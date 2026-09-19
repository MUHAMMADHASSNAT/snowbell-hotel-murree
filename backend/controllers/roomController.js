import { Room } from "../models/Room.js";
import { Booking } from "../models/Booking.js";
import { asyncHandler } from "../middleware/error.js";
import { overlapFilter, parseDay } from "../lib/booking.js";

function typeKey(room) {
  return room.slug || room.roomType;
}

function summarizeAvailability(rooms, bookedIds) {
  const bookable = rooms.filter(
    (r) => r.active && r.status === "available" && !bookedIds.has(r._id.toString()),
  );
  const blocked = rooms.filter((r) => r.status === "maintenance" || r.status === "cleaning");
  if (bookable.length === 0) {
    if (rooms.every((r) => r.status === "maintenance")) return "maintenance";
    if (rooms.every((r) => r.status === "cleaning" || r.status === "maintenance")) return "cleaning";
    return "fullyBooked";
  }
  if (bookable.length === 1 && rooms.length > 1) return "limited";
  return "available";
}

export function toPublicType(rooms, bookedIds = new Set()) {
  const first = rooms[0];
  const availability = summarizeAvailability(rooms, bookedIds);
  return {
    id: typeKey(first),
    name: first.title,
    slug: typeKey(first),
    description: first.description,
    longDescription: first.longDescription,
    capacity: first.capacity,
    beds: first.beds,
    sizeSqFt: first.sizeSqFt,
    facilities: first.amenities,
    pricePerNight: first.price,
    availability,
    image: first.images?.[0] || "",
    imageAlt: first.imageAlt || first.title,
    featured: rooms.some((r) => r.featured),
    availableCount: rooms.filter(
      (r) => r.active && r.status === "available" && !bookedIds.has(r._id.toString()),
    ).length,
  };
}

export const listPublicRooms = asyncHandler(async (req, res) => {
  const checkIn = parseDay(req.query.checkIn);
  const checkOut = parseDay(req.query.checkOut);
  const rooms = await Room.find({ active: true }).sort({ roomNumber: 1 }).lean();
  let bookedIds = new Set();
  if (checkIn && checkOut && checkOut > checkIn) {
    const bookings = await Booking.find(overlapFilter(checkIn, checkOut)).lean();
    bookedIds = new Set(bookings.flatMap((b) => (b.roomIds || [b.roomId]).map((id) => String(id))));
  }
  const groups = new Map();
  for (const room of rooms) {
    const key = typeKey(room);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(room);
  }
  res.json({ rooms: [...groups.values()].map((list) => toPublicType(list, bookedIds)) });
});

export const availability = asyncHandler(async (req, res) => {
  const checkIn = parseDay(req.query.checkIn);
  const checkOut = parseDay(req.query.checkOut);
  const guests = Number(req.query.guests || 1);
  if (!checkIn || !checkOut || checkOut <= checkIn) {
    return res.status(400).json({ message: "Check-out must be after check-in." });
  }
  const rooms = await Room.find({ active: true }).sort({ roomNumber: 1 }).lean();
  const bookings = await Booking.find(overlapFilter(checkIn, checkOut)).lean();
  const bookedIds = new Set(bookings.flatMap((b) => (b.roomIds || [b.roomId]).map((id) => String(id))));
  const groups = new Map();
  for (const room of rooms) {
    const key = typeKey(room);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(room);
  }
  const result = [...groups.values()].map((list) => {
    const summary = toPublicType(list, bookedIds);
    const tooSmall = guests > summary.capacity;
    return {
      ...summary,
      guestFit: !tooSmall,
      availability: tooSmall ? "unavailable" : summary.availability,
    };
  });
  res.json({ rooms: result });
});

export const listAdminRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find().sort({ roomNumber: 1 }).lean();
  res.json({ rooms });
});

export const createRoom = asyncHandler(async (req, res) => {
  const room = await Room.create(req.body);
  res.status(201).json({ room });
});

export const updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!room) return res.status(404).json({ message: "Room not found." });
  res.json({ room });
});

export const deactivateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
  if (!room) return res.status(404).json({ message: "Room not found." });
  res.json({ room });
});
