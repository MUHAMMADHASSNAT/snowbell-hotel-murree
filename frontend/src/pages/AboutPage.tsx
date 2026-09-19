import { hotel } from "../data/hotel";
import { Seo } from "../components/Seo";
import { PageHero } from "../components/layout/PageHero";

export function AboutPage() {
  return (
    <>
      <Seo
        title={`About | ${hotel.name}`}
        description="About Snowbell Hotel Murree — a hill hotel stay in Murree, Punjab, Pakistan."
      />
      <PageHero
        title="About the hotel"
        subtitle="A straightforward introduction to Snowbell Hotel Murree and why guests use it as a base in the hills."
        image="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80"
      />
      <section className="mx-auto max-w-3xl px-4 py-14 md:px-6">
        <h2 className="font-serif text-3xl text-navy">Hotel introduction</h2>
        {hotel.about.map((para) => (
          <p key={para.slice(0, 24)} className="mt-4 text-base leading-relaxed text-muted">
            {para}
          </p>
        ))}
      </section>
      <section className="bg-cream py-14">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="font-serif text-3xl text-navy">Why choose us</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {hotel.whyChoose.map((item) => (
              <article key={item.title} className="rounded-xl bg-white p-6">
                <h3 className="font-serif text-xl text-navy">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 py-14 md:px-6">
        <h2 className="font-serif text-3xl text-navy">Location</h2>
        <p className="mt-4 text-base leading-relaxed text-muted">
          {hotel.name} is listed in {hotel.location}. Murree is a hill station in Punjab, reached by road from Islamabad and Rawalpindi. Confirm the exact approach road and check-in time with the hotel before you travel — the public street address on this site is still a placeholder.
        </p>
      </section>
    </>
  );
}
