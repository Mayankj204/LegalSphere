import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    sources: [
      {
        filename: String,
        documentId: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  { timestamps: true }
);

const caseChatSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
      unique: true,
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

export default mongoose.model("CaseChat", caseChatSchema);
