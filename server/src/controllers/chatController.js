// src/controllers/chatController.js

import ChatSession from "../models/ChatSession.js";
import Document from "../models/Document.js";
import Chunk from "../models/Chunk.js";

import { embedTexts } from "../utils/hfClient.js";     // Embeddings (OpenRouter)
import { streamLLM } from "../utils/llmClient.js";     // DeepSeek LLM


/* ============================================================
   🔢 Cosine Similarity
   ============================================================ */
function cosine(a, b) {
  if (!a || !b || a.length !== b.length) return 0;

  let dot = 0, na = 0, nb = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }

  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom ? dot / denom : 0;
}


/* ============================================================
   📘 Retrieve Top-K Relevant Chunks
   ============================================================ */
async function retrieveChunks(docId, queryEmbedding, k = 4) {
  const chunks = await Chunk.find({ documentId: docId }).lean();

  if (!chunks || chunks.length === 0) return [];

  return chunks
    .map((c) => ({
      ...c,
      sim: cosine(queryEmbedding, c.embedding || [])
    }))
    .sort((a, b) => b.sim - a.sim)
    .slice(0, k);
}


/* ============================================================
   🧠 Build RAG Prompt for DeepSeek
   ============================================================ */
function buildPrompt(chunks, question, history = []) {
  const chunkText = chunks.length
    ? chunks
        .map((c, i) => `SOURCE ${i + 1}:\n${c.text}`)
        .join("\n\n")
    : "No relevant sources found.";

  const hist = history
    .map((m) => `${m.role.toUpperCase()}: ${m.text}`)
    .join("\n") || "No previous messages.";

  return `
You are a legal AI assistant. You MUST use only the provided document sources.

Sources:
${chunkText}

Chat History:
${hist}

User Question:
${question}

If the required information is not present in the sources, reply:
"The document does not contain this information."

Give a precise, structured legal answer and cite sources like [Source 1].
`;
}


/* ============================================================
   🟢 Start Document-Based Chat Session
   ============================================================ */
export const startSession = async (req, res) => {
  try {
    const { documentId } = req.body;

    if (!documentId)
      return res.status(400).json({ error: "documentId is required" });

    const session = await ChatSession.create({
      documentId,
      messages: [],
    });

    res.json({ sessionId: session._id });
  } catch (err) {
    console.error("startSession error:", err);
    res.status(500).json({ error: "Failed to create session" });
  }
};


/* ============================================================
   🔴 STREAM MESSAGE — Server-Sent Events (SSE)
   ============================================================ */
export const streamMessage = async (req, res) => {
  try {
    const { sessionId, q } = req.query;

    // ---- VALIDATION FIX (prevents ObjectId null crash) ----
    if (!sessionId || sessionId === "null" || sessionId === "undefined") {
      res.write(`data: ${JSON.stringify({ error: "Missing or invalid sessionId" })}\n\n`);
      return res.end();
    }

    if (!q || !q.trim()) {
      res.write(`data: ${JSON.stringify({ error: "Empty question" })}\n\n`);
      return res.end();
    }

    // ---- SSE HEADERS ----
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    // ---- Load Chat Session ----
    let session;
    try {
      session = await ChatSession.findById(sessionId);
    } catch (err) {
      res.write(`data: ${JSON.stringify({ error: "Invalid sessionId" })}\n\n`);
      return res.end();
    }

    if (!session) {
      res.write(`data: ${JSON.stringify({ error: "Session not found" })}\n\n`);
      return res.end();
    }

    // ---- Load Document ----
    const doc = await Document.findById(session.documentId);
    if (!doc) {
      res.write(`data: ${JSON.stringify({ error: "Document not found" })}\n\n`);
      return res.end();
    }

    // ---- Generate Embedding ----
    const embeds = await embedTexts([q]);
    const qEmbed = embeds?.[0];

    if (!qEmbed) {
      res.write(`data: ${JSON.stringify({ error: "Embedding failed" })}\n\n`);
      return res.end();
    }

    // ---- RAG Retrieval ----
    const topChunks = await retrieveChunks(doc._id, qEmbed, 4);

    const prompt = buildPrompt(topChunks, q, session.messages.slice(-6));

    // ---- STREAM DEEPSEEK RESPONSE ----
    let full = "";

    await streamLLM(prompt, (chunk) => {
      full += chunk;
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();

    // ---- SAVE CHAT HISTORY ----
    session.messages.push({ role: "user", text: q });
    session.messages.push({ role: "assistant", text: full });
    await session.save();

  } catch (err) {
    console.error("STREAM ERROR:", err);
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
};


/* ============================================================
   ⚪ Non-stream POST message (fallback for mobile)
   ============================================================ */
export const postMessage = async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message)
      return res.status(400).json({ error: "sessionId and message required" });

    let session;
    try {
      session = await ChatSession.findById(sessionId);
    } catch (err) {
      return res.status(400).json({ error: "Invalid sessionId" });
    }

    if (!session)
      return res.status(404).json({ error: "Session not found" });

    const doc = await Document.findById(session.documentId);
    if (!doc)
      return res.status(404).json({ error: "Document not found" });

    const embeds = await embedTexts([message]);
    const qEmbed = embeds?.[0];

    const topChunks = await retrieveChunks(doc._id, qEmbed, 4);
    const prompt = buildPrompt(topChunks, message, session.messages.slice(-6));

    // Full generation
    let full = "";
    await streamLLM(prompt, (chunk) => (full += chunk));

    // Save
    session.messages.push({ role: "user", text: message });
    session.messages.push({ role: "assistant", text: full });
    await session.save();

    res.json({ answer: full });

  } catch (err) {
    console.error("postMessage error:", err);
    res.status(500).json({ error: err.message });
  }
};
