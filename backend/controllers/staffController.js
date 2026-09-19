import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { asyncHandler } from "../middleware/error.js";

function serialize(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    active: user.active,
    createdAt: user.createdAt,
  };
}

export const listStaff = asyncHandler(async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).lean();
  res.json({ staff: users.map(serialize) });
});

export const createStaff = asyncHandler(async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const role = req.body.role === "admin" ? "admin" : "receptionist";
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters." });
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash, role, active: true });
  res.status(201).json({ staff: serialize(user) });
});

export const updateStaff = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "Staff member not found." });
  if (req.body.name) user.name = String(req.body.name).trim();
  if (req.body.email) user.email = String(req.body.email).trim().toLowerCase();
  if (typeof req.body.active === "boolean") user.active = req.body.active;
  if (req.body.role === "admin" || req.body.role === "receptionist") user.role = req.body.role;
  if (req.body.password) {
    if (String(req.body.password).length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }
    user.passwordHash = await bcrypt.hash(String(req.body.password), 12);
  }
  await user.save();
  res.json({ staff: serialize(user) });
});
