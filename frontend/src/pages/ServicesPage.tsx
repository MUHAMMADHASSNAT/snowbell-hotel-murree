import { hotel } from "../data/hotel";
import { services } from "../data/services";
import { Seo } from "../components/Seo";
import { PageHero } from "../components/layout/PageHero";
import { ServiceGrid } from "../components/services/ServiceGrid";

export function ServicesPage() {
  return (
    <>
      <Seo
        title={`Services & facilities | ${hotel.name}`}
        description="WiFi, electricity, backup power, hot and cold water, heating, and room service at Snowbell Hotel Murree."
      />
      <PageHero
        title="Services & facilities"
        subtitle="The practical services guests typically need in Murree — listed without extra amenities we cannot verify."
        image="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80"
      />
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <ServiceGrid items={services} />
      </section>
    </>
  );
}
