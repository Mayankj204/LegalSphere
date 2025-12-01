// server/src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// ROUTES
import docRoutes from "./routes/docRoutes.js";
import aiChatRoutes from "./routes/aiChatRoutes.js";  // GLOBAL + DOC AI
import caseRoutes from "./routes/caseRoutes.js";
import caseSubRoutes from "./routes/caseSubRoutes.js";
import caseAiRoutes from "./routes/caseAiRoutes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

/* ============================================================
   📄 SERVE PDF FILES (VIEW IN BROWSER)
   ============================================================ */
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".pdf")) {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline");
      }
    },
  })
);

/* ============================================================
   ⚠️ ROUTE ORDER — DO NOT CHANGE
   ============================================================ */

/* 1️⃣ GLOBAL AI (Navbar Chat) + DOCUMENT AI WORKSPACE (AI Chat) */
app.use("/api/ai/chat", aiChatRoutes);

/* 2️⃣ CASE CRUD (cases, documents inside case) */
app.use("/api/cases", caseRoutes);

/* 3️⃣ OTHER FEATURES (notes, timeline, hearings, tasks, billing) */
app.use("/api", caseSubRoutes);

/* 4️⃣ CASE-SPECIFIC AI (RAG over case documents)
      — MUST COME LAST or it will block /api/ai/chat */
app.use("/api/ai", caseAiRoutes);

/* ============================================================
   DEFAULT ROUTE
   ============================================================ */
app.get("/", (req, res) => {
  res.send("LegalSphere Backend Running...");
});

export default app;
