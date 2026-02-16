import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMyNotifications,
  markAsRead,
  deleteNotification,
  clearNotifications,
} from "../controllers/notificationController.js";

const router = express.Router();

/* ================= GET MY NOTIFICATIONS ================= */
router.get("/", protect, getMyNotifications);

/* ================= MARK AS READ ================= */
router.put("/:id/read", protect, markAsRead);

/* ================= DELETE SINGLE NOTIFICATION ================= */
router.delete("/:id", protect, deleteNotification);

/* ================= CLEAR ALL NOTIFICATIONS ================= */
router.delete("/", protect, clearNotifications);

export default router;
