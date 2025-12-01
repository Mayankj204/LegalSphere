// src/utils/chunker.js

export function chunkText(text, maxLen = 1200, overlap = 200) {
  const words = text.split(" ");
  const chunks = [];

  for (let i = 0; i < words.length; i += (maxLen - overlap)) {
    chunks.push(words.slice(i, i + maxLen).join(" "));
  }

  return chunks;
}
