import { Contact } from "../models/Contact.js";
import { asyncHandler } from "../middleware/error.js";

function serialize(item) {
  return {
    id: item._id.toString(),
    name: item.name,
    email: item.email,
    phone: item.phone,
    subject: item.subject,
    message: item.message,
    status: item.status,
    createdAt: item.createdAt,
  };
}

export const createContact = asyncHandler(async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim();
  const message = String(req.body.message || "").trim();
  if (!name || !email || !message) {
    return res.status(400).json({ message: "Name, email, and message are required." });
  }
  const item = await Contact.create({
    name,
    email,
    phone: String(req.body.phone || "").trim(),
    subject: String(req.body.subject || "").trim(),
    message,
    status: "unread",
  });
  res.status(201).json({ contact: serialize(item), message: "Message received. The desk will follow up." });
});

export const listMessages = asyncHandler(async (_req, res) => {
  const items = await Contact.find().sort({ createdAt: -1 }).lean();
  res.json({ messages: items.map(serialize) });
});

export const markRead = asyncHandler(async (req, res) => {
  const item = await Contact.findByIdAndUpdate(req.params.id, { status: "read" }, { new: true });
  if (!item) return res.status(404).json({ message: "Message not found." });
  res.json({ message: serialize(item) });
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const item = await Contact.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: "Message not found." });
  res.json({ ok: true });
});
