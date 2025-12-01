import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },

    filename: {
      type: String,
      required: true,
    },

    storageUrl: {
      type: String,
      required: true,
    },

    tag: {
      type: String,
      enum: ["Evidence", "FIR", "Contract", "Notes", "Court Order", "Other", ""],
      default: "",
    },

    summary: {
      type: String,
      default: "",
    },

    fullText: {
      type: String,
      default: "",
    },

    // <-- stored embedding vector (array of numbers)
    embedding: {
      type: [Number],
      default: [],
      index: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Document", DocumentSchema);
