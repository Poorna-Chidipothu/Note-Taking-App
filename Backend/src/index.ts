import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/notes-app-dev";
const PORT = process.env.PORT || 4000;

mongoose.connect(MONGO_URI)
  .then(()=> console.log("Connected to MongoDB"))
  .catch(err => console.error("Mongo connect error:", err));

app.get("/api/ping", (_req, res) => {
  res.json({ ok: true, message: "pong" });
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
