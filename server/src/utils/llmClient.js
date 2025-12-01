// src/utils/llmClient.js
import axios from "axios";

export const streamLLM = async (prompt, onChunk) => {
  try {
    const API_KEY = process.env.OPENROUTER_API_KEY;

    if (!API_KEY) {
      throw new Error("Missing OPENROUTER_API_KEY");
    }

    const response = await axios({
      method: "post",
      url: "https://openrouter.ai/api/v1/chat/completions",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      data: {
        model: "deepseek/deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        stream: true,
      },
      responseType: "stream",
    });

    return new Promise((resolve) => {
      response.data.on("data", (chunk) => {
        const lines = chunk.toString().split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            if (line.includes("[DONE]")) return resolve();

            try {
              const json = JSON.parse(line.replace("data: ", ""));
              const text = json.choices?.[0]?.delta?.content;
              if (text) onChunk(text);
            } catch {}
          }
        }
      });

      response.data.on("end", () => resolve());
    });
  } catch (err) {
    console.error("STREAM ERROR:", err);
    throw err;
  }
};
