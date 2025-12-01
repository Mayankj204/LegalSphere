// server/src/routes/aiChatRoutes.js
import express from "express";
import { streamGeneralAI } from "../controllers/aiChatController.js";
import {
  startSession,
  streamMessage,
  postMessage,
} from "../controllers/chatController.js";

const router = express.Router();

/* ============================================================
   🌍 GLOBAL AI (Navbar Chat)
   ============================================================ */
router.get("/general", streamGeneralAI);  
// final resolved path → GET /api/ai/chat/general

/* ============================================================
   🧠 DOCUMENT AI WORKSPACE
   ============================================================ */
router.post("/start", startSession);           
router.get("/stream", streamMessage);          
router.post("/message", postMessage);          

export default router;
