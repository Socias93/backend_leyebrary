import express from "express";
import { categories, Category } from "./categories";

const router = express.Router();

export function getCategories(): Category[] {
  return categories;
}

export interface BaseItem {
  id: string;
  title: string;
  isBorrowable?: boolean;
  category: Category;
  // if checked out:
  borrower?: string;
  borrowDate?: string; // ISO string
}

export interface Book extends BaseItem {
  author: string;
  nbrPages: number;
}

export interface DVD extends BaseItem {
  runTimeMinutes: number;
}

export interface Audiobook extends BaseItem {
  runTimeMinutes: number;
}

export interface ReferenceBook extends BaseItem {
  author: string;
  nbrPages: number;
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

  // Två extra DVD
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

  // Två extra ljudböcker
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

  // Två extra uppslagsböcker
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

router.get("/", (req, res) => {
  return res.send(items);
});

export default router;
