import dotenv from "dotenv";
dotenv.config({ quiet: true });

import express from "express";
import cors from "cors";
const bodyParser = require('body-parser');
import connectDB from "./config/db";
import authRoutes from "./routes/auth";
import notesRoutes from "./routes/notes";


const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/notes-app-dev";

// Connect DB
connectDB(MONGO_URI);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);


app.get("/api/ping", (_req, res) => {
  res.json({ ok: true, message: "pong" });
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
