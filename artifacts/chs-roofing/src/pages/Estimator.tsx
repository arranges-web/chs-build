import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Calculator,
  Compass,
  HardHat,
  Info,
  MapPin,
  Phone,
  Ruler,
  ShieldCheck,
  Sparkles,
  Triangle,
} from "lucide-react";
import { Link } from "wouter";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import PageHero from "@/components/PageHero";
import CtaSection from "@/components/CtaSection";
import {
  ESTIMATOR_COMPLEXITY_OPTIONS,
  ESTIMATOR_MATERIALS,
  ESTIMATOR_PITCH_OPTIONS,
  FOUNDER_PHOTOS,
  SITE,
} from "@/lib/site-config";
import { api } from "@/lib/api";
import { CheckCircle2, Save } from "lucide-react";

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.45, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const fmtUSD = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

// Inline SVG icons for each material type — small, on-brand,
// no extra image assets required.
function ShingleIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 28h36M10 38h28" />
      <path d="M10 28l4-6h6l-4 6m6 0l4-6h6l-4 6m6 0l4-6h6l-4 6" />
    </svg>
  );
}

function StandingSeamIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 38L24 12l18 26" />
      <path d="M14 30l3.5-5M22 18l3.5-5M30 30l-3.5-5" />
    </svg>
  );
}

function FiveVIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 36h40M4 36l4-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4" />
      <path d="M4 36L24 10l20 26" />
    </svg>
  );
}

function TileIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 22c0 0 3-4 6-4s3 4 6 4 3-4 6-4 3 4 6 4 3-4 6-4 3 4 6 4" />
      <path d="M6 32c0 0 3-4 6-4s3 4 6 4 3-4 6-4 3 4 6 4 3-4 6-4 3 4 6 4" />
    </svg>
  );
}

function FlatRoofIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="22" width="36" height="14" rx="1" />
      <path d="M6 22h36M10 28h4M18 28h4M26 28h4M34 28h4" />
    </svg>
  );
}

const MATERIAL_ICONS: Record<string, (p: { className?: string }) => React.ReactElement> = {
  shingle: ShingleIcon,
  "metal-standing-seam": StandingSeamIcon,
  "metal-5v": FiveVIcon,
  "tile-on-tile": TileIcon,
  "tile-to-standing-seam": StandingSeamIcon,
};

// Visual roof-pitch silhouettes for each pitch option. Each one
// renders a tiny SVG of a roof at the right steepness so the
// customer can pick what matches their home.
function PitchVisual({ slug, className = "" }: { slug: string; className?: string }) {
  // Heights drive the apex height: bigger = steeper.
  const apex: Record<string, number> = {
    low: 4,
    standard: 12,
    steep: 22,
    "very-steep": 30,
  };
  const h = apex[slug] ?? 12;
  return (
    <svg
      viewBox="0 0 80 40"
      className={className}
      role="img"
      aria-label={`Pitch profile: ${slug}`}
    >
      {/* House body */}
      <rect x="8" y={40 - 12} width="64" height="12" fill="currentColor" opacity="0.12" />
      {/* Roof line */}
      <path
        d={`M4 ${40 - 12} L40 ${40 - 12 - h} L76 ${40 - 12} Z`}
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

export default function EstimatorPage() {
  const { t } = useTranslation();
  const [address, setAddress] = useState("");
  const [footprintInput, setFootprintInput] = useState<string>("2000");
  const [materialSlug, setMaterialSlug] =
    useState<(typeof ESTIMATOR_MATERIALS)[number]["slug"]>("shingle");
  const [colorOption, setColorOption] = useState(false);
  const [pitchSlug, setPitchSlug] =
    useState<(typeof ESTIMATOR_PITCH_OPTIONS)[number]["slug"]>("standard");
  // Default complexity = moderate so the estimate lands on the
  // founder's published starting price for an average roof.
  const [complexitySlug, setComplexitySlug] =
    useState<(typeof ESTIMATOR_COMPLEXITY_OPTIONS)[number]["slug"]>("moderate");

  // "Save my estimate" state — saves a snapshot to the admin portal
  // so the team can follow up.
  const [saveEmail, setSaveEmail] = useState("");
  const [saveName, setSaveName] = useState("");
  const [savePhone, setSavePhone] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveOpen, setSaveOpen] = useState(false);

  const material = ESTIMATOR_MATERIALS.find((m) => m.slug === materialSlug)!;
  const pitch = ESTIMATOR_PITCH_OPTIONS.find((p) => p.slug === pitchSlug)!;
  const complexity = ESTIMATOR_COMPLEXITY_OPTIONS.find((c) => c.slug === complexitySlug)!;

  // Per-material waste factor lives on the material itself. It is
  // applied ONCE as an area multiplier (more roof → more squares),
  // never as a price multiplier on top of an already-final price.
  const computed = useMemo(() => {
    const footprintSf = Math.max(0, Number(footprintInput) || 0);
    // 1) footprint × pitch = estimated roof area
    const adjustedSf = footprintSf * pitch.multiplier;
    // 2) + waste factor = total roof area
    const totalRoofArea = adjustedSf * (1 + material.wasteFactor);
    // 3) total roof area ÷ 100 = roofing squares
    const squares = totalRoofArea / 100;
    // Color toggle (when offered) switches to the higher internal
    // base — we do NOT add a flat $/sq on top of an already-tuned
    // base price.
    const useColorBase = material.colorOptionAvailable && colorOption;
    const basePrice = useColorBase
      ? (material as { internalBaseWithColor?: number }).internalBaseWithColor ??
        material.internalBase
      : material.internalBase;
    // 4) squares × internal base × complexity = starting estimate
    const subtotal = squares * basePrice * complexity.multiplier;
    const lowEstimate = subtotal * 0.92;
    const highEstimate = subtotal * 1.08;
    return {
      footprintSf,
      adjustedSf,
      totalRoofArea,
      squares,
      basePrice,
      subtotal,
      lowEstimate,
      highEstimate,
    };
  }, [footprintInput, pitch, material, colorOption, complexity]);

  const mapsEmbed = address.trim()
    ? `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=k&z=19&ie=UTF8&iwloc=&output=embed`
    : null;

  return (
    <>
      <PageHero
        eyebrow={t("estimator.eyebrow")}
        title={
          <>
            {t("estimator.titleStart")} <span className="text-primary">{t("estimator.titleAccent")}</span>
          </>
        }
        subtitle={t("estimator.subtitle")}
        image={FOUNDER_PHOTOS.flat[3]}
        imageAlt={t("estimator.imageAlt")}
        crumbs={[{ label: t("header.nav.estimator") }]}
      />

      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid lg:grid-cols-[1fr_460px] gap-8">
            {/* INPUT COLUMN */}
            <div className="space-y-6">
              {/* Address + satellite preview */}
              <FadeIn>
                <div className="bg-card border border-border/60 rounded-3xl p-6 md:p-7 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-bold tracking-tight text-foreground text-lg">
                        {t("estimator.address.title")}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                        {t("estimator.address.subtitle")}
                      </p>
                    </div>
                  </div>

                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={t("estimator.address.placeholder")}
                    autoComplete="street-address"
                    className="w-full h-11 px-4 rounded-xl border border-border/60 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label={t("estimator.address.title")}
                  />

                  {mapsEmbed ? (
                    <div className="mt-4 rounded-2xl overflow-hidden border border-border/60 bg-muted/40 aspect-video">
                      <iframe
                        title={`Satellite preview of ${address}`}
                        src={mapsEmbed}
                        className="w-full h-full block"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  ) : (
                    <div className="mt-4 rounded-2xl border border-dashed border-border/60 bg-muted/30 aspect-video flex flex-col items-center justify-center text-center px-6 text-muted-foreground">
                      <Compass className="w-7 h-7 text-primary/70 mb-2" />
                      <p className="text-sm font-semibold text-foreground">{t("estimator.address.preview")}</p>
                      <p className="text-xs mt-1 max-w-xs">
                        {t("estimator.address.previewBody")}
                      </p>
                    </div>
                  )}
                </div>
              </FadeIn>

              {/* Roof footprint + material */}
              <FadeIn delay={0.05}>
                <div className="bg-card border border-border/60 rounded-3xl p-6 md:p-7 shadow-sm space-y-6">
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Ruler className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display font-bold tracking-tight text-foreground text-lg">
                          {t("estimator.footprint.title")}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                          {t("estimator.footprint.subtitle")}
                        </p>
                      </div>
                    </div>
                    <div className="relative max-w-xs">
                      <input
                        type="number"
                        inputMode="numeric"
                        min={200}
                        step={50}
                        value={footprintInput}
                        onChange={(e) => setFootprintInput(e.target.value)}
                        className="w-full h-11 pl-4 pr-16 rounded-xl border border-border/60 bg-background text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        aria-label={t("estimator.footprint.title")}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                        {t("estimator.footprint.unit")}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display font-bold tracking-tight text-foreground text-lg">
                          {t("estimator.material.title")}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                          {t("estimator.material.subtitle")}
                        </p>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      {ESTIMATOR_MATERIALS.map((m) => {
                        const selected = m.slug === materialSlug;
                        const label = t(`estimator.material.items.${m.slug}.label`, { defaultValue: m.label });
                        const short = t(`estimator.material.items.${m.slug}.short`, { defaultValue: m.short });
                        const Icon = MATERIAL_ICONS[m.slug] ?? FlatRoofIcon;
                        return (
                          <button
                            key={m.slug}
                            type="button"
                            onClick={() => setMaterialSlug(m.slug)}
                            className={`text-left rounded-2xl border p-4 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                              selected
                                ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary/30"
                                : "border-border/60 bg-background hover:border-primary/40"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                                  selected ? "bg-primary text-white" : "bg-primary/10 text-primary"
                                }`}
                              >
                                <Icon className="w-6 h-6" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-foreground tracking-tight text-sm leading-tight">
                                  {label}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1 leading-snug">{short}</p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {material.colorOptionAvailable && (
                      <label className="mt-4 flex items-start gap-3 p-3.5 rounded-2xl bg-[hsl(var(--accent-gold))]/10 border border-[hsl(var(--accent-gold))]/30 cursor-pointer hover:bg-[hsl(var(--accent-gold))]/15 transition-colors">
                        <input
                          type="checkbox"
                          checked={colorOption}
                          onChange={(e) => setColorOption(e.target.checked)}
                          className="mt-0.5 w-4 h-4 accent-[hsl(var(--accent-gold))] cursor-pointer"
                        />
                        <span className="flex-1 text-sm">
                          <span className="font-semibold text-foreground block">
                            {t("estimator.material.colorOption")}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Adds a factory-baked color finish to your metal roof.
                          </span>
                        </span>
                      </label>
                    )}
                  </div>
                </div>
              </FadeIn>

              {/* Roof pitch with visual */}
              <FadeIn delay={0.1}>
                <div className="bg-card border border-border/60 rounded-3xl p-6 md:p-7 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Triangle className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-bold tracking-tight text-foreground text-lg">
                        {t("estimator.pitch.title")}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                        {t("estimator.pitch.subtitle")}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {ESTIMATOR_PITCH_OPTIONS.map((opt) => {
                      const selected = opt.slug === pitchSlug;
                      const label = t(`estimator.pitch.items.${opt.slug}`, { defaultValue: opt.label });
                      return (
                        <button
                          key={opt.slug}
                          type="button"
                          onClick={() => setPitchSlug(opt.slug)}
                          className={`text-center rounded-2xl border p-3 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                            selected
                              ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary/30"
                              : "border-border/60 bg-background hover:border-primary/40"
                          }`}
                          aria-pressed={selected}
                        >
                          <div
                            className={`mx-auto mb-2 w-full h-12 flex items-end justify-center ${
                              selected ? "text-primary" : "text-foreground/60"
                            }`}
                          >
                            <PitchVisual slug={opt.slug} className="w-full max-w-[80px] h-12" />
                          </div>
                          <p className="font-semibold text-sm text-foreground tracking-tight leading-tight">
                            {label}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </FadeIn>

              {/* Complexity */}
              <FadeIn delay={0.12}>
                <div className="bg-card border border-border/60 rounded-3xl p-6 md:p-7 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <HardHat className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-bold tracking-tight text-foreground text-lg">
                        {t("estimator.complexity.title")}
                      </h3>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-2.5">
                    {ESTIMATOR_COMPLEXITY_OPTIONS.map((opt) => {
                      const selected = opt.slug === complexitySlug;
                      const label = t(`estimator.complexity.items.${opt.slug}`, { defaultValue: opt.label });
                      return (
                        <button
                          key={opt.slug}
                          type="button"
                          onClick={() => setComplexitySlug(opt.slug)}
                          className={`text-left rounded-xl border p-3.5 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                            selected
                              ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                              : "border-border/60 bg-background hover:border-primary/40"
                          }`}
                          aria-pressed={selected}
                        >
                          <p className="font-semibold text-sm text-foreground tracking-tight leading-tight">
                            {label}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* RESULT COLUMN */}
            <div className="lg:sticky lg:top-24 self-start space-y-5">
              <div className="bg-secondary text-white border border-white/10 rounded-3xl p-6 md:p-7 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/40">
                      <Calculator className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary">
                        {t("estimator.result.label")}
                      </p>
                      <h3 className="font-display font-bold text-xl tracking-tight">
                        {t("estimator.result.title")}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-white/60 mb-1 uppercase tracking-[0.18em] font-semibold">
                    {t("estimator.result.rangeLabel")}
                  </p>
                  <p className="font-display font-bold text-3xl md:text-4xl tracking-tight text-white">
                    {fmtUSD(computed.lowEstimate)} – {fmtUSD(computed.highEstimate)}
                  </p>
                  <p className="text-[11px] text-white/60 mt-1">
                    {t("estimator.result.midpoint")} {fmtUSD(computed.subtotal)} ·{" "}
                    {t("estimator.result.squares", {
                      squares: computed.squares.toFixed(1),
                      sf: Math.round(computed.adjustedSf).toLocaleString(),
                    })}
                  </p>

                  <div className="mt-5 flex flex-col gap-2">
                    <Link
                      href="/contact"
                      className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-3 rounded-xl font-semibold text-sm tracking-tight shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all"
                    >
                      {t("estimator.result.ctaInspect")}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <a
                      href={`tel:${SITE.phoneTel}`}
                      className="w-full inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white px-5 py-3 rounded-xl font-semibold text-sm tracking-tight transition-all"
                    >
                      <Phone className="w-4 h-4" />
                      {t("common.callLabel", { phone: SITE.phoneDisplay })}
                    </a>

                    {/* Save my estimate */}
                    {!saveOpen && saveStatus !== "saved" && (
                      <button
                        type="button"
                        onClick={() => setSaveOpen(true)}
                        className="w-full inline-flex items-center justify-center gap-2 text-white/85 hover:text-white text-xs font-semibold tracking-tight py-2 transition-colors"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Save my estimate & get a follow-up
                      </button>
                    )}
                    {saveOpen && saveStatus !== "saved" && (
                      <div className="mt-2 p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                        <input
                          value={saveName}
                          onChange={(e) => setSaveName(e.target.value)}
                          placeholder="Your name"
                          className="w-full h-9 px-3 rounded-lg bg-white/10 border border-white/10 text-white text-sm placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                        />
                        <input
                          value={savePhone}
                          onChange={(e) => setSavePhone(e.target.value)}
                          placeholder="Phone"
                          type="tel"
                          inputMode="tel"
                          className="w-full h-9 px-3 rounded-lg bg-white/10 border border-white/10 text-white text-sm placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                        />
                        <input
                          value={saveEmail}
                          onChange={(e) => setSaveEmail(e.target.value)}
                          placeholder="Email"
                          type="email"
                          inputMode="email"
                          className="w-full h-9 px-3 rounded-lg bg-white/10 border border-white/10 text-white text-sm placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                        />
                        {saveStatus === "error" && (
                          <p className="text-[11px] text-rose-300">
                            Save failed. Please try again or call us.
                          </p>
                        )}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={async () => {
                              setSaveStatus("saving");
                              const res = await api.submitEstimate({
                                name: saveName || null,
                                phone: savePhone || null,
                                email: saveEmail || null,
                                address: address || null,
                                material: material.slug,
                                colorOption: colorOption ? "yes" : "no",
                                pitch: pitch.slug,
                                complexity: complexity.slug,
                                footprintSf: String(computed.footprintSf),
                                squares: computed.squares.toFixed(1),
                                lowEstimate: computed.lowEstimate.toFixed(0),
                                highEstimate: computed.highEstimate.toFixed(0),
                                midEstimate: computed.subtotal.toFixed(0),
                                source: "estimator",
                              });
                              setSaveStatus(res ? "saved" : "error");
                            }}
                            disabled={saveStatus === "saving"}
                            className="flex-1 inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors disabled:opacity-60"
                          >
                            <Save className="w-3.5 h-3.5" />
                            {saveStatus === "saving" ? "Saving…" : "Save estimate"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setSaveOpen(false)}
                            className="text-xs text-white/60 hover:text-white px-2"
                          >
                            Cancel
                          </button>
                        </div>
                        <p className="text-[10px] text-white/50 leading-relaxed">
                          We'll save this estimate to your account and a CHS rep
                          will follow up. Your info is never sold or shared.
                        </p>
                      </div>
                    )}
                    {saveStatus === "saved" && (
                      <div className="mt-2 p-3 rounded-xl bg-primary/15 border border-primary/30 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-[12px] text-white/90 leading-relaxed">
                          Estimate saved. We'll reach out within one business day.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-[hsl(var(--accent-gold))]/10 border border-[hsl(var(--accent-gold))]/30 rounded-2xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[hsl(var(--accent-gold))] shrink-0 mt-0.5" />
                <p
                  className="text-xs text-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: t("estimator.disclaimer") }}
                />
              </div>

              <div className="bg-card border border-border/60 rounded-2xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t("estimator.rateNote", { region: SITE.region })}
                </p>
              </div>

              <div className="bg-card border border-border/60 rounded-2xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t("estimator.comingSoon")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaSection
        title={
          <>
            {t("estimator.ctaTitle")} <span className="text-primary">{t("estimator.ctaTitleAccent")}</span>
          </>
        }
        subtitle={t("estimator.ctaSubtitle")}
      />
    </>
  );
}
