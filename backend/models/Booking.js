import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    guestName: { type: String, required: true, trim: true },
    guestEmail: { type: String, required: true, trim: true, lowercase: true },
    guestPhone: { type: String, required: true, trim: true },
    specialRequest: { type: String, default: "" },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    roomIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
    roomType: { type: String, required: true },
    roomTitle: { type: String, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true, min: 1 },
    numberOfRooms: { type: Number, required: true, min: 1 },
    nights: { type: Number, required: true, min: 1 },
    pricePerNight: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, default: "Pay at Hotel" },
    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "checked-in", "checked-out"],
      default: "pending",
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

bookingSchema.index({ roomId: 1, checkIn: 1, checkOut: 1 });

export const Booking = mongoose.model("Booking", bookingSchema);
