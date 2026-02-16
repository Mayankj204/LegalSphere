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
  deleteDocument
} from "../controllers/caseController.js";

import { upload } from "../utils/upload.js";   // ✅ REQUIRED FOR DOCUMENT UPLOAD ROUTE

const router = express.Router();

/* ================================
   CASE CRUD (Dashboard + Client)
   ================================ */
router.get("/", protect, listCases);       
router.post("/", protect, createCase);     
router.patch("/:id", protect, updateCase); 
router.delete("/:id", protect, deleteCase);

/* ================================
   CASE DETAILS PAGE
   ================================ */
router.get("/:caseId", getCaseById);

/* ================================
   DOCUMENT MANAGEMENT
   ================================ */
router.get("/:caseId/documents", getCaseDocuments);

// ✅ FIX: ADD multer handler
router.post(
  "/:caseId/documents",
  upload.single("file"),       // <--- this was missing
  uploadCaseDocument
);

/* Edit / Delete Document */
router.patch("/:caseId/documents/:docId", updateDocument);
router.delete("/:caseId/documents/:docId", deleteDocument);

export default router;
