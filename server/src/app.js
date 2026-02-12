// server/src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();
import authRoutes from "./routes/authRoutes.js";

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
app.use("/api/auth", authRoutes);

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

/* 1️⃣ AUTH */
app.use("/api/auth", authRoutes);

/* 2️⃣ GLOBAL AI + DOCUMENT CHAT */
app.use("/api/ai/chat", aiChatRoutes);

/* 3️⃣ CASE CRUD */
app.use("/api/cases", caseRoutes);

/* 4️⃣ OTHER FEATURES */
app.use("/api", caseSubRoutes);

/* 5️⃣ CASE AI (LAST) */
app.use("/api/ai", caseAiRoutes);

/* ============================================================
   DEFAULT ROUTE
   ============================================================ */
app.get("/", (req, res) => {
  res.send("LegalSphere Backend Running...");
});

export default app;
