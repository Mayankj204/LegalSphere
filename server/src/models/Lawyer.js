import mongoose from "mongoose";

const lawyerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: { type: String, default: "lawyer" },

    specialization: { type: String, required: true },

    experience: { type: Number, required: true }, // in years

    city: { type: String, required: true },

    bio: { type: String },

    phone: { type: String },

    profileImage: { type: String }
  },
  { timestamps: true }
);

// remove password from JSON response
lawyerSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("Lawyer", lawyerSchema);