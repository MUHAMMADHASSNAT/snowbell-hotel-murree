import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { hotel } from "../data/hotel";
import { rooms as seedRooms } from "../data/rooms";
import { isBookable, quoteBooking, validateDates } from "../lib/booking";
import { api, ApiError } from "../lib/api";
import { availabilityLabel, formatDate, formatPKR, whatsappUrl } from "../lib/format";
import { Seo } from "../components/Seo";
import { PageHero } from "../components/layout/PageHero";
import { BookingReceipt } from "../components/booking/BookingReceipt";
import type { BookingRecord, Room } from "../types";

export function BookingPage() {
  const [params] = useSearchParams();
  const [catalog, setCatalog] = useState<Room[]>(seedRooms);
  const initialRoom = catalog.find((r) => r.id === params.get("room"))?.id ?? catalog[0]?.id ?? "";

  const [checkIn, setCheckIn] = useState(params.get("checkIn") ?? "");
  const [checkOut, setCheckOut] = useState(params.get("checkOut") ?? "");
  const [guests, setGuests] = useState(Number(params.get("guests") ?? 2));
  const [roomCount, setRoomCount] = useState(Number(params.get("rooms") ?? 1));
  const [roomId, setRoomId] = useState(initialRoom);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<BookingRecord | null>(null);

  useEffect(() => {
    let cancelled = false;
    const qs = new URLSearchParams();
    if (checkIn) qs.set("checkIn", checkIn);
    if (checkOut) qs.set("checkOut", checkOut);
    if (guests) qs.set("guests", String(guests));
    const path = checkIn && checkOut ? `/api/rooms/availability?${qs}` : `/api/rooms`;
    setChecking(true);
    api<{ rooms: Room[] }>(path)
      .then((data) => {
        if (!cancelled && data.rooms?.length) {
          setCatalog(data.rooms);
          setRoomId((current) => data.rooms.some((r) => r.id === current) ? current : data.rooms[0].id);
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [checkIn, checkOut, guests]);

  const room = catalog.find((item) => item.id === roomId) ?? catalog[0] ?? seedRooms[0];
  const dateError = checkIn && checkOut ? validateDates(checkIn, checkOut) : null;
  const quote = useMemo(
    () => quoteBooking({ checkIn, checkOut, guests, rooms: roomCount, roomId }, room),
    [checkIn, checkOut, guests, roomCount, roomId, room],
  );

  async function submit(e: FormEvent) {
    e.preventDefault();
    const invalid = validateDates(checkIn, checkOut);
    if (invalid) {
      setError(invalid);
      return;
    }
    if (!isBookable(room.availability)) {
      setError("This room type is not available for the selected dates.");
      return;
    }
    if (guests > room.capacity * roomCount) {
      setError(`This selection sleeps up to ${room.capacity * roomCount} guests.`);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const data = await api<{ booking: BookingRecord }>("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          roomId,
          checkIn,
          checkOut,
          guests,
          numberOfRooms: roomCount,
          guestName: name,
          guestEmail: email,
          guestPhone: phone,
          specialRequest,
          paymentMethod: "Pay at Hotel",
        }),
      });
      setConfirmed(data.booking);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not complete the booking.");
    } finally {
      setSubmitting(false);
    }
  }

  const waMessage = confirmed
    ? `Hello ${hotel.name}, I have booking ${confirmed.bookingId} for ${confirmed.roomTitle} from ${formatDate(confirmed.checkIn)} to ${formatDate(confirmed.checkOut)}.`
    : "";

  return (
    <>
      <Seo
        title={`Book a stay | ${hotel.name}`}
        description="Check room availability and confirm a booking at Snowbell Hotel Murree. Pay at the hotel — no online payment is taken."
      />
      <PageHero
        title="Book your stay"
        subtitle="Choose dates and a room type. Availability is checked against live reservations. Payment is at the hotel."
        image="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1600&q=80"
      />

      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        {confirmed ? (
          <div>
            <BookingReceipt booking={confirmed} />
            <div className="mt-6 flex flex-wrap gap-3 no-print">
              <button type="button" className="btn-navy" onClick={() => window.print()}>
                Print / receipt
              </button>
              <a className="btn-gold" href={whatsappUrl(waMessage)} target="_blank" rel="noreferrer">
                WhatsApp the desk
              </a>
              <button type="button" className="btn-outline" onClick={() => setConfirmed(null)}>
                Make another booking
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6 rounded-2xl border border-navy/8 p-6 md:p-8">
              <h2 className="font-serif text-2xl text-navy">Stay details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium">Check-in
                  <input className="input mt-1" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
                </label>
                <label className="text-sm font-medium">Check-out
                  <input className="input mt-1" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
                </label>
                <label className="text-sm font-medium">Guests
                  <input className="input mt-1" type="number" min={1} max={12} value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
                </label>
                <label className="text-sm font-medium">Number of rooms
                  <input className="input mt-1" type="number" min={1} max={4} value={roomCount} onChange={(e) => setRoomCount(Number(e.target.value))} />
                </label>
                <label className="text-sm font-medium sm:col-span-2">Room type
                  <select className="input mt-1" value={roomId} onChange={(e) => setRoomId(e.target.value)}>
                    {catalog.map((item) => (
                      <option key={item.id} value={item.id}>{item.name} — {availabilityLabel(item.availability)}</option>
                    ))}
                  </select>
                </label>
              </div>
              {checking && <p className="text-sm text-muted">Checking availability…</p>}
              {dateError && <p className="text-sm text-rose-700">{dateError}</p>}

              <h2 className="pt-2 font-serif text-2xl text-navy">Guest details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium sm:col-span-2">Full name
                  <input className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} required />
                </label>
                <label className="text-sm font-medium">Email
                  <input className="input mt-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label className="text-sm font-medium">Phone
                  <input className="input mt-1" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </label>
                <label className="text-sm font-medium sm:col-span-2">Special request
                  <textarea className="input mt-1 min-h-24" value={specialRequest} onChange={(e) => setSpecialRequest(e.target.value)} placeholder="Arrival time, extra bedding…" />
                </label>
                <p className="text-sm text-muted sm:col-span-2">Payment method: Pay at Hotel (no online payment on this site).</p>
              </div>
              {error && <p className="text-sm text-rose-700">{error}</p>}
              <button type="submit" className="btn-gold" disabled={!isBookable(room.availability) || submitting}>
                {submitting ? "Confirming…" : "Confirm booking"}
              </button>
            </div>

            <aside className="h-fit rounded-2xl bg-navy p-6 text-white md:p-8">
              <h2 className="font-serif text-2xl text-gold">Booking summary</h2>
              <img src={room.image} alt={room.imageAlt} referrerPolicy="no-referrer" className="mt-4 h-40 w-full rounded-lg object-cover" />
              <p className="mt-4 font-serif text-2xl">{room.name}</p>
              <p className="mt-1 text-sm text-white/70">{room.beds} · up to {room.capacity} guests</p>
              <p className="mt-3 text-sm">
                Status: <span className="text-gold">{availabilityLabel(room.availability)}</span>
              </p>
              <dl className="mt-6 space-y-3 border-t border-white/10 pt-4 text-sm">
                <div className="flex justify-between"><dt>Price / night</dt><dd>{formatPKR(quote.pricePerNight)}</dd></div>
                <div className="flex justify-between"><dt>Nights</dt><dd>{quote.nights || "—"}</dd></div>
                <div className="flex justify-between"><dt>Rooms</dt><dd>{roomCount}</dd></div>
                <div className="flex justify-between font-semibold text-gold"><dt>Total</dt><dd>{quote.total ? formatPKR(quote.total) : "—"}</dd></div>
              </dl>
              <p className="mt-6 text-xs leading-relaxed text-white/50">
                The reservation is stored when you confirm. Payment is collected at the hotel.
              </p>
              <Link to="/gallery" className="mt-4 inline-block text-xs text-gold hover:underline">View gallery</Link>
            </aside>
          </form>
        )}
      </section>
    </>
  );
}
