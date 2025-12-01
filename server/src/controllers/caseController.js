// server/src/controllers/caseController.js

import CaseModel from "../models/Case.js";
import Document from "../models/Document.js";
import fs from "fs";
import path from "path";
import { embedText } from "../utils/aiClient.js";

/* ---------------------- FIXED PDF PARSE (ESM COMPATIBLE) ---------------------- */
// pdf-parse is CommonJS → MUST be dynamically imported
async function parsePDF(buffer) {
  const pdfMod = await import("pdf-parse");     // dynamically load module
  return pdfMod.default(buffer);                // call default export manually
}

/* ========================================================================
   🎯 CASE CRUD (Dashboard, Case creation, editing, deleting)
   ======================================================================== */

// GET ALL CASES
export const listCases = async (req, res) => {
  try {
    const cases = await CaseModel.find().sort({ updatedAt: -1 });
    res.json({ ok: true, cases });
  } catch (err) {
    console.error("Error fetching cases:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

// CREATE NEW CASE
export const createCase = async (req, res) => {
  try {
    const created = await CaseModel.create(req.body);
    res.json({ ok: true, case: created });
  } catch (err) {
    console.error("Error creating case:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

// UPDATE CASE
export const updateCase = async (req, res) => {
  try {
    const updated = await CaseModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ ok: true, case: updated });
  } catch (err) {
    console.error("Error updating case:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

// DELETE CASE
export const deleteCase = async (req, res) => {
  try {
    const caseId = req.params.id;

    await Document.deleteMany({ caseId });
    await CaseModel.findByIdAndDelete(caseId);

    res.json({
      ok: true,
      message: "Case and all belonging documents deleted successfully.",
    });
  } catch (err) {
    console.error("Error deleting case:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

/* ========================================================================
   📄 CASE DETAILS + DOCUMENT MANAGEMENT (Workspace)
   ======================================================================== */

// GET CASE DETAILS
export const getCaseById = async (req, res) => {
  const { caseId } = req.params;

  try {
    const caseData = await CaseModel.findById(caseId);
    if (!caseData) return res.status(404).json({ ok: false, message: "Case not found" });

    res.json({ ok: true, case: caseData });
  } catch (err) {
    console.error("Error fetching case:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

// GET CASE DOCUMENTS
export const getCaseDocuments = async (req, res) => {
  const { caseId } = req.params;

  try {
    const docs = await Document.find({ caseId }).sort({ createdAt: -1 });
    res.json({ ok: true, documents: docs });
  } catch (err) {
    console.error("Error fetching documents:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

// UPLOAD CASE DOCUMENT (includes text extraction + embedding)
export const uploadCaseDocument = async (req, res) => {
  const { caseId } = req.params;

  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, message: "No file uploaded" });
    }

    // File paths
    const filePathRel = `/uploads/${req.file.filename}`;
    const fullPath = path.join(process.cwd(), "uploads", req.file.filename);

    // -------------- Extract text ----------------
    let text = "";
    const ext = (req.file.originalname || "").split(".").pop().toLowerCase();

    if (ext === "pdf") {
      try {
        const buffer = fs.readFileSync(fullPath);
        const pdfData = await parsePDF(buffer);     // FIXED: use dynamic import wrapper
        text = pdfData.text || "";
      } catch (err) {
        console.error("PDF parse error:", err);
        text = "";
      }
    } else {
      try {
        text = fs.readFileSync(fullPath, "utf8");
      } catch (err) {
        text = "";
      }
    }

    // -------------- Generate Embedding ----------------
    let embedding = [];
    try {
      const chunk = (text || "").slice(0, 30000); // limit size
      embedding = await embedText(chunk);
    } catch (err) {
      console.error("Embedding generation failed:", err);
    }

    // -------------- Save Document ----------------
    const doc = await Document.create({
      caseId,
      filename: req.file.originalname,
      storageUrl: filePathRel,
      summary: "",
      tag: "",
      fullText: text,
      embedding,
    });

    res.json({ ok: true, document: doc });

  } catch (err) {
    console.error("uploadCaseDocument error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

// UPDATE DOCUMENT
export const updateDocument = async (req, res) => {
  const { docId } = req.params;
  const { filename, tag } = req.body;

  try {
    const updated = await Document.findByIdAndUpdate(
      docId,
      { filename, tag },
      { new: true }
    );

    res.json({ ok: true, updated });
  } catch (err) {
    console.error("Error updating document:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

// DELETE DOCUMENT
export const deleteDocument = async (req, res) => {
  const { docId } = req.params;

  try {
    await Document.findByIdAndDelete(docId);
    res.json({ ok: true, message: "Document deleted successfully." });
  } catch (err) {
    console.error("Error deleting document:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};
