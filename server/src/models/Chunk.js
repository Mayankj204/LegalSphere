// src/models/Chunk.js
import mongoose from "mongoose";

const ChunkSchema = new mongoose.Schema({
  documentId: mongoose.Schema.Types.ObjectId,
  text: String,
  embedding: { type: Array, default: [] },
});

export default mongoose.model("Chunk", ChunkSchema);
