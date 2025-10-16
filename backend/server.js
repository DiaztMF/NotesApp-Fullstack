import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import notesRouter from "./routes/notes.js";
import authRouter from "./routes/login.js"; 
import profilesRouter from "./routes/profiles.js";
dotenv.config();

console.log("✅ ATLAS_URI from .env:", process.env.ATLAS_URI);

const PORT = process.env.PORT || 5050;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/notes", notesRouter);
app.use("/api/auth", authRouter);
app.use("/api/auth", profilesRouter);

// Server listen
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
