import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { hotel } from "../../data/hotel";

const links = [
  { to: "/", label: "Home" },
  { to: "/rooms", label: "Rooms" },
  { to: "/gallery", label: "Gallery" },
  { to: "/services", label: "Services" },
  { to: "/reviews", label: "Reviews" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/95 text-white backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link to="/" className="leading-tight" onClick={() => setOpen(false)}>
          <span className="font-serif text-xl tracking-[0.18em] text-gold">{hotel.shortName.toUpperCase()}</span>
          <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.28em] text-white/70">
            Hotel Murree
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `text-sm tracking-wide transition ${isActive ? "text-gold" : "text-white/80 hover:text-white"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/book" className="btn-gold hidden sm:inline-flex">
            Book Now
          </Link>
          <button
            type="button"
            className="rounded-md p-2 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/10 px-4 py-4 lg:hidden" aria-label="Mobile">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `py-1 text-base ${isActive ? "text-gold" : "text-white/85"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link to="/book" className="btn-gold mt-2 w-full" onClick={() => setOpen(false)}>
              Book Now
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
