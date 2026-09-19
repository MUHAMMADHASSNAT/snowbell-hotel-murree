import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { BookingWidget } from "../components/booking/BookingWidget";
import { ReviewCard } from "../components/reviews/ReviewCard";
import { RoomGrid } from "../components/rooms/RoomGrid";
import { Seo } from "../components/Seo";
import { ServiceGrid } from "../components/services/ServiceGrid";
import { hotel } from "../data/hotel";
import { attractions } from "../data/attractions";
import { galleryItems } from "../data/gallery";
import { offers } from "../data/offers";
import { featuredRooms } from "../data/rooms";
import { services } from "../data/services";
import { api } from "../lib/api";
import { useRooms } from "../lib/useRooms";
import type { Review } from "../types";

const heroImage =
  "https://images.unsplash.com/photo-1483921020237-2ff51e8f4a42?auto=format&fit=crop&w=2000&q=80";

export function HomePage() {
  const { rooms } = useRooms();
  const featured = rooms.filter((r) => r.featured);
  const [guestReviews, setGuestReviews] = useState<Review[]>([]);

  useEffect(() => {
    api<{ reviews: Review[] }>("/api/reviews")
      .then((data) => setGuestReviews((data.reviews || []).slice(0, 3)))
      .catch(() => setGuestReviews([]));
  }, []);
  return (
    <>
      <Seo
        title={`${hotel.name} | Stay in Murree, Punjab`}
        description="Snowbell Hotel Murree — rooms, hill-stay facilities, and booking enquiries in Murree, Punjab, Pakistan."
      />
      <section className="relative isolate min-h-[88vh] overflow-hidden bg-navy">
        <img
          src={heroImage}
          alt="Snow-dusted pine hills typical of a Murree mountain stay"
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/75 to-navy/25" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-4 pb-10 pt-28 md:px-6 md:pb-16">
          <p className="text-xs uppercase tracking-[0.32em] text-gold">{hotel.location}</p>
          <h1 className="mt-3 max-w-xl font-serif text-5xl leading-tight text-white md:text-7xl">{hotel.name}</h1>
          <p className="mt-4 max-w-lg text-lg text-white/80">{hotel.tagline}</p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">{hotel.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/book" className="btn-gold">Book Now</Link>
            <Link to="/rooms" className="btn-outline border-white/30 text-white hover:border-gold hover:text-gold">
              View rooms
            </Link>
          </div>
          <div className="mt-10">
            <BookingWidget />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-gold">Stay</p>
            <h2 className="mt-1 font-serif text-4xl text-navy">Featured rooms</h2>
          </div>
          <Link to="/rooms" className="hidden text-sm font-semibold text-navy hover:text-gold sm:block">
            All rooms
          </Link>
        </div>
        <div className="mt-8">
          <RoomGrid rooms={featured.length ? featured : featuredRooms()} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <p className="text-xs uppercase tracking-[0.22em] text-gold">Stay ideas</p>
        <h2 className="mt-1 font-serif text-4xl text-navy">Special offers</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Example packages for the desk to edit. They are not live discounted rates.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <article key={offer.id} className="rounded-xl border border-navy/8 p-5">
              <h3 className="font-serif text-xl text-navy">{offer.title}</h3>
              <p className="mt-2 text-sm text-muted">{offer.text}</p>
              <p className="mt-3 text-xs uppercase tracking-wider text-gold">{offer.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-cream py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <p className="text-xs uppercase tracking-[0.22em] text-gold">On the property</p>
          <h2 className="mt-1 font-serif text-4xl text-navy">Facilities</h2>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            Core services for a hill stay in Murree — listed as they are, without extra claims.
          </p>
          <div className="mt-8">
            <ServiceGrid items={services} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-gold">Look around</p>
            <h2 className="mt-1 font-serif text-4xl text-navy">Gallery</h2>
          </div>
          <Link to="/gallery" className="text-sm font-semibold text-navy hover:text-gold">Open gallery</Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {galleryItems.slice(0, 4).map((item) => (
            <img key={item.id} src={item.src} alt={item.alt} referrerPolicy="no-referrer" className="h-36 w-full rounded-lg object-cover md:h-44" />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-gold">Guests</p>
            <h2 className="mt-1 font-serif text-4xl text-navy">Guest reviews</h2>
          </div>
          <Link to="/reviews" className="text-sm font-semibold text-navy hover:text-gold">Read more</Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {guestReviews.length === 0 ? (
            <p className="text-sm text-muted">Approved reviews will appear here.</p>
          ) : (
            guestReviews.map((review) => <ReviewCard key={review.id} review={review} />)
          )}
        </div>
      </section>

      <section className="bg-navy py-16 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-2 md:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-gold">Location</p>
            <h2 className="mt-1 font-serif text-4xl">Murree, Punjab</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              The hotel is in Murree, a hill station north-east of Islamabad. Use the map as a general area guide until a verified street address is published on this site.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-white/70">
              {attractions.map((item) => (
                <li key={item.name}>
                  <span className="text-gold">{item.name}.</span> {item.note}
                </li>
              ))}
            </ul>
            <ul className="mt-5 space-y-2 text-sm text-white/70">
              {attractions.map((item) => (
                <li key={item.name}>
                  <span className="text-gold">{item.name}.</span> {item.note}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-white/55">{hotel.contact.addressNote}</p>
            <Link to="/contact" className="btn-gold mt-8 inline-flex">Get directions</Link>
          </div>
          <div className="min-h-64 overflow-hidden rounded-xl border border-white/10 bg-navy-mid">
            <iframe
              title="Map of Murree, Punjab, Pakistan"
              className="h-full min-h-64 w-full"
              loading="lazy"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(hotel.contact.mapQuery)}&z=12&output=embed`}
            />
          </div>
        </div>
      </section>
    </>
  );
}
