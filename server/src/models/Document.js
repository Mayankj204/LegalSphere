// src/models/Document.js
import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
  filename: String,
  fullText: String,
}, { timestamps: true });

export default mongoose.model("Document", DocumentSchema);
