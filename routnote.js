import { Router } from "express";
import { getNotes, addNote, deleteNote } from "./notes.js";

const router = Router();

router.get("/notes", (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ success: false, message: "email is required." });
  }
  return res.status(200).json({ success: true, notes: getNotes(email) });
});

router.post("/notes", (req, res) => {
  const { email, title, content } = req.body ?? {};
  if (!email || !title?.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "A title is required." });
  }
  const note = addNote(email, { title: title.trim(), content: (content ?? "").trim() });
  return res.status(201).json({ success: true, note });
});

router.delete("/notes/:id", (req, res) => {
  const { email } = req.body ?? {};
  if (!email) {
    return res.status(400).json({ success: false, message: "email is required." });
  }
  const notes = deleteNote(email, req.params.id);
  return res.status(200).json({ success: true, notes });
});

export default router;