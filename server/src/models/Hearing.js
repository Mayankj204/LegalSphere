import mongoose from "mongoose";

const hearingSchema = new mongoose.Schema(
  {
    title: { type: String, default: "Court Hearing" },

    description: { type: String, default: "" },

    date: { type: Date, required: true },

    type: { type: String, default: "Hearing" },

    /* 🔥 ADD THESE */
    court: { type: String, default: "" },
    purpose: { type: String, default: "" },

    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
    },

    lawyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lawyer",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Hearing", hearingSchema);