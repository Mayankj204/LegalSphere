import express from "express";
import {
  getAllLawyers,
  getLawyerById
} from "../controllers/lawyerController.js";

const router = express.Router();

router.get("/", getAllLawyers);
router.get("/:id", getLawyerById);

export default router;
