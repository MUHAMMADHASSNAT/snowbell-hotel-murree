import { useEffect, useState } from "react";
import { api } from "../../lib/api";

type AdminRoom = { _id: string; roomNumber: string; title: string; status: string; active: boolean };

export function AdminAvailabilityPage() {
  const [rooms, setRooms] = useState<AdminRoom[]>([]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [types, setTypes] = useState<{ id: string; name: string; availability: string; availableCount?: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ rooms: AdminRoom[] }>("/api/rooms/admin")
      .then((data) => setRooms(data.rooms))
      .finally(() => setLoading(false));
  }, []);

  async function check() {
    if (!checkIn || !checkOut) return;
    const data = await api<{ rooms: typeof types }>(`/api/rooms/availability?checkIn=${checkIn}&checkOut=${checkOut}`);
    setTypes(data.rooms);
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-navy">Room availability</h1>
      <div className="mt-6 flex flex-wrap gap-3">
        <input className="input max-w-44" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
        <input className="input max-w-44" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
        <button type="button" className="btn-gold" onClick={() => void check()}>Check dates</button>
      </div>
      {types.length > 0 && (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {types.map((item) => (
            <li key={item.id} className="rounded-xl bg-white p-4">
              <p className="font-medium text-navy">{item.name}</p>
              <p className="text-sm capitalize text-muted">{item.availability}{item.availableCount != null ? ` · ${item.availableCount} free` : ""}</p>
            </li>
          ))}
        </ul>
      )}
      <h2 className="mt-10 font-serif text-2xl text-navy">Current room status</h2>
      {loading ? <p className="mt-3 text-muted">Loading…</p> : (
        <div className="mt-4 overflow-x-auto rounded-xl bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase text-muted">
              <tr><th className="px-3 py-3">No.</th><th className="px-3 py-3">Title</th><th className="px-3 py-3">Status</th></tr>
            </thead>
            <tbody>
              {rooms.filter((r) => r.active).map((room) => (
                <tr key={room._id} className="border-t border-navy/5">
                  <td className="px-3 py-2">{room.roomNumber}</td>
                  <td className="px-3 py-2">{room.title}</td>
                  <td className="px-3 py-2 capitalize">{room.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
