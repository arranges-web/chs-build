import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Calculator,
  Clipboard,
  Compass,
  HardHat,
  Home as HomeIcon,
  Info,
  MapPin,
  Phone,
  Ruler,
  ShieldCheck,
  Sparkles,
  Wrench,
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
  ESTIMATOR_WASTE_OPTIONS,
  PHOTOS,
  SITE,
} from "@/lib/site-config";

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

export default function EstimatorPage() {
  const { t } = useTranslation();
  const [address, setAddress] = useState("");
  const [footprintInput, setFootprintInput] = useState<string>("2000");
  const [materialSlug, setMaterialSlug] =
    useState<(typeof ESTIMATOR_MATERIALS)[number]["slug"]>("shingle");
  const [colorOption, setColorOption] = useState(false);
  const [pitchSlug, setPitchSlug] =
    useState<(typeof ESTIMATOR_PITCH_OPTIONS)[number]["slug"]>("standard");
  const [complexitySlug, setComplexitySlug] =
    useState<(typeof ESTIMATOR_COMPLEXITY_OPTIONS)[number]["slug"]>("simple");
  const [wasteSlug, setWasteSlug] =
    useState<(typeof ESTIMATOR_WASTE_OPTIONS)[number]["slug"]>("standard");
  const [permitInput, setPermitInput] = useState<string>("750");
  const [deckingInput, setDeckingInput] = useState<string>("500");

  const material = ESTIMATOR_MATERIALS.find((m) => m.slug === materialSlug)!;
  const pitch = ESTIMATOR_PITCH_OPTIONS.find((p) => p.slug === pitchSlug)!;
  const complexity = ESTIMATOR_COMPLEXITY_OPTIONS.find((c) => c.slug === complexitySlug)!;
  const waste = ESTIMATOR_WASTE_OPTIONS.find((w) => w.slug === wasteSlug)!;

  const computed = useMemo(() => {
    const footprintSf = Math.max(0, Number(footprintInput) || 0);
    const permit = Math.max(0, Number(permitInput) || 0);
    const decking = Math.max(0, Number(deckingInput) || 0);
    const adjustedSf = footprintSf * pitch.multiplier;
    const squares = adjustedSf / 100;
    const colorAdder =
      material.colorOptionAvailable && colorOption
        ? (material as { colorAdderPerSquare?: number }).colorAdderPerSquare ?? 0
        : 0;
    const perSquareTotal = material.pricePerSquare + colorAdder;
    const baseMaterial = squares * perSquareTotal;
    const complexityAdj = baseMaterial * (complexity.multiplier - 1);
    const wasteAdj = (baseMaterial + complexityAdj) * waste.value;
    const subtotal = baseMaterial + complexityAdj + wasteAdj + permit + decking;
    const lowEstimate = subtotal * 0.92;
    const highEstimate = subtotal * 1.08;
    return {
      footprintSf,
      adjustedSf,
      squares,
      colorAdder,
      perSquareTotal,
      baseMaterial,
      complexityAdj,
      wasteAdj,
      permit,
      decking,
      subtotal,
      lowEstimate,
      highEstimate,
    };
  }, [footprintInput, permitInput, deckingInput, pitch, material, colorOption, complexity, waste]);

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
        image={PHOTOS.beachfrontMetal}
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
                            <div className="flex items-baseline justify-between gap-2">
                              <p className="font-semibold text-foreground tracking-tight text-sm leading-tight">
                                {label}
                              </p>
                              <p className="font-display font-bold text-primary text-sm whitespace-nowrap">
                                ${m.pricePerSquare}{t("estimator.material.perSquare")}
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1.5 leading-snug">{short}</p>
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
                            {t("estimator.material.colorOptionDesc", { adder: (material as { colorAdderPerSquare?: number }).colorAdderPerSquare ?? 0 })}
                          </span>
                        </span>
                      </label>
                    )}
                  </div>
                </div>
              </FadeIn>

              {/* Pitch / complexity / waste */}
              <FadeIn delay={0.1}>
                <div className="bg-card border border-border/60 rounded-3xl p-6 md:p-7 shadow-sm space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <HomeIcon className="w-4.5 h-4.5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold tracking-tight text-foreground text-base">
                          {t("estimator.pitch.title")}
                        </h3>
                      </div>
                    </div>
                    <Picker
                      options={ESTIMATOR_PITCH_OPTIONS.map((o) => ({
                        slug: o.slug,
                        label: t(`estimator.pitch.items.${o.slug}`, { defaultValue: o.label }),
                        sub: `×${o.multiplier.toFixed(2)} ${t("estimator.pitch.areaSuffix")}`,
                      }))}
                      value={pitchSlug}
                      onChange={(v) => setPitchSlug(v as typeof pitchSlug)}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <HardHat className="w-4.5 h-4.5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold tracking-tight text-foreground text-base">
                          {t("estimator.complexity.title")}
                        </h3>
                      </div>
                    </div>
                    <Picker
                      options={ESTIMATOR_COMPLEXITY_OPTIONS.map((o) => ({
                        slug: o.slug,
                        label: t(`estimator.complexity.items.${o.slug}`, { defaultValue: o.label }),
                        sub: `×${o.multiplier.toFixed(2)}`,
                      }))}
                      value={complexitySlug}
                      onChange={(v) => setComplexitySlug(v as typeof complexitySlug)}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Wrench className="w-4.5 h-4.5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold tracking-tight text-foreground text-base">
                          {t("estimator.waste.title")}
                        </h3>
                      </div>
                    </div>
                    <Picker
                      options={ESTIMATOR_WASTE_OPTIONS.map((o) => ({
                        slug: o.slug,
                        label: t(`estimator.waste.items.${o.slug}`, { defaultValue: o.label }),
                      }))}
                      value={wasteSlug}
                      onChange={(v) => setWasteSlug(v as typeof wasteSlug)}
                    />
                  </div>
                </div>
              </FadeIn>

              {/* Allowances */}
              <FadeIn delay={0.15}>
                <div className="bg-card border border-border/60 rounded-3xl p-6 md:p-7 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Clipboard className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-bold tracking-tight text-foreground text-lg">
                        {t("estimator.allowances.title")}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                        {t("estimator.allowances.subtitle")}
                      </p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        {t("estimator.allowances.permit")}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                        <input
                          type="number"
                          inputMode="numeric"
                          min={0}
                          step={50}
                          value={permitInput}
                          onChange={(e) => setPermitInput(e.target.value)}
                          className="w-full h-10 pl-7 pr-3 rounded-xl border border-border/60 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          aria-label={t("estimator.allowances.permit")}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        {t("estimator.allowances.decking")}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                        <input
                          type="number"
                          inputMode="numeric"
                          min={0}
                          step={50}
                          value={deckingInput}
                          onChange={(e) => setDeckingInput(e.target.value)}
                          className="w-full h-10 pl-7 pr-3 rounded-xl border border-border/60 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          aria-label={t("estimator.allowances.decking")}
                        />
                      </div>
                    </div>
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

                  <div className="mt-5 pt-5 border-t border-white/10 space-y-2 text-sm">
                    <Row
                      label={`${t(`estimator.material.items.${material.slug}.label`, { defaultValue: material.label })}${colorOption && material.colorOptionAvailable ? ` + ${t("estimator.material.colorOption")}` : ""}`}
                      value={`${computed.squares.toFixed(1)} sq × ${fmtUSD(computed.perSquareTotal)} = ${fmtUSD(computed.baseMaterial)}`}
                    />
                    {computed.complexityAdj > 0 && (
                      <Row
                        label={t("estimator.result.rows.complexity", {
                          label: t(`estimator.complexity.items.${complexity.slug}`, { defaultValue: complexity.label }).split(" (")[0],
                        })}
                        value={fmtUSD(computed.complexityAdj)}
                      />
                    )}
                    <Row
                      label={t("estimator.result.rows.waste", { pct: t(`estimator.waste.items.${waste.slug}`, { defaultValue: waste.label }) })}
                      value={fmtUSD(computed.wasteAdj)}
                    />
                    <Row label={t("estimator.result.rows.permit")} value={fmtUSD(computed.permit)} />
                    <Row label={t("estimator.result.rows.decking")} value={fmtUSD(computed.decking)} />
                    <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.18em] font-semibold text-white/70">
                        {t("estimator.result.rows.total")}
                      </span>
                      <span className="font-display font-bold text-lg text-primary">
                        {fmtUSD(computed.subtotal)}
                      </span>
                    </div>
                  </div>

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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="text-white/70">{label}</span>
      <span className="font-semibold text-white whitespace-nowrap">{value}</span>
    </div>
  );
}

function Picker({
  options,
  value,
  onChange,
}: {
  options: { slug: string; label: string; sub?: string }[];
  value: string;
  onChange: (slug: string) => void;
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-2">
      {options.map((opt) => {
        const selected = opt.slug === value;
        return (
          <button
            key={opt.slug}
            type="button"
            onClick={() => onChange(opt.slug)}
            className={`text-left rounded-xl border p-3 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              selected
                ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                : "border-border/60 bg-background hover:border-primary/40"
            }`}
          >
            <p className="font-semibold text-sm text-foreground tracking-tight leading-tight">
              {opt.label}
            </p>
            {opt.sub && <p className="text-[11px] text-muted-foreground mt-0.5">{opt.sub}</p>}
          </button>
        );
      })}
    </div>
  );
}
