// server/src/utils/embeddingService.js
import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const EMBEDDING_MODEL = process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-001";

/**
 * createEmbedding(textOrArray)
 * - textOrArray: string | string[]
 * - returns: Float32Array (vector) or array of vectors for batch
 */
export async function createEmbedding(input) {
  try {
    const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });

    // model.embedContent supports string or array
    const resp = await model.embedContent(typeof input === "string" ? input : input);
    // resp.embedding may be an object or array depending on SDK
    // Standardize output: return array of numbers (or array of arrays)
    if (Array.isArray(resp)) {
      // batch
      return resp.map((r) => r.embedding?.values ?? r.embedding ?? r);
    } else {
      return resp.embedding?.values ?? resp.embedding ?? resp;
    }
  } catch (err) {
    console.error("Embedding Error:", err?.message ?? err);
    throw err;
  }
}
