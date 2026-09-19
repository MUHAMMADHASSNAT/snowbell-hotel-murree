export function PageHero({
  title,
  subtitle,
  image,
}: {
  title: string;
  subtitle: string;
  image: string;
}) {
  return (
    <section className="relative isolate flex min-h-[38vh] items-end overflow-hidden bg-navy md:min-h-[44vh]">
      <img src={image} alt="" referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/30" />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-14 md:px-6">
        <p className="text-xs uppercase tracking-[0.28em] text-gold">Snowbell Hotel Murree</p>
        <h1 className="mt-2 max-w-2xl font-serif text-4xl text-white md:text-5xl">{title}</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75 md:text-base">{subtitle}</p>
      </div>
    </section>
  );
}
