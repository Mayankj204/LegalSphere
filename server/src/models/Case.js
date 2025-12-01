import mongoose from "mongoose";

const CaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  clientName: String,
  lawyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  court: String,
  status: { type: String, default: "Open" },
  confidential: { type: Boolean, default: false },
  collaborators: [String],
  deadlines: [{ label: String, date: Date }],
  quickNotes: String
}, { timestamps: true });

export default mongoose.model("Case", CaseSchema);
