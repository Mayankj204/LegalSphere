// src/routes/aiRoutes.js
import express from "express";
import {
  summarize,
  keypoints,
  analyze,
} from "../controllers/aiController.js";

const router = express.Router();

router.post("/summarize", summarize);
router.post("/keypoints", keypoints);
router.post("/analyze", analyze);

export default router;
