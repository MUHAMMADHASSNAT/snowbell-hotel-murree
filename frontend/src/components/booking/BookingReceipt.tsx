import { hotel } from "../../data/hotel";
import { formatDate, formatPKR } from "../../lib/format";
import type { BookingRecord } from "../../types";

export function BookingReceipt({ booking }: { booking: BookingRecord }) {
  return (
    <div className="rounded-2xl border border-gold/40 bg-cream p-8 print:border-navy/20 print:bg-white">
      <p className="text-xs uppercase tracking-[0.22em] text-gold">{hotel.name}</p>
      <h2 className="mt-2 font-serif text-3xl text-navy">Booking confirmed</h2>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Thank you, {booking.guestName}. Please keep this booking ID for the front desk.
      </p>
      <p className="mt-4 font-serif text-2xl text-navy">{booking.bookingId}</p>
      <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
        <div><dt className="text-muted">Guest</dt><dd className="font-medium text-navy">{booking.guestName}</dd></div>
        <div><dt className="text-muted">Status</dt><dd className="font-medium capitalize text-navy">{booking.bookingStatus}</dd></div>
        <div><dt className="text-muted">Room</dt><dd className="font-medium text-navy">{booking.roomTitle}</dd></div>
        <div><dt className="text-muted">Guests / rooms</dt><dd className="font-medium text-navy">{booking.guests} guests · {booking.numberOfRooms} room(s)</dd></div>
        <div><dt className="text-muted">Check-in</dt><dd className="font-medium text-navy">{formatDate(booking.checkIn)}</dd></div>
        <div><dt className="text-muted">Check-out</dt><dd className="font-medium text-navy">{formatDate(booking.checkOut)}</dd></div>
        <div><dt className="text-muted">Nights</dt><dd className="font-medium text-navy">{booking.nights}</dd></div>
        <div><dt className="text-muted">Charge / night</dt><dd className="font-medium text-navy">{formatPKR(booking.pricePerNight)}</dd></div>
        <div><dt className="text-muted">Total</dt><dd className="font-medium text-navy">{formatPKR(booking.totalAmount)}</dd></div>
        <div><dt className="text-muted">Payment</dt><dd className="font-medium text-navy">{booking.paymentMethod}</dd></div>
        <div><dt className="text-muted">Email</dt><dd className="font-medium text-navy">{booking.guestEmail}</dd></div>
        <div><dt className="text-muted">Phone</dt><dd className="font-medium text-navy">{booking.guestPhone}</dd></div>
      </dl>
      <p className="mt-6 text-xs text-muted">{hotel.contact.address} · {hotel.contact.phone}</p>
    </div>
  );
}
