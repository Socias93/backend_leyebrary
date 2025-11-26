import express from "express";
import { validate } from "./schemas/Categories";
import { categories, Category, getCategories, items } from "./data";

const router = express.Router();

const CATEGORY_API = "/";
const CATEGORY_API_ID = "/:id";
const CATEGORY_NOT_FOUND = "Category ID not found";
const CATEGORY_EXIST = "Category already exists";
const ITEM_IN_CATEGORY = "Category must be empty before you can delete it";

router.get(CATEGORY_API, (req, res) => {
  return res.send(categories);
});

router.get(CATEGORY_API_ID, (req, res) => {
  const category = categories.find((c) => c.id === req.params.id);

  if (!category) return res.status(404).send(CATEGORY_NOT_FOUND);

  return res.send(category);
});

router.post(CATEGORY_API, (req, res) => {
  const validation = validate(req.body);
  if (!validation.success)
    return res.status(404).send(validation.error.issues[0].message);

  const exists = getCategories().some(
    (c) => c.name.toLowerCase() === req.body.name.toLowerCase()
  );
  if (exists) return res.status(400).send(CATEGORY_EXIST);

  const newCategory: Category = {
    id: Date.now().toString(),
    name: req.body.name,
    fields: req.body.fields,
  };

  categories.push(newCategory);

  return res.status(201).send(newCategory);
});

router.delete(CATEGORY_API_ID, (req, res) => {
  const category = categories.find((c) => c.id === req.params.id);

  if (!category) return res.status(404).send(CATEGORY_NOT_FOUND);

  const used = items.some((item) => item.category?.id === req.params.id);
  if (used) return res.status(404).send(ITEM_IN_CATEGORY);

  const index = categories.indexOf(category);
  categories.splice(index, 1);

  return res.status(200).send(category);
});

export default router;
