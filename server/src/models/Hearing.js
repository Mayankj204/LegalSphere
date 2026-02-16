import mongoose from "mongoose";

const hearingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    date: { type: Date, required: true },
    type: { type: String, default: "Hearing" },

    lawyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lawyer",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Hearing", hearingSchema);
