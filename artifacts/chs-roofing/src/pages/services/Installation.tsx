import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { MATERIALS, PHOTOS } from "@/lib/site-config";

export default function Installation() {
  return (
    <ServicePageTemplate
      eyebrow="Service · Installation"
      title={<>New Roof <span className="text-primary">Installation</span></>}
      subtitle="Premium residential and commercial roof installations across Southwest Florida — engineered for our climate, built to last decades."
      image={PHOTOS.beachfrontMetal}
      imageAlt="Standing-seam metal roof on a beachfront SWFL home"
      crumbs={[{ label: "Services" }, { label: "Installation" }]}
      intro={
        <>
          <p>
            Whether you're building new construction or replacing an aging roof, CHS Roofing delivers full-system installations using premium materials and certified-installer techniques. Our in-house crews — never day labor — handle tear-off, dry-in, underlayment, ventilation, flashing, and finish work to spec.
          </p>
          <p>
            We install across all four major roofing material categories so we can recommend what's truly best for your home, budget, and HOA — not just what we happen to stock.
          </p>
        </>
      }
      included={[
        { title: "Free on-site inspection", desc: "Owner-supervised assessment with drone photography when needed." },
        { title: "Line-itemed estimate", desc: "Honest, transparent pricing within 24–48 hours. No surprises." },
        { title: "Full tear-off & disposal", desc: "Complete removal of existing roofing, decking inspection, and clean haul-away." },
        { title: "Premium underlayment", desc: "Synthetic and peel-and-stick underlayment systems engineered for SWFL heat and humidity." },
        { title: "Florida-code fastening", desc: "Engineered nail patterns rated for 130+ MPH wind zones." },
        { title: "Flashing & ventilation", desc: "New step flashing, valley flashing, ridge vents, and intake vents installed to code." },
        { title: "Permits & inspections", desc: "We pull every permit and coordinate with your county or city." },
        { title: "10-year workmanship warranty", desc: "Written labor guarantee on every installation we perform." },
        { title: "Daily clean-up + magnet sweep", desc: "Your driveway and yard left cleaner than we found them." },
      ]}
      extra={
        <section className="py-20 bg-background">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h4 className="text-primary font-semibold tracking-[0.2em] uppercase mb-3 text-xs">Choose Your Material</h4>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground leading-[1.05]">
                We install every major roofing system
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {MATERIALS.map(m => (
                <Link
                  key={m.slug}
                  href={m.href}
                  className="group bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md lift-on-hover"
                >
                  <div className="h-44 overflow-hidden">
                    <img loading="lazy" src={m.image} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display font-bold tracking-tight text-foreground text-lg mb-2 group-hover:text-primary transition-colors">{m.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{m.short}</p>
                    <span className="text-primary text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Learn more <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      }
    />
  );
}
