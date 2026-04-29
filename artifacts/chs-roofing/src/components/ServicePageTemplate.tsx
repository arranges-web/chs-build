import { motion } from "framer-motion";
import { Link } from "wouter";
import { CheckCircle, ArrowRight } from "lucide-react";
import PageHero from "./PageHero";
import CtaSection from "./CtaSection";
import ProcessTimeline from "./ProcessTimeline";
import FAQ from "./FAQ";
import { TESTIMONIALS, SITE } from "@/lib/site-config";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  image: string;
  imageAlt?: string;
  crumbs?: { label: string; href?: string }[];
  intro: React.ReactNode;
  included: { title: string; desc: string }[];
  testimonialIndices?: number[];
  showProcess?: boolean;
  showFaq?: boolean;
  extra?: React.ReactNode;
};

export default function ServicePageTemplate({
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt,
  crumbs,
  intro,
  included,
  testimonialIndices = [0, 3, 5],
  showProcess = true,
  showFaq = true,
  extra,
}: Props) {
  const reviews = testimonialIndices.map(i => TESTIMONIALS[i]).filter(Boolean);

  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        image={image}
        imageAlt={imageAlt}
        crumbs={crumbs}
      />

      {/* Intro */}
      <section className="py-20 bg-background bg-wash-warm">
        <div className="container mx-auto max-w-4xl px-4 prose-headings:font-display prose-headings:tracking-tight">
          <div className="text-lg md:text-xl text-foreground leading-relaxed space-y-5">{intro}</div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 bg-muted/40">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h4 className="text-primary font-semibold tracking-[0.2em] uppercase mb-3 text-xs">What's Included</h4>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground leading-[1.05]">
              Every detail. Done right.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {included.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm hover:shadow-md lift-on-hover"
              >
                <CheckCircle className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-display font-bold tracking-tight text-foreground text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {extra}

      {showProcess && <ProcessTimeline />}

      {/* Reviews */}
      <section className="py-20 bg-background">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h4 className="text-primary font-semibold tracking-[0.2em] uppercase mb-3 text-xs">5-Star Reviews</h4>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground leading-[1.05]">
              What our clients say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <div key={i} className="bg-card border border-border/60 p-7 rounded-2xl shadow-sm flex flex-col">
                <div className="flex gap-1 mb-3 text-primary">
                  {[...Array(5)].map((_, j) => <span key={j} className="text-lg">★</span>)}
                </div>
                <p className="text-foreground italic mb-5 flex-grow leading-relaxed">"{r.text}"</p>
                <div>
                  <p className="font-bold text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.date}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/gallery/residential"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              See more of our work <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {showFaq && <FAQ />}

      <CtaSection />
    </>
  );
}
