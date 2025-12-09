import express from "express";
import { PrismaClient } from "@prisma/client";
import { validateItem } from "./schemas/Items";

const prisma = new PrismaClient();
const router = express.Router();

const ITEM_API = "/";
const ITEM_API_ID = "/:id";
const ITEM_NOT_FOUND = "Item not found";
const CATEGORY_NOT_FOUND = "Category ID not found";

router.get(ITEM_API, async (req, res) => {
  const items = await prisma.item.findMany({
    include: { category: true },
  });
  return res.send(items);
});

router.get(ITEM_API_ID, async (req, res) => {
  const item = await prisma.item.findFirst({
    where: { id: req.params.id },
    include: { category: true },
  });

  if (!item) return res.status(404).send(ITEM_NOT_FOUND);

  return res.send(item);
});

router.post(ITEM_API, async (req, res) => {
  const validation = validateItem(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.issues[0].message);

  const category = await prisma.category.findFirst({
    where: { id: req.body.categoryId },
  });
  if (!category) return res.status(404).send(CATEGORY_NOT_FOUND);

  const { title, categoryId, type, author, nbrPages, runTimeMinutes } =
    req.body;
  const attributes: Record<string, any> = {};

  if (type === "Book" || type === "ReferenceBook") {
    attributes.author = req.body.author;
    attributes.nbrPages = req.body.nbrPages;
  }

  if (type === "DVD" || type === "AudioBook") {
    attributes.runTimeMinutes = req.body.runTimeMinutes;
  }

  const newItem = await prisma.item.create({
    data: {
      title,
      categoryId,
      type,
      attributes: Object.keys(attributes).length ? attributes : undefined,
      isBorrowable: type !== "ReferenceBook",
    },
  });
  return res.status(201).send(newItem);
});

router.put(ITEM_API_ID, async (req, res) => {
  const item = await prisma.item.findFirst({ where: { id: req.params.id } });
  if (!item) return res.status(404).send(ITEM_NOT_FOUND);

  const validation = validateItem(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.issues[0].message);

  const category = await prisma.category.findFirst({
    where: { id: req.body.categoryId },
  });
  if (!category) return res.status(404).send(CATEGORY_NOT_FOUND);

  const attributes: Record<string, any> = {};
  if (req.body.type === "Book" || req.body.type === "ReferenceBook") {
    attributes.author = req.body.attributes?.author;
    attributes.nbrPages = req.body.attributes?.nbrPages;
  }
  if (req.body.type === "DVD" || req.body.type === "AudioBook") {
    attributes.runTimeMinutes = req.body.attributes?.runTimeMinutes;
  }

  const updatedItem = await prisma.item.update({
    where: { id: req.params.id },
    data: {
      title: req.body.title,
      categoryId: req.body.categoryId,
      type: req.body.type,
      attributes: Object.keys(attributes).length ? attributes : undefined,
      isBorrowable: req.body.type !== "ReferenceBook",
    },
  });

  return res.status(200).send(updatedItem);
});

router.delete(ITEM_API_ID, async (req, res) => {
  const item = await prisma.item.findFirst({ where: { id: req.params.id } });
  if (!item) return res.status(404).send(ITEM_NOT_FOUND);

  await prisma.item.delete({ where: { id: req.params.id } });
  return res.status(200).send(item);
});

router.post("/:id/checkout", async (req, res) => {
  const { borrower } = req.body;

  const item = await prisma.item.findFirst({ where: { id: req.params.id } });
  if (!item) return res.status(404).send("Item not found");

  if (item.type === "ReferenceBook" || !item.isBorrowable)
    return res.status(400).send("Item cannot be borrowed");

  const updated = await prisma.item.update({
    where: { id: req.params.id },
    data: {
      borrower,
      borrowDate: new Date().toISOString(),
      isBorrowable: false,
    },
  });

  return res.status(200).send(updated);
});

router.post("/:id/return", async (req, res) => {
  const item = await prisma.item.findFirst({ where: { id: req.params.id } });
  if (!item) return res.status(404).send("Item not found");

  if (!item.borrower) return res.status(400).send("Item is not borrowed");

  const updated = await prisma.item.update({
    where: { id: req.params.id },
    data: { borrower: null, borrowDate: null, isBorrowable: true },
  });

  return res.status(200).send(updated);
});

export default router;
