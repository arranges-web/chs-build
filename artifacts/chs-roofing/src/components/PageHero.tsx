import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Phone, ChevronRight } from "lucide-react";
import { SITE } from "@/lib/site-config";

type Crumb = { label: string; href?: string };

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  image: string;
  imageAlt?: string;
  crumbs?: Crumb[];
  /** Optional decorative overlay rendered above the image gradients but below content (e.g. RaindropOverlay). */
  overlay?: React.ReactNode;
};

export default function PageHero({ eyebrow, title, subtitle, image, imageAlt, crumbs, overlay }: Props) {
  return (
    <section className="relative pt-20 pb-24 lg:pt-28 lg:pb-32 overflow-hidden bg-secondary">
      <div className="absolute inset-0 z-0">
        <img
          src={image}
          alt={imageAlt ?? ""}
          aria-hidden={imageAlt ? undefined : true}
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-secondary/40" />
        {overlay}
      </div>

      <div className="container mx-auto max-w-7xl px-4 relative z-10">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-5 text-xs font-medium text-white/70">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              {crumbs.map((c, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-white/40" />
                  {c.href ? (
                    <Link href={c.href} className="hover:text-white">{c.label}</Link>
                  ) : (
                    <span className="text-white/90">{c.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/90 text-primary-foreground text-[11px] font-semibold tracking-wide uppercase shadow-lg backdrop-blur-md border border-white/20 mb-5">
            {eyebrow}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-[1.05] tracking-tight mb-5 drop-shadow-lg">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-gray-200/90 leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link
              href="/contact"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-7 py-4 rounded-full font-semibold text-base tracking-tight transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
            >
              Get Your Free Quote <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={`tel:${SITE.phoneTel}`}
              className="bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/25 text-white px-7 py-4 rounded-full font-semibold text-base tracking-tight transition-all duration-300 inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
            >
              <Phone className="w-4 h-4" />
              Call {SITE.phoneDisplay}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
