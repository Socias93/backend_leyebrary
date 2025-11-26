import express from "express";
import { categories, Category, getCategories } from "./categories";
import { validate } from "./schemas/Items";

const router = express.Router();

const ITEM_API = "/";
const ITEM_API_ID = "/:id";
const ITEM_NOT_FOUND = "Item not found";
const CATEGORY_NOT_FOUND = "Category ID not found";

export interface BaseItem {
  id: string;
  title: string;
  isBorrowable?: boolean;
  category: Category;

  borrower?: string;
  borrowDate?: string;
}

export interface Book extends BaseItem {
  author?: string;
  nbrPages?: number;
}

export interface DVD extends BaseItem {
  runTimeMinutes?: number;
}

export interface Audiobook extends BaseItem {
  runTimeMinutes?: number;
}

export interface ReferenceBook extends BaseItem {
  author?: string;
  nbrPages?: number;
}

export type LibraryItem = Book | DVD | Audiobook | ReferenceBook;

const items: LibraryItem[] = [
  {
    id: "lib-0001",
    title: "Svenska sagor",
    author: "A. Författare",
    nbrPages: 320,
    isBorrowable: true,
    category: getCategories().find((c) => c.name === "Book") || {
      id: "c1b3f9a0-1a2b-4c3d-8e9f-000000000001",
      name: "Book",
    },
  } as Book,
  {
    id: "lib-0002",
    title: "Action Movie I",
    runTimeMinutes: 125,
    isBorrowable: true,
    category: getCategories().find((c) => c.name === "DVD") || {
      id: "c1b3f9a0-1a2b-4c3d-8e9f-000000000002",
      name: "DVD",
    },
  } as DVD,
  {
    id: "lib-0003",
    title: "Storytelling",
    runTimeMinutes: 400,
    isBorrowable: true,
    category: getCategories().find((c) => c.name === "Audiobook") || {
      id: "c1b3f9a0-1a2b-4c3d-8e9f-000000000003",
      name: "Audiobook",
    },
  } as Audiobook,
  {
    id: "lib-0004",
    title: "Nationalencyklopedin Volym 1",
    author: "NE",
    nbrPages: 1200,
    category: getCategories().find((c) => c.name === "Referencebook") || {
      id: "c1b3f9a0-1a2b-4c3d-8e9f-000000000004",
      name: "Referencebook",
    },
  } as ReferenceBook,

  {
    id: "lib-0005",
    title: "Svenska sagor - Volym 2",
    author: "A. Författare",
    nbrPages: 288,
    isBorrowable: true,
    category: { id: "c1b3f9a0-1a2b-4c3d-8e9f-000000000001", name: "Book" },
  } as Book,
  {
    id: "lib-0006",
    title: "Moderna noveller",
    author: "B. Författare",
    nbrPages: 214,
    isBorrowable: true,
    category: { id: "c1b3f9a0-1a2b-4c3d-8e9f-000000000001", name: "Book" },
  } as Book,

  {
    id: "lib-0007",
    title: "Action Movie II",
    runTimeMinutes: 132,
    isBorrowable: true,
    category: { id: "c1b3f9a0-1a2b-4c3d-8e9f-000000000002", name: "DVD" },
  } as DVD,

  {
    id: "lib-0008",
    title: "Drama Anthology",
    runTimeMinutes: 98,
    isBorrowable: true,
    category: { id: "c1b3f9a0-1a2b-4c3d-8e9f-000000000002", name: "DVD" },
  } as DVD,

  {
    id: "lib-0009",
    title: "Storytelling - Vol. 2",
    runTimeMinutes: 360,
    isBorrowable: true,
    category: {
      id: "c1b3f9a0-1a2b-4c3d-8e9f-000000000003",
      name: "Audiobook",
    },
  } as Audiobook,
  {
    id: "lib-0010",
    title: "Berättelser för natten",
    runTimeMinutes: 240,
    isBorrowable: true,
    category: {
      id: "c1b3f9a0-1a2b-4c3d-8e9f-000000000003",
      name: "Audiobook",
    },
  } as Audiobook,

  {
    id: "lib-0011",
    title: "Nationalencyklopedin Volym 2",
    author: "NE",
    nbrPages: 1184,
    category: {
      id: "c1b3f9a0-1a2b-4c3d-8e9f-000000000004",
      name: "Referencebook",
    },
  } as ReferenceBook,
  {
    id: "lib-0012",
    title: "Nationalencyklopedin Volym 3",
    author: "NE",
    nbrPages: 1220,
    category: {
      id: "c1b3f9a0-1a2b-4c3d-8e9f-000000000004",
      name: "Referencebook",
    },
  } as ReferenceBook,
];

router.get(ITEM_API, (req, res) => {
  return res.send(items);
});

router.get(ITEM_API_ID, (req, res) => {
  const item = items.find((i) => i.id === req.params.id);

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

export default router;
