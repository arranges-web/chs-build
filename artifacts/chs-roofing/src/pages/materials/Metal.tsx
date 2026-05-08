import { motion } from "framer-motion";
import MaterialPageTemplate from "@/components/MaterialPageTemplate";
import { FOUNDER_PHOTOS, PHOTOS } from "@/lib/site-config";

const VARIANTS = [
  {
    name: "Standing Seam Metal Roofing",
    desc: "Concealed-fastener metal panels with raised vertical seams that lock together. The most premium and weather-tight metal system available — ideal for coastal homes that need maximum hurricane protection and a clean, modern look.",
    bullets: [
      "Concealed fasteners — no exposed screws to fail or leak",
      "Mechanical or snap-lock seams for maximum wind uplift",
      "Architectural Kynar PVDF finishes with 35-year color warranty",
      "Best for high-end residential, modern, and coastal homes",
    ],
    image: FOUNDER_PHOTOS.metalStandingSeam,
    fallbackImage: PHOTOS.whiteStandingSeam,
    accent: "primary" as const,
  },
  {
    name: "5V Metal Roofing",
    desc: "5V metal roofing is a strong, durable, and cost-effective metal roof option for Florida homes and buildings. It gives the property a clean traditional metal look while providing excellent protection against heavy rain, heat, and high winds. A great choice for homeowners who want the durability of metal with a more classic exposed-fastener style.",
    bullets: [
      "Lower cost than standing seam — same metal durability",
      "Classic ribbed profile with exposed fasteners",
      "Fast install with proven hurricane wind ratings",
      "Best for cottages, ranches, agricultural buildings, and value-focused projects",
    ],
    image: FOUNDER_PHOTOS.metal5V,
    fallbackImage: PHOTOS.silverMetalPorch,
    accent: "gold" as const,
  },
];

function MetalVariants() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h4 className="text-primary font-semibold tracking-[0.2em] uppercase mb-3 text-xs">Two Metal Systems</h4>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground leading-[1.05]">
            Standing Seam vs. 5V Metal
          </h2>
          <p className="text-muted-foreground mt-5 text-lg leading-relaxed max-w-2xl mx-auto">
            We install both — and we'll tell you honestly which fits your home, budget, and look. Here's the difference at a glance.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {VARIANTS.map((v, i) => {
            const isGold = v.accent === "gold";
            return (
              <motion.div
                key={v.name}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className={`bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col border ${
                  isGold ? "border-[hsl(var(--accent-gold))]/40" : "border-primary/30"
                }`}
              >
                <div className="h-56 overflow-hidden relative bg-muted/30">
                  <img
                    loading="lazy"
                    src={v.image}
                    alt={v.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div
                    className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.18em] ${
                      isGold
                        ? "bg-[hsl(var(--accent-gold))]/20 text-[hsl(var(--accent-gold))] border border-[hsl(var(--accent-gold))]/40"
                        : "bg-primary/20 text-primary border border-primary/40"
                    }`}
                  >
                    {isGold ? "Value · Classic" : "Premium · Coastal"}
                  </div>
                  <h3 className="absolute bottom-4 left-5 right-5 font-display font-bold tracking-tight text-white text-2xl drop-shadow">
                    {v.name}
                  </h3>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{v.desc}</p>
                  <ul className="space-y-2 mt-auto">
                    {v.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-foreground">
                        <span
                          className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${
                            isGold ? "bg-[hsl(var(--accent-gold))]" : "bg-primary"
                          }`}
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function Metal() {
  return (
    <MaterialPageTemplate
      slug="metal"
      intro={
        <>
          <p>
            Metal is the gold standard for hurricane resistance in Southwest Florida. We install two distinct systems — premium <strong>standing seam</strong> with concealed fasteners and a classic <strong>5V exposed-fastener</strong> profile — so you can match your roof to your home, budget, and aesthetic.
          </p>
          <p>
            Both systems are engineered for Florida wind ratings, paired with high-temperature underlayments, and finished with factory-baked color systems. Lifetime materials, lifetime peace of mind.
          </p>
        </>
      }
      pros={[
        "50+ year service life",
        "Highest wind resistance of any roof type",
        "Energy efficient — reflects up to 70% of solar heat",
        "Fully recyclable, 100% sustainable",
        "Lowest maintenance of any roof material",
        "Insurance discounts on most policies",
        "Premium curb appeal and resale value",
      ]}
      cons={[
        "Higher up-front cost than shingles",
        "Requires experienced installer (we are that installer)",
        "Can be louder during heavy rain without proper underlayment",
        "Finish color matching for additions can be difficult years later",
      ]}
      bestFor={[
        "Coastal homes facing salt air and hurricane wind",
        "Owners planning to stay 20+ years",
        "Homes seeking the highest insurance discounts",
        "Modern, ranch, or coastal-contemporary architecture",
        "Solar-ready homes",
      ]}
      manufacturers={["Metal Alliance", "ABC Supply"]}
      galleryImages={[
        { src: PHOTOS.whiteStandingSeam, alt: "White standing-seam metal roof on a Cape Coral waterfront home" },
        { src: PHOTOS.beachfrontMetal, alt: "Standing-seam metal roof on a Sanibel beachfront residence" },
        { src: PHOTOS.darkMetalAerial, alt: "Finished dark metal roof aerial view, Southwest Florida" },
        { src: PHOTOS.silverMetalPoolCage, alt: "Silver metal roof with pool cage, Punta Gorda" },
      ]}
      extra={<MetalVariants />}
    />
  );
}
