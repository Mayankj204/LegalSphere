// server/src/utils/openaiClient.js
import dotenv from "dotenv";
dotenv.config();

let openai = null;
if (process.env.OPENAI_API_KEY) {
  const { OpenAI } = await import("openai");
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export function getOpenAI() {
  if (!openai) throw new Error("OpenAI not configured. Set OPENAI_API_KEY in .env");
  return openai;
}
