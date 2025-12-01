// server/src/controllers/aiChatController.js
import { streamLLM } from "../utils/llmClient.js";

export const streamGeneralAI = async (req, res) => {
  try {
    // Support both GET query and POST body
    const q = req.query.q || req.body?.query;

    if (!q || typeof q !== "string" || !q.trim()) {
      return res.write(
        `data: ${JSON.stringify({ error: "Invalid or empty query" })}\n\n`
      );
    }

    // SSE headers
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });

    const send = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);

    const prompt = `
You are a helpful Indian Legal AI Assistant.
Answer general legal questions, drafting help, IPC/CrPC explanations, petitions, notices, etc.
Be correct. Do NOT hallucinate legal sections.

User question:
${q}
    `;

    let full = "";

    await streamLLM(prompt, (chunk) => {
      full += chunk;
      send({ text: chunk });
    });

    send({ done: true });
    res.end();
  } catch (err) {
    console.error("General AI Error:", err);
    res.write(
      `data: ${JSON.stringify({ error: "AI error", done: true })}\n\n`
    );
    res.end();
  }
};
