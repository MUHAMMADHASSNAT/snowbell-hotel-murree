import type { BookingDraft, Room, RoomAvailability } from "../types";
import { getRoomById } from "../data/rooms";

export function nightsBetween(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  const diff = Math.round((end.getTime() - start.getTime()) / 86_400_000);
  return diff;
}

export function validateDates(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return "Please select check-in and check-out dates.";
  const nights = nightsBetween(checkIn, checkOut);
  if (Number.isNaN(nights) || nights < 1) return "Check-out must be after check-in.";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(`${checkIn}T00:00:00`);
  if (start < today) return "Check-in cannot be in the past.";
  return null;
}

export function quoteBooking(draft: BookingDraft, room: Room) {
  const nights = nightsBetween(draft.checkIn, draft.checkOut);
  const roomsCount = Math.max(1, draft.rooms);
  return {
    nights,
    pricePerNight: room.pricePerNight,
    total: nights > 0 ? nights * room.pricePerNight * roomsCount : 0,
    availability: room.availability as RoomAvailability,
  };
}

export function isBookable(availability: RoomAvailability) {
  return availability === "available" || availability === "limited";
}

export function getLocalRoom(id: string) {
  return getRoomById(id);
}
