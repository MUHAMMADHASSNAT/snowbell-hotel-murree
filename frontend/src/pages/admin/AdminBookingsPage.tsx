import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { api, ApiError } from "../../lib/api";
import { formatDate, formatPKR } from "../../lib/format";
import type { BookingRecord, Room } from "../../types";
import { BookingReceipt } from "../../components/booking/BookingReceipt";

const actions: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["checked-in", "cancelled"],
  "checked-in": ["checked-out"],
  "checked-out": [],
  cancelled: [],
};

export function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selected, setSelected] = useState<BookingRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [b, r] = await Promise.all([
        api<{ bookings: BookingRecord[] }>("/api/bookings/admin"),
        api<{ rooms: Room[] }>("/api/rooms"),
      ]);
      setBookings(b.bookings);
      setRooms(r.rooms);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load bookings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function setStatus(id: string, status: string) {
    await api(`/api/bookings/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
    await load();
  }

  async function create(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setCreating(true);
    setError(null);
    try {
      await api("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          roomId: data.get("roomId"),
          checkIn: data.get("checkIn"),
          checkOut: data.get("checkOut"),
          guests: Number(data.get("guests")),
          numberOfRooms: 1,
          guestName: data.get("guestName"),
          guestEmail: data.get("guestEmail"),
          guestPhone: data.get("guestPhone"),
          paymentMethod: "Pay at Hotel",
        }),
      });
      e.currentTarget.reset();
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create booking.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-navy">Bookings</h1>
      <form onSubmit={create} className="mt-6 grid gap-3 rounded-xl bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
        <input className="input" name="guestName" placeholder="Guest name" required />
        <input className="input" name="guestEmail" type="email" placeholder="Email" required />
        <input className="input" name="guestPhone" placeholder="Phone" required />
        <select className="input" name="roomId" required>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>{room.name}</option>
          ))}
        </select>
        <input className="input" name="checkIn" type="date" required />
        <input className="input" name="checkOut" type="date" required />
        <input className="input" name="guests" type="number" min={1} defaultValue={2} />
        <button className="btn-gold" type="submit" disabled={creating}>{creating ? "Saving…" : "Create booking"}</button>
      </form>
      {error && <p className="mt-3 text-sm text-rose-700">{error}</p>}
      {loading ? <p className="mt-6 text-muted">Loading bookings…</p> : (
        <div className="mt-6 overflow-x-auto rounded-xl bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-navy/10 text-xs uppercase text-muted">
              <tr>
                <th className="px-3 py-3">ID</th>
                <th className="px-3 py-3">Guest</th>
                <th className="px-3 py-3">Room</th>
                <th className="px-3 py-3">Check-in</th>
                <th className="px-3 py-3">Check-out</th>
                <th className="px-3 py-3">Guests</th>
                <th className="px-3 py-3">Total</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-navy/5">
                  <td className="px-3 py-3 font-medium text-navy">
                    <button type="button" className="underline" onClick={() => setSelected(booking)}>{booking.bookingId}</button>
                  </td>
                  <td className="px-3 py-3">{booking.guestName}</td>
                  <td className="px-3 py-3">{booking.roomTitle}</td>
                  <td className="px-3 py-3">{formatDate(booking.checkIn)}</td>
                  <td className="px-3 py-3">{formatDate(booking.checkOut)}</td>
                  <td className="px-3 py-3">{booking.guests}</td>
                  <td className="px-3 py-3">{formatPKR(booking.totalAmount)}</td>
                  <td className="px-3 py-3 capitalize">{booking.bookingStatus}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      {actions[booking.bookingStatus]?.map((status) => (
                        <button key={status} type="button" className="rounded border border-navy/15 px-2 py-1 text-xs" onClick={() => setStatus(booking.id, status)}>
                          {status}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selected && (
        <div className="mt-6">
          <BookingReceipt booking={selected} />
          <button type="button" className="btn-outline mt-3" onClick={() => setSelected(null)}>Close details</button>
        </div>
      )}
    </div>
  );
}
