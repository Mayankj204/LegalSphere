// server/src/controllers/caseController.js

import CaseModel from "../models/Case.js";
import Document from "../models/Document.js";
import fs from "fs";
import path from "path";
import { embedText } from "../utils/aiClient.js";

/* ========================================================================
   🔥 SAFE PDF PARSER (Node 24 + ESM Compatible)
   ======================================================================== */

async function parsePDF(buffer) {
  const mod = await import("pdf-parse");

  // Handle all possible export shapes
  const pdfParse =
    mod.default?.default ||
    mod.default ||
    mod;

  if (typeof pdfParse !== "function") {
    throw new Error("pdf-parse export is not a function");
  }

  return pdfParse(buffer);
}

/* ========================================================================
   🎯 CASE CRUD
   ======================================================================== */

// GET CASES FOR LOGGED IN USER
export const listCases = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let query = {};

    if (req.user.role === "lawyer") {
      query = { lawyerId: req.user._id };
    } else if (req.user.role === "client") {
      query = { clientId: req.user._id };
    } else {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const cases = await CaseModel.find(query)
      .populate("lawyerId", "name email")
      .sort({ updatedAt: -1 });

    const activeCount = cases.filter(
      (c) => c.status === "Open" || c.status === "In Progress"
    ).length;

    const resolvedCount = cases.filter(
      (c) => c.status === "Closed"
    ).length;

    const connectedLawyers = [
      ...new Set(cases.map((c) => c.lawyerId?._id?.toString()))
    ].length;

    res.json({
      ok: true,
      cases,
      stats: {
        activeCount,
        resolvedCount,
        connectedLawyers,
      },
    });

  } catch (err) {
    console.error("Error fetching cases:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

// CREATE CASE
export const createCase = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const created = await CaseModel.create({
      title: req.body.title,
      court: req.body.court || "",
      status: req.body.status || "Open",
      confidential: req.body.confidential || false,
      lawyerId: req.user._id,
      clientId: req.body.clientId || req.user._id,
    });

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
   📄 CASE DETAILS
   ======================================================================== */

export const getCaseById = async (req, res) => {
  const { caseId } = req.params;

  try {
    const caseData = await CaseModel.findById(caseId)
      .populate("clientId", "name email")
      .populate("lawyerId", "name email");

    if (!caseData) {
      return res.status(404).json({ ok: false, message: "Case not found" });
    }

    res.json({ ok: true, case: caseData });

  } catch (err) {
    console.error("Error fetching case:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

/* ========================================================================
   📂 DOCUMENTS
   ======================================================================== */

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

export const uploadCaseDocument = async (req, res) => {
  const { caseId } = req.params;

  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, message: "No file uploaded" });
    }

    const filePathRel = `/uploads/${req.file.filename}`;
    const fullPath = path.join(process.cwd(), "uploads", req.file.filename);

    let text = "";
    const ext = req.file.originalname.split(".").pop().toLowerCase();

    if (ext === "pdf") {
      try {
        const buffer = fs.readFileSync(fullPath);
        const pdfData = await parsePDF(buffer);
        text = pdfData.text || "";
      } catch (err) {
        console.error("PDF parse error:", err);
      }
    } else {
      try {
        text = fs.readFileSync(fullPath, "utf8");
      } catch {
        text = "";
      }
    }

    let embedding = [];
    try {
      const chunk = text.slice(0, 30000);
      embedding = await embedText(chunk);
    } catch (err) {
      console.error("Embedding generation failed:", err);
    }

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



