import express from "express";
import {
  register,
  login,
  updateProfile,
  getMe,
  updateProfileImage,
  removeProfileImage
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../utils/upload.js";

const router = express.Router();

/* ================= AUTH ================= */
router.post("/register", register);
router.post("/login", login);

/* ================= PROFILE ================= */
router.get("/me", protect, getMe);

router.put(
  "/update-profile-image",
  protect,
  upload.single("profileImage"),
  updateProfileImage
);

router.put("/remove-profile-image", protect, removeProfileImage);

router.put("/update-profile", protect, updateProfile);

export default router;
