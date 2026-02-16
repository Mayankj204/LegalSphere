import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Lawyer from "../models/Lawyer.js";
import { generateToken } from "../utils/jwt.js";

/* ================= REGISTER ================= */
export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      specialization,
      experience,
      city,
      barCouncilId,
      consultationFee,
      languages,
      availability,
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingUser =
      (await User.findOne({ email })) ||
      (await Lawyer.findOne({ email }));

    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;

    if (role === "lawyer") {
      if (!specialization || !experience || !city) {
        return res.status(400).json({
          error: "Specialization, experience, and city are required for lawyers",
        });
      }

      let parsedLanguages = [];
      if (languages) {
        parsedLanguages = Array.isArray(languages)
          ? languages
          : languages.split(",").map((l) => l.trim());
      }

      newUser = await Lawyer.create({
        name,
        email,
        password: hashedPassword,
        specialization,
        experience,
        city,
        barCouncilId: barCouncilId || "",
        consultationFee: consultationFee || null,
        languages: parsedLanguages,
        availability: availability || "Available",
      });

    } else {
      newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });
    }

    const token = generateToken({
      id: newUser._id,
      role,
    });

    res.status(201).json({
      token,
      role,
      name: newUser.name,
      email: newUser.email,
    });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};


/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    let user = await User.findOne({ email });
    let role = "client";

    if (!user) {
      user = await Lawyer.findOne({ email });
      role = "lawyer";
    }

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = generateToken({
      id: user._id,
      role,
    });

    res.json({
      token,
      role,
      name: user.name,
      email: user.email,
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};


/* ================= UPDATE PROFILE ================= */
export const updateProfile = async (req, res) => {
  try {
    let user;

    if (req.role === "lawyer") {
      user = await Lawyer.findById(req.user._id);
    } else {
      user = await User.findById(req.user._id);
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 🚫 Prevent sensitive field overwrite
    const restrictedFields = ["password", "role", "_id", "email"];

    Object.keys(req.body).forEach((key) => {
      if (!restrictedFields.includes(key)) {
        user[key] = req.body[key];
      }
    });

    const updatedUser = await user.save();

    const userObj = updatedUser.toObject();
    delete userObj.password;

    res.json(userObj);

  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Profile update failed" });
  }
};


/* ================= GET CURRENT USER ================= */
export const getMe = async (req, res) => {
  try {
    let user;

    if (req.role === "lawyer") {
      user = await Lawyer.findById(req.user._id).select("-password");
    } else {
      user = await User.findById(req.user._id).select("-password");
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);

  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};


/* ================= UPDATE PROFILE IMAGE ================= */
export const updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    let user;

    if (req.role === "lawyer") {
      user = await Lawyer.findById(req.user._id);
    } else {
      user = await User.findById(req.user._id);
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.profileImage = `/uploads/${req.file.filename}`;
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    res.json(userObj);

  } catch (err) {
    console.error("Profile image update error:", err);
    res.status(500).json({ error: "Failed to update image" });
  }
};


/* ================= REMOVE PROFILE IMAGE ================= */
export const removeProfileImage = async (req, res) => {
  try {
    let user;

    if (req.role === "lawyer") {
      user = await Lawyer.findById(req.user._id);
    } else {
      user = await User.findById(req.user._id);
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.profileImage = "";
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    res.json(userObj);

  } catch (err) {
    console.error("Remove profile image error:", err);
    res.status(500).json({ error: "Failed to remove image" });
  }
};
