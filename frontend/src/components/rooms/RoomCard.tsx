import { Link } from "react-router-dom";
import type { Room } from "../../types";
import { availabilityLabel, formatPKR } from "../../lib/format";
import { isBookable } from "../../lib/booking";

export function RoomCard({
  room,
  onDetails,
}: {
  room: Room;
  onDetails: (room: Room) => void;
}) {
  const tone =
    room.availability === "available"
      ? "bg-emerald-50 text-emerald-800"
      : room.availability === "limited"
        ? "bg-amber-50 text-amber-800"
        : room.availability === "cleaning"
          ? "bg-sky-50 text-sky-800"
          : room.availability === "maintenance"
            ? "bg-slate-100 text-slate-800"
            : "bg-rose-50 text-rose-800";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-navy/8 bg-white shadow-[0_12px_40px_rgba(15,28,46,0.06)]">
      <div className="relative h-52 overflow-hidden">
        <img src={room.image} alt={room.imageAlt} referrerPolicy="no-referrer" className="h-full w-full object-cover transition duration-500 hover:scale-105" />
        <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>
          {availabilityLabel(room.availability)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-2xl text-navy">{room.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{room.description}</p>
        <dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-navy-mid">
          <div>
            <dt className="uppercase tracking-wider text-muted">Capacity</dt>
            <dd className="mt-0.5 font-medium">{room.capacity} guests</dd>
          </div>
          <div>
            <dt className="uppercase tracking-wider text-muted">Beds</dt>
            <dd className="mt-0.5 font-medium">{room.beds}</dd>
          </div>
        </dl>
        <p className="mt-4 font-serif text-xl text-navy">
          {formatPKR(room.pricePerNight)}
          <span className="ml-1 text-sm font-sans font-normal text-muted">/ night</span>
        </p>
        <div className="mt-4 flex gap-2">
          <button type="button" className="btn-outline flex-1" onClick={() => onDetails(room)}>
            View Details
          </button>
          <Link
            to={`/book?room=${room.id}`}
            className={`btn-gold flex-1 ${!isBookable(room.availability) ? "pointer-events-none opacity-50" : ""}`}
          >
            Book Now
          </Link>
        </div>
      </div>
    </article>
  );
}
