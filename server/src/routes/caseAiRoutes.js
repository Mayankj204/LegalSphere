import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../utils/upload.js";
import {
  caseChat,
  getCaseChat,
} from "../controllers/caseAiController.js";

const router = express.Router();

router.get("/case-chat/:caseId", protect, getCaseChat);

router.post(
  "/case-chat/:caseId",
  protect,
  upload.single("file"),
  caseChat
);

export default router;
