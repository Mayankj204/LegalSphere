import mongoose from "mongoose";

const lawyerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: { type: String, required: true, unique: true, trim: true },

    password: { type: String, required: true },

    role: { type: String, default: "lawyer" },

    specialization: { type: String, required: true, trim: true },

    practiceAreas: { type: [String], default: [] },

    courts: { type: [String], default: [] },

    experience: { type: Number, required: true },

    city: { type: String, required: true, trim: true },

    officeAddress: { type: String, trim: true },

    consultationFee: { type: Number },

    languages: { type: [String], default: [] },

    education: { type: [String], default: [] },

    casesHandled: { type: Number },

    successRate: { type: Number },

    barCouncilId: { type: String, trim: true },

    enrolledYear: { type: Number },

    availability: {
      type: String,
      enum: ["Available", "Busy", "Unavailable"],
      default: "Available",
    },

    isVerified: { type: Boolean, default: false },

    bio: { type: String },

    phone: { type: String },

    profileImage: { type: String },
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
