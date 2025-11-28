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
  const categories = await prisma.category.findMany();

  return res.send(categories);
});

router.get(CATEGORY_API_ID, async (req, res) => {
  const findId = req.params.id;
  const category = await prisma.category.findFirst({
    where: { id: findId },
  });

  if (!category) return res.status(404).send(CATEGORY_NOT_FOUND);

  return res.send(category);
});

router.put(CATEGORY_API, async (req, res) => {
  const validation = validate(req.body);
  if (!validation.success)
    return res.status(404).send(validation.error.issues[0].message);

  const findName = req.body.name;
  const findFields = req.body.fields;

  const exists = await prisma.category.findFirst({
    where: { name: findName },
  });
  if (exists) return res.status(400).send(CATEGORY_EXIST);

  const newCategory = await prisma.category.create({
    data: { name: findName, fields: findFields },
  });

  return res.status(201).send(newCategory);
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
