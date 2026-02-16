// server/src/routes/caseRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  listCases,
  createCase,
  updateCase,
  deleteCase,
  getCaseById,
  getCaseDocuments,
  uploadCaseDocument,
  updateDocument,
  deleteDocument,
} from "../controllers/caseController.js";

// 🔥 Import Note Controllers
import {
  getNotes,
  addNote,
  updateNote,
  deleteNote,
} from "../controllers/caseSubController.js";

import { upload } from "../utils/upload.js";

const router = express.Router();

/* ================================
   CASE CRUD
   ================================ */
router.get("/", protect, listCases);
router.post("/", protect, createCase);
router.patch("/:id", protect, updateCase);
router.delete("/:id", protect, deleteCase);

/* ================================
   CASE DETAILS
   ================================ */
router.get("/:caseId", protect, getCaseById);

/* ================================
   NOTES ROUTES
   ================================ */
router.get("/:caseId/notes", protect, getNotes);
router.post("/:caseId/notes", protect, addNote);
router.patch("/:caseId/notes/:noteId", protect, updateNote);
router.delete("/:caseId/notes/:noteId", protect, deleteNote);

/* ================================
   DOCUMENT MANAGEMENT
   ================================ */
router.get("/:caseId/documents", protect, getCaseDocuments);

router.post(
  "/:caseId/documents",
  protect,
  upload.single("file"),
  uploadCaseDocument
);

router.patch(
  "/:caseId/documents/:docId",
  protect,
  updateDocument
);

router.delete(
  "/:caseId/documents/:docId",
  protect,
  deleteDocument
);

export default router;
