import express from "express";
import cors from "cors";
import authRoutes from "./auth.js";
import notesRoutes from "./routnote.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", notesRoutes);

app.get("/", (_req, res) => {
  res.send("Kiln auth API is running.");
});

app.listen(PORT, () => {
  console.log(`Kiln auth API listening on http://localhost:${PORT}`);
});