import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import CtaSection from "@/components/CtaSection";
import Partners from "@/components/Partners";
import ShingleDivider from "@/components/ShingleDivider";
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

      <ShingleDivider variant="light" className="bg-background" />

      <section className="pt-4 pb-20 bg-background">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GALLERY_RESIDENTIAL.map((g, i) => (
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
              href="/gallery/commercial"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              See commercial projects <ArrowRight className="w-4 h-4" />
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
