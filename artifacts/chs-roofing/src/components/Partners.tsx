import { PARTNERS } from "@/lib/site-config";

export default function Partners({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`${compact ? "py-12" : "py-20"} bg-white border-y border-border/40`}>
      <div className="container mx-auto max-w-7xl px-4">
        <p className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-8">
          Our Manufacturer Partners
        </p>
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
          {PARTNERS.map(p => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <span className="font-display font-bold tracking-tight text-foreground text-base md:text-lg">
                {p.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
