import { Link } from "wouter";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { PHOTOS } from "@/lib/site-config";

const REPAIR_GALLERY = [
  { src: PHOTOS.tearOff, alt: "Damaged decking exposed during a roof repair tear-off" },
  { src: PHOTOS.shingleInstallTopdown, alt: "Replacement shingle field laid in during a section repair" },
  { src: PHOTOS.flatPrepRedLine, alt: "Flat-roof leak boundary marked and prepped for patching" },
  { src: PHOTOS.greyMetalHip, alt: "Repaired metal hip roof restored to a clean weathertight finish" },
  { src: PHOTOS.finishedGreyShingle, alt: "Finished color-matched shingle repair blended into the roof field" },
  { src: PHOTOS.silverMetalPorch, alt: "Repaired silver metal roof and porch ready for handoff" },
];

export default function Repair() {
  return (
    <ServicePageTemplate
      eyebrow="Service · Repair"
      title={<>Roof <span className="text-primary">Repair</span> Done Right</>}
      subtitle="Fast, honest repair work — leaks, missing shingles, flashing failures, and post-storm damage. We come out, diagnose accurately, and fix it the first time."
      image={PHOTOS.tearOff}
      imageAlt="Roof tear-off and decking inspection in progress"
      crumbs={[{ label: "Services" }, { label: "Repair" }]}
      intro={
        <>
          <p>
            Most roof failures are local — a few lifted shingles, failing pipe-boot flashing, or a small leak around a skylight. You don't need a full replacement. You need an honest contractor who'll fix the actual problem instead of upselling you a $30K project.
          </p>
          <p>
            Our team specializes in surgical, lasting repairs across shingle, metal, tile, and flat roofs. If a repair isn't the right call, we'll tell you that too — and explain exactly why.
          </p>
        </>
      }
      included={[
        { title: "Same-week service", desc: "Most repair calls are scheduled within 3–5 business days; emergencies same-day." },
        { title: "Leak detection", desc: "We trace leaks to the actual entry point — not just patch where the water shows up inside." },
        { title: "Shingle & tile replacement", desc: "Color-matched replacements blended into existing roof field." },
        { title: "Flashing repair", desc: "Step, valley, chimney, and skylight flashing rebuilt to code." },
        { title: "Pipe boot & vent repair", desc: "The #1 cause of residential leaks — replaced with lifetime boots." },
        { title: "Soft-spot decking repair", desc: "Rotted plywood replaced before it spreads." },
        { title: "Sealant & caulk renewal", desc: "All exposed sealants refreshed to manufacturer spec." },
        { title: "Photo documentation", desc: "Before/after photos of every repair, sent to you on completion." },
        { title: "30-day repair warranty", desc: "If our repair fails in 30 days, we come back and fix it free." },
      ]}
      testimonialIndices={[3, 6, 7]}
      extra={
        <>
          <section className="py-20 bg-background">
            <div className="container mx-auto max-w-7xl px-4">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <h4 className="text-primary font-semibold tracking-[0.2em] uppercase mb-3 text-xs">Recent Repair Work</h4>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground leading-[1.05]">
                  Real repairs. Lasting results.
                </h2>
                <p className="text-muted-foreground mt-5 text-lg leading-relaxed max-w-2xl mx-auto">
                  A look at recent repair projects across SWFL — leaks traced, decking replaced, and roofs restored to weathertight.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {REPAIR_GALLERY.map((g, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="aspect-square overflow-hidden rounded-2xl border border-border/60 shadow-sm group"
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
          <section className="py-12 bg-primary/5 border-y border-primary/10">
            <div className="container mx-auto max-w-5xl px-4 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <AlertCircle className="w-10 h-10 text-primary shrink-0" />
                <div>
                  <p className="font-display font-bold text-foreground text-lg tracking-tight">Storm or hurricane damage?</p>
                  <p className="text-muted-foreground text-sm">We handle insurance documentation and emergency tarping.</p>
                </div>
              </div>
              <Link href="/services/storm-damage" className="bg-primary text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-primary/90 transition-colors">
                Storm Damage Help →
              </Link>
            </div>
          </section>
        </>
      }
    />
  );
}
