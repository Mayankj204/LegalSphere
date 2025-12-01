export function chunkText(text, size = 1200, overlap = 200) {
  text = text.replace(/\s+/g, " ").trim();

  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + size, text.length);
    chunks.push(text.slice(start, end));
    start = end - overlap;
    if (start < 0) start = 0;
  }

  return chunks;
}
