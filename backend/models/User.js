import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "receptionist"], required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

export const User = mongoose.model("User", userSchema);
