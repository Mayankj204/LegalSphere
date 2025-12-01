// server/src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// ROUTES
import docRoutes from "./routes/docRoutes.js";
import aiChatRoutes from "./routes/aiChatRoutes.js"; // Only RAG Chat
// aiRoutes removed — no longer required

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// ROUTING
app.use("/api/documents", docRoutes);        // Upload + list + delete docs
app.use("/api/ai/chat", aiChatRoutes);       // RAG chat system

// DEFAULT ROUTE
app.get("/", (req, res) => {
  res.send("LegalSphere Backend Running...");
});

export default app;
