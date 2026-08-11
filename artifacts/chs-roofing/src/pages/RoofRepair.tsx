import { useEffect } from "react";
import { Link } from "wouter";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Award,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  CloudLightning,
  Droplets,
  Facebook,
  FileText,
  Hammer,
  HardHat,
  Home as HomeIcon,
  Instagram,
  Layers,
  MapPin,
  MessageSquare,
  Phone,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Wind,
  Wrench,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import RepairForm from "@/components/RepairForm";
import BBBBadges from "@/components/BBBBadges";
import { GoogleReviewsBadge } from "@/components/GoogleLogo";
import Seo, { faqSchema } from "@/components/Seo";
import { usePageViewTracker } from "@/hooks/usePageViewTracker";
import { FOUNDER_PHOTOS, PHOTOS, SITE, TESTIMONIALS } from "@/lib/site-config";
import { gaEvent } from "@/lib/gtag";

/**
 * /roof-repair — Meta Ads landing page for the repair-starting-at-
 * $250 campaign. Standalone layout (minimal nav, sticky mobile
 * Call/Schedule buttons) matching the /free-roof-inspection
 * pattern. Meta Pixel Lead + GA4 events fire only from the
 * dedicated /thank-you-repair thank-you page.
 */

const WARNING_SIGNS = [
  { icon: Droplets, label: "Water stains on ceilings" },
  { icon: AlertTriangle, label: "Active roof leaks" },
  { icon: Layers, label: "Missing shingles" },
  { icon: Wind, label: "Lifted shingles" },
  { icon: Shield, label: "Damaged tile roofs" },
  { icon: Activity, label: "Flat roof ponding" },
  { icon: CloudLightning, label: "Roof leaks after storms" },
  { icon: HomeIcon, label: "Interior water damage" },
  { icon: Hammer, label: "Flashing failures" },
  { icon: Wrench, label: "Pipe boot leaks" },
] as const;

const INSPECTION_INCLUDES = [
  "Complete roof inspection",
  "Leak source identification",
  "Photo documentation",
  "Attic inspection (when accessible)",
  "Flashing inspection",
  "Pipe boot inspection",
  "Roof ventilation inspection",
  "Underlayment evaluation",
  "Written repair recommendations",
  "Estimate with no obligation",
];

type RepairCategory = {
  title: string;
  icon: typeof Wrench;
  items: string[];
};

const REPAIR_CATEGORIES: RepairCategory[] = [
  {
    title: "Shingle Roof Repair",
    icon: Layers,
    items: ["Missing shingles", "Storm damage", "Flashing", "Leaks"],
  },
  {
    title: "Tile Roof Repair",
    icon: Shield,
    items: ["Broken tiles", "Mortar repair", "Leaks", "Underlayment repairs"],
  },
  {
    title: "Metal Roof Repair",
    icon: Wind,
    items: ["Fastener replacement", "Sealants", "Flashing", "Leaks"],
  },
  {
    title: "Flat Roof Repair",
    icon: Activity,
    items: ["TPO", "Modified Bitumen", "Silicone coatings", "PVC", "BUR"],
  },
  {
    title: "Emergency Storm Damage",
    icon: CloudLightning,
    items: [
      "Temporary tarping",
      "Leak mitigation",
      "Storm inspections",
      "Insurance documentation",
    ],
  },
];

const WHY_HOMEOWNERS = [
  {
    icon: ClipboardCheck,
    title: "Honest Inspections",
    body: "If your roof can be repaired, we'll tell you. We don't push replacements when a repair is the right call.",
  },
  {
    icon: ShieldCheck,
    title: "Licensed Professionals",
    body: `Florida Roofing License ${SITE.license} — fully licensed and insured.`,
  },
  {
    icon: Camera,
    title: "Photo Reports",
    body: "Receive detailed photos showing exactly what we found on your roof.",
  },
  {
    icon: Award,
    title: "No High-Pressure Sales",
    body: "We explain the problem, walk you through options, and let you decide.",
  },
  {
    icon: MapPin,
    title: "Local Company",
    body: `Proudly serving Southwest Florida since ${SITE.established}.`,
  },
];

const FAQS = [
  {
    q: "How much do roof repairs cost?",
    a: "Roof repairs start at $250 depending on the extent of the damage. After a free inspection we'll give you a written estimate with no obligation so you know exactly what the repair will cost.",
  },
  {
    q: "Can my roof be repaired instead of replaced?",
    a: "Many roofs can be repaired. We'll inspect it first and provide honest recommendations — if a repair is possible we'll do the repair, not push you into a full replacement.",
  },
  {
    q: "How quickly can someone come out?",
    a: "Same-day or next-day appointments may be available depending on scheduling. Call CHS Roofing at " + SITE.phoneDisplay + " for the fastest response, especially for active leaks.",
  },
  {
    q: "Do you repair all roof types?",
    a: "Yes — asphalt shingle, tile, metal (standing seam and exposed-fastener), flat / low-slope, and commercial roofing systems.",
  },
  {
    q: "Do you offer emergency service?",
    a: "Yes — emergency leak inspections and temporary tarping/protection are available. Call " + SITE.phoneDisplay + " and we'll route you to the on-call team.",
  },
  {
    q: "Will my repair be covered by a warranty?",
    a: "Qualifying repairs come with our 10-year workmanship warranty. We walk you through what's covered before you sign — no fine-print surprises.",
  },
  {
    q: "Do you work with insurance claims?",
    a: "We document every visible finding with photos and provide a written report you can hand to your adjuster. We don't determine coverage or guarantee approval — that's between you and your carrier — but a thorough report has helped a lot of SWFL homeowners get their claims covered.",
  },
  {
    q: "What if my leak comes back after the repair?",
    a: "Call us. Repairs are backed by our workmanship warranty for qualifying work, and if something we fixed isn't holding up, we come back out and make it right.",
  },
  {
    q: "Do I need to be home for the inspection?",
    a: "It's preferred but not required. Access arrangements and inspection findings can be discussed in advance — call the office to set up a time that works for you.",
  },
  {
    q: "How long does a typical repair take?",
    a: "Most residential repairs are completed the same day the crew arrives. Larger repairs or those requiring materials to be ordered may take longer — we'll tell you upfront when we deliver the estimate.",
  },
  {
    q: "Are you licensed and insured?",
    a: `Yes. ${SITE.legalName} (${SITE.brand}) is a fully licensed and insured Florida roofing contractor — License ${SITE.license}. Verify at MyFloridaLicense.com.`,
  },
];

const BEFORE_AFTER =
  FOUNDER_PHOTOS.beforeAfter.length > 0
    ? FOUNDER_PHOTOS.beforeAfter
    : ([] as ReadonlyArray<{ before: string; after: string }>);

// LocalBusiness + RoofingContractor schema as spec'd. This overrides
// nothing site-wide — the base RoofingContractor is also in index.html
// but this page-specific block scopes the offer to repair services.
const REPAIR_SCHEMA = {
  "@context": "https://schema.org",
  "@type": ["RoofingContractor", "LocalBusiness"],
  name: SITE.brand,
  legalName: SITE.legalName,
  url: "https://chs-roofing.com/roof-repair",
  telephone: SITE.phoneTel,
  email: SITE.email,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cape Coral",
    addressRegion: "FL",
    postalCode: "33904",
    addressCountry: "US",
  },
  areaServed: [
    "Naples",
    "Bonita Springs",
    "Estero",
    "Fort Myers",
    "Cape Coral",
    "Lehigh Acres",
    "Punta Gorda",
    "Port Charlotte",
    "North Port",
    "Marco Island",
    "Sarasota",
  ].map((name) => ({ "@type": "City", name })),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Roof repair services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Shingle Roof Repair" }, priceCurrency: "USD", price: "250", priceSpecification: { "@type": "PriceSpecification", priceCurrency: "USD", price: "250", description: "Starting at" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Tile Roof Repair" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Metal Roof Repair" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Flat Roof Repair" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Emergency Storm Damage Repair" } },
    ],
  },
};

export default function RoofRepair() {
  const { t } = useTranslation();
  usePageViewTracker();
  void t;

  useEffect(() => {
    const previous = document.title;
    document.title = `Roof Repair Starting at $250 | ${SITE.brand} SWFL`;
    gaEvent("view_roof_repair_page", { landing_page: "roof-repair" });
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Seo
        title="Roof Repair Starting at $250 | CHS Roofing SWFL"
        description="Fast, honest roof repairs from a licensed Florida roofing contractor. Leaks, storm damage, shingle, tile, metal, and flat roof repairs across Southwest Florida. Free inspection with no obligation."
        path="/roof-repair"
        jsonLd={[faqSchema(FAQS), REPAIR_SCHEMA]}
      />

      {/* Minimal sticky header */}
      {/* Bright top strip — makes the phone number impossible to miss.
          Client asked for a more prominent phone near the top of the
          page; this always-visible bar delivers that on both desktop
          and mobile. */}
      <div className="bg-primary text-white text-center py-2 px-3 text-[13px] font-semibold">
        <a
          href={`tel:${SITE.phoneTel}`}
          onClick={() => gaEvent("click_to_call", { location: "top-strip" })}
          className="inline-flex items-center gap-1.5 hover:underline"
        >
          <Phone className="w-3.5 h-3.5" />
          Roof leaking? Call {SITE.phoneDisplay} for a same-day or next-day inspection
        </a>
      </div>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-border/60">
        <div className="container mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label={`${SITE.brand} home`}>
            <img src={SITE.logo} alt={`${SITE.brand} logo`} className="w-10 h-10 md:w-12 md:h-12 object-contain" />
            <div className="flex flex-col">
              <span className="font-display text-sm md:text-base font-bold tracking-tight text-foreground leading-none">
                {SITE.brand}
              </span>
              <span className="hidden sm:block text-[10px] text-muted-foreground font-semibold tracking-[0.18em] uppercase mt-1">
                FL License {SITE.license} · Licensed & Insured
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Phone rendered as a red pill so it doesn't lose out to
                the schedule CTA — client asked for the phone number
                to be more prominent near the top. */}
            <a
              href={`tel:${SITE.phoneTel}`}
              onClick={() => gaEvent("click_to_call", { location: "header" })}
              className="inline-flex items-center gap-1.5 bg-card border-2 border-primary text-primary px-3 sm:px-4 h-10 rounded-full font-bold text-sm tracking-tight hover:bg-primary hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">{SITE.phoneDisplay}</span>
              <span className="sm:hidden">Call</span>
            </a>
            <a
              href="#quote-form"
              className="hidden sm:inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-full font-semibold text-sm tracking-tight shadow-md shadow-primary/30 transition-all"
            >
              Schedule Inspection
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ─── HERO ─────────────────────────────────────────────── */}
        <section className="relative pt-10 pb-14 lg:pt-14 lg:pb-20 overflow-hidden bg-secondary">
          <div className="absolute inset-0 z-0">
            <img
              src={PHOTOS.flatPrepRedLine}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover object-center"
              fetchPriority="high"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/85 to-secondary/55" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-secondary/40" />
          </div>

          <div className="container mx-auto max-w-6xl px-4 relative z-10">
            <div className="grid lg:grid-cols-[1.05fr_1fr] gap-8 items-start lg:items-center">
              <div className="text-white">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/90 text-primary-foreground text-[11px] font-semibold tracking-wide uppercase shadow-md backdrop-blur-md border border-white/20 mb-5">
                  <Wrench className="w-3.5 h-3.5" />
                  Roof Repair · Starting at $250
                </div>
                <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05] mb-5 drop-shadow-lg">
                  Roof Leak?{" "}
                  <span className="text-primary">Get It Fixed Before It Gets Worse.</span>
                </h1>

                {/* Trust statement — client asked for a line right
                    under the headline highlighting family-owned +
                    license + honest recommendations. Kept short so
                    it reads as trust, not a wall of text. */}
                <p className="text-[14px] font-semibold text-white/95 mb-5 max-w-xl inline-flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="inline-flex items-center gap-1.5">
                    <HomeIcon className="w-3.5 h-3.5 text-primary" />
                    Family-owned
                  </span>
                  <span className="text-white/40">·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                    FL License {SITE.license}
                  </span>
                  <span className="text-white/40">·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <ClipboardCheck className="w-3.5 h-3.5 text-primary" />
                    Honest recommendations
                  </span>
                </p>

                <p className="text-lg md:text-xl text-gray-200/95 leading-relaxed mb-4 max-w-xl">
                  Professional roof repairs starting at{" "}
                  <strong className="text-white">$250</strong>.
                </p>
                <p className="text-[15px] text-gray-200/90 leading-relaxed mb-5 max-w-xl">
                  Serving Southwest Florida with fast inspections, honest
                  recommendations, and quality repairs backed by experienced
                  roofing professionals.
                </p>

                {/* Emergency-leak callout — the exact copy the client
                    asked for. Amber pill so it visually separates
                    from the "info" paragraphs above. */}
                <div className="mb-6 max-w-xl rounded-2xl border border-amber-300/50 bg-amber-500/10 px-4 py-3 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <p className="text-[14px] text-white/95 leading-snug">
                    <strong className="text-amber-200">Need emergency roof leak assistance?</strong>{" "}
                    Call us today. Same-day or next-day inspections may be
                    available depending on scheduling.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="#quote-form"
                    className="bg-primary hover:bg-primary/90 text-white px-7 py-4 rounded-full font-semibold text-base tracking-tight shadow-lg shadow-primary/40 hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2"
                  >
                    Schedule My Roof Inspection
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href={`tel:${SITE.phoneTel}`}
                    onClick={() => gaEvent("click_to_call", { location: "hero" })}
                    className="bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/25 text-white px-7 py-4 rounded-full font-semibold text-base tracking-tight inline-flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Call {SITE.phoneDisplay}
                  </a>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3 text-white/90 text-sm">
                  <GoogleReviewsBadge variant="dark" />
                  <span className="flex items-center gap-1.5 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-primary" /> BBB Accredited A+
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Clock className="w-4 h-4 text-primary" /> Family-owned since {SITE.established}
                  </span>
                </div>
              </div>

              <div id="quote-form" className="relative scroll-mt-24">
                <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
                <div className="relative">
                  <RepairForm variant="hero" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── TRUST BAR ────────────────────────────────────────── */}
        <section className="bg-white border-b border-border/60 py-4">
          <div className="container mx-auto max-w-6xl px-4">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] font-semibold text-foreground">
              {[
                "Licensed Florida Roofing Contractor",
                "Family Owned & Operated",
                "Residential & Commercial",
                "10-Year Workmanship Warranty (where applicable)",
                "Serving Southwest Florida",
              ].map((label) => (
                <li key={label} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ─── HOW IT WORKS — 4 simple steps ────────────────────── */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-2">
                How it works
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground leading-tight">
                Four Simple Steps From Leak to Fixed
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  n: "1",
                  icon: MessageSquare,
                  title: "Tell us about it",
                  body: "Fill out the short form or call — takes about 60 seconds. The dispatcher will call to schedule.",
                },
                {
                  n: "2",
                  icon: ClipboardCheck,
                  title: "We inspect",
                  body: "A CHS pro comes out, walks the roof, and documents everything with photos.",
                },
                {
                  n: "3",
                  icon: FileText,
                  title: "You get a written estimate",
                  body: "Line-itemed, plain-English pricing within 24–48 hours. No obligation, no upselling.",
                },
                {
                  n: "4",
                  icon: Wrench,
                  title: "We fix it right",
                  body: "Repair completed to FL wind code and backed by our workmanship warranty where applicable.",
                },
              ].map((s) => (
                <div key={s.n} className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-10 h-10 rounded-full bg-primary text-white font-display font-bold text-base flex items-center justify-center shadow-md shadow-primary/30">
                      {s.n}
                    </span>
                    <s.icon className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-lg tracking-tight text-foreground mb-1.5">
                    {s.title}
                  </h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── WARNING SIGNS ────────────────────────────────────── */}
        <section className="py-16 md:py-20 bg-muted/40">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-2">
                Warning signs
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground leading-tight">
                Don't Ignore These Warning Signs
              </h2>
            </div>
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
              {WARNING_SIGNS.map((s) => (
                <li key={s.label} className="bg-card border border-border/60 rounded-2xl p-4 shadow-sm text-center flex flex-col items-center gap-2">
                  <span className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                    <s.icon className="w-5 h-5 text-primary" />
                  </span>
                  <span className="text-[13px] font-semibold text-foreground leading-snug">
                    {s.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ─── WHAT'S INCLUDED ──────────────────────────────────── */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-2">
                Your inspection
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground leading-tight">
                What's Included With Your Inspection
              </h2>
            </div>
            <ul className="grid sm:grid-cols-2 gap-3">
              {INSPECTION_INCLUDES.map((item) => (
                <li key={item} className="flex items-start gap-3 bg-card border border-border/60 rounded-2xl p-4 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-[14px] font-semibold text-foreground leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Mid-page CTA — every 1–2 sections per spec */}
        <section className="py-8 bg-background">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="rounded-2xl border border-primary/30 bg-primary/[0.04] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-center sm:text-left">
              <p className="font-display font-bold text-lg text-foreground">
                Active leak? Schedule your inspection now.
              </p>
              <a
                href="#quote-form"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white h-11 px-5 rounded-full font-semibold text-sm shadow-md shadow-primary/30 hover:bg-primary/90"
              >
                Schedule My Roof Inspection
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* ─── REPAIRS WE PERFORM ───────────────────────────────── */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-2">
                Every roof system
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground leading-tight">
                Roof Repairs We Perform
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {REPAIR_CATEGORIES.map((c) => (
                <div key={c.title} className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm h-full">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <c.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-lg tracking-tight text-foreground mb-2">
                    {c.title}
                  </h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {c.items.map((it) => (
                      <li key={it} className="flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-primary mt-2 shrink-0" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── WHY HOMEOWNERS CHOOSE CHS — split with photo ─────── */}
        <section className="py-16 md:py-20 bg-muted/40">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-2">
                Why CHS
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground leading-tight">
                Why Homeowners Choose CHS Roofing
              </h2>
            </div>
            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 items-center">
              <div className="rounded-3xl overflow-hidden border border-border/60 shadow-lg bg-card">
                <img
                  src={FOUNDER_PHOTOS.repair[3] ?? PHOTOS.silverMetalPorch}
                  alt="CHS Roofing technician completing a repair in Southwest Florida"
                  loading="lazy"
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
              <ul className="space-y-4">
                {WHY_HOMEOWNERS.map((b) => (
                  <li key={b.title} className="flex items-start gap-4">
                    <span className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <b.icon className="w-5 h-5 text-primary" />
                    </span>
                    <div>
                      <h3 className="font-display font-bold text-lg tracking-tight text-foreground mb-0.5">
                        {b.title}
                      </h3>
                      <p className="text-[14px] text-muted-foreground leading-relaxed">{b.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ─── BEFORE / AFTER ───────────────────────────────────── */}
        {BEFORE_AFTER.length > 0 && (
          <section className="py-16 md:py-20 bg-background">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-2">
                  Real repairs
                </p>
                <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground leading-tight">
                  Before &amp; After Gallery
                </h2>
                <p className="text-sm text-muted-foreground mt-3">
                  Every photo is a real CHS Roofing repair — no stock images.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-5">
                {BEFORE_AFTER.slice(0, 3).map((pair, i) => (
                  <div key={i} className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm">
                    <div className="grid grid-cols-2">
                      <figure>
                        <img src={pair.before} alt="Before" loading="lazy" className="aspect-square w-full object-cover" />
                        <figcaption className="text-[10px] uppercase tracking-[0.18em] font-bold text-white bg-secondary/90 py-1 text-center">
                          Before
                        </figcaption>
                      </figure>
                      <figure>
                        <img src={pair.after} alt="After" loading="lazy" className="aspect-square w-full object-cover" />
                        <figcaption className="text-[10px] uppercase tracking-[0.18em] font-bold text-white bg-primary py-1 text-center">
                          After
                        </figcaption>
                      </figure>
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-semibold text-foreground">Southwest Florida</p>
                      <p className="text-[12px] text-muted-foreground mt-0.5">
                        {["Shingle leak repair", "Tile repair", "Flat roof repair"][i] ?? "Repair"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── REVIEWS ──────────────────────────────────────────── */}
        <section className="py-16 md:py-20 bg-muted/40">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-2">
                Verified reviews
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground leading-tight">
                Customer Reviews
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.slice(0, 3).map((r, i) => (
                <div key={i} className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm h-full flex flex-col">
                  <div className="flex gap-0.5 mb-3 text-primary">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-primary" />
                    ))}
                  </div>
                  <p className="text-foreground italic leading-relaxed mb-4 flex-grow text-sm">"{r.text}"</p>
                  <div>
                    <p className="font-bold text-foreground">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <GoogleReviewsBadge />
            </div>
          </div>
        </section>

        {/* ─── FAQ ──────────────────────────────────────────────── */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto max-w-3xl px-4">
            <div className="text-center mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-2">
                Frequently asked
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground leading-tight">
                Roof Repair, Answered
              </h2>
            </div>
            <div className="space-y-3">
              {FAQS.map((f, i) => (
                <details
                  key={i}
                  className="group bg-card border border-border/60 rounded-2xl p-5 shadow-sm open:shadow-md"
                >
                  <summary className="cursor-pointer list-none flex items-start justify-between gap-3 font-semibold text-foreground tracking-tight">
                    <span>{f.q}</span>
                    <span
                      className="w-7 h-7 shrink-0 rounded-full border border-border/60 flex items-center justify-center text-primary group-open:rotate-45 transition-transform"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed whitespace-pre-line">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA + form repeated ────────────────────────── */}
        <section className="py-16 md:py-20 bg-secondary text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-primary/15" />
          <div className="container mx-auto max-w-6xl px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight mb-5">
                Don't Wait Until the Leak Gets Worse.
              </h2>
              <p className="text-gray-300/95 text-lg leading-relaxed max-w-2xl mx-auto mb-7">
                A small leak today can become thousands of dollars in damage
                tomorrow. Schedule your professional roof inspection today.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="#quote-form-bottom"
                  className="bg-primary hover:bg-primary/90 text-white px-7 py-4 rounded-full font-semibold text-base tracking-tight shadow-lg shadow-primary/40 hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2"
                >
                  Schedule My Roof Inspection
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href={`tel:${SITE.phoneTel}`}
                  onClick={() => gaEvent("click_to_call", { location: "final-cta" })}
                  className="bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/25 text-white px-7 py-4 rounded-full font-semibold text-base tracking-tight inline-flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Call {SITE.phoneDisplay}
                </a>
              </div>
              <div className="mt-6 flex justify-center">
                <BBBBadges variant="dark" />
              </div>
            </div>

            <div id="quote-form-bottom" className="scroll-mt-24 max-w-xl mx-auto">
              <RepairForm variant="bottom" />
            </div>
          </div>
        </section>
      </main>

      {/* Sticky mobile CTAs — Call + Schedule, both visible under scroll */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 grid grid-cols-2 gap-2 p-3 bg-white/95 backdrop-blur-xl border-t border-border/60 shadow-lg">
        <a
          href={`tel:${SITE.phoneTel}`}
          onClick={() => gaEvent("click_to_call", { location: "sticky-mobile" })}
          className="inline-flex items-center justify-center gap-2 bg-card border border-border/60 text-foreground h-12 rounded-full font-semibold text-sm shadow-sm"
        >
          <Phone className="w-4 h-4 text-primary" />
          Call Now
        </a>
        <a
          href="#quote-form"
          className="inline-flex items-center justify-center gap-2 bg-primary text-white h-12 rounded-full font-semibold text-sm shadow-lg shadow-primary/40"
        >
          <ClipboardCheck className="w-4 h-4" />
          Schedule
        </a>
      </div>

      {/* Compliance footer */}
      <footer className="bg-secondary text-secondary-foreground border-t border-white/10 py-10 pb-28 sm:pb-10">
        <div className="container mx-auto max-w-6xl px-4 grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="font-display font-bold text-white tracking-tight">
              {SITE.legalName}{" "}
              <span className="text-secondary-foreground/60 font-normal">({SITE.brand})</span>
            </p>
            <p className="text-secondary-foreground/70 mt-1">
              Florida Roofing License {SITE.license} · Fully Insured · BBB Accredited A+
            </p>
            <p className="text-secondary-foreground/70 mt-1">
              {SITE.city}
            </p>
            <p className="text-secondary-foreground/60 mt-2 text-xs leading-relaxed">
              Verify our license at{" "}
              <a
                href="https://www.myfloridalicense.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-secondary-foreground"
              >
                MyFloridaLicense.com
              </a>
              .
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary mb-2">
              Serving
            </p>
            <p className="text-secondary-foreground/85 text-[13px] leading-relaxed">
              Naples · Bonita Springs · Estero · Fort Myers · Cape Coral · Lehigh Acres · Punta Gorda · Port Charlotte · North Port · Marco Island · Sarasota
            </p>
          </div>
          <div className="md:text-right">
            <ul className="space-y-1.5">
              <li className="flex md:justify-end items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a
                  href={`tel:${SITE.phoneTel}`}
                  onClick={() => gaEvent("click_to_call", { location: "footer" })}
                  className="hover:text-primary"
                >
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li className="flex md:justify-end items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                <span>Google 5-star rated</span>
              </li>
              {SITE.social?.facebook && (
                <li className="flex md:justify-end items-center gap-2">
                  <Facebook className="w-4 h-4 text-primary" />
                  <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    Facebook
                  </a>
                </li>
              )}
              {SITE.social?.instagram && (
                <li className="flex md:justify-end items-center gap-2">
                  <Instagram className="w-4 h-4 text-primary" />
                  <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    Instagram
                  </a>
                </li>
              )}
              <li className="flex md:justify-end items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
              </li>
              <li className="flex md:justify-end items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto max-w-6xl px-4 pt-6 mt-6 border-t border-white/10 text-xs text-secondary-foreground/60">
          <p className="text-center">
            © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
