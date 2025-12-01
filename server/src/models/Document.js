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
      required: true,      // 🔥 MUST be required so dummy URL is never saved again
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
  },
  { timestamps: true }
);

export default mongoose.model("Document", DocumentSchema);
