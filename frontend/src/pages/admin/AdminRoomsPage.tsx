import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { formatPKR } from "../../lib/format";

type AdminRoom = {
  _id: string;
  roomNumber: string;
  roomType: string;
  title: string;
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
  status: "available" | "occupied" | "cleaning" | "maintenance";
  active: boolean;
};

const statuses = ["available", "occupied", "cleaning", "maintenance"] as const;

export function AdminRoomsPage() {
  const [rooms, setRooms] = useState<AdminRoom[]>([]);
  const [editing, setEditing] = useState<AdminRoom | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const data = await api<{ rooms: AdminRoom[] }>("/api/rooms/admin");
    setRooms(data.rooms);
    setLoading(false);
  }

  useEffect(() => {
    void load().catch(() => setLoading(false));
  }, []);

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    const data = new FormData(e.currentTarget);
    await api(`/api/rooms/${editing._id}`, {
      method: "PATCH",
      body: JSON.stringify({
        title: data.get("title"),
        description: data.get("description"),
        price: Number(data.get("price")),
        capacity: Number(data.get("capacity")),
        amenities: String(data.get("amenities") || "").split(",").map((s) => s.trim()).filter(Boolean),
        status: data.get("status"),
        active: data.get("active") === "on",
      }),
    });
    setEditing(null);
    await load();
  }

  async function add(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const title = String(data.get("title"));
    await api("/api/rooms", {
      method: "POST",
      body: JSON.stringify({
        roomNumber: data.get("roomNumber"),
        roomType: data.get("roomType"),
        slug: data.get("roomType"),
        title,
        description: data.get("description"),
        longDescription: data.get("description"),
        price: Number(data.get("price")),
        capacity: Number(data.get("capacity") || 2),
        amenities: String(data.get("amenities") || "").split(",").map((s) => s.trim()).filter(Boolean),
        images: [],
        status: "available",
        active: true,
      }),
    });
    e.currentTarget.reset();
    await load();
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-navy">Rooms</h1>
      <form onSubmit={add} className="mt-6 grid gap-3 rounded-xl bg-white p-4 sm:grid-cols-2 lg:grid-cols-3">
        <input className="input" name="roomNumber" placeholder="Room number" required />
        <input className="input" name="roomType" placeholder="Type slug e.g. deluxe-double" required />
        <input className="input" name="title" placeholder="Title" required />
        <input className="input" name="price" type="number" placeholder="Price / night" required />
        <input className="input" name="capacity" type="number" placeholder="Capacity" />
        <input className="input sm:col-span-2" name="amenities" placeholder="Amenities, comma separated" />
        <input className="input sm:col-span-2 lg:col-span-3" name="description" placeholder="Description" required />
        <button className="btn-gold" type="submit">Add room</button>
      </form>
      {loading ? <p className="mt-6 text-muted">Loading rooms…</p> : (
        <div className="mt-6 overflow-x-auto rounded-xl bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-navy/10 text-xs uppercase text-muted">
              <tr>
                <th className="px-3 py-3">No.</th>
                <th className="px-3 py-3">Title</th>
                <th className="px-3 py-3">Price</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Active</th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id} className="border-b border-navy/5">
                  <td className="px-3 py-3">{room.roomNumber}</td>
                  <td className="px-3 py-3">{room.title}</td>
                  <td className="px-3 py-3">{formatPKR(room.price)}</td>
                  <td className="px-3 py-3 capitalize">{room.status}</td>
                  <td className="px-3 py-3">{room.active ? "Yes" : "No"}</td>
                  <td className="px-3 py-3">
                    <button type="button" className="text-sm underline" onClick={() => setEditing(room)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editing && (
        <form onSubmit={save} className="mt-6 space-y-3 rounded-xl bg-white p-4">
          <h2 className="font-serif text-xl">Edit {editing.roomNumber}</h2>
          <input className="input" name="title" defaultValue={editing.title} />
          <textarea className="input min-h-24" name="description" defaultValue={editing.description} />
          <input className="input" name="price" type="number" defaultValue={editing.price} />
          <input className="input" name="capacity" type="number" defaultValue={editing.capacity} />
          <input className="input" name="amenities" defaultValue={editing.amenities.join(", ")} />
          <select className="input" name="status" defaultValue={editing.status}>
            {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="active" defaultChecked={editing.active} /> Active
          </label>
          <div className="flex gap-2">
            <button className="btn-navy" type="submit">Save</button>
            <button className="btn-outline" type="button" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
