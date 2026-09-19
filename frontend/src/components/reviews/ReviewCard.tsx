import { Star } from "lucide-react";
import type { Review } from "../../types";

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "fill-gold text-gold" : "text-navy/20"}
        />
      ))}
    </span>
  );
}

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="rounded-xl border border-navy/8 bg-white p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-navy">{review.name}</h3>
        <Stars rating={review.rating} />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">{review.text}</p>
      <p className="mt-4 text-xs uppercase tracking-wider text-gold">
        {review.isDemo ? `Demo review · ${review.stayMonth}` : review.stayMonth}
      </p>
    </article>
  );
}
