import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import docRoutes from "./routes/docRoutes.js";
import aiChatRoutes from "./routes/aiChatRoutes.js";
import caseRoutes from "./routes/caseRoutes.js";
import caseSubRoutes from "./routes/caseSubRoutes.js";
import caseAiRoutes from "./routes/caseAiRoutes.js";
import lawyerRoutes from "./routes/lawyerRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import hearingRoutes from "./routes/hearingRoutes.js";

dotenv.config();
const app = express();

/* ================= MIDDLEWARE ================= */

app.use(cors());

/* 🔥 FIX: SAFE JSON PARSER */
app.use(express.json({
  limit: "50mb",
  strict: true
}));

app.use(express.urlencoded({ extended: true }));

/* 🔥 ERROR HANDLER FOR BAD JSON */
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    console.error("Invalid JSON received:", err.message);
    return res.status(400).json({ error: "Invalid JSON format" });
  }
  next();
});

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/lawyers", lawyerRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/hearings", hearingRoutes);
app.use("/api/documents", docRoutes);

/* AI */
app.use("/api/ai/chat", aiChatRoutes);
app.use("/api/ai", caseAiRoutes);

/* CASES */
app.use("/api/cases", caseRoutes);
app.use("/api", caseSubRoutes);

/* ================= STATIC FILES ================= */

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

/* ================= ROOT ================= */

app.get("/", (req, res) => {
  res.send("LegalSphere Backend Running...");
});

export default app;