// src/controllers/docController.js
import fs from "fs/promises";
import path from "path";

// PDF Extraction
import pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.js";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// Models
import Document from "../models/Document.js";
import Chunk from "../models/Chunk.js";

// Utilities
import { chunkText } from "../utils/chunker.js";
import { embedTexts } from "../utils/hfClient.js";


// =======================================================
// UPLOAD DOCUMENT
// =======================================================
export const uploadDocument = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const ext = path.extname(file.originalname).toLowerCase();
    let text = "";

    // Extract PDF
    if (ext === ".pdf") {
      const data = new Uint8Array(await fs.readFile(file.path));
      const pdf = await pdfjsLib.getDocument({ data }).promise;

      for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
        const page = await pdf.getPage(pageNo);
        const content = await page.getTextContent();
        text += content.items.map((c) => c.str).join(" ") + "\n";
      }
    }
    // Extract TXT
    else if (ext === ".txt") {
      text = await fs.readFile(file.path, "utf8");
    }
    // Wrong file
    else {
      return res.status(400).json({ error: "Only PDF or TXT allowed" });
    }

    // Save Document
    const doc = await Document.create({
      filename: file.originalname,
      fullText: text,
      filePath: file.path,
    });

    // Chunking + Embeddings
    const chunks = chunkText(text, 1200, 200);
    const embeddings = await embedTexts(chunks);

    if (!embeddings || embeddings.length !== chunks.length) {
      return res.status(500).json({ error: "Embedding generation failed" });
    }

    const ops = chunks.map((chunk, i) =>
      Chunk.create({
        documentId: doc._id,
        text: chunk,
        embedding: embeddings[i],
      })
    );
    await Promise.all(ops);

    // FIX: frontend expects "document"
    res.json({
      message: "Document uploaded successfully",
      document: doc,
      chunks: chunks.length,
    });

  } catch (err) {
    console.error("❌ Upload Error:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
};


// =======================================================
// GET ALL DOCUMENTS
// =======================================================
export const getAllDocuments = async (req, res) => {
  try {
    const docs = await Document.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};


// =======================================================
// GET DOCUMENT BY ID
// =======================================================
export const getDocumentById = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Document not found" });

    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch document" });
  }
};


// =======================================================
// DOWNLOAD DOCUMENT
// =======================================================
export const downloadDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Document not found" });

    if (!doc.filePath) {
      return res.status(400).json({ error: "Download not available" });
    }

    return res.download(doc.filePath, doc.filename);
  } catch (err) {
    res.status(500).json({ error: "Download failed" });
  }
};


// =======================================================
// DELETE DOCUMENT + CHUNKS
// =======================================================
export const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Document not found" });

    // remove file
    if (doc.filePath) {
      try {
        await fs.unlink(doc.filePath);
      } catch {}
    }

    await Chunk.deleteMany({ documentId: doc._id });
    await Document.findByIdAndDelete(doc._id);

    res.json({ message: "Document and chunks deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};
