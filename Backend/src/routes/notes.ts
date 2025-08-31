import { Router } from "express";
import Note from "../models/Notes";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// Get all notes for user
router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const notes = await Note.find({ userId: req.user!.userId });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// Create a note
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const note = await Note.create({
      userId: req.user!.userId,
      text: req.body.text,
    });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: "Failed to create note" });
  }
});

// Delete a note
router.delete("/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    await Note.deleteOne({ _id: req.params.id, userId: req.user!.userId });
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete note" });
  }
});

export default router;
