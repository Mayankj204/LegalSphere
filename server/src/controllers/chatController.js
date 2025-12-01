// src/controllers/chatController.js

import ChatSession from "../models/ChatSession.js";
import Document from "../models/Document.js";
import Chunk from "../models/Chunk.js";

import { embedTexts } from "../utils/hfClient.js";   // OpenRouter embeddings
import { streamLLM } from "../utils/llmClient.js";   // OpenRouter DeepSeek LLM


// -------------------------------------------
// Cosine similarity
// -------------------------------------------
function cosine(a, b) {
  if (!a || !b || a.length !== b.length) return 0;
  let dot = 0, na = 0, nb = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}


// -------------------------------------------
// Retrieve top K similar chunks
// -------------------------------------------
async function retrieveChunks(docId, queryEmbedding, k = 4) {
  const chunks = await Chunk.find({ documentId: docId }).lean();

  return chunks
    .map(c => ({
      ...c,
      sim: cosine(queryEmbedding, c.embedding || [])
    }))
    .sort((a, b) => b.sim - a.sim)
    .slice(0, k);
}


// -------------------------------------------
// Build prompt for DeepSeek
// -------------------------------------------
function buildPrompt(chunks, question, history = []) {
  const chunkText = chunks
    .map((c, i) => `SOURCE ${i + 1}:\n${c.text}`)
    .join("\n\n");

  const hist = history
    .map(m => `${m.role.toUpperCase()}: ${m.text}`)
    .join("\n");

  return `
You are a legal AI assistant. Use ONLY the following document sources.

${chunkText}

Chat History:
${hist}

User Question:
${question}

If information is not present in the sources, reply:
"The document does not contain this information."

Give a clear structured legal answer and cite SOURCE numbers.
  `;
}



// =====================================================
// START A CHAT SESSION
// =====================================================
export const startSession = async (req, res) => {
  try {
    const session = await ChatSession.create({
      documentId: req.body.documentId,
      messages: [],
    });

    res.json({ sessionId: session._id });
  } catch (err) {
    res.status(500).json({ error: "Failed to create session" });
  }
};



// =====================================================
// STREAM MESSAGE (SSE)
// =====================================================
export const streamMessage = async (req, res) => {
  try {
    const { sessionId, q } = req.query;

    if (!sessionId || !q) {
      return res.end();
    }

    // SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    // Load session
    const session = await ChatSession.findById(sessionId);
    if (!session) {
      res.write(`data: ${JSON.stringify({ error: "Invalid session ID" })}\n\n`);
      return res.end();
    }

    const doc = await Document.findById(session.documentId);
    if (!doc) {
      res.write(`data: ${JSON.stringify({ error: "Document not found" })}\n\n`);
      return res.end();
    }

    // --------------------------------------
    // Generate embedding from OpenRouter
    // --------------------------------------
    const embeddings = await embedTexts([q]);
    const queryEmbedding = embeddings?.[0];

    if (!queryEmbedding) {
      res.write(`data: ${JSON.stringify({ error: "Embedding failed" })}\n\n`);
      return res.end();
    }

    // --------------------------------------
    // Retrieve similar document chunks
    // --------------------------------------
    const topChunks = await retrieveChunks(doc._id, queryEmbedding, 4);

    const prompt = buildPrompt(topChunks, q, session.messages.slice(-6));

    // ======================================
    // STREAM LLM FROM OPENROUTER
    // ======================================
    let fullResponse = "";

    await streamLLM(prompt, (chunkText) => {
      fullResponse += chunkText;
      res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();

    // --------------------------------------
    // SAVE CHAT
    // --------------------------------------
    session.messages.push({ role: "user", text: q });
    session.messages.push({ role: "assistant", text: fullResponse });
    await session.save();

  } catch (err) {
    console.error("STREAM ERROR:", err);
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
};



// =====================================================
// NON-STREAM MESSAGE (POST) — fallback for mobile UI
// =====================================================
export const postMessage = async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message)
      return res.status(400).json({ error: "sessionId and message required" });

    const session = await ChatSession.findById(sessionId);
    if (!session)
      return res.status(404).json({ error: "Invalid sessionId" });

    const doc = await Document.findById(session.documentId);
    if (!doc)
      return res.status(404).json({ error: "Document missing" });

    // Embedding
    const embeddings = await embedTexts([message]);
    const queryEmbedding = embeddings?.[0];

    const topChunks = await retrieveChunks(doc._id, queryEmbedding, 4);

    const prompt = buildPrompt(topChunks, message, session.messages.slice(-6));

    // LLM full generation (non-stream)
    let full = "";
    await streamLLM(prompt, (text) => {
      full += text;
    });

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
