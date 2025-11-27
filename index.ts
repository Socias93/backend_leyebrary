import express from "express";
import categories from "./routes/categories";
import items from "./routes/items";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

const PORT = 5313;

app.use("/api/categories", categories);
app.use("/api/items", items);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
