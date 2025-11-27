import express from "express";
import { validate } from "./schemas/Items";
import { getCategories, items, LibraryItem } from "./data";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

const ITEM_API = "/";
const ITEM_API_ID = "/:id";
const ITEM_NOT_FOUND = "Item not found";
const CATEGORY_NOT_FOUND = "Category ID not found";

router.get(ITEM_API, async (req, res) => {
  const items = await prisma.item.findMany();
  return res.send(items);
});

router.get(ITEM_API_ID, async (req, res) => {
  const item = await prisma.item.findFirst({ where: { id: req.params.id } });

  if (!item) return res.status(404).send(ITEM_NOT_FOUND);

  return res.send(item);
});

router.post(ITEM_API, (req, res) => {
  const validation = validate(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.issues[0].message);

  const category = getCategories().find((c) => c.id === req.body.categoryId);
  if (!category) return res.status(404).send(CATEGORY_NOT_FOUND);

  const newItem: LibraryItem = {
    id: Date.now().toString(),
    title: req.body.title,
    category,
    ...(req.body.author ? { author: req.body.author } : {}),
    ...(req.body.nbrPages ? { nbrPages: req.body.nbrPages } : {}),
    ...(req.body.runTimeMinutes
      ? { runTimeMinutes: req.body.runTimeMinutes }
      : {}),
  };

  items.push(newItem);
  return res.status(201).send(newItem);
});

router.put(ITEM_API_ID, (req, res) => {
  const item = items.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).send(ITEM_NOT_FOUND);

  const validation = validate(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.issues[0].message);

  const category = getCategories().find((c) => c.id === req.body.categoryId);
  if (!category) return res.status(404).send(CATEGORY_NOT_FOUND);

  (item.title = req.body.title), (item.category = category);
  if (req.body.author !== undefined) (item as any).author = req.body.author;
  if (req.body.nbrPages !== undefined)
    (item as any).nbrPages = req.body.nbrPages;
  if (req.body.runTimeMinutes !== undefined)
    (item as any).runTimeMinutes = req.body.runTimeMinutes;

  return res.status(200).send(item);
});

router.delete(ITEM_API_ID, (req, res) => {
  const item = items.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).send(ITEM_NOT_FOUND);

  const index = items.indexOf(item);
  items.splice(index, 1);

  return res.status(200).send(item);
});

export default router;
