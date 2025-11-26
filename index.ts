import express from "express";
import categories from "./routes/categories";

const app = express();

const PORT = 5513;

app.use("/api/categories", categories);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
