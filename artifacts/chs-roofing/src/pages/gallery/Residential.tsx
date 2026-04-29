import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import CtaSection from "@/components/CtaSection";
import Partners from "@/components/Partners";
import { GALLERY_RESIDENTIAL, PHOTOS } from "@/lib/site-config";

export default function ResidentialGallery() {
  return (
    <>
      <PageHero
        eyebrow="Gallery · Residential"
        title={<>Residential <span className="text-primary">Project Gallery</span></>}
        subtitle="A small selection of recent residential roofing projects across Cape Coral, Fort Myers, Naples, and the rest of Southwest Florida."
        image={PHOTOS.beachfrontMetal}
        imageAlt="Standing-seam metal roof on a beachfront SWFL home"
        crumbs={[{ label: "Gallery" }, { label: "Residential" }]}
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GALLERY_RESIDENTIAL.map((g, i) => (
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="group bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md shingle-lift"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    loading="lazy"
                    src={g.src}
                    alt={g.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <figcaption className="p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{g.label}</p>
                  <p className="font-display font-bold tracking-tight text-foreground mt-1">{g.alt}</p>
                </figcaption>
              </motion.figure>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/gallery/commercial"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              See commercial projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Partners compact />
      <CtaSection />
    </>
  );
}
