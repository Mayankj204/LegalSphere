import mongoose from "mongoose";

const TimelineSchema = new mongoose.Schema({
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: "Case", required: true },
  title: String,
  details: String,
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Timeline", TimelineSchema);
