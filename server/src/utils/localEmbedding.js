// ===============================================================
// LOCAL EMBEDDING SYSTEM (Transformers.js)
// Uses: XENOVA/all-MiniLM-L6-v2
// No API required — 100% free & offline
// ===============================================================

import { pipeline } from "@xenova/transformers";

// Cache the model in memory (loads only once)
let embedder = null;

// Lazy loader
async function loadModel() {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
}


// ---------------------------------------------------------------
// EMBED SINGLE TEXT
// ---------------------------------------------------------------
export async function embedTextLocal(text) {
  const extractor = await loadModel();
  const result = await extractor(text, { pooling: "mean", normalize: true });
  return Array.from(result.data);
}


// ---------------------------------------------------------------
// EMBED MULTIPLE TEXTS
// ---------------------------------------------------------------
export async function embedTextsLocal(textArray) {
  const extractor = await loadModel();
  let embeddings = [];

  for (const txt of textArray) {
    const output = await extractor(txt, { pooling: "mean", normalize: true });
    embeddings.push(Array.from(output.data));
  }

  return embeddings;
}
