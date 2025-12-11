import express from "express";
import { validate } from "./schemas/Categories";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

const CATEGORY_API = "/";
const CATEGORY_API_ID = "/:id";
const CATEGORY_NOT_FOUND = "Category ID not found";
const CATEGORY_EXIST = "Category already exists";
const ITEM_IN_CATEGORY = "Category must be empty before you can delete it";

router.get(CATEGORY_API, async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    return res.send(categories);
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error fetching categories:", err.message);
      console.error(err.stack);
    }
    return res.status(500).send("Internal Server Error");
  }
});

router.get(CATEGORY_API_ID, async (req, res) => {
  const findId = req.params.id;
  const category = await prisma.category.findFirst({
    where: { id: findId },
  });

  if (!category) return res.status(404).send(CATEGORY_NOT_FOUND);

  return res.send(category);
});

router.post(CATEGORY_API, async (req, res) => {
  const validation = validate(req.body);
  if (!validation.success) {
    return res.status(400).send(validation.error.issues[0].message);
  }

  const { name, image } = req.body;

  const exists = await prisma.category.findFirst({ where: { name } });
  if (exists) return res.status(400).send(CATEGORY_EXIST);

  const newCategory = await prisma.category.create({
    data: { name, image },
  });

  return res.status(201).send(newCategory);
});

router.put(CATEGORY_API_ID, async (req, res) => {
  const findId = req.params.id;
  const category = await prisma.category.findFirst({
    where: { id: findId },
  });

  if (!category) return res.status(404).send(CATEGORY_NOT_FOUND);

  const validation = validate(req.body);
  if (!validation.success) {
    return res.status(400).send(validation.error.issues[0].message);
  }

  const { name, image } = req.body;

  const exists = await prisma.category.findFirst({
    where: { name, NOT: { id: findId } },
  });
  if (exists) return res.status(400).send(CATEGORY_EXIST);

  const updatedCategory = await prisma.category.update({
    where: { id: findId },
    data: { name, image },
  });

  return res.status(200).send(updatedCategory);
});

router.delete(CATEGORY_API_ID, async (req, res) => {
  const findId = req.params.id;

  const category = await prisma.category.findFirst({
    where: { id: findId },
  });

  if (!category) return res.status(404).send(CATEGORY_NOT_FOUND);

  const used = await prisma.item.findFirst({
    where: { categoryId: category.id },
  });
  if (used) return res.status(404).send(ITEM_IN_CATEGORY);

  const deletedCategory = await prisma.category.delete({
    where: { id: findId },
  });

  return res.status(200).send(deletedCategory);
});

export default router;
