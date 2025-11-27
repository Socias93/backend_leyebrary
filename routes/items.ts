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

router.post(ITEM_API, async (req, res) => {
  const validation = validate(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.issues[0].message);

  const category = await prisma.category.findFirst({
    where: { id: req.body.categoryId },
  });
  if (!category) return res.status(404).send(CATEGORY_NOT_FOUND);

  const newItem = await prisma.item.create({
    data: {
      title: req.body.title,
      attributes: req.body.attributes,
      categoryId: req.body.categoryId,
    },
  });

  return res.status(201).send(newItem);
});

router.put(ITEM_API_ID, async (req, res) => {
  const item = await prisma.item.findFirst({ where: { id: req.params.id } });
  if (!item) return res.status(404).send(ITEM_NOT_FOUND);

  const validation = validate(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.issues[0].message);

  const category = await prisma.category.findFirst({
    where: { id: req.body.categoryId },
  });
  if (!category) return res.status(404).send(CATEGORY_NOT_FOUND);

  const newItem = await prisma.item.update({
    where: { id: req.params.id },
    data: {
      title: req.body.title,
      categoryId: req.body.categoryId,
      attributes: req.body.attributes,
    },
  });

  return res.status(200).send(newItem);
});

router.delete(ITEM_API_ID, async (req, res) => {
  const item = await prisma.item.findFirst({ where: { id: req.params.id } });
  if (!item) return res.status(404).send(ITEM_NOT_FOUND);

  await prisma.item.delete({ where: { id: req.params.id } });
  return res.status(200).send(item);
});

export default router;
