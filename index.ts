import express from "express";
import categories from "./routes/categories";
import items from "./routes/items";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: ["https://leyebrary.onrender.com", "http://localhost:5173"],
  })
);

app.use(express.json());

app.use("/api/categories", categories);
app.use("/api/items", items);

const PORT = process.env.PORT || 5313;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
