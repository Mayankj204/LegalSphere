import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getHearings,
  createHearing,
  updateHearing,
  deleteHearing,
} from "../controllers/hearingController.js";

const router = express.Router();

router.get("/", protect, getHearings);
router.post("/", protect, createHearing);
router.put("/:id", protect, updateHearing);
router.delete("/:id", protect, deleteHearing);

export default router;
