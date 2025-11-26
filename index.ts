import express from "express";
import categories from "./routes/categories";
import items from "./routes/items";

const app = express();

const PORT = 5513;

app.use("/api/categories", categories);
app.use("/api/items", items);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
