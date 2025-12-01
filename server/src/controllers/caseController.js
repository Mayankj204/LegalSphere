// server/src/controllers/caseController.js

import CaseModel from "../models/Case.js";
import Document from "../models/Document.js";

/* ============================================================
   🎯 CASE CRUD (Dashboard, Case creation, editing, deleting)
   ============================================================ */

// ---------------------------------------------
// GET ALL CASES (Dashboard)
// TODO: Filter by lawyer using req.user after auth
// ---------------------------------------------
export const listCases = async (req, res) => {
  try {
    const cases = await CaseModel.find().sort({ updatedAt: -1 });
    res.json({ ok: true, cases });
  } catch (err) {
    console.error("Error fetching cases:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

// ---------------------------------------------
// CREATE NEW CASE
// ---------------------------------------------
export const createCase = async (req, res) => {
  try {
    const payload = req.body;

    const created = await CaseModel.create(payload);

    res.json({
      ok: true,
      case: created
    });

  } catch (err) {
    console.error("Error creating case:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

// ---------------------------------------------
// UPDATE CASE (rename, edit fields)
// ---------------------------------------------
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

// ---------------------------------------------
// DELETE CASE + cascade delete all its documents
// ---------------------------------------------
export const deleteCase = async (req, res) => {
  try {
    const caseId = req.params.id;

    // delete all documents related to the case
    await Document.deleteMany({ caseId });

    // delete case itself
    await CaseModel.findByIdAndDelete(caseId);

    res.json({
      ok: true,
      message: "Case and all belonging documents deleted successfully."
    });

  } catch (err) {
    console.error("Error deleting case:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};


/* ============================================================
   📄 CASE DETAILS + DOCUMENT MANAGEMENT (Workspace)
   ============================================================ */

// ---------------------------------------------
// GET CASE DETAILS FOR CaseWorkspace + CaseDetails
// ---------------------------------------------
export const getCaseById = async (req, res) => {
  const { caseId } = req.params;
  try {
    const caseData = await CaseModel.findById(caseId);
    if (!caseData)
      return res.status(404).json({ ok: false, message: "Case not found" });

    res.json({ ok: true, case: caseData });
  } catch (err) {
    console.error("Error fetching case:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

// ---------------------------------------------
// GET ALL DOCUMENTS OF THIS CASE
// ---------------------------------------------
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

// ---------------------------------------------
// UPLOAD DOCUMENT to case
// TODO: integrate multer/S3 for real uploads
// ---------------------------------------------
export const uploadCaseDocument = async (req, res) => {
  const { caseId } = req.params;

  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, message: "No file uploaded" });
    }

    // Store local file path correctly
    const filePath = `/uploads/${req.file.filename}`;

    const doc = await Document.create({
      caseId,
      filename: req.file.originalname,
      storageUrl: filePath,        // 🔥 FIXED
      summary: "",
      tag: ""
    });

    res.json({ ok: true, document: doc });
  } catch (err) {
    console.error("uploadCaseDocument error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};


// ---------------------------------------------
// UPDATE DOCUMENT (rename + tag)
// ---------------------------------------------
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

// ---------------------------------------------
// DELETE DOCUMENT
// ---------------------------------------------
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
