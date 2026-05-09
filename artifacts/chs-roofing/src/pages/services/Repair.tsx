import { Link } from "wouter";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import StepsTimeline from "@/components/StepsTimeline";
import { FOUNDER_PHOTOS, PHOTOS, REPAIR_PAIRS } from "@/lib/site-config";

const REPAIR_STEPS = [
  {
    title: "Inspect Roof & Water Test to Find the Leak",
    desc: "We perform a detailed roof inspection and water test when needed to identify the exact source of the leak — not just the area where water is showing inside.",
    image: FOUNDER_PHOTOS.repair[3],
    imageAlt: "Shingle damage identified during roof inspection",
  },
  {
    title: "Inspection Report With Photos & Solutions",
    desc: "After the inspection we provide a clear report with pictures, notes, and repair recommendations so the homeowner understands what is happening and what needs to be done.",
    image: FOUNDER_PHOTOS.repair[4],
    imageAlt: "Shingle valley damage documented for repair report",
  },
  {
    title: "Complete the Repair & Final Water Test",
    desc: "Once the repair is completed, we run a final water test when possible to confirm the leak has been repaired properly.",
    image: FOUNDER_PHOTOS.repair[5],
    imageAlt: "Completed tile repair — weathertight and color-matched",
  },
];

export default function Repair() {
  return (
    <ServicePageTemplate
      eyebrow="Service · Repair"
      title={<>Roof <span className="text-primary">Repair</span> Done Right</>}
      subtitle="Fast, honest repair work — leaks, missing shingles, flashing failures, and post-storm damage. We diagnose accurately and fix it the first time."
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
      testimonialIndices={[3, 4, 6]}
      showProcess={false}
      extra={
        <>
          <StepsTimeline
            eyebrow="Our 3-Step Repair Process"
            title="Find it. Fix it. Prove it's fixed."
            subtitle="A focused process built for accurate diagnoses and lasting repairs."
            steps={REPAIR_STEPS}
            background="bg-background bg-wash-cool"
          />

          {/* Before / After Gallery */}
          <section className="py-20 bg-background">
            <div className="container mx-auto max-w-7xl px-4">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <h4 className="text-primary font-semibold tracking-[0.2em] uppercase mb-3 text-xs">Recent Repair Work</h4>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground leading-[1.05]">
                  Real repairs. Lasting results.
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Every job documented with before-and-after photos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {REPAIR_PAIRS.map((pair, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    className="rounded-2xl border border-border/60 overflow-hidden shadow-sm bg-card"
                  >
                    {pair.before ? (
                      <div className="grid grid-cols-2 divide-x divide-border/60">
                        <div className="relative">
                          <img
                            loading="lazy"
                            src={pair.before}
                            alt={`${pair.label} — before`}
                            className="w-full aspect-[4/3] object-cover"
                          />
                          <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full backdrop-blur-sm">
                            Before
                          </span>
                        </div>
                        <div className="relative">
                          <img
                            loading="lazy"
                            src={pair.after}
                            alt={`${pair.label} — after`}
                            className="w-full aspect-[4/3] object-cover"
                          />
                          <span className="absolute top-2 left-2 bg-primary/90 text-white text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full backdrop-blur-sm">
                            After
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          loading="lazy"
                          src={pair.after}
                          alt={`${pair.label} — completed`}
                          className="w-full aspect-[16/9] object-cover"
                        />
                        <span className="absolute top-2 left-2 bg-primary/90 text-white text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full backdrop-blur-sm">
                          After
                        </span>
                      </div>
                    )}
                    <div className="px-4 py-3">
                      <p className="text-sm font-medium text-foreground">{pair.label}</p>
                    </div>
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
