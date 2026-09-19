import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: "", trim: true },
    subject: { type: String, default: "", trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ["unread", "read"], default: "unread" },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

export const Contact = mongoose.model("Contact", contactSchema);
