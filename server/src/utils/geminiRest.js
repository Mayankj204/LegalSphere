// src/utils/geminiRest.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:streamGenerateContent?key=${API_KEY}`;

export async function streamGemini(prompt, onChunk) {
  try {
    const response = await axios({
      url: GEMINI_URL,
      method: "POST",
      responseType: "stream",
      data: {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      },
    });

    response.data.on("data", (chunk) => {
      try {
        const lines = chunk.toString().trim().split("\n");
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const json = JSON.parse(line.replace("data:", "").trim());
          const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) onChunk(text);
        }
      } catch {}
    });

    return response.data;
  } catch (err) {
    console.error("STREAM ERROR:", err.response?.data || err);
    throw err;
  }
}
