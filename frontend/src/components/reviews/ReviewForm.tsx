import { useState } from "react";
import type { FormEvent } from "react";
import { api, ApiError } from "../../lib/api";
import { Stars } from "./ReviewCard";

export function ReviewForm() {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await api("/api/reviews", {
        method: "POST",
        body: JSON.stringify({ name: name.trim(), review: text.trim(), rating }),
      });
      setName("");
      setText("");
      setRating(5);
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not submit the review.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-navy/10 bg-cream/60 p-6">
      <h3 className="font-serif text-2xl text-navy">Write a review</h3>
      <p className="mt-1 text-sm text-muted">Submitted reviews wait for desk approval before they appear publicly.</p>
      <label className="mt-5 block text-sm font-medium text-navy">
        Name
        <input className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <fieldset className="mt-4">
        <legend className="text-sm font-medium text-navy">Rating</legend>
        <div className="mt-2 flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              className="rounded-md border border-navy/10 bg-white px-2 py-1"
              onClick={() => setRating(value)}
              aria-pressed={rating === value}
            >
              <Stars rating={value} />
            </button>
          ))}
        </div>
      </fieldset>
      <label className="mt-4 block text-sm font-medium text-navy">
        Review
        <textarea className="input mt-1 min-h-28" value={text} onChange={(e) => setText(e.target.value)} required />
      </label>
      <button type="submit" className="btn-navy mt-5" disabled={loading}>
        {loading ? "Sending…" : "Submit review"}
      </button>
      {error && <p className="mt-3 text-sm text-rose-700">{error}</p>}
      {done && <p className="mt-3 text-sm text-navy-mid">Received. It will show once approved.</p>}
    </form>
  );
}
