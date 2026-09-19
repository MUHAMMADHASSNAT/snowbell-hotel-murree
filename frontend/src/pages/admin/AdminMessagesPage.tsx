import { useEffect, useState } from "react";
import { api } from "../../lib/api";

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
};

export function AdminMessagesPage() {
  const [items, setItems] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const data = await api<{ messages: Message[] }>("/api/contact");
    setItems(data.messages);
    setLoading(false);
  }

  useEffect(() => {
    void load().catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-serif text-3xl text-navy">Messages</h1>
      {loading ? <p className="mt-6 text-muted">Loading messages…</p> : (
        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <article key={item.id} className="rounded-xl bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-navy">{item.name} · {item.status}</p>
                <div className="flex gap-2 text-sm">
                  {item.status !== "read" && (
                    <button type="button" className="underline" onClick={() => api(`/api/contact/${item.id}/read`, { method: "PATCH" }).then(load)}>Mark read</button>
                  )}
                  <button type="button" className="underline text-rose-700" onClick={() => api(`/api/contact/${item.id}`, { method: "DELETE" }).then(load)}>Delete</button>
                </div>
              </div>
              <p className="mt-1 text-xs text-muted">{item.email} {item.phone} {item.subject}</p>
              <p className="mt-2 text-sm">{item.message}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
