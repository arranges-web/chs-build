import { motion } from "framer-motion";
import { Search, FileText, CalendarCheck, Hammer, ShieldCheck } from "lucide-react";

const steps = [
  { icon: Search, title: "Free Inspection", desc: "We climb the roof, document every detail, and assess damage with drone photography when needed." },
  { icon: FileText, title: "Honest Quote", desc: "A line-itemed written estimate within 24–48 hours. No vague numbers, no high-pressure tactics." },
  { icon: CalendarCheck, title: "Schedule & Permit", desc: "We pull all required permits and schedule installation around Florida's weather windows." },
  { icon: Hammer, title: "Expert Install", desc: "Our in-house crew delivers same-day tear-off and dry-in. Daily clean-up included." },
  { icon: ShieldCheck, title: "Final Walk-Through", desc: "Magnetic nail sweep, final inspection, and a written warranty handed to you in person." },
];

export default function ProcessTimeline() {
  return (
    <section className="py-28 bg-background bg-wash-cool relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h4 className="text-primary font-semibold tracking-[0.2em] uppercase mb-3 text-xs">How We Work</h4>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-foreground leading-[1.05]">
            Five Steps. Zero Surprises.
          </h2>
          <p className="text-muted-foreground mt-6 text-lg leading-relaxed max-w-2xl mx-auto">
            A straightforward process built on transparency, craftsmanship, and respect for your home.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line - desktop only */}
          <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4 relative">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="text-center group"
              >
                <div className="relative mx-auto w-20 h-20 mb-5">
                  <div className="absolute inset-0 bg-primary/10 rounded-full group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-2 bg-background border-2 border-primary rounded-full flex items-center justify-center shadow-md">
                    <s.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-secondary text-white text-xs font-display font-bold flex items-center justify-center border-2 border-background">
                    {i + 1}
                  </div>
                </div>
                <h3 className="font-display font-bold tracking-tight text-foreground text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed px-2">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
