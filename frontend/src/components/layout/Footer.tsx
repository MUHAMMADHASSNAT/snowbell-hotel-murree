import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { hotel } from "../../data/hotel";

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3 md:px-6">
        <div>
          <p className="font-serif text-2xl tracking-[0.14em] text-gold">{hotel.shortName.toUpperCase()}</p>
          <p className="mt-2 text-sm text-white/70">{hotel.tagline}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">{hotel.intro}</p>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Visit</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li className="flex gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold" />
              <span>
                {hotel.contact.address}
                <span className="mt-1 block text-xs text-white/45">{hotel.contact.addressNote}</span>
              </span>
            </li>
            <li className="flex gap-2">
              <Phone size={16} className="mt-0.5 shrink-0 text-gold" />
              <span>
                {hotel.contact.phone}
                <span className="mt-1 block text-xs text-white/45">{hotel.contact.phoneNote}</span>
              </span>
            </li>
            <li className="flex gap-2">
              <Mail size={16} className="mt-0.5 shrink-0 text-gold" />
              <span>
                {hotel.contact.email}
                <span className="mt-1 block text-xs text-white/45">{hotel.contact.emailNote}</span>
              </span>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Explore</h2>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <Link className="text-white/80 hover:text-gold" to="/rooms">Rooms</Link>
            <Link className="text-white/80 hover:text-gold" to="/gallery">Gallery</Link>
            <Link className="text-white/80 hover:text-gold" to="/book">Book</Link>
            <Link className="text-white/80 hover:text-gold" to="/services">Services</Link>
            <Link className="text-white/80 hover:text-gold" to="/reviews">Reviews</Link>
            <Link className="text-white/80 hover:text-gold" to="/about">About</Link>
            <Link className="text-white/80 hover:text-gold" to="/contact">Contact</Link>
            <Link className="text-white/80 hover:text-gold" to="/admin/login">Staff</Link>
          </div>
          <div className="mt-6 flex gap-4 text-sm text-white/70">
            {hotel.social.map((item) => (
              <a key={item.label} href={item.href} className="hover:text-gold" target="_blank" rel="noreferrer">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/45">
        {hotel.name} · {hotel.website} · {hotel.location}
      </div>
    </footer>
  );
}
