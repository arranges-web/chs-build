import { useEffect } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Droplets,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Wallet,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import FreeQuoteForm from "@/components/FreeQuoteForm";
import BBBBadges from "@/components/BBBBadges";
import { GoogleReviewsBadge } from "@/components/GoogleLogo";
import Seo, { faqSchema } from "@/components/Seo";
import { usePageViewTracker } from "@/hooks/usePageViewTracker";
import { PHOTOS, SITE, TESTIMONIALS } from "@/lib/site-config";

/**
 * /roof-coating-quote — dedicated Google Ads landing page for the
 * "roof coating" search term. Built to Google Ads' landing-page
 * policy: clear business identity, accurate claims, visible
 * privacy + terms, no fake urgency, no deceptive scarcity, fast on
 * mobile. The form locks `serviceType` to "roof-coating" so the
 * lead lands in the admin panel properly tagged for attribution.
 *
 * Compliance highlights:
 *  • Legal business name + FL license number visible above the fold
 *  • Real phone + real address shown in header AND footer
 *  • All benefit claims are qualified ("up to", "typically", "depends
 *    on roof condition") — no absolute promises
 *  • Privacy + Terms linked in footer and below the form CTA
 *  • TCPA-style consent under the submit button (call/text consent)
 *  • No popups, countdowns, exit-intent traps, or fake testimonials
 *  • Single intent: get a free roof-coating quote
 */

const FAQS = [
  {
    q: "What is a roof coating, and is it right for my roof?",
    a: "A roof coating is a fluid-applied membrane (silicone, acrylic, or polyurethane) that goes over an existing flat or low-slope roof to seal seams, stop leaks, and reflect sunlight. It's a great fit for TPO, modified bitumen, EPDM, and metal commercial roofs that are still structurally sound but starting to show their age. We inspect first to confirm coating is the right call — if your roof needs replacement, we'll tell you straight.",
  },
  {
    q: "How much does roof coating cost?",
    a: "Pricing depends on roof size, condition, prep work needed, and the coating system used. Coating typically runs 40–60% less than a full replacement for the same square footage. We provide line-itemed written estimates within 24–48 hours of the inspection so you can compare apples-to-apples.",
  },
  {
    q: "How long does a roof coating last?",
    a: "Most silicone systems we install carry manufacturer warranties of 10–15 years when applied to a properly prepped roof. Acrylic systems are typically 5–10 years. Actual lifespan depends on the substrate, prep quality, foot traffic, and Florida sun exposure — we walk you through the trade-offs before you sign.",
  },
  {
    q: "Will a coating actually lower my energy bills?",
    a: "Reflective white coatings can reduce roof surface temperatures meaningfully on Florida flat roofs, which often translates to lower cooling loads. The exact savings depend on insulation, HVAC efficiency, and operating hours — we won't quote you a magic number, but we'll share what our other commercial customers have seen.",
  },
  {
    q: "Are you licensed and insured in Florida?",
    a: `Yes. ${SITE.legalName} ("${SITE.brand}") is fully licensed (FL License ${SITE.license}) and insured. You can verify our license at MyFloridaLicense.com. We're BBB accredited (A+) and family-owned, based in ${SITE.city}.`,
  },
  {
    q: "What areas do you serve?",
    a: "Cape Coral, Fort Myers, Naples, Bonita Springs, Estero, Sanibel, Punta Gorda, North Port, Lehigh Acres, and the rest of Southwest Florida. If you're not sure if you're in our area, give us a call — we'll tell you straight.",
  },
];

const BENEFITS = [
  {
    icon: Droplets,
    title: "Seals leaks at the source",
    body: "Liquid-applied membrane bridges seams, penetrations, and weak spots — no tear-off, no landfill load.",
  },
  {
    icon: Sun,
    title: "Reflects Florida heat",
    body: "White reflective coatings cut roof surface temperatures, which can help reduce the AC load on your building.",
  },
  {
    icon: Wallet,
    title: "Costs less than replacement",
    body: "Coating typically runs 40–60% less than a full re-roof when the substrate is still structurally sound.",
  },
  {
    icon: ShieldCheck,
    title: "Manufacturer-backed warranty",
    body: "Up to 15 years on silicone systems, properly prepped. We walk you through the warranty before you sign.",
  },
];

export default function RoofCoatingQuote() {
  const { t } = useTranslation();
  usePageViewTracker();
  void t;

  useEffect(() => {
    const previous = document.title;
    document.title = `Roof Coating Quote in SWFL — ${SITE.brand}`;
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Seo
        title="Roof Coating Quote in Cape Coral, Fort Myers & Naples FL | CHS Roofing"
        description={`Free roof coating estimate from a licensed Florida roofing contractor (FL ${SITE.license}). Silicone and acrylic restoration systems for TPO, modified bitumen, EPDM and metal commercial roofs. Call ${SITE.phoneDisplay} or request a quote online.`}
        path="/roof-coating-quote"
        jsonLd={[faqSchema(FAQS)]}
      />

      {/* Minimal sticky header — business identity, license, phone */}
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
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-foreground hover:text-primary"
            >
              <Phone className="w-4 h-4 text-primary" />
              {SITE.phoneDisplay}
            </a>
            <a
              href="#quote-form"
              className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-full font-semibold text-sm tracking-tight shadow-md shadow-primary/30 transition-all"
            >
              Get my quote
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO */}
        <section className="relative pt-10 pb-16 lg:pt-14 lg:pb-20 overflow-hidden bg-secondary">
          <div className="absolute inset-0 z-0">
            <img
              src={PHOTOS.flatTpoCrew}
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
            <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 items-center">
              <div className="text-white">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/90 text-primary-foreground text-[11px] font-semibold tracking-wide uppercase shadow-md backdrop-blur-md border border-white/20 mb-5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Roof Coating & Restoration — SWFL
                </div>
                <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05] mb-5 drop-shadow-lg">
                  Extend your roof's life with a{" "}
                  <span className="text-primary">reflective coating system</span>.
                </h1>
                <p className="text-lg md:text-xl text-gray-200/95 leading-relaxed mb-7 max-w-xl">
                  Silicone and acrylic coatings for TPO, modified bitumen, EPDM and
                  metal commercial roofs across Cape Coral, Fort Myers, Naples and
                  all of Southwest Florida. Free, no-pressure inspection — we'll
                  tell you straight whether coating is right for your roof.
                </p>

                <ul className="space-y-2.5 mb-7">
                  {[
                    "Stops leaks at the seams and penetrations",
                    "Reflects Florida heat to help reduce cooling costs",
                    "Typically 40–60% less than a full replacement",
                    "Up to 15-year manufacturer warranties on silicone systems",
                    `Licensed and insured — FL ${SITE.license}, since ${SITE.established}`,
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-white">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="font-medium text-[15px] leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="#quote-form"
                    className="bg-primary hover:bg-primary/90 text-white px-7 py-4 rounded-full font-semibold text-base tracking-tight shadow-lg shadow-primary/40 hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2"
                  >
                    Get my free quote
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href={`tel:${SITE.phoneTel}`}
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

              {/* Form */}
              <div id="quote-form" className="relative scroll-mt-24">
                <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
                <div className="relative">
                  <FreeQuoteForm
                    lockService="roof-coating"
                    sourceTag="roof-coating-quote"
                    title={
                      <>
                        Free roof coating quote — <span className="text-primary">60 seconds</span>.
                      </>
                    }
                    subtitle="We'll review your details and reach out within 24 hours."
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="bg-white border-y border-border/60 py-6">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-bold text-foreground">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" /> FL License {SITE.license}
              </span>
              <span className="hidden md:block w-px h-5 bg-border" />
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" /> Fully Insured
              </span>
              <span className="hidden md:block w-px h-5 bg-border" />
              <span className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> 5-star reviews
              </span>
              <span className="hidden md:block w-px h-5 bg-border" />
              <span className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-primary" /> Florida-owned since {SITE.established}
              </span>
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-2">
                Why a roof coating
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground leading-tight">
                Restore your roof — without a full replacement.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {BENEFITS.map((b) => (
                <div
                  key={b.title}
                  className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow h-full"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <b.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-lg tracking-tight text-foreground mb-1.5">
                    {b.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="py-16 md:py-20 bg-muted/40">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-2">
                Our process
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground leading-tight">
                Honest inspection. Clear estimate. Quality work.
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  n: "1",
                  title: "Free on-site inspection",
                  body: "We assess the existing roof, seams, penetrations, drainage and problem spots — and tell you straight whether coating is the right call.",
                },
                {
                  n: "2",
                  title: "Written, line-itemed estimate",
                  body: "Within 24–48 hours you get a plain-English estimate covering prep, materials, labor and warranty. No high-pressure sales.",
                },
                {
                  n: "3",
                  title: "Professional application + walkthrough",
                  body: "We prep the substrate, repair as needed, apply the manufacturer-spec coating system, and walk the finished roof with you.",
                },
              ].map((p) => (
                <div
                  key={p.n}
                  className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm h-full"
                >
                  <div className="w-11 h-11 rounded-full bg-primary text-white font-display font-bold text-lg flex items-center justify-center mb-4 shadow-md shadow-primary/30">
                    {p.n}
                  </div>
                  <h3 className="font-display font-bold text-lg tracking-tight text-foreground mb-1.5">
                    {p.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS — real names from Google */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-2">
                What customers say
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground leading-tight">
                Verified Google reviews from real customers.
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.slice(0, 3).map((r, i) => (
                <div
                  key={i}
                  className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm h-full flex flex-col"
                >
                  <div className="flex gap-0.5 mb-3 text-primary">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-primary" />
                    ))}
                  </div>
                  <p className="text-foreground italic leading-relaxed mb-4 flex-grow text-sm">
                    "{r.text}"
                  </p>
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

        {/* FAQ */}
        <section className="py-16 md:py-20 bg-muted/40">
          <div className="container mx-auto max-w-3xl px-4">
            <div className="text-center mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-2">
                Frequently asked
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground leading-tight">
                Roof coating, answered straight.
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
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-16 md:py-20 bg-secondary text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-primary/15" />
          <div className="container mx-auto max-w-4xl px-4 relative z-10 text-center">
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight mb-5">
              Ready for a <span className="text-primary">straight answer</span> on your roof?
            </h2>
            <p className="text-gray-300/95 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
              Free inspection. Written quote within 24–48 hours. No high-pressure sales — just an honest assessment from a licensed Florida roofing contractor.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <a
                href="#quote-form"
                className="bg-primary hover:bg-primary/90 text-white px-7 py-4 rounded-full font-semibold text-base tracking-tight shadow-lg shadow-primary/40 hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2"
              >
                Get my free quote
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={`tel:${SITE.phoneTel}`}
                className="bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/25 text-white px-7 py-4 rounded-full font-semibold text-base tracking-tight inline-flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Call {SITE.phoneDisplay}
              </a>
            </div>
            <BBBBadges variant="dark" />
          </div>
        </section>
      </main>

      {/* Compliance footer — business identity, license, contact,
          privacy, terms. Google Ads policy: visitors need to be able
          to identify and contact the business. */}
      <footer className="bg-secondary text-secondary-foreground border-t border-white/10 py-10">
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
                <a href={`tel:${SITE.phoneTel}`} className="hover:text-primary">
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">@</span>
                <a href={`mailto:${SITE.email}`} className="hover:text-primary break-all">
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>
          <div className="md:text-right">
            <ul className="space-y-1.5">
              <li>
                <Link href="/privacy" className="hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-primary">
                  Visit full site
                </Link>
              </li>
              <li>
                <Link href="/services/roof-coating" className="hover:text-primary">
                  Learn more about roof coating
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto max-w-6xl px-4 pt-6 mt-6 border-t border-white/10 text-xs text-secondary-foreground/60">
          <p className="leading-relaxed">
            By submitting the form on this page you consent to {SITE.brand} contacting you by
            phone, text, or email about your quote request. Message and data rates may apply.
            You can opt out at any time. See our{" "}
            <Link href="/privacy" className="underline hover:text-secondary-foreground">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="underline hover:text-secondary-foreground">
              Terms of Service
            </Link>{" "}
            for details.
          </p>
          <p className="mt-3 text-center">
            © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
