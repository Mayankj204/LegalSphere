import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: "Case", required: true },
  text: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Note", NoteSchema);
