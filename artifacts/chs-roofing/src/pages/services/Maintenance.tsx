import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Crown, Shield, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { MAINTENANCE_PLANS, PHOTOS } from "@/lib/site-config";

const PLAN_ICONS = [Shield, ShieldCheck, Crown];

const ROOF_TYPE_INFO = [
  {
    title: "Tile Roof Maintenance",
    desc: "Tile roofs are strong and beautiful, but broken tiles, cracked mortar, loose ridge caps, and underlayment issues can lead to leaks. Regular maintenance helps protect the system underneath the tile.",
    image: PHOTOS.terracottaWaterfront,
  },
  {
    title: "Metal Roof Maintenance",
    desc: "Metal roofs perform great in Florida, but screws, seams, flashing, sealants, and fasteners should be checked regularly to prevent leaks and corrosion.",
    image: PHOTOS.whiteStandingSeam,
  },
  {
    title: "Shingle Roof Maintenance",
    desc: "Shingle roofs should be inspected for lifted shingles, missing shingles, exposed nails, pipe boots, flashing issues, and storm damage before small problems become bigger repairs.",
    image: PHOTOS.finishedGreyShingle,
  },
  {
    title: "Flat Roof Maintenance",
    desc: "Flat and low-slope roofs need regular inspections because ponding water, clogged drains, open seams, and cracked coatings can quickly lead to leaks.",
    image: PHOTOS.flatTpoCrew,
  },
];

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
            Three straightforward plans — each one designed to extend roof life and catch problems before they turn into expensive repairs. Click a plan to request more details.
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
                className="h-full"
              >
                <Link
                  href={`/contact?service=maintenance&plan=${plan.slug}`}
                  className={`group relative bg-card border rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    isFeatured ? "border-primary ring-2 ring-primary/20" : "border-border/60 hover:border-primary/40"
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
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
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
                    <ul className="space-y-2 mb-5">
                      {plan.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2 text-sm text-foreground">
                          <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-2">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                        Request more details
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MaintenanceByRoofType() {
  return (
    <section className="py-24 bg-background bg-wash-cool">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h4 className="text-primary font-semibold tracking-[0.2em] uppercase mb-3 text-xs">By Roof System</h4>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground leading-[1.05]">
            Roof Maintenance for Every Roof System
          </h2>
          <p className="text-muted-foreground mt-5 text-lg leading-relaxed max-w-2xl mx-auto">
            Every roof needs attention, even when it looks fine from the ground. Florida heat, storms, wind-driven rain, clogged drains, loose fasteners, cracked sealants, and small leaks can turn into expensive problems if they are not caught early.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ROOF_TYPE_INFO.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.06 }}
              className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="h-36 overflow-hidden relative">
                <img
                  loading="lazy"
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <h3 className="absolute bottom-3 left-4 right-4 font-display font-bold tracking-tight text-white text-base drop-shadow">
                  {item.title}
                </h3>
              </div>
              <div className="p-5 flex-1">
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 max-w-3xl mx-auto text-center">
          <p className="text-lg font-display font-semibold text-foreground tracking-tight">
            The goal is simple: catch the problem before it becomes an emergency.
          </p>
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
      showProcess={false}
      extra={
        <>
          <MaintenancePlans />
          <MaintenanceByRoofType />
        </>
      }
    />
  );
}
