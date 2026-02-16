import mongoose from "mongoose";

const CaseSchema = new mongoose.Schema(
  {
   
    title: { type: String, required: true },

    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    lawyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    court: String,

    status: {
      type: String,
      enum: ["Open", "In Progress", "Evidence Pending", "Closed"],
      default: "Open",
    },

    confidential: {
      type: Boolean,
      default: false,
    },

    collaborators: [String],

    deadlines: [{ label: String, date: Date }],

    quickNotes: String,
  },
  { timestamps: true }
);

export default mongoose.model("Case", CaseSchema);
