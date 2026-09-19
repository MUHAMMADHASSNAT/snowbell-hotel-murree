import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { hotel } from "../../data/hotel";
import { clearSession, getStaffUser } from "../../lib/api";

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard", roles: ["admin"] },
  { to: "/admin/bookings", label: "Bookings", roles: ["admin", "receptionist"] },
  { to: "/admin/rooms", label: "Rooms", roles: ["admin"] },
  { to: "/admin/availability", label: "Availability", roles: ["admin", "receptionist"] },
  { to: "/admin/reviews", label: "Reviews", roles: ["admin"] },
  { to: "/admin/messages", label: "Messages", roles: ["admin"] },
  { to: "/admin/staff", label: "Staff", roles: ["admin"] },
];

export function AdminLayout() {
  const user = getStaffUser();
  const navigate = useNavigate();
  const links = adminLinks.filter((link) => user && link.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-navy/10 bg-navy text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <p className="font-serif tracking-[0.16em] text-gold">{hotel.shortName.toUpperCase()} DESK</p>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-white/70">{user?.name} · {user?.role}</span>
            <button
              type="button"
              className="text-gold"
              onClick={() => {
                clearSession();
                navigate("/admin/login");
              }}
            >
              Sign out
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 pb-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-md px-3 py-2 text-sm ${isActive ? "bg-white/10 text-gold" : "text-white/80"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
