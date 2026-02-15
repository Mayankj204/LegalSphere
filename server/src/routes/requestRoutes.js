import express from "express";
import {
  createRequest,
  getLawyerRequests,
  updateRequestStatus,
} from "../controllers/requestController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Client sends request
router.post("/", protect, createRequest);

// Lawyer sees requests
router.get("/lawyer", protect, getLawyerRequests);

// Lawyer approves/rejects
router.put("/:id", protect, updateRequestStatus);

export default router;
