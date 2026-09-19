import { X } from "lucide-react";
import { Link } from "react-router-dom";
import type { Room } from "../../types";
import { availabilityLabel, formatPKR } from "../../lib/format";

export function RoomModal({ room, onClose }: { room: Room; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-navy/60 p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="room-modal-title">
      <button type="button" className="absolute inset-0" aria-label="Close details" onClick={onClose} />
      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        <img src={room.image} alt={room.imageAlt} referrerPolicy="no-referrer" className="h-56 w-full object-cover sm:h-72" />
        <button type="button" className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-navy" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        <div className="p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-gold">{availabilityLabel(room.availability)}</p>
          <h2 id="room-modal-title" className="mt-1 font-serif text-3xl text-navy">{room.name}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{room.longDescription}</p>
          <div className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
            <p><span className="block text-xs uppercase text-muted">Capacity</span>{room.capacity} guests</p>
            <p><span className="block text-xs uppercase text-muted">Beds</span>{room.beds}</p>
            <p><span className="block text-xs uppercase text-muted">Size</span>{room.sizeSqFt} sq ft</p>
          </div>
          <ul className="mt-6 flex flex-wrap gap-2">
            {room.facilities.map((item) => (
              <li key={item} className="rounded-full bg-cream px-3 py-1 text-xs text-navy-mid">
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <p className="font-serif text-2xl text-navy">
              {formatPKR(room.pricePerNight)} <span className="text-base font-sans text-muted">/ night</span>
            </p>
            <Link to={`/book?room=${room.id}`} className="btn-gold" onClick={onClose}>
              Book this room
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
