// server/src/rag/chunkPDF.js
// simple chunker by chars with overlap
export function chunkText(text, maxLen = 1200, overlap = 200) {
  if (!text) return [];
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(text.length, start + maxLen);
    chunks.push(text.slice(start, end).trim());
    if (end === text.length) break;
    start = Math.max(0, end - overlap);
  }
  return chunks;
}
