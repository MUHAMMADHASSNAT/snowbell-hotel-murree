import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { asyncHandler } from "../middleware/error.js";

function tokenFor(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );
}

function publicUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export const login = asyncHandler(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }
  const user = await User.findOne({ email });
  if (!user || !user.active) {
    return res.status(401).json({ message: "Invalid email or password." });
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: "Invalid email or password." });
  }
  res.json({ token: tokenFor(user), user: publicUser(user) });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
