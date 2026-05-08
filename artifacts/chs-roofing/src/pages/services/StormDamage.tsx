import { motion } from "framer-motion";
import { Phone, FileCheck, Camera, Wrench } from "lucide-react";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import RaindropOverlay from "@/components/RaindropOverlay";
import { SITE, PHOTOS } from "@/lib/site-config";

export default function StormDamage() {
  return (
    <ServicePageTemplate
      eyebrow="Service · Storm Damage"
      title={<>Hurricane & <span className="text-primary">Storm Damage</span> Restoration</>}
      subtitle="Emergency tarping, full insurance documentation, and complete restoration. We've helped hundreds of SWFL families recover from Ian, Helene, and Milton."
      image={PHOTOS.tearOff}
      imageAlt="Storm-damaged roof tear-off and decking inspection in progress"
      heroOverlay={<RaindropOverlay count={28} tint="light" />}
      crumbs={[{ label: "Services" }, { label: "Storm Damage" }]}
      intro={
        <>
          <p>
            Florida storms can compromise your roof's integrity in ways you can't see from the ground. Lifted shingles, hairline tile cracks, displaced flashing — invisible damage that causes catastrophic leaks weeks or months later.
          </p>
          <p>
            We provide free, no-obligation storm damage inspections, emergency tarping to stop water intrusion immediately, and full insurance-claim documentation so your carrier pays for what's actually broken.
          </p>
        </>
      }
      included={[
        { title: "Emergency tarping (24/7)", desc: "Stop water intrusion within hours of your call." },
        { title: "Free damage inspection", desc: "Drone + ground walk, fully documented for insurance." },
        { title: "Insurance claim assistance", desc: "We meet your adjuster on-site and provide Xactimate-aligned scopes." },
        { title: "Photo + video evidence package", desc: "Documentation that supports a full, fair claim payout." },
        { title: "Mortgage company coordination", desc: "We handle multi-party check release on insurance proceeds." },
        { title: "Same-day quote turnaround", desc: "Most storm-damage estimates delivered within 24 hours." },
        { title: "Code-upgrade compliance", desc: "All work brought up to current FL Building Code (2023 edition)." },
        { title: "Full reroof or repair", desc: "Whatever the damage actually requires — never an upsell." },
        { title: "Priority scheduling", desc: "Storm-damaged homes go to the front of the queue." },
      ]}
      testimonialIndices={[3, 5, 6]}
      showProcess={false}
      extra={
        <section className="py-16 bg-secondary text-white">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center mb-10">
              <h4 className="text-primary font-semibold tracking-[0.2em] uppercase mb-3 text-xs">How Insurance Claims Work</h4>
              <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-white leading-[1.1]">
                We handle the paperwork. You get a new roof.
              </h2>
            </div>
            <div className="grid md:grid-cols-4 gap-5">
              {[
                { icon: Phone, title: "1. Call us", desc: "Free inspection scheduled within 24–48 hours." },
                { icon: Camera, title: "2. We document", desc: "Drone + ground photos of all damage." },
                { icon: FileCheck, title: "3. Meet adjuster", desc: "We show up to your adjuster appointment." },
                { icon: Wrench, title: "4. Restore", desc: "We complete the work to insurance scope." },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="bg-white/[0.05] border border-white/10 rounded-2xl p-6 text-center"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <s.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display font-bold tracking-tight text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-10">
              <a
                href={`tel:${SITE.phoneTel}`}
                className="inline-flex items-center gap-2 bg-primary text-white px-7 py-4 rounded-full font-semibold tracking-tight hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
              >
                <Phone className="w-4 h-4" /> 24/7 Storm Hotline {SITE.phoneDisplay}
              </a>
            </div>
          </div>
        </section>
      }
    />
  );
}
