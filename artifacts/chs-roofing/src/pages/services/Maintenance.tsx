import { motion } from "framer-motion";
import { CheckCircle, Crown, Shield, ShieldCheck } from "lucide-react";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { MAINTENANCE_PLANS, MAINTENANCE_STEPS, PHOTOS } from "@/lib/site-config";

const PLAN_ICONS = [Shield, ShieldCheck, Crown];

function MaintenancePlans() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h4 className="text-primary font-semibold tracking-[0.2em] uppercase mb-3 text-xs">Maintenance Plans</h4>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground leading-[1.05]">
            Pick the protection level that fits your roof
          </h2>
          <p className="text-muted-foreground mt-5 text-lg leading-relaxed max-w-2xl mx-auto">
            Three straightforward plans — each one designed to extend roof life and catch problems before they turn into expensive repairs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {MAINTENANCE_PLANS.map((plan, i) => {
            const Icon = PLAN_ICONS[i] ?? Shield;
            const isFeatured = plan.slug === "pro";
            return (
              <motion.div
                key={plan.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className={`relative bg-card border rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col ${
                  isFeatured ? "border-primary ring-2 ring-primary/20" : "border-border/60"
                }`}
              >
                {isFeatured && (
                  <span className="absolute top-4 right-4 z-10 bg-primary text-white text-[10px] font-semibold uppercase tracking-[0.18em] px-3 py-1 rounded-full shadow-md shadow-primary/30">
                    Most popular
                  </span>
                )}
                <div className="h-44 overflow-hidden relative">
                  <img
                    loading="lazy"
                    src={plan.image}
                    alt={`${plan.name} — ${plan.tagline}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-3 left-4 text-white">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-foreground/80">{plan.tagline}</p>
                    <h3 className="text-2xl font-display font-bold tracking-tight">{plan.name}</h3>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{plan.desc}</p>
                  </div>
                  <ul className="space-y-2 mt-auto">
                    {plan.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-sm text-foreground">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 bg-muted/40 border border-border/60 rounded-3xl p-8 md:p-10">
          <h3 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-foreground mb-6">
            What every maintenance visit includes
          </h3>
          <ol className="grid md:grid-cols-5 gap-4">
            {MAINTENANCE_STEPS.map((step, i) => (
              <li key={step} className="flex flex-col gap-2">
                <span className="w-9 h-9 rounded-full bg-primary text-white font-display font-bold text-sm flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <p className="text-sm font-semibold text-foreground leading-snug">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default function Maintenance() {
  return (
    <ServicePageTemplate
      eyebrow="Service · Maintenance"
      title={<>Roof <span className="text-primary">Maintenance</span> & Inspections</>}
      subtitle="Annual maintenance is the cheapest insurance policy you can buy for your roof. Catch small problems before they become $20,000 ones."
      image={PHOTOS.greyMetalHip}
      imageAlt="Clean grey metal hip roof on a Fort Myers home"
      crumbs={[{ label: "Services" }, { label: "Maintenance" }]}
      intro={
        <>
          <p>
            Florida is brutal on roofs. UV, salt air, sudden rainstorms, and hurricane season chip away at sealants, lift flashing, and crack rubber boots. A single missed pipe-boot failure can cause thousands in interior damage.
          </p>
          <p>
            Our maintenance program catches those issues early — usually for the cost of a single repair — and extends the useful life of your roof by years. Pick the plan that matches your roof's age, exposure, and budget.
          </p>
        </>
      }
      included={[
        { title: "Full roof inspection", desc: "Walked, photographed, and reported. Drone documentation on steep or fragile roofs." },
        { title: "Sealant & caulk renewal", desc: "Every penetration sealed and re-caulked to current manufacturer spec." },
        { title: "Pipe boot inspection", desc: "Replaced proactively when cracking or UV-degraded — before they leak." },
        { title: "Debris & moss removal", desc: "Valleys cleared, leaves blown off, gutter outlets cleared at the roof line." },
        { title: "Flashing check", desc: "Step, valley, and ridge flashing inspected for lift or movement." },
        { title: "Granule loss assessment", desc: "We track shingle wear over time to forecast replacement years in advance." },
        { title: "Written report", desc: "Photo-documented PDF report emailed to you within 48 hours." },
        { title: "Priority scheduling", desc: "Maintenance customers get first slots after storm events." },
      ]}
      testimonialIndices={[1, 2, 6]}
      extra={<MaintenancePlans />}
    />
  );
}
