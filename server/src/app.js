import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// ROUTES
import docRoutes from "./routes/docRoutes.js";
import aiChatRoutes from "./routes/aiChatRoutes.js";
import caseRoutes from "./routes/caseRoutes.js";
import caseSubRoutes from "./routes/caseSubRoutes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve uploads folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/documents", docRoutes);
app.use("/api/ai/chat", aiChatRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api", caseSubRoutes);

app.get("/", (req, res) => {
  res.send("LegalSphere Backend Running...");
});

export default app;
