import { motion } from "framer-motion";
import { Search, Shield, Wrench, Droplets, Hammer, ClipboardCheck } from "lucide-react";
import { PHOTOS } from "@/lib/site-config";

const steps = [
  {
    icon: Search,
    title: "Free Inspection",
    desc: "Full evaluation of roof condition with photo documentation and a no-obligation report.",
    image: PHOTOS.greyMetalHip,
  },
  {
    icon: Shield,
    title: "Site Preparation",
    desc: "Protect property and prep the job site — landscaping, pool, and driveway covered.",
    image: PHOTOS.flatPrepRedLine,
  },
  {
    icon: Wrench,
    title: "Tear-Off",
    desc: "Remove old roofing materials safely down to clean, sound decking.",
    image: PHOTOS.tearOff,
  },
  {
    icon: Droplets,
    title: "Dry-In",
    desc: "Install premium underlayment for full waterproofing before finish material goes on.",
    image: PHOTOS.shingleInstallTopdown,
  },
  {
    icon: Hammer,
    title: "Install",
    desc: "Install your new roofing system with code-rated fastening and precision finish work.",
    image: PHOTOS.whiteStandingSeam,
  },
  {
    icon: ClipboardCheck,
    title: "Final Walkthrough",
    desc: "Quality check, magnet sweep, written warranty, and client approval before we leave.",
    image: PHOTOS.finishedGreyShingle,
  },
];

export default function ProcessTimeline() {
  return (
    <section className="py-28 bg-background bg-wash-cool relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h4 className="text-primary font-semibold tracking-[0.2em] uppercase mb-3 text-xs">How We Work</h4>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-foreground leading-[1.05]">
            Our 6-Step Process
          </h2>
          <p className="text-muted-foreground mt-6 text-lg leading-relaxed max-w-2xl mx-auto">
            A straightforward process built on transparency, craftsmanship, and respect for your home — from first inspection to final walkthrough.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg shingle-lift group flex flex-col"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  loading="lazy"
                  decoding="async"
                  src={s.image}
                  alt={`Step ${i + 1}: ${s.title}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute top-4 left-4 w-11 h-11 rounded-full bg-white shadow-lg border-2 border-primary flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-secondary text-white text-xs font-display font-bold flex items-center justify-center border-2 border-white shadow">
                  {i + 1}
                </div>
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-display font-bold tracking-tight text-white text-xl drop-shadow">
                    {s.title}
                  </h3>
                </div>
              </div>
              <div className="p-5 flex-1">
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
