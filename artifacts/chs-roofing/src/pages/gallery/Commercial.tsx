import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import CtaSection from "@/components/CtaSection";
import Partners from "@/components/Partners";
import ShingleDivider from "@/components/ShingleDivider";
import { GALLERY_COMMERCIAL, FOUNDER_PHOTOS } from "@/lib/site-config";

export default function CommercialGallery() {
  return (
    <>
      <PageHero
        eyebrow="Gallery · Commercial"
        title={<>Commercial <span className="text-primary">Project Gallery</span></>}
        subtitle="From flat TPO systems on warehouses to standing-seam metal on retail spaces, we deliver code-compliant commercial roofing across SWFL."
        image={FOUNDER_PHOTOS.flat[1]}
        imageAlt="Aerial of CHS crew installing white TPO flat roof on commercial building"
        crumbs={[{ label: "Gallery" }, { label: "Commercial" }]}
      />

      <ShingleDivider variant="light" className="bg-background" />

      <section className="pt-4 pb-20 bg-background">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GALLERY_COMMERCIAL.map((g, i) => (
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

          <div className="text-center mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3">
            <Link
              href="/gallery/residential"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              See residential projects <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/gallery/multifamily"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              See multifamily projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Partners compact />
      <CtaSection />
    </>
  );
}
