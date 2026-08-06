import { useEffect } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Facebook,
  FileText,
  Hammer,
  HardHat,
  Home as HomeIcon,
  Instagram,
  KeyRound,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import InspectionForm from "@/components/InspectionForm";
import BBBBadges from "@/components/BBBBadges";
import { GoogleReviewsBadge } from "@/components/GoogleLogo";
import Seo, { faqSchema } from "@/components/Seo";
import { usePageViewTracker } from "@/hooks/usePageViewTracker";
import { FOUNDER_PHOTOS, PHOTOS, SITE, TESTIMONIALS } from "@/lib/site-config";
import { gaEvent } from "@/lib/gtag";

/**
 * /free-roof-inspection — Meta Ads landing page for the 21-point
 * inspection campaign. Built to the client's spec: hero + form
 * above the fold, problem statement with real photos, 21-item
 * inspection checklist, what-you-receive, 3-step how-it-works,
 * why-choose-CHS credentials, before-after gallery, reviews,
 * service area, FAQ (FAQPage schema), final CTA with form
 * repeated, sticky mobile CTA.
 *
 * Analytics per spec:
 *   - Meta Pixel `PageView` fires site-wide (index.html)
 *   - GA4 `view_free_inspection_page` on mount
 *   - GA4 `inspection_form_start` when a field is first focused
 *     (in InspectionForm)
 *   - GA4 `inspection_form_submit` and Meta `Lead` fire from the
 *     dedicated /inspection-request-received thank-you page —
 *     NOT on submit-button click, per Meta's guidance.
 *   - click_to_call / click_to_text fire from tel:/sms: buttons.
 *
 * UTM params are read + preserved through the form submission and
 * forwarded on to the thank-you page URL so downstream tools stay
 * attribution-aware.
 */

const CHECKLIST = [
  "Overall roof condition",
  "Missing, cracked, slipped, or damaged materials",
  "Shingle condition and granule loss",
  "Tile damage and movement",
  "Metal panel and fastener condition",
  "Ridge caps and hip caps",
  "Roof valleys",
  "Drip edge and perimeter metal",
  "Pipe boots and plumbing penetrations",
  "Roof vents and ventilation components",
  "Flashing around walls and transitions",
  "Chimney and skylight flashing",
  "Sealants and exposed fasteners",
  "Signs of wind or storm damage",
  "Ponding or drainage concerns",
  "Visible soft spots or decking concerns",
  "Signs of active or previous leaks",
  "Fascia and soffit conditions visible from the roof",
  "Gutters and roof drainage areas",
  "Estimated remaining roof service life",
  "Recommended repairs, maintenance, or replacement options",
];

const FAQS = [
  {
    q: "Is the inspection really free?",
    a: "Yes. The initial visual roof inspection is offered at no charge for properties within the CHS Roofing service area. Certain commercial, engineering, destructive, certification, insurance, real-estate, or specialty inspections may require a separate fee.",
  },
  {
    q: "How long does the inspection take?",
    a: "Most residential inspections take approximately 30–60 minutes, depending on the roof size, slope, material, accessibility, and condition.",
  },
  {
    q: "Do I need to be home?",
    a: "It is preferred but not always required. Access arrangements and inspection findings can be discussed in advance.",
  },
  {
    q: "Will you provide photos?",
    a: "Yes. When conditions and accessibility allow, CHS will document visible roofing concerns with photos.",
  },
  {
    q: "Does an inspection mean I need a new roof?",
    a: "No. The purpose is to determine the roof's visible condition. Repairs, maintenance, monitoring, or replacement may be recommended depending on what is found.",
  },
  {
    q: "What types of roofs do you inspect?",
    a: "CHS Roofing works with asphalt shingles, tile roofing, standing seam and exposed-fastener metal roofing, and low-slope or flat roofing systems.",
  },
  {
    q: "Can you inspect storm damage?",
    a: "Yes. CHS can document visible wind, rain, impact, or storm-related concerns. CHS does not determine insurance coverage or guarantee claim approval.",
  },
];

const WHY_CHOOSE = [
  { icon: ShieldCheck, title: `Florida License ${SITE.license}`, body: "Licensed and insured statewide contractor." },
  { icon: Award, title: "GAF Certified", body: "Certified installers backing manufacturer warranties." },
  { icon: HomeIcon, title: "Family-Owned & Operated", body: "Local team, direct communication, no bait-and-switch." },
  { icon: Building2, title: "Residential & Commercial", body: "From single-family homes to multifamily and commercial roofs." },
  { icon: Hammer, title: "Every roof system", body: "Shingle, tile, standing seam & exposed-fastener metal, flat." },
  { icon: FileText, title: "10-Year Workmanship Warranty", body: "On qualifying new-roof projects." },
  { icon: KeyRound, title: "Customer Portal", body: "Project photos, documents, warranty info — all in one place." },
  { icon: MapPin, title: "Serving Southwest Florida", body: "Cape Coral, Fort Myers, Naples, and neighboring communities." },
  { icon: Wallet, title: "Financing Options Available", body: "Payment plans through qualified partners for approved customers." },
];

const BEFORE_AFTER =
  FOUNDER_PHOTOS.beforeAfter.length > 0
    ? FOUNDER_PHOTOS.beforeAfter
    : ([] as ReadonlyArray<{ before: string; after: string }>);

export default function FreeRoofInspection() {
  const { t } = useTranslation();
  usePageViewTracker();
  void t;

  useEffect(() => {
    const previous = document.title;
    document.title = `Free 21-Point Roof Inspection | ${SITE.brand} SWFL`;
    // Campaign-specific GA4 event, once per mount.
    gaEvent("view_free_inspection_page", {
      landing_page: "free-roof-inspection",
    });
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Seo
        title="Free 21-Point Roof Inspection | CHS Roofing SWFL"
        description="Schedule a free 21-point roof inspection from CHS Roofing. Receive roof photos, a detailed condition report, and honest recommendations with no obligation. Serving Southwest Florida."
        path="/free-roof-inspection"
        jsonLd={[faqSchema(FAQS)]}
      />

      {/* Minimal sticky header — one clear identity + one CTA. No
          full nav so paid traffic isn't distracted from converting. */}
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
          <div className="flex items-center gap-2.5">
            <a
              href={`tel:${SITE.phoneTel}`}
              onClick={() => gaEvent("click_to_call", { location: "header" })}
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-foreground hover:text-primary"
            >
              <Phone className="w-4 h-4 text-primary" />
              {SITE.phoneDisplay}
            </a>
            <a
              href="#quote-form"
              className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-full font-semibold text-sm tracking-tight shadow-md shadow-primary/30 transition-all"
            >
              Schedule Free Inspection
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
              src={PHOTOS.silverMetalPorch}
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
                  <ClipboardCheck className="w-3.5 h-3.5" />
                  Free 21-Point Roof Inspection
                </div>
                <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05] mb-5 drop-shadow-lg">
                  Is Your Roof Ready for{" "}
                  <span className="text-primary">Florida's Next Storm?</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-200/95 leading-relaxed mb-6 max-w-xl">
                  Get a <strong className="text-white">FREE 21-Point Roof Inspection</strong> with
                  detailed roof photos, professional findings, and honest
                  recommendations — without pressure or obligation.
                </p>

                <p className="text-[13px] text-white/85 mb-6 max-w-xl">
                  Licensed Florida Roofing Contractor <strong className="text-white">{SITE.license}</strong> · GAF Certified · Family-Owned &amp; Operated
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="#quote-form"
                    className="bg-primary hover:bg-primary/90 text-white px-7 py-4 rounded-full font-semibold text-base tracking-tight shadow-lg shadow-primary/40 hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2"
                  >
                    Schedule My Free Inspection
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

              {/* Form — beside on desktop, below on mobile */}
              <div id="quote-form" className="relative scroll-mt-24">
                <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
                <div className="relative">
                  <InspectionForm variant="hero" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── PROBLEM SECTION ──────────────────────────────────── */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-2">
                Why this matters
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground leading-tight">
                Your Roof Can Have Damage Before You See a Leak
              </h2>
              <p className="text-[15px] text-muted-foreground mt-4 leading-relaxed">
                Florida roofs are constantly exposed to intense sun, heavy
                rain, high winds, humidity, and tropical storms. Small
                problems can remain hidden until they cause damaged ceilings,
                rotten decking, mold, or expensive interior repairs.
              </p>
              <p className="text-[15px] text-foreground/85 mt-3 leading-relaxed font-semibold">
                A professional inspection can uncover issues before they become emergencies.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { src: FOUNDER_PHOTOS.repair[3], caption: "Damaged & missing shingles" },
                { src: FOUNDER_PHOTOS.repair[0], caption: "Rotten roof decking" },
                { src: FOUNDER_PHOTOS.repair[2], caption: "Failed flashing & pipe boots" },
              ].map((p, i) => (
                <figure key={i} className="rounded-2xl overflow-hidden border border-border/60 bg-card shadow-sm">
                  <img src={p.src} alt={p.caption} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                  <figcaption className="p-3 text-center text-[13px] font-semibold text-foreground">
                    {p.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 21-POINT CHECKLIST ───────────────────────────────── */}
        <section className="py-16 md:py-20 bg-muted/40">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-2">
                What we check
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground leading-tight">
                What We Check During Your Roof Inspection
              </h2>
            </div>
            <ol className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 max-w-5xl mx-auto counter-reset-[cl]">
              {CHECKLIST.map((item, i) => (
                <li key={i} className="flex items-start gap-3 py-2">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center font-mono">
                    {i + 1}
                  </span>
                  <span className="text-[14px] text-foreground/85 leading-snug">{item}</span>
                </li>
              ))}
            </ol>
            <p className="max-w-3xl mx-auto mt-10 text-center text-[12px] text-muted-foreground leading-relaxed">
              Inspection items may vary based on roof type, accessibility,
              weather conditions, roof slope, and property conditions. The
              inspection is visual and non-destructive unless otherwise
              agreed in writing.
            </p>
          </div>
        </section>

        {/* ─── WHAT YOU RECEIVE ─────────────────────────────────── */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-2">
                What you get
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground leading-tight">
                You'll Know Exactly What Is Happening Above Your Home
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                "Roof photos",
                "Explanation of visible concerns",
                "Condition summary",
                "Recommended next steps",
                "Repair or replacement options when needed",
                "No-pressure consultation",
                "Written estimate when requested",
                "Everything documented in your CHS portal",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 bg-card border border-border/60 rounded-2xl p-4 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm font-semibold text-foreground leading-snug">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-center max-w-3xl mx-auto mt-8 text-[14px] text-muted-foreground leading-relaxed italic">
              We will not tell you that you need a new roof unless the
              condition of the roof supports that recommendation. When a
              repair is appropriate, we will explain the repair option.
            </p>
          </div>
        </section>

        {/* ─── HOW IT WORKS ─────────────────────────────────────── */}
        <section className="py-16 md:py-20 bg-muted/40">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-2">
                How it works
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground leading-tight">
                Three Simple Steps
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  n: "1",
                  title: "Request your inspection",
                  body: "Complete the short form or call CHS Roofing.",
                },
                {
                  n: "2",
                  title: "We inspect your roof",
                  body: "A CHS representative evaluates accessible roof components and documents visible conditions.",
                },
                {
                  n: "3",
                  title: "You receive clear recommendations",
                  body: "We explain what we found, show you the photos, and discuss practical next steps.",
                },
              ].map((p) => (
                <div key={p.n} className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm h-full">
                  <div className="w-11 h-11 rounded-full bg-primary text-white font-display font-bold text-lg flex items-center justify-center mb-4 shadow-md shadow-primary/30">
                    {p.n}
                  </div>
                  <h3 className="font-display font-bold text-lg tracking-tight text-foreground mb-1.5">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── WHY CHOOSE CHS ───────────────────────────────────── */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-2">
                Why choose CHS
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground leading-tight">
                Local Roofing Experience You Can Trust
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {WHY_CHOOSE.map((b) => (
                <div key={b.title} className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm h-full">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <b.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-base tracking-tight text-foreground mb-1">{b.title}</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{b.body}</p>
                </div>
              ))}
            </div>
            <p className="max-w-3xl mx-auto mt-8 text-center text-[14px] text-muted-foreground leading-relaxed">
              CHS Roofing provides straightforward communication from the
              first inspection through final completion. Customers receive
              updates, project photos, documents, warranties, and inspection
              information through our customer portal.
            </p>
          </div>
        </section>

        {/* ─── BEFORE / AFTER ───────────────────────────────────── */}
        {BEFORE_AFTER.length > 0 && (
          <section className="py-16 md:py-20 bg-muted/40">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-2">
                  Real projects
                </p>
                <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground leading-tight">
                  Real Roofing Projects Completed by CHS
                </h2>
                <p className="text-sm text-muted-foreground mt-3">
                  Real Southwest Florida roofs. Real CHS crews. No stock photos.
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
                        {i === 0 ? "Shingle roof transformation" : i === 1 ? "Tile roof transformation" : "Standing seam metal roof"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── REVIEWS ──────────────────────────────────────────── */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-2">
                What customers say
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground leading-tight">
                Trusted by Southwest Florida Homeowners
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
            <div className="mt-8 flex justify-center gap-3 flex-wrap">
              <GoogleReviewsBadge />
              {SITE.social?.google && (
                <a
                  href={SITE.social.google}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-card border border-border/60 hover:border-primary/40 px-5 py-2.5 rounded-full text-sm font-semibold text-foreground hover:text-primary transition-colors"
                >
                  Read More Customer Reviews
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </section>

        {/* ─── SERVICE AREA ─────────────────────────────────────── */}
        <section className="py-16 md:py-20 bg-muted/40">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-2">
              Where we work
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground leading-tight">
              Serving Homeowners Across Southwest Florida
            </h2>
            <p className="mt-4 text-[15px] text-foreground/85 leading-relaxed">
              Cape Coral · Fort Myers · North Fort Myers · Lehigh Acres ·
              Estero · Bonita Springs · Naples · Marco Island · Punta Gorda ·
              Port Charlotte · North Port · and surrounding communities.
            </p>
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
                Your Roof Inspection, Answered
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

        {/* ─── FINAL CTA + FORM REPEATED ────────────────────────── */}
        <section className="py-16 md:py-20 bg-secondary text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-primary/15" />
          <div className="container mx-auto max-w-6xl px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight mb-5">
                Don't Wait for a Ceiling Stain to Find Out Your Roof Has a Problem
              </h2>
              <p className="text-gray-300/95 text-lg leading-relaxed max-w-2xl mx-auto mb-7">
                Schedule your FREE 21-Point Roof Inspection and get clear
                information about the condition of your roof.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="#quote-form-bottom"
                  className="bg-primary hover:bg-primary/90 text-white px-7 py-4 rounded-full font-semibold text-base tracking-tight shadow-lg shadow-primary/40 hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2"
                >
                  Schedule My Free Inspection
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

            {/* Form repeated */}
            <div id="quote-form-bottom" className="scroll-mt-24 max-w-xl mx-auto">
              <InspectionForm variant="bottom" />
            </div>
          </div>
        </section>
      </main>

      {/* Sticky mobile CTA — always visible under scroll on phones */}
      <a
        href="#quote-form"
        className="sm:hidden fixed bottom-4 left-4 right-4 z-40 inline-flex items-center justify-center gap-2 bg-primary text-white h-14 rounded-full font-semibold text-base tracking-tight shadow-2xl shadow-primary/50"
      >
        <ClipboardCheck className="w-5 h-5" />
        Schedule Free Inspection
      </a>

      {/* Compliance footer */}
      <footer className="bg-secondary text-secondary-foreground border-t border-white/10 py-10 pb-24 sm:pb-10">
        <div className="container mx-auto max-w-6xl px-4 grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="font-display font-bold text-white tracking-tight">
              {SITE.legalName}{" "}
              <span className="text-secondary-foreground/60 font-normal">({SITE.brand})</span>
            </p>
            <p className="text-secondary-foreground/70 mt-1">
              FL License {SITE.license} · Fully Insured · BBB Accredited A+
            </p>
            <p className="text-secondary-foreground/70 mt-1">
              {SITE.city} · Serving Southwest Florida
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
          <div className="flex md:justify-center">
            <ul className="space-y-1.5">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a
                  href={`tel:${SITE.phoneTel}`}
                  onClick={() => gaEvent("click_to_call", { location: "footer" })}
                  className="hover:text-primary"
                >
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">@</span>
                <a href={`mailto:${SITE.email}`} className="hover:text-primary break-all">
                  {SITE.email}
                </a>
              </li>
              {SITE.social?.facebook && (
                <li className="flex items-center gap-2">
                  <Facebook className="w-4 h-4 text-primary" />
                  <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    Facebook
                  </a>
                </li>
              )}
              {SITE.social?.instagram && (
                <li className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-primary" />
                  <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    Instagram
                  </a>
                </li>
              )}
            </ul>
          </div>
          <div className="md:text-right">
            <ul className="space-y-1.5">
              <li>
                <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-primary">Visit full site</Link>
              </li>
              <li>
                <Link href="/gallery/residential" className="hover:text-primary">Project gallery</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto max-w-6xl px-4 pt-6 mt-6 border-t border-white/10 text-xs text-secondary-foreground/60">
          <p className="leading-relaxed">
            By submitting the form on this page you consent to {SITE.brand}
            contacting you by phone, text, or email about your inspection
            request. Message and data rates may apply. You can opt out at
            any time. See our{" "}
            <Link href="/privacy" className="underline hover:text-secondary-foreground">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="underline hover:text-secondary-foreground">
              Terms of Service
            </Link>{" "}
            for details.
          </p>
          <p className="mt-3 text-center flex items-center justify-center gap-2 text-secondary-foreground/70">
            <Users className="w-3.5 h-3.5" />
            © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
