// src/models/ChatSession.js

import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  role: { type: String, required: true },
  text: { type: String, required: true }, // cannot be empty
});

const ChatSessionSchema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: "Document" },
  messages: { type: [MessageSchema], default: [] }
}, { timestamps: true });

export default mongoose.model("ChatSession", ChatSessionSchema);
