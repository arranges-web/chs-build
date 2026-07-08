import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, CheckCircle, HelpCircle, MapPin, Phone, ShieldCheck } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PageHero from "@/components/PageHero";
import CtaSection from "@/components/CtaSection";
import Seo, { breadcrumbSchema, faqSchema, serviceSchema } from "@/components/Seo";
import { SERVICES, SITE, TESTIMONIALS } from "@/lib/site-config";

type Props = {
  /** e.g. "Fort Myers" */
  city: string;
  /** URL path, e.g. "/roofing-fort-myers" */
  path: string;
  heroImage: string;
  heroImageAlt: string;
  /** SEO title, ~50-60 chars, keyword-rich. */
  seoTitle: string;
  /** SEO meta description, 140-160 chars. */
  seoDescription: string;
  /** 1-2 short paragraphs of genuinely unique, city-specific copy. */
  intro: React.ReactNode;
  /** Neighborhoods / areas within the city we call out for local relevance. */
  neighborhoods: string[];
  /** Local considerations specific to this city (wind zone, HOA, coastal salt air, etc). */
  localPoints: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  testimonialIndices?: number[];
  /** Other city pages to cross-link for internal linking / crawl depth. */
  nearbyCities: { name: string; href: string }[];
};

export default function LocationPageTemplate({
  city,
  path,
  heroImage,
  heroImageAlt,
  seoTitle,
  seoDescription,
  intro,
  neighborhoods,
  localPoints,
  faqs,
  testimonialIndices = [0, 2, 4],
  nearbyCities,
}: Props) {
  const reviews = testimonialIndices.map((i) => TESTIMONIALS[i]).filter(Boolean);

  return (
    <>
      <Seo
        title={seoTitle}
        description={seoDescription}
        path={path}
        jsonLd={[
          serviceSchema({
            name: `Roofing Services in ${city}, FL`,
            description: seoDescription,
            path,
            serviceType: "Roof Installation, Repair & Maintenance",
          }),
          breadcrumbSchema([{ name: `Roofing in ${city}`, path }]),
          faqSchema(faqs),
        ]}
      />

      <PageHero
        eyebrow={`Roofing Contractor · ${city}, FL`}
        title={
          <>
            Trusted roof repair &amp; installation in <span className="text-primary">{city}</span>
          </>
        }
        subtitle={`Licensed (${SITE.license}) and locally trusted, CHS Roofing has installed, repaired, and restored roofs across ${city} and the surrounding Southwest Florida coast.`}
        image={heroImage}
        imageAlt={heroImageAlt}
        crumbs={[{ label: `Roofing in ${city}` }]}
      />

      {/* Intro */}
      <section className="py-20 bg-background bg-wash-warm">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-lg md:text-xl text-foreground leading-relaxed space-y-5">{intro}</div>
        </div>
      </section>

      {/* Local considerations */}
      <section className="py-20 bg-muted/40">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h4 className="text-primary font-semibold tracking-[0.2em] uppercase mb-3 text-xs">
              Built for {city}'s climate
            </h4>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground leading-[1.05]">
              What makes roofing here different
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {localPoints.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm hover:shadow-md shingle-lift"
              >
                <ShieldCheck className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-display font-bold tracking-tight text-foreground text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services grid — internal links to service pages */}
      <section className="py-20 bg-background">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h4 className="text-primary font-semibold tracking-[0.2em] uppercase mb-3 text-xs">
              Services in {city}
            </h4>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground leading-[1.05]">
              Everything your roof needs
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map((s) => (
              <Link
                key={s.slug}
                href={s.href}
                className="group bg-card border border-border/60 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col"
              >
                <h3 className="font-display font-bold tracking-tight text-foreground text-base mb-1.5 group-hover:text-primary transition-colors">
                  {s.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed flex-grow">{s.short}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  Learn more <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Neighborhoods served */}
      <section className="py-16 bg-muted/40">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <h4 className="text-primary font-semibold tracking-[0.2em] uppercase mb-3 text-xs">
            Areas we serve near {city}
          </h4>
          <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-foreground leading-tight mb-8">
            Local crews, no subcontracting out
          </h2>
          <div className="flex flex-wrap justify-center gap-2.5">
            {neighborhoods.map((n) => (
              <span
                key={n}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-card border border-border/60 text-sm font-medium text-foreground"
              >
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {n}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 bg-background">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h4 className="text-primary font-semibold tracking-[0.2em] uppercase mb-3 text-xs">5-Star Reviews</h4>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground leading-[1.05]">
              What {city} homeowners say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <div key={i} className="bg-card border border-border/60 p-7 rounded-2xl shadow-sm flex flex-col">
                <div className="flex gap-1 mb-3 text-primary">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-lg">★</span>
                  ))}
                </div>
                <p className="text-foreground italic mb-5 flex-grow leading-relaxed">"{r.text}"</p>
                <div>
                  <p className="font-bold text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 bg-muted/40">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center mb-14">
            <h4 className="text-primary font-semibold tracking-[0.2em] uppercase mb-3 text-xs flex items-center justify-center gap-2">
              <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked
            </h4>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-foreground leading-[1.05]">
              {city} Roofing Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="bg-card border border-border/60 rounded-2xl px-6 md:px-7 shadow-sm data-[state=open]:shadow-md data-[state=open]:border-primary/30 transition-all"
              >
                <AccordionTrigger className="font-display font-bold tracking-tight text-foreground text-left text-base md:text-lg hover:no-underline py-5">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6 text-base">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Nearby cities — internal linking for crawl depth */}
      {nearbyCities.length > 0 && (
        <section className="py-14 bg-muted/40">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">
              Also serving nearby
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {nearbyCities.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-card border border-border/60 text-sm font-semibold text-foreground hover:border-primary/40 hover:text-primary transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-primary" />
                  Roofing in {c.name}
                </Link>
              ))}
            </div>
            <a
              href={`tel:${SITE.phoneTel}`}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              <Phone className="w-4 h-4" /> Or call {SITE.phoneDisplay}
            </a>
          </div>
        </section>
      )}

      <CtaSection />
    </>
  );
}
