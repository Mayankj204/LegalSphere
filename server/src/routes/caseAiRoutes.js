// server/src/routes/caseAiRoutes.js
import express from "express";
import { streamCaseAI } from "../controllers/caseAiController.js";

const router = express.Router();

/* ============================================================
   CASE-SPECIFIC AI CHAT (RAG + GPT2)
   Example: POST /api/ai/case/12345/query
   Body: { query: "What is the bail section?" }
   ============================================================ */

router.post("/case/:caseId/query", streamCaseAI);

export default router;
