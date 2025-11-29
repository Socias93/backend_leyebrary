import express from "express";
import categories from "./routes/categories";
import items from "./routes/items";
import cors from "cors";

const app = express();
app.use(cors());
const PORT = 5313;

app.use("/api/categories", categories);
app.use("/api/items", items);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
