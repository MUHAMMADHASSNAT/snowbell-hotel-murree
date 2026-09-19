import { useEffect, useState } from "react";
import { api } from "../../lib/api";

type Stats = {
  totalBookings: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  availableRooms: number;
  occupiedRooms: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  roomStatuses: { id: string; roomNumber: string; title: string; status: string }[];
};

export function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Stats>("/api/bookings/dashboard")
      .then(setStats)
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) return <p className="text-rose-700">{error}</p>;
  if (!stats) return <p className="text-muted">Loading dashboard…</p>;

  const cards = [
    ["Total bookings", stats.totalBookings],
    ["Today's check-ins", stats.todayCheckIns],
    ["Today's check-outs", stats.todayCheckOuts],
    ["Available rooms", stats.availableRooms],
    ["Occupied rooms", stats.occupiedRooms],
    ["Pending", stats.pendingBookings],
    ["Confirmed", stats.confirmedBookings],
    ["Cancelled", stats.cancelledBookings],
  ] as const;

  return (
    <div>
      <h1 className="font-serif text-3xl text-navy">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, value]) => (
          <article key={label} className="rounded-xl bg-white p-5">
            <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
            <p className="mt-2 font-serif text-3xl text-navy">{value}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
