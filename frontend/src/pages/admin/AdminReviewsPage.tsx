import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import type { Review } from "../../types";

export function AdminReviewsPage() {
  const [items, setItems] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const data = await api<{ reviews: Review[] }>("/api/reviews/admin");
    setItems(data.reviews);
    setLoading(false);
  }

  useEffect(() => {
    void load().catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-serif text-3xl text-navy">Reviews</h1>
      {loading ? <p className="mt-6 text-muted">Loading reviews…</p> : (
        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <article key={item.id} className="rounded-xl bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-navy">{item.name} · {item.rating}/5 · {item.status}</p>
                <div className="flex gap-2 text-sm">
                  <button type="button" className="underline" onClick={() => api(`/api/reviews/${item.id}`, { method: "PATCH", body: JSON.stringify({ status: "approved" }) }).then(load)}>Approve</button>
                  <button type="button" className="underline" onClick={() => api(`/api/reviews/${item.id}`, { method: "PATCH", body: JSON.stringify({ status: "rejected" }) }).then(load)}>Reject</button>
                  <button type="button" className="underline text-rose-700" onClick={() => api(`/api/reviews/${item.id}`, { method: "DELETE" }).then(load)}>Delete</button>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted">{item.text}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
