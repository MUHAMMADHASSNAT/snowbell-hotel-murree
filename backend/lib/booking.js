import { Booking } from "../models/Booking.js";
import { Counter } from "../models/Counter.js";

export const BLOCKING_STATUSES = ["pending", "confirmed", "checked-in"];

export function parseDay(value) {
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

export function nightsBetween(checkIn, checkOut) {
  return Math.round((checkOut.getTime() - checkIn.getTime()) / 86_400_000);
}

export function dateError(checkInRaw, checkOutRaw) {
  const checkIn = parseDay(checkInRaw);
  const checkOut = parseDay(checkOutRaw);
  if (!checkIn || !checkOut) return "Please select check-in and check-out dates.";
  if (nightsBetween(checkIn, checkOut) < 1) return "Check-out must be after check-in.";
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (checkIn < today) return "Check-in cannot be in the past.";
  return null;
}

export async function overlappingBookings(roomIds, checkIn, checkOut, excludeBookingId) {
  const query = {
    roomIds: { $in: roomIds },
    bookingStatus: { $in: BLOCKING_STATUSES },
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  };
  if (excludeBookingId) query._id = { $ne: excludeBookingId };
  return Booking.find(query).lean();
}

export async function nextBookingId() {
  const year = new Date().getUTCFullYear();
  const key = `booking-${year}`;
  const doc = await Counter.findOneAndUpdate(
    { key },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );
  return `SB-${year}-${String(doc.seq).padStart(5, "0")}`;
}

export function overlapFilter(checkIn, checkOut) {
  return {
    bookingStatus: { $in: BLOCKING_STATUSES },
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  };
}
