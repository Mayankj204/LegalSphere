// src/routes/aiChatRoutes.js
import express from "express";

import {
  startSession,
  streamMessage,
  postMessage,
} from "../controllers/chatController.js";

const router = express.Router();

// Create a new chat session
router.post("/start", startSession);   // <-- FIXED for frontend

// Stream LLM response
router.get("/stream", streamMessage);

// Send normal message (non-stream)
router.post("/message", postMessage);

export default router;
