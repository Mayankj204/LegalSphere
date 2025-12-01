// testHF.js
import dotenv from "dotenv";
dotenv.config();

const HF_API_KEY = process.env.HF_API_KEY;
const MODEL = "intfloat/e5-small-v2"; // <-- Change here

if (!HF_API_KEY) {
  console.error("❌ HF_API_KEY missing");
  process.exit(1);
}

const HF_URL = `https://router.huggingface.co/${MODEL}`;

console.log("🔍 Testing HF Embeddings Router API...");
console.log("➡ URL:", HF_URL);

async function test() {
  try {
    const response = await fetch(HF_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: "Hello world",
        parameters: { truncate: true },
        options: { use_cache: false, wait_for_model: true }
      })
    });

    const raw = await response.text();

    if (!response.ok) {
      console.error(`❌ HF API Error ${response.status}: ${raw}`);
      return;
    }

    console.log("✅ SUCCESS!");
    console.log(JSON.parse(raw));

  } catch (err) {
    console.error("❌ Exception:", err);
  }
}

test();
