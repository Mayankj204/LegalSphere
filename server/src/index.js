// server/src/index.js
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import app from "./app.js";
import { loadEmbeddingModel } from "./utils/hfClient.js";

const PORT = process.env.PORT || 5000;

// CONNECT DATABASE
connectDB();

// LOAD LOCAL MINI-LM MODEL
await loadEmbeddingModel();

// START SERVER
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
