import Document from "../models/Document.js";
import CaseChat from "../models/CaseChat.js";
import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
const pdf = pdfParse.default || pdfParse;

import { embedText, generateAnswer } from "../utils/aiClient.js";

/* ================= COSINE ================= */
function cosineSim(a, b) {
  let dot = 0,
    na = 0,
    nb = 0;

  for (let i = 0; i < a.length; i++) {
    const x = a[i] || 0;
    const y = b[i] || 0;
    dot += x * y;
    na += x * x;
    nb += y * y;
  }

  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-8);
}

/* ================= CLEAN ================= */
function cleanText(text) {
  if (!text) return "";
  return text.replace(/[^\x20-\x7E\n]/g, " ").replace(/\s+/g, " ").trim();
}

/* ================= CHUNKING ================= */
function chunkText(text, size = 500) {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}

/* ================= GET CHAT ================= */
export const getCaseChat = async (req, res) => {
  try {
    const chat = await CaseChat.findOne({ caseId: req.params.caseId }).lean();
    res.json({ ok: true, messages: chat?.messages || [] });
  } catch {
    res.status(500).json({ ok: false });
  }
};

/* ================= MAIN CHAT ================= */
export const caseChat = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { message } = req.body;

    let chat = await CaseChat.findOne({ caseId });
    if (!chat) chat = await CaseChat.create({ caseId, messages: [] });

    chat.messages.push({
      role: "user",
      text: message || "Uploaded a file",
    });

    /* ================= FILE ================= */
    if (req.file) {
      const fullPath = path.join(process.cwd(), "uploads", req.file.filename);
      const ext = req.file.originalname.split(".").pop().toLowerCase();

      let extractedText = "";

      try {
        if (ext === "pdf") {
          const buffer = fs.readFileSync(fullPath);
          const data = await pdf(buffer);
          extractedText = data?.text || "";
        }

        if (ext === "txt") {
          extractedText = fs.readFileSync(fullPath, "utf8");
        }
      } catch (err) {
        console.error("PDF ERROR:", err);
      }

      extractedText = cleanText(extractedText);

      console.log("PDF SAMPLE:\n", extractedText.slice(0, 300));

      /* ❌ if unreadable */
      if (!extractedText || extractedText.length < 50) {
        return res.json({
          ok: true,
          answer: "Unable to read document properly.",
          sources: [],
        });
      }

      /* ================= CHUNK + STORE ================= */
      const chunks = chunkText(extractedText);

      for (const chunk of chunks) {
        const embedding = await embedText(chunk);

        await Document.create({
          caseId,
          filename: req.file.originalname,
          storageUrl: `/uploads/${req.file.filename}`,
          fullText: chunk,
          embedding,
        });
      }
    }

    /* ================= RETRIEVE ================= */
    const docs = await Document.find({
      caseId,
      embedding: { $ne: [] },
    }).lean();

    if (!docs.length) {
      return res.json({
        ok: true,
        answer: "No documents uploaded.",
        sources: [],
      });
    }

    const qVec = await embedText(message);

    const scored = docs.map((d) => ({
      doc: d,
      score: cosineSim(qVec, d.embedding),
    }));

    const top = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    console.log("TOP MATCH:\n", top[0]?.doc.fullText);

    /* ================= STRICT FILTER ================= */
    if (!top.length || top[0].score < 0.3) {
      return res.json({
        ok: true,
        answer: "Not found in uploaded documents.",
        sources: [],
      });
    }

    const context = top
      .map((t) => t.doc.fullText.slice(0, 250))
      .join("\n\n");

    const answer = await generateAnswer(message, { context });

    chat.messages.push({
      role: "assistant",
      text: answer,
      sources: top.map((t) => ({
        filename: t.doc.filename,
        snippet: t.doc.fullText.slice(0, 150),
      })),
    });

    await chat.save();

    return res.json({
      ok: true,
      answer,
      sources: top.map((t) => ({
        filename: t.doc.filename,
        snippet: t.doc.fullText.slice(0, 150),
      })),
    });

  } catch (err) {
    console.error("AI ERROR FULL:", err);
    res.status(500).json({ error: "AI error" });
  }
};