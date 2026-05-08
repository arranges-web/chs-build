import { motion } from "framer-motion";
import { Link } from "wouter";
import { Check, X, Clock, Droplets, Wind, Flame, ArrowRight } from "lucide-react";
import PageHero from "./PageHero";
import CtaSection from "./CtaSection";
import { MATERIALS } from "@/lib/site-config";

type Props = {
  slug: typeof MATERIALS[number]["slug"];
  intro: React.ReactNode;
  pros: string[];
  cons: string[];
  bestFor: string[];
  manufacturers: string[];
  galleryImages: { src: string; alt: string }[];
  /** Optional content rendered above the gallery (e.g. material variant comparisons). */
  extra?: React.ReactNode;
};

const STATS_ICONS = [Clock, Wind, Droplets, Flame];

export default function MaterialPageTemplate({
  slug,
  intro,
  pros,
  cons,
  bestFor,
  manufacturers,
  galleryImages,
  extra,
}: Props) {
  const material = MATERIALS.find(m => m.slug === slug)!;
  const otherMaterials = MATERIALS.filter(m => m.slug !== slug);

  const stats = [
    { icon: Clock, label: "Lifespan", value: material.lifespan },
    { icon: Wind, label: "Wind rating", value: "Up to 130+ MPH" },
    { icon: Droplets, label: "Florida-tested", value: "Salt-air ready" },
    { icon: Flame, label: "Fire rating", value: "Class A available" },
  ];

  return (
    <>
      <PageHero
        eyebrow="Roofing Material"
        title={<>{material.title}<span className="text-primary"> for SWFL Homes</span></>}
        subtitle={material.short}
        image={material.image}
        crumbs={[
          { label: "Materials", href: "/materials/asphalt-shingles" },
          { label: material.title },
        ]}
      />

      {/* Stats Strip */}
      <section className="py-10 bg-white border-b border-border/40">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => {
              const Icon = STATS_ICONS[i];
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">{s.label}</p>
                    <p className="font-bold text-foreground tracking-tight">{s.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 bg-background bg-wash-warm">
        <div className="container mx-auto max-w-4xl px-4 text-lg md:text-xl text-foreground leading-relaxed space-y-5">
          {intro}
        </div>
      </section>

      {/* Pros / Cons / Best For */}
      <section className="py-20 bg-muted/40">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card border border-border/60 rounded-2xl p-7 shadow-sm">
              <h3 className="font-display font-bold tracking-tight text-foreground text-xl mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" /> Pros
              </h3>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {pros.map((p, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /> {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card border border-border/60 rounded-2xl p-7 shadow-sm">
              <h3 className="font-display font-bold tracking-tight text-foreground text-xl mb-4 flex items-center gap-2">
                <X className="w-5 h-5 text-muted-foreground" /> Trade-offs
              </h3>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {cons.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <X className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" /> {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card border border-border/60 rounded-2xl p-7 shadow-sm">
              <h3 className="font-display font-bold tracking-tight text-foreground text-xl mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" /> Best For
              </h3>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {bestFor.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /> {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Manufacturers */}
      <section className="py-16 bg-background">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <h4 className="text-primary font-semibold tracking-[0.2em] uppercase mb-3 text-xs">Recommended By CHS</h4>
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground mb-8 leading-[1.1]">
            Trusted manufacturers we install
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {manufacturers.map(m => (
              <span
                key={m}
                className="px-5 py-3 rounded-2xl border border-border/60 bg-card font-display font-bold tracking-tight text-foreground"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Strip */}
      {extra}

      {galleryImages.length > 0 && (
        <section className="py-20 bg-muted/40">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground leading-[1.1]">
                Recent {material.title} Projects
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {galleryImages.map((g, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="aspect-square overflow-hidden rounded-2xl border border-border/60 shadow-sm group shingle-lift"
                >
                  <img
                    loading="lazy"
                    src={g.src}
                    alt={g.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Compare other materials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-foreground mb-8 text-center">
            Considering other materials?
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {otherMaterials.map(m => (
              <Link
                key={m.slug}
                href={m.href}
                className="group bg-card border border-border/60 rounded-2xl p-6 hover:border-primary/40 hover:shadow-md shingle-lift transition-all"
              >
                <h3 className="font-display font-bold tracking-tight text-foreground text-lg mb-1 group-hover:text-primary transition-colors">
                  {m.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{m.short}</p>
                <span className="text-primary text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        title={<>Get a quote on a <span className="text-primary">{material.title.toLowerCase()}</span> roof</>}
        subtitle="Tell us about your home and we'll send a transparent, line-itemed estimate within 48 hours."
      />
    </>
  );
}
