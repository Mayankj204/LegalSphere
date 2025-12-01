// server/src/controllers/caseAiController.js
import Document from "../models/Document.js";
import { embedText, generateAnswer } from "../utils/aiClient.js";

/* ------------------------------------------------------------
   UTILITY: COSINE SIMILARITY
------------------------------------------------------------ */
function cosineSim(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    const x = a[i] || 0;
    const y = b[i] || 0;
    dot += x * y;
    na += x * x;
    nb += y * y;
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-8);
}

/* ------------------------------------------------------------
   CASE-SPECIFIC AI CHAT (STREAMING)
   Route: POST /api/ai/case/:caseId/query
------------------------------------------------------------ */
export const streamCaseAI = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required." });
    }

    /* ----------------------------------------------
       SSE HEADERS
    ---------------------------------------------- */
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });

    const send = (data) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    /* ----------------------------------------------
       1. Load all documents with embeddings
    ---------------------------------------------- */
    const docs = await Document.find({
      caseId,
      embedding: { $exists: true, $ne: [] }
    }).lean();

    if (!docs.length) {
      // No embeddings — just answer normally
      const answer = await generateAnswer(query);

      // Simulate streaming
      const chunks = answer.match(/.{1,40}/g) || [];
      for (const c of chunks) {
        await new Promise((r) => setTimeout(r, 20));
        send({ text: c });
      }
      send({ done: true });
      return res.end();
    }

    /* ----------------------------------------------
       2. Embed question
    ---------------------------------------------- */
    const qVec = await embedText(query);

    /* ----------------------------------------------
       3. Compute similarity between question and docs
    ---------------------------------------------- */
    const scored = docs.map((d) => ({
      doc: d,
      score: cosineSim(qVec, d.embedding || []),
    }));

    scored.sort((a, b) => b.score - a.score);

    const TOP_K = 4;
    const top = scored.slice(0, TOP_K).filter((s) => s.score > 0.05);

    /* ----------------------------------------------
       4. Build context from top documents
    ---------------------------------------------- */
    const contextParts = top.map((t, idx) => {
      const text = (t.doc.fullText || "").slice(0, 1500);
      return `Source ${idx + 1} (${t.doc.filename}):\n${text}`;
    });

    const context = contextParts.join("\n\n");

    /* ----------------------------------------------
       5. Build final GPT prompt
    ---------------------------------------------- */
    const prompt = `
You are a legal assistant. Use ONLY the following case documents to answer.
If answer not in the documents, say so (do NOT hallucinate).

Context:
${context}

Question:
${query}

Answer clearly and reference documents using [Source 1], [Source 2], etc.
    `;

    /* ----------------------------------------------
       6. Generate answer and stream token-by-token
    ---------------------------------------------- */
    const output = await generateAnswer(prompt);

    const chunks = output.match(/.{1,40}/g) || [];

    for (const c of chunks) {
      await new Promise((r) => setTimeout(r, 20));
      send({ text: c });
    }

    send({ done: true });
    res.end();
  } catch (err) {
    console.error("CaseAI Error:", err);
    res.write(`data: ${JSON.stringify({ error: "AI error", done: true })}\n\n`);
    res.end();
  }
};
