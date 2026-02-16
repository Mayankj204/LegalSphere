import express from "express";
import {
  createRequest,
  getLawyerRequests,
  getClientRequests,
  updateRequestStatus,
  deleteRequest,
} from "../controllers/requestController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= CLIENT SENDS REQUEST ================= */
router.post("/", protect, createRequest);

/* ================= LAWYER SEES REQUESTS ================= */
router.get("/lawyer", protect, getLawyerRequests);

/* ================= CLIENT SEES OWN REQUESTS ================= */
router.get("/client", protect, getClientRequests);

/* ================= LAWYER APPROVES / REJECTS ================= */
router.put("/:id", protect, updateRequestStatus);

/* ================= LAWYER DELETE REQUEST ================= */
router.delete("/:id", protect, deleteRequest);

export default router;
