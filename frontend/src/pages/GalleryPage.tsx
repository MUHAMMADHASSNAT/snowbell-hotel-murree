import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { hotel } from "../data/hotel";
import { galleryCategories, galleryItems } from "../data/gallery";
import { Seo } from "../components/Seo";
import { PageHero } from "../components/layout/PageHero";

export function GalleryPage() {
  const [category, setCategory] = useState<(typeof galleryCategories)[number]>("All");
  const [open, setOpen] = useState<(typeof galleryItems)[number] | null>(null);
  const items = useMemo(
    () => (category === "All" ? galleryItems : galleryItems.filter((item) => item.category === category)),
    [category],
  );

  return (
    <>
      <Seo title={`Gallery | ${hotel.name}`} description="Rooms, exterior, mountain views, and facilities at Snowbell Hotel Murree." />
      <PageHero
        title="Gallery"
        subtitle="Existing photography used on this site, grouped by rooms, views, and the hotel."
        image="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80"
      />
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div className="flex flex-wrap gap-2">
          {galleryCategories.map((item) => (
            <button
              key={item}
              type="button"
              className={`rounded-full px-4 py-1.5 text-sm ${category === item ? "bg-navy text-white" : "bg-cream text-navy"}`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
          {items.map((item) => (
            <button key={item.id} type="button" className="overflow-hidden rounded-xl" onClick={() => setOpen(item)}>
              <img src={item.src} alt={item.alt} referrerPolicy="no-referrer" className="h-44 w-full object-cover transition hover:scale-105 md:h-56" />
            </button>
          ))}
        </div>
      </section>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-navy/80 p-4" role="dialog" aria-modal="true">
          <button type="button" className="absolute inset-0" aria-label="Close" onClick={() => setOpen(null)} />
          <div className="relative max-h-[90vh] w-full max-w-4xl">
            <button type="button" className="absolute -top-10 right-0 text-white" onClick={() => setOpen(null)} aria-label="Close image">
              <X />
            </button>
            <img src={open.src} alt={open.alt} referrerPolicy="no-referrer" className="max-h-[85vh] w-full rounded-lg object-contain" />
            <p className="mt-2 text-center text-sm text-white/80">{open.alt} · {open.category}</p>
          </div>
        </div>
      )}
    </>
  );
}
