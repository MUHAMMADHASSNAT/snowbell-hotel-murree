import mongoose from "mongoose";
import { Room } from "../models/Room.js";
import { Booking } from "../models/Booking.js";
import { asyncHandler } from "../middleware/error.js";
import {
  dateError,
  nightsBetween,
  nextBookingId,
  overlapFilter,
  parseDay,
} from "../lib/booking.js";

const ALLOWED_STATUS = ["pending", "confirmed", "cancelled", "checked-in", "checked-out"];
const PAYMENT_METHODS = ["Pay at Hotel"];

function serialize(booking) {
  return {
    id: booking._id.toString(),
    bookingId: booking.bookingId,
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    guestPhone: booking.guestPhone,
    specialRequest: booking.specialRequest,
    roomId: booking.roomId,
    roomType: booking.roomType,
    roomTitle: booking.roomTitle,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    guests: booking.guests,
    numberOfRooms: booking.numberOfRooms,
    nights: booking.nights,
    pricePerNight: booking.pricePerNight,
    totalAmount: booking.totalAmount,
    paymentMethod: booking.paymentMethod,
    bookingStatus: booking.bookingStatus,
    createdAt: booking.createdAt,
  };
}

async function pickRooms(slug, checkIn, checkOut, count) {
  const candidates = await Room.find({
    $or: [{ slug }, { roomType: slug }],
    active: true,
    status: "available",
  }).sort({ roomNumber: 1 });
  if (candidates.length === 0) return [];
  const bookings = await Booking.find(overlapFilter(checkIn, checkOut)).lean();
  const booked = new Set(bookings.flatMap((b) => (b.roomIds || [b.roomId]).map((id) => String(id))));
  return candidates.filter((r) => !booked.has(r._id.toString())).slice(0, count);
}

export const createBooking = asyncHandler(async (req, res) => {
  const {
    roomId,
    checkIn: checkInRaw,
    checkOut: checkOutRaw,
    guests,
    numberOfRooms,
    guestName,
    guestEmail,
    guestPhone,
    specialRequest,
    paymentMethod,
  } = req.body;

  const invalid = dateError(checkInRaw, checkOutRaw);
  if (invalid) return res.status(400).json({ message: invalid });
  if (!guestName || !guestEmail || !guestPhone) {
    return res.status(400).json({ message: "Guest name, email, and phone are required." });
  }
  const checkIn = parseDay(checkInRaw);
  const checkOut = parseDay(checkOutRaw);
  const roomsWanted = Math.max(1, Number(numberOfRooms || 1));
  const guestCount = Math.max(1, Number(guests || 1));
  const method = PAYMENT_METHODS.includes(paymentMethod) ? paymentMethod : "Pay at Hotel";

  const selected = await pickRooms(String(roomId || ""), checkIn, checkOut, roomsWanted);
  if (selected.length < roomsWanted) {
    return res.status(409).json({ message: "Those dates are no longer available for this room type." });
  }
  const sample = selected[0];
  if (guestCount > sample.capacity * roomsWanted) {
    return res.status(400).json({
      message: `This selection sleeps up to ${sample.capacity * roomsWanted} guests.`,
    });
  }

  const nights = nightsBetween(checkIn, checkOut);
  const booking = await Booking.create({
    bookingId: await nextBookingId(),
    guestName: String(guestName).trim(),
    guestEmail: String(guestEmail).trim().toLowerCase(),
    guestPhone: String(guestPhone).trim(),
    specialRequest: String(specialRequest || "").trim(),
    roomId: sample._id,
    roomIds: selected.map((r) => r._id),
    roomType: sample.slug || sample.roomType,
    roomTitle: sample.title,
    checkIn,
    checkOut,
    guests: guestCount,
    numberOfRooms: roomsWanted,
    nights,
    pricePerNight: sample.price,
    totalAmount: nights * sample.price * roomsWanted,
    paymentMethod: method,
    bookingStatus: "pending",
  });

  res.status(201).json({ booking: serialize(booking) });
});

export const getBooking = asyncHandler(async (req, res) => {
  const query = [{ bookingId: req.params.id }];
  if (mongoose.isValidObjectId(req.params.id)) query.push({ _id: req.params.id });
  const booking = await Booking.findOne({ $or: query }).lean();
  if (!booking) return res.status(404).json({ message: "Booking not found." });
  res.json({ booking: serialize(booking) });
});

export const listAdminBookings = asyncHandler(async (_req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 }).lean();
  res.json({ bookings: bookings.map(serialize) });
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const status = req.body.status;
  if (!ALLOWED_STATUS.includes(status)) {
    return res.status(400).json({ message: "Invalid booking status." });
  }
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: "Booking not found." });

  if (status === "checked-in") {
    await Room.updateMany({ _id: { $in: booking.roomIds } }, { status: "occupied" });
  }
  if (status === "checked-out") {
    await Room.updateMany({ _id: { $in: booking.roomIds } }, { status: "cleaning" });
  }
  if (status === "cancelled" && booking.bookingStatus === "checked-in") {
    await Room.updateMany({ _id: { $in: booking.roomIds } }, { status: "available" });
  }

  booking.bookingStatus = status;
  await booking.save();
  res.json({ booking: serialize(booking) });
});

export const dashboard = asyncHandler(async (_req, res) => {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  const [total, pending, confirmed, cancelled, checkIns, checkOuts, rooms] = await Promise.all([
    Booking.countDocuments(),
    Booking.countDocuments({ bookingStatus: "pending" }),
    Booking.countDocuments({ bookingStatus: "confirmed" }),
    Booking.countDocuments({ bookingStatus: "cancelled" }),
    Booking.countDocuments({ checkIn: { $gte: start, $lt: end }, bookingStatus: { $in: ["confirmed", "checked-in"] } }),
    Booking.countDocuments({ checkOut: { $gte: start, $lt: end }, bookingStatus: { $in: ["confirmed", "checked-in", "checked-out"] } }),
    Room.find({ active: true }).lean(),
  ]);

  const occupied = rooms.filter((r) => r.status === "occupied").length;
  const available = rooms.filter((r) => r.status === "available").length;

  res.json({
    totalBookings: total,
    todayCheckIns: checkIns,
    todayCheckOuts: checkOuts,
    availableRooms: available,
    occupiedRooms: occupied,
    pendingBookings: pending,
    confirmedBookings: confirmed,
    cancelledBookings: cancelled,
    roomStatuses: rooms.map((r) => ({
      id: r._id,
      roomNumber: r.roomNumber,
      title: r.title,
      status: r.status,
    })),
  });
});
