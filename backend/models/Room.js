import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true, trim: true },
    roomType: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    longDescription: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    capacity: { type: Number, required: true, min: 1 },
    beds: { type: String, default: "" },
    sizeSqFt: { type: Number, default: 0 },
    images: [{ type: String }],
    imageAlt: { type: String, default: "" },
    amenities: [{ type: String }],
    status: {
      type: String,
      enum: ["available", "occupied", "cleaning", "maintenance"],
      default: "available",
    },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Room = mongoose.model("Room", roomSchema);
