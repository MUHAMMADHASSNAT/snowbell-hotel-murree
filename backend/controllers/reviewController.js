import { Review } from "../models/Review.js";
import { asyncHandler } from "../middleware/error.js";

function serialize(item) {
  return {
    id: item._id.toString(),
    name: item.name,
    rating: item.rating,
    text: item.review,
    stayMonth: new Date(item.createdAt).toLocaleString("en-GB", { month: "long", year: "numeric" }),
    status: item.status,
    createdAt: item.createdAt,
    isDemo: false,
  };
}

export const listPublicReviews = asyncHandler(async (_req, res) => {
  const items = await Review.find({ status: "approved" }).sort({ createdAt: -1 }).lean();
  res.json({ reviews: items.map(serialize) });
});

export const createReview = asyncHandler(async (req, res) => {
  const name = String(req.body.name || "").trim();
  const review = String(req.body.review || req.body.text || "").trim();
  const rating = Number(req.body.rating);
  if (!name || !review || !rating) {
    return res.status(400).json({ message: "Name, rating, and review are required." });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5." });
  }
  const item = await Review.create({ name, rating, review, status: "pending" });
  res.status(201).json({
    review: serialize(item),
    message: "Thank you. Your review is pending approval.",
  });
});

export const listAdminReviews = asyncHandler(async (_req, res) => {
  const items = await Review.find().sort({ createdAt: -1 }).lean();
  res.json({ reviews: items.map(serialize) });
});

export const moderateReview = asyncHandler(async (req, res) => {
  const status = req.body.status;
  if (!["approved", "rejected", "pending"].includes(status)) {
    return res.status(400).json({ message: "Invalid review status." });
  }
  const item = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!item) return res.status(404).json({ message: "Review not found." });
  res.json({ review: serialize(item) });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const item = await Review.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: "Review not found." });
  res.json({ ok: true });
});
