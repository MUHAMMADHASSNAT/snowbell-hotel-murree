import { useEffect, useMemo, useState } from "react";
import { hotel } from "../data/hotel";
import { averageRating } from "../data/reviews";
import type { Review } from "../types";
import { api } from "../lib/api";
import { Seo } from "../components/Seo";
import { PageHero } from "../components/layout/PageHero";
import { ReviewCard, Stars } from "../components/reviews/ReviewCard";
import { ReviewForm } from "../components/reviews/ReviewForm";

export function ReviewsPage() {
  const [items, setItems] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const average = useMemo(() => averageRating(items), [items]);

  useEffect(() => {
    api<{ reviews: Review[] }>("/api/reviews")
      .then((data) => setItems(data.reviews || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Seo
        title={`Guest reviews | ${hotel.name}`}
        description="Guest ratings for Snowbell Hotel Murree. Only approved reviews are shown."
      />
      <PageHero
        title="Feedback & ratings"
        subtitle="Published comments are approved by the hotel desk. New reviews stay pending until they are accepted."
        image="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80"
      />
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div className="mb-10 flex flex-wrap items-center gap-4 rounded-xl bg-cream px-6 py-5">
          <p className="font-serif text-4xl text-navy">{items.length ? average.toFixed(1) : "—"}</p>
          <div>
            <Stars rating={Math.round(average) || 0} />
            <p className="mt-1 text-sm text-muted">
              {loading ? "Loading reviews…" : `${items.length} published reviews`}
            </p>
          </div>
        </div>
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="grid gap-4">
            {!loading && items.length === 0 && (
              <p className="text-sm text-muted">No approved reviews yet.</p>
            )}
            {items.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
          <ReviewForm />
        </div>
      </section>
    </>
  );
}
