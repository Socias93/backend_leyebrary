import express from "express";
import categories from "./routes/categories";
import items from "./routes/items";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Request origin:", origin);
      const allowed = [
        "https://leyebrary.onrender.com",
        "http://localhost:5173",
      ];
      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());

app.use("/api/categories", categories);

app.use("/api/items", items);

const PORT = process.env.PORT || 5313;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
