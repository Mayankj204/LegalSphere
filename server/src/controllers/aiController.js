import dotenv from "dotenv";
dotenv.config();

/**
 * GEMINI REST API CALL (v1beta models endpoint)
 * Works 100% reliably without @google/generative-ai SDK.
 */
async function generateGemini(prompt) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.2
        }
      })
    });

    const data = await response.json();

    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      console.log("❌ Gemini REST API error:", data);
      return "AI could not generate a response.";
    }

    return data.candidates[0].content.parts[0].text;
  } catch (err) {
    console.error("❌ Gemini REST Fatal Error:", err);
    return "AI request failed.";
  }
}

// ==========================================================
// SUMMARIZE
// ==========================================================
export const summarize = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) return res.status(400).json({ error: "Text is required" });

    const prompt = `
You are a legal case summarizer.
Summarize the following text into clean bullet points:

"${text}"
`;

    const result = await generateGemini(prompt);
    res.json({ summary: result });
  } catch (err) {
    res.status(500).json({ error: "AI Summarization Failed" });
  }
};

// ==========================================================
// KEYPOINTS
// ==========================================================
export const keypoints = async (req, res) => {
  try {
    const { text } = req.body;

    const prompt = `
Extract key legal points, insights, and a short conclusion.

Text:
"${text}"

Return strictly in JSON format:
{
  "keyPoints": [...],
  "conclusion": "..."
}
`;

    const result = await generateGemini(prompt);

    try {
      const parsed = JSON.parse(result);
      res.json(parsed);
    } catch {
      res.json({ raw: result });
    }
  } catch (err) {
    res.status(500).json({ error: "AI keypoints failed" });
  }
};

// ==========================================================
// ANALYZE LEGAL CASE
// ==========================================================
export const analyze = async (req, res) => {
  try {
    const { caseContext } = req.body;

    const prompt = `
You are an advanced legal AI assistant.
Analyze the following case and extract:

1. Summary
2. Legal issues
3. Possible next steps
4. Evidence required

Return strictly in JSON format.

Case:
"${caseContext}"
`;

    const result = await generateGemini(prompt);

    try {
      const parsed = JSON.parse(result);
      res.json(parsed);
    } catch {
      res.json({ raw: result });
    }
  } catch (err) {
    res.status(500).json({ error: "AI analysis failed" });
  }
};
