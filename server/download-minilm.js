import fs from "fs";
import https from "https";
import path from "path";

const dir = "./models/minilm";
const filePath = path.join(dir, "model.onnx");

if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// HuggingFace MiniLM model file (correct path)
const URL =
  "https://huggingface.co/Xenova/all-MiniLM-L6-v2/resolve/main/onnx/model.onnx";

function download(url, dest) {
  console.log("⬇️ Downloading:", url);

  https.get(url, (res) => {
    // Handle redirects (302, 301, 307, 308)
    if (
      res.statusCode >= 300 &&
      res.statusCode < 400 &&
      res.headers.location
    ) {
      console.log(`🔁 Redirecting to: ${res.headers.location}`);
      return download(res.headers.location, dest);
    }

    if (res.statusCode !== 200) {
      console.log("❌ Download failed. Status:", res.statusCode);
      return;
    }

    const fileStream = fs.createWriteStream(dest);
    res.pipe(fileStream);

    fileStream.on("finish", () => {
      fileStream.close();
      console.log("✔️ Downloaded successfully →", dest);
    });
  });
}

// Start download
download(URL, filePath);
