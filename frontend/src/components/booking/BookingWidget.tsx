import { useMemo } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { rooms } from "../../data/rooms";
import type { BookingDraft } from "../../types";

const empty: BookingDraft = {
  checkIn: "",
  checkOut: "",
  guests: 2,
  rooms: 1,
  roomId: rooms[0].id,
};

export function BookingWidget({ initial }: { initial?: Partial<BookingDraft> }) {
  const navigate = useNavigate();
  const start = useMemo(() => ({ ...empty, ...initial }), [initial]);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const params = new URLSearchParams({
      checkIn: String(data.get("checkIn") ?? ""),
      checkOut: String(data.get("checkOut") ?? ""),
      guests: String(data.get("guests") ?? "2"),
      rooms: String(data.get("rooms") ?? "1"),
      room: String(data.get("roomId") ?? rooms[0].id),
    });
    navigate(`/book?${params.toString()}`);
  }

  return (
    <form
      onSubmit={submit}
      className="grid gap-3 rounded-xl border border-white/15 bg-white/92 p-4 shadow-xl backdrop-blur md:grid-cols-6 md:items-end"
    >
      <label className="text-xs font-semibold uppercase tracking-wider text-navy">
        Check-in
        <input className="input mt-1" type="date" name="checkIn" defaultValue={start.checkIn} required />
      </label>
      <label className="text-xs font-semibold uppercase tracking-wider text-navy">
        Check-out
        <input className="input mt-1" type="date" name="checkOut" defaultValue={start.checkOut} required />
      </label>
      <label className="text-xs font-semibold uppercase tracking-wider text-navy">
        Guests
        <input className="input mt-1" type="number" name="guests" min={1} max={8} defaultValue={start.guests} />
      </label>
      <label className="text-xs font-semibold uppercase tracking-wider text-navy">
        Rooms
        <input className="input mt-1" type="number" name="rooms" min={1} max={4} defaultValue={start.rooms} />
      </label>
      <label className="text-xs font-semibold uppercase tracking-wider text-navy md:col-span-1">
        Room type
        <select className="input mt-1" name="roomId" defaultValue={start.roomId}>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className="btn-gold h-[42px] w-full">
        Check stays
      </button>
    </form>
  );
}
