import dotenv from "dotenv";
dotenv.config({ quiet: true });

import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/auth";


const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/notes-app-dev";

// Connect DB
connectDB(MONGO_URI);

// Routes
app.use("/api/auth", authRoutes);


app.get("/api/ping", (_req, res) => {
  res.json({ ok: true, message: "pong" });
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
