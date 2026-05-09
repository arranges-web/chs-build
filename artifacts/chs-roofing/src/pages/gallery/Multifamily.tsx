import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import CtaSection from "@/components/CtaSection";
import Partners from "@/components/Partners";
import ShingleDivider from "@/components/ShingleDivider";
import { GALLERY_MULTIFAMILY, FOUNDER_PHOTOS } from "@/lib/site-config";

export default function MultifamilyGallery() {
  return (
    <>
      <PageHero
        eyebrow="Gallery · Multifamily"
        title={<>Multifamily <span className="text-primary">Project Gallery</span></>}
        subtitle="Condos, apartment communities, and multi-building properties across Southwest Florida — re-roofed to weather hurricane season and last."
        image={FOUNDER_PHOTOS.multifamily[0]}
        imageAlt="Aerial of a full condo community being re-roofed by CHS in Cape Coral"
        crumbs={[{ label: "Gallery" }, { label: "Multifamily" }]}
      />

      <ShingleDivider variant="light" className="bg-background" />

      <section className="pt-4 pb-20 bg-background">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GALLERY_MULTIFAMILY.map((g, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-md shingle-lift bg-muted/30"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    loading="lazy"
                    src={g.src}
                    alt={g.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </motion.div>
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
