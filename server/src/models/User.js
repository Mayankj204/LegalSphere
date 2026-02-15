import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "client" },

    // NEW FIELDS
    phone: { type: String, default: "" },
    city: { type: String, default: "" },
    address: { type: String, default: "" },
    about: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
