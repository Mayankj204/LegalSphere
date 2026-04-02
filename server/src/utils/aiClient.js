// server/src/utils/aiClient.js
import { pipeline } from "@xenova/transformers";

let embedder = null;
let generator = null;
let initPromise = null;

/* ================= INIT ================= */
export async function initAI() {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    console.log("⏳ Initializing AI...");

    embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );

    generator = await pipeline(
      "text2text-generation",
      "Xenova/flan-t5-small"
    );

    console.log("✅ AI ready");
  })();

  return initPromise;
}

/* ================= EMBEDDING ================= */
export async function embedText(text) {
  await initAI();

  const output = await embedder(text, {
    pooling: "mean",
    normalize: true,
  });

  let vector;

  if (Array.isArray(output?.[0])) vector = output[0];
  else if (Array.isArray(output)) vector = output;
  else if (output?.data) vector = Array.from(output.data);
  else throw new Error("Invalid embedding output");

  const norm = Math.hypot(...vector);
  return norm > 0 ? vector.map((v) => v / norm) : vector;
}

/* ================= GENERATE ================= */
export async function generateAnswer(question, { context = "" }) {
  await initAI();

  const prompt = `
Answer ONLY using the given context.

RULES:
- Do NOT guess
- Do NOT add extra info
- If answer not present → say "Not found in uploaded documents."

Context:
${context}

Question:
${question}

Answer:
`;

  const out = await generator(prompt, {
    max_new_tokens: 120,
  });

  let text = out?.[0]?.generated_text || "";

  if (text.includes("Answer:")) {
    text = text.split("Answer:").pop().trim();
  }

  text = text.replace(/\s+/g, " ").trim();

  if (!text || text.length < 5) {
    return "Not found in uploaded documents.";
  }

  return text;
}