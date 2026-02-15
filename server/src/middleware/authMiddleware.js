import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Lawyer from "../models/Lawyer.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ error: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check both collections
    let user = await User.findById(decoded.id);
    if (!user) {
      user = await Lawyer.findById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    req.role = decoded.role;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalid" });
  }
};
