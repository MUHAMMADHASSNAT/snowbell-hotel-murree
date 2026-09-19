import type { FormEvent } from "react";
import { useState } from "react";
import { hotel } from "../data/hotel";
import { attractions } from "../data/attractions";
import { api, ApiError } from "../lib/api";
import { Seo } from "../components/Seo";
import { PageHero } from "../components/layout/PageHero";

export function ContactPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setLoading(true);
    setError(null);
    try {
      await api("/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          subject: data.get("subject"),
          message: data.get("message"),
        }),
      });
      setSent(true);
      form.reset();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send the message.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Seo
        title={`Contact | ${hotel.name}`}
        description="Contact Snowbell Hotel Murree in Murree, Punjab. Placeholder phone, email, and map until verified details are published."
      />
      <PageHero
        title="Contact"
        subtitle="Reach the desk with a question about dates, rooms, or the drive up to Murree."
        image="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1600&q=80"
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2 md:px-6">
        <div>
          <h2 className="font-serif text-3xl text-navy">Hotel desk</h2>
          <dl className="mt-6 space-y-5 text-sm">
            <div>
              <dt className="font-semibold text-navy">Phone</dt>
              <dd className="mt-1">{hotel.contact.phone}</dd>
              <dd className="text-xs text-muted">{hotel.contact.phoneNote}</dd>
            </div>
            <div>
              <dt className="font-semibold text-navy">Email</dt>
              <dd className="mt-1">{hotel.contact.email}</dd>
              <dd className="text-xs text-muted">{hotel.contact.emailNote}</dd>
            </div>
            <div>
              <dt className="font-semibold text-navy">Address</dt>
              <dd className="mt-1">{hotel.contact.address}</dd>
              <dd className="text-xs text-muted">{hotel.contact.addressNote}</dd>
            </div>
          </dl>
          <div className="mt-8 flex gap-4 text-sm">
            {hotel.social.map((item) => (
              <a key={item.label} href={item.href} className="font-semibold text-navy hover:text-gold" target="_blank" rel="noreferrer">
                {item.label}
              </a>
            ))}
          </div>
          <div className="mt-8">
            <h3 className="font-serif text-xl text-navy">Nearby in Murree</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {attractions.map((item) => (
                <li key={item.name}>
                  <span className="font-medium text-navy">{item.name}.</span> {item.note}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 min-h-64 overflow-hidden rounded-xl border border-navy/10">
            <iframe
              title="Google map placeholder for Murree"
              className="h-72 w-full"
              loading="lazy"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(hotel.contact.mapQuery)}&z=12&output=embed`}
            />
          </div>
        </div>
        <form onSubmit={submit} className="rounded-2xl border border-navy/8 p-6 md:p-8">
          <h2 className="font-serif text-2xl text-navy">Send a message</h2>
          <p className="mt-2 text-sm text-muted">Messages are stored for the hotel desk. They are not emailed automatically.</p>
          <label className="mt-5 block text-sm font-medium">Name
            <input className="input mt-1" name="name" required />
          </label>
          <label className="mt-4 block text-sm font-medium">Email
            <input className="input mt-1" type="email" name="email" required />
          </label>
          <label className="mt-4 block text-sm font-medium">Phone
            <input className="input mt-1" type="tel" name="phone" />
          </label>
          <label className="mt-4 block text-sm font-medium">Subject
            <input className="input mt-1" name="subject" />
          </label>
          <label className="mt-4 block text-sm font-medium">Message
            <textarea className="input mt-1 min-h-32" name="message" required />
          </label>
          <button type="submit" className="btn-navy mt-5" disabled={loading}>
            {loading ? "Sending…" : "Send"}
          </button>
          {error && <p className="mt-3 text-sm text-rose-700">{error}</p>}
          {sent && <p className="mt-3 text-sm text-navy-mid">Message received. The desk will follow up.</p>}
        </form>
      </section>
    </>
  );
}
