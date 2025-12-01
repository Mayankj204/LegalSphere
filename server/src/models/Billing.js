import mongoose from "mongoose";

const BillingSchema = new mongoose.Schema({
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: "Case", required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  description: String
}, { timestamps: true });

export default mongoose.model("Billing", BillingSchema);
