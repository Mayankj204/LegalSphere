import express from "express";
import {
  createRequest,
  getLawyerRequests,
  getClientRequests,   // ✅ ADD THIS
  updateRequestStatus,
} from "../controllers/requestController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= CLIENT SENDS REQUEST ================= */
router.post("/", protect, createRequest);

/* ================= LAWYER SEES REQUESTS ================= */
router.get("/lawyer", protect, getLawyerRequests);

/* ================= CLIENT SEES OWN REQUESTS ================= */
router.get("/client", protect, getClientRequests);   // ✅ NOW VALID

/* ================= LAWYER APPROVES / REJECTS ================= */
router.put("/:id", protect, updateRequestStatus);

export default router;
