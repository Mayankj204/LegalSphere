import mongoose from "mongoose";

const HearingSchema = new mongoose.Schema(
  {
    caseId: { type: mongoose.Schema.Types.ObjectId, ref: "Case" },
    date: { type: Date, required: true },
    court: String,
    purpose: String
  },
  { timestamps: true }
);

export default mongoose.model("Hearing", HearingSchema);
