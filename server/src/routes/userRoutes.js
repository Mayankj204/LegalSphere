import express from "express";
import { updateUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ==============================
   UPDATE USER NAME
   ============================== */
router.patch("/:id", protect, updateUser);

export default router;
