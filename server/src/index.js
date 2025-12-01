// server/src/index.js
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import app from "./app.js";
import { loadEmbeddingModel } from "./utils/hfClient.js";
import { initAI } from "./utils/aiClient.js";
const PORT = process.env.PORT || 5000;

// CONNECT DATABASE
connectDB();
await initAI();
// LOAD LOCAL MINI-LM MODEL (for RAG/AI system)
await loadEmbeddingModel();

// START SERVER
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
