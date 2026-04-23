import { motion } from "framer-motion";
import { ShieldCheck, Award, Home as HomeIcon, Star } from "lucide-react";
import PageHero from "@/components/PageHero";
import CtaSection from "@/components/CtaSection";
import Partners from "@/components/Partners";
import Credentials from "@/components/Credentials";
import ServiceArea from "@/components/ServiceArea";
import { TEAM, SITE } from "@/lib/site-config";

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About CHS Roofing"
        title={<>A family-owned <span className="text-primary">SWFL roofer</span></>}
        subtitle={`Cordova Home Services has been roofing Southwest Florida since ${SITE.established}. Licensed, insured, and built on a simple promise: treat every client like family.`}
        image="/images/tile-roof.png"
        crumbs={[{ label: "About" }]}
      />

      {/* Story */}
      <section className="py-20 bg-background bg-wash-warm">
        <div className="container mx-auto max-w-4xl px-4">
          <h4 className="text-primary font-semibold tracking-[0.2em] uppercase mb-3 text-xs">Our Story</h4>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
            Built on family. Grown by trust.
          </h2>
          <div className="text-lg text-foreground leading-relaxed space-y-5">
            <p>
              CHS Roofing — short for Cordova Home Services — is a family-owned roofing contractor headquartered in Cape Coral, Florida. We started with a simple goal: deliver the kind of honest, high-craftsmanship roofing work we'd want done on our own homes.
            </p>
            <p>
              Today, we serve homeowners and commercial clients across all of Southwest Florida — from Cape Coral and Fort Myers to Naples, Bonita Springs, and beyond. Our crews are in-house (never day labor), our quotes are line-itemed (never vague), and our work is backed by a written 10-year workmanship warranty.
            </p>
            <p>
              We treat every client like family, ensuring personalized care. We provide transparent communication with no hidden surprises. And because we're locally owned, we're around long after the job is done.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: ShieldCheck, label: "Licensed", value: SITE.license },
              { icon: HomeIcon, label: "Family-Owned", value: `Since ${SITE.established}` },
              { icon: Star, label: "Google Rating", value: "5.0 ★" },
              { icon: Award, label: "BBB", value: "A+ Accredited" },
            ].map((s, i) => (
              <div key={i} className="bg-card border border-border/60 rounded-2xl p-5 text-center shadow-sm">
                <s.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="font-display font-bold tracking-tight text-foreground text-sm">{s.value}</p>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-muted/40">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h4 className="text-primary font-semibold tracking-[0.2em] uppercase mb-3 text-xs">People You Can Trust</h4>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground leading-[1.05]">
              Meet the CHS Team
            </h2>
            <p className="text-muted-foreground mt-5 text-lg leading-relaxed max-w-2xl mx-auto">
              Family-owned means you deal with the owners directly — not a call center. Here's the team that'll be on your roof.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {TEAM.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md lift-on-hover text-center"
              >
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    loading="lazy"
                    src={m.image}
                    alt={m.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display font-bold tracking-tight text-foreground text-base">{m.name}</h3>
                  <p className="text-[11px] uppercase tracking-[0.15em] text-primary font-semibold mt-1">{m.role}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEAM.map(m => (
              <div key={`bio-${m.name}`} className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <img loading="lazy" src={m.image} alt="" aria-hidden="true" className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h3 className="font-display font-bold tracking-tight text-foreground">{m.name}</h3>
                    <p className="text-[11px] uppercase tracking-[0.15em] text-primary font-semibold">{m.role}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Credentials />
      <Partners />
      <ServiceArea />
      <CtaSection />
    </>
  );
}
