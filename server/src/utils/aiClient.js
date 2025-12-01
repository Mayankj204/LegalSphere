// server/src/utils/aiClient.js
import { pipeline } from "@xenova/transformers";

let embedder = null;
let generator = null;
let initPromise = null;

/* ============================================================
   Initialize Pipelines (MiniLM + GPT2)
   ============================================================ */

export async function initAI() {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    console.log("⏳ Initializing AI pipelines...");

    // MiniLM sentence embeddings
    embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2", // local or hub
      { progress_callback: () => {} }
    );

    // Simple generator for chatbot
    generator = await pipeline("text-generation", "Xenova/gpt2", {
      max_length: 512,
    });

    console.log("✅ AI pipelines ready.");
  })();

  return initPromise;
}

/* ============================================================
   EMBEDDING FIX — supports ALL Xenova tensor shapes
   ============================================================ */

export async function embedText(text) {
  await initAI();

  const output = await embedder(text, { pooling: "mean", normalize: true });

  let vector;

  // Case 1: [[vec]]
  if (Array.isArray(output) && Array.isArray(output[0])) {
    vector = output[0];
  }
  // Case 2: [vec]
  else if (Array.isArray(output)) {
    vector = output;
  }
  // Case 3: Tensor { data: Float32Array }
  else if (output?.data) {
    vector = Array.from(output.data);
  } else {
    console.error(output);
    throw new Error("Unexpected embedder output shape");
  }

  // Normalize (best for cosine search)
  const norm = Math.hypot(...vector);
  if (norm > 0) vector = vector.map((v) => v / norm);

  return vector;
}

/* ============================================================
   GENERATION (For General Chatbot)
   ============================================================ */

export async function generateAnswer(prompt, opts = {}) {
  await initAI();

  const out = await generator(prompt, {
    max_length: opts.max_length || 512,
    temperature: opts.temperature || 0.7,
    top_p: opts.top_p || 0.9,
    do_sample: true,
  });

  return out[0].generated_text;
}
