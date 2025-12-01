// server/src/routes/docRoutes.js
import express from "express";
import multer from "multer";

import {
  uploadDocument,
  getAllDocuments,
  getDocumentById,
  downloadDocument,
  deleteDocument,
} from "../controllers/docController.js";

const router = express.Router();

// FIX → accept field "document"
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("document"), uploadDocument);

router.get("/", getAllDocuments);
router.get("/:id", getDocumentById);
router.get("/download/:id", downloadDocument);
router.delete("/:id", deleteDocument);

export default router;
