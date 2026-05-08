import { motion } from "framer-motion";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { PHOTOS } from "@/lib/site-config";

const SPECIALTY_GALLERY = [
  { src: PHOTOS.silverMetalPorch, alt: "Skylight installation flashed into a silver metal roof" },
  { src: PHOTOS.darkMetalAerial, alt: "Custom bent flashing on a complex dark metal roof" },
  { src: PHOTOS.darkMetalEstate, alt: "Custom chimney cap detail on an estate roof" },
  { src: PHOTOS.greyMetalHip, alt: "Full metal cricket diverting water around a chimney" },
  { src: PHOTOS.beachfrontMetal, alt: "Architectural standing seam on a coastal home" },
  { src: PHOTOS.lightGreyMetalLanai, alt: "Cupola and ridge detail integrated into a metal roof" },
];

export default function SpecialtyRoofing() {
  return (
    <ServicePageTemplate
      eyebrow="Service · Specialty"
      title={<>Specialty <span className="text-primary">Roofing</span> Services</>}
      subtitle="Skylights, custom-bent flashing, chimney caps, full metal crickets, and unique architectural roofs. The detail work other contractors won't touch."
      image={PHOTOS.redMetalAccent}
      imageAlt="Bold red standing-seam metal accent roof — specialty install"
      crumbs={[{ label: "Services" }, { label: "Specialty Roofing" }]}
      intro={
        <>
          <p>
            Some roofs aren't standard — and they don't deserve standard work. Whether it's a complex multi-pitch architectural design, a precision skylight install that has to seal perfectly, or a custom chimney cap and metal cricket that has to look as good as it performs, we have the metal-shop and craftsmanship experience to do it right.
          </p>
          <p>
            We work with architects, custom-home builders, and homeowners on projects where details matter and craftsmanship is non-negotiable.
          </p>
        </>
      }
      included={[
        { title: "Skylight installation", desc: "Velux and equivalent — fully flashed, fully sealed, fully warrantied." },
        { title: "Custom-bent flashing", desc: "On-site brake work for non-standard valleys, roof-to-wall, and parapets." },
        { title: "Custom chimney caps", desc: "Architectural metal chimney caps and crowns — built to size, installed weathertight." },
        { title: "Full metal crickets", desc: "Engineered metal saddles that divert water around chimneys and skylights." },
        { title: "Architectural standing seam", desc: "High-end snap-lock and mechanical-seam metal in dozens of finishes." },
        { title: "Cupolas & ridge ornaments", desc: "Decorative ridge caps and architectural cupolas installed and sealed." },
        { title: "Roof-to-wall transitions", desc: "Complex transitions on additions and second-story builds." },
        { title: "Solar-ready prep", desc: "Reinforced decking and pre-installed mounts for future solar arrays." },
        { title: "HOA-spec installations", desc: "Tile, paint, and profile matching for HOA-controlled communities." },
      ]}
      testimonialIndices={[0, 4, 6]}
      showFaq={false}
      showProcess={false}
      extra={
        <section className="py-20 bg-background">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h4 className="text-primary font-semibold tracking-[0.2em] uppercase mb-3 text-xs">Specialty Work In Action</h4>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground leading-[1.05]">
                Where the details matter
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {SPECIALTY_GALLERY.map((g, i) => (
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
      }
    />
  );
}
