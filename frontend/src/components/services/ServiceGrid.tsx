import type { LucideIcon } from "lucide-react";
import { Battery, Bell, Droplets, Flame, Wifi, Zap } from "lucide-react";
import type { HotelService } from "../../types";

const icons: Record<HotelService["icon"], LucideIcon> = {
  wifi: Wifi,
  zap: Zap,
  battery: Battery,
  droplets: Droplets,
  flame: Flame,
  bell: Bell,
};

export function ServiceGrid({ items }: { items: HotelService[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((service) => {
        const Icon = icons[service.icon];
        return (
          <article key={service.id} className="rounded-xl border border-navy/8 bg-white p-6 shadow-[0_8px_30px_rgba(15,28,46,0.04)]">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cream text-navy">
              <Icon size={20} />
            </div>
            <h3 className="mt-4 font-serif text-xl text-navy">{service.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{service.description}</p>
          </article>
        );
      })}
    </div>
  );
}
