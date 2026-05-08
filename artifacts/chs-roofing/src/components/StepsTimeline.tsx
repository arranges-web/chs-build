import { motion } from "framer-motion";

type Step = {
  title: string;
  desc: string;
  image?: string;
  imageAlt?: string;
};

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  steps: Step[];
  /** Background tone — defaults to bg-background. */
  background?: string;
  /** Show numbered badges (default true). */
  numbered?: boolean;
};

/**
 * Generic numbered process timeline used on service pages that need
 * a tailored set of steps (Repair / Gutters / Roof Coating). Renders
 * a card per step with an optional image, an icon-style number badge,
 * and a clean title/desc pair. Falls back gracefully if no images
 * are supplied (text-only timeline).
 */
export default function StepsTimeline({
  eyebrow,
  title,
  subtitle,
  steps,
  background = "bg-background",
  numbered = true,
}: Props) {
  const hasImages = steps.some((s) => s.image);
  const cols = steps.length <= 3 ? "lg:grid-cols-3" : steps.length <= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";

  return (
    <section className={`py-24 ${background}`}>
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          {eyebrow && (
            <h4 className="text-primary font-semibold tracking-[0.2em] uppercase mb-3 text-xs">
              {eyebrow}
            </h4>
          )}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground leading-[1.05]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-muted-foreground mt-5 text-lg leading-relaxed max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 ${cols} gap-5`}>
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.06 }}
              className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col"
            >
              {hasImages && (
                <div className="relative h-40 bg-muted/40 overflow-hidden">
                  {s.image ? (
                    <img
                      loading="lazy"
                      decoding="async"
                      src={s.image}
                      alt={s.imageAlt ?? s.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/10"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  {numbered && (
                    <div className="absolute top-3 left-3 w-9 h-9 rounded-full bg-primary text-white font-display font-bold text-sm flex items-center justify-center shadow-md shadow-primary/40 border-2 border-white">
                      {i + 1}
                    </div>
                  )}
                </div>
              )}
              <div className="p-5 flex-1">
                <div className="flex items-start gap-3 mb-2">
                  {numbered && !hasImages && (
                    <div className="w-9 h-9 rounded-full bg-primary text-white font-display font-bold text-sm flex items-center justify-center shadow-md shadow-primary/30 shrink-0">
                      {i + 1}
                    </div>
                  )}
                  <h3 className="font-display font-bold tracking-tight text-foreground text-lg leading-tight">
                    {s.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
