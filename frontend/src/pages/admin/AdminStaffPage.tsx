import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";

type Staff = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "receptionist";
  active: boolean;
};

export function AdminStaffPage() {
  const [items, setItems] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const data = await api<{ staff: Staff[] }>("/api/admin/staff");
    setItems(data.staff);
    setLoading(false);
  }

  useEffect(() => {
    void load().catch((err: Error) => {
      setError(err.message);
      setLoading(false);
    });
  }, []);

  async function create(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setError(null);
    try {
      await api("/api/admin/staff", {
        method: "POST",
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          password: data.get("password"),
          role: "receptionist",
        }),
      });
      e.currentTarget.reset();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add staff.");
    }
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-navy">Staff</h1>
      <form onSubmit={create} className="mt-6 grid gap-3 rounded-xl bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
        <input className="input" name="name" placeholder="Name" required />
        <input className="input" name="email" type="email" placeholder="Email" required />
        <input className="input" name="password" type="password" placeholder="Password (min 8)" required minLength={8} />
        <button className="btn-gold" type="submit">Add receptionist</button>
      </form>
      {error && <p className="mt-3 text-sm text-rose-700">{error}</p>}
      {loading ? <p className="mt-6 text-muted">Loading staff…</p> : (
        <div className="mt-6 overflow-x-auto rounded-xl bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase text-muted">
              <tr>
                <th className="px-3 py-3">Name</th>
                <th className="px-3 py-3">Email</th>
                <th className="px-3 py-3">Role</th>
                <th className="px-3 py-3">Active</th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-navy/5">
                  <td className="px-3 py-3">{item.name}</td>
                  <td className="px-3 py-3">{item.email}</td>
                  <td className="px-3 py-3">{item.role}</td>
                  <td className="px-3 py-3">{item.active ? "Yes" : "No"}</td>
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      className="text-sm underline"
                      onClick={() =>
                        api(`/api/admin/staff/${item.id}`, {
                          method: "PATCH",
                          body: JSON.stringify({ active: !item.active }),
                        }).then(load)
                      }
                    >
                      {item.active ? "Disable" : "Enable"}
                    </button>
                    <button
                      type="button"
                      className="ml-3 text-sm underline"
                      onClick={() => {
                        const password = window.prompt("New password (min 8 characters)");
                        if (!password) return;
                        void api(`/api/admin/staff/${item.id}`, {
                          method: "PATCH",
                          body: JSON.stringify({ password }),
                        }).then(load).catch((err: Error) => setError(err.message));
                      }}
                    >
                      Reset password
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
