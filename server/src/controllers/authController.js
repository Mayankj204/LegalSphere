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
    } = req.body;

    // Check existing user
    const existingUser =
      (await User.findOne({ email })) ||
      (await Lawyer.findOne({ email }));

    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;

    if (role === "lawyer") {
      newUser = await Lawyer.create({
        name,
        email,
        password: hashedPassword,
        specialization: specialization || "",
        experience: experience || "",
        city: city || "",
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

    res.json({
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
