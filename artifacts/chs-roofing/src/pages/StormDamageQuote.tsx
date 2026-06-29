import { useEffect } from "react";
import { Link } from "wouter";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  CloudLightning,
  FileText,
  Phone,
  ShieldCheck,
  Star,
  Wind,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import FreeQuoteForm from "@/components/FreeQuoteForm";
import BBBBadges from "@/components/BBBBadges";
import { GoogleReviewsBadge } from "@/components/GoogleLogo";
import Seo, { faqSchema } from "@/components/Seo";
import { usePageViewTracker } from "@/hooks/usePageViewTracker";
import { FOUNDER_PHOTOS, PHOTOS, SITE, TESTIMONIALS } from "@/lib/site-config";

/**
 * /storm-damage-quote — dedicated Google Ads landing page targeting
 * "hurricane roof damage" / "storm roof inspection" / "wind damage
 * roofing" during Florida storm season. Same compliance posture as
 * /roof-coating-quote:
 *  • Real business identity + FL license above the fold
 *  • No fake urgency ("only 3 spots left" etc.) — storm urgency is
 *    real and we let the facts speak for themselves
 *  • All claims qualified ("we can help document", not "we get your
 *    claim approved")
 *  • TCPA-style consent disclosure in the footer
 *  • Privacy + Terms linked
 *  • Form locks serviceType to "storm-damage" for clean attribution
 */

const FAQS = [
  {
    q: "Do you handle insurance claims for storm damage?",
    a: "We document everything — photos, measurements, and a written assessment — and walk your adjuster through what we find. We can't guarantee your insurance company will approve your claim, but a thorough independent inspection report has helped a lot of our SWFL customers get covered for repairs they didn't know they were entitled to.",
  },
  {
    q: "How fast can you get out for an emergency inspection?",
    a: "During storm season we prioritize active leaks and structural damage. Call us at " + SITE.phoneDisplay + " and we'll let you know the soonest we can be there — usually same-day or next-day for emergency calls in the Cape Coral, Fort Myers, and Naples area.",
  },
  {
    q: "Can you tarp my roof to stop a leak right now?",
    a: "Yes. Emergency tarping is one of the first things we do on a storm-damage call — it stops further water intrusion while we plan the repair and document the damage for your insurance carrier.",
  },
  {
    q: "What does a storm-damage inspection cost?",
    a: "Free. We give you a written, line-itemed estimate within 24–48 hours of the inspection. No high-pressure sales, no obligation to use us for the repair.",
  },
  {
    q: "Will my insurance cover hurricane damage?",
    a: "Most Florida homeowner policies include hurricane coverage, but coverage limits, deductibles, and exclusions vary. We can document what we find and you submit it through your carrier's claims process. For specifics about your policy, contact your insurance agent.",
  },
  {
    q: "Are you licensed and insured?",
    a: `Yes. ${SITE.legalName} ("${SITE.brand}") is fully licensed (FL License ${SITE.license}) and insured. We're BBB accredited (A+) and family-owned, based in ${SITE.city}. Verify our license at MyFloridaLicense.com.`,
  },
];

const BENEFITS = [
  {
    icon: Clock,
    title: "Fast emergency response",
    body: "We prioritize active leaks and structural damage during storm season — typically same-day or next-day inspections in our SWFL service area.",
  },
  {
    icon: ShieldCheck,
    title: "Emergency tarping",
    body: "We can tarp your roof on the inspection visit to stop further water intrusion while we plan the permanent repair.",
  },
  {
    icon: FileText,
    title: "Insurance claim documentation",
    body: "Photos, measurements, and a written assessment you can hand to your insurance adjuster. We can walk them through what we found.",
  },
  {
    icon: Wind,
    title: "Built to Florida wind code",
    body: "Every repair and replacement we do meets current FL wind code — important for both safety and future insurability.",
  },
];

export default function StormDamageQuote() {
  const { t } = useTranslation();
  usePageViewTracker();
  void t;

  useEffect(() => {
    const previous = document.title;
    document.title = `Hurricane & Storm Damage Roof Inspection — ${SITE.brand}`;
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Seo
        title="Hurricane & Storm Damage Roof Inspection in SWFL | CHS Roofing"
        description={`Free hurricane and wind damage roof inspection from a licensed Florida roofing contractor (FL ${SITE.license}). Emergency tarping, insurance claim documentation, and storm repairs across Cape Coral, Fort Myers, Naples and Southwest Florida. Call ${SITE.phoneDisplay}.`}
        path="/storm-damage-quote"
        jsonLd={[faqSchema(FAQS)]}
      />

      {/* Compliance header */}
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
              Get inspection
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
              src={PHOTOS.tearOff}
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
                  <CloudLightning className="w-3.5 h-3.5" />
                  Hurricane & Storm Damage Inspection
                </div>
                <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05] mb-5 drop-shadow-lg">
                  Storm damage? <span className="text-primary">We're on it.</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-200/95 leading-relaxed mb-7 max-w-xl">
                  Free hurricane and wind-damage roof inspections across Cape
                  Coral, Fort Myers, Naples and all of Southwest Florida.
                  Emergency tarping, insurance claim documentation, and
                  Florida-wind-code repairs from a licensed local contractor.
                </p>

                <ul className="space-y-2.5 mb-7">
                  {[
                    "Fast emergency response — same-day inspections when possible",
                    "Emergency tarping to stop active leaks",
                    "Photo + written documentation for your insurance claim",
                    "All repairs meet current FL wind code",
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
                    href={`tel:${SITE.phoneTel}`}
                    className="bg-primary hover:bg-primary/90 text-white px-7 py-4 rounded-full font-semibold text-base tracking-tight shadow-lg shadow-primary/40 hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Call now: {SITE.phoneDisplay}
                  </a>
                  <a
                    href="#quote-form"
                    className="bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/25 text-white px-7 py-4 rounded-full font-semibold text-base tracking-tight inline-flex items-center justify-center gap-2"
                  >
                    Request inspection
                    <ArrowRight className="w-4 h-4" />
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
                  <FreeQuoteForm
                    lockService="storm-damage"
                    sourceTag="storm-damage-quote"
                    title={
                      <>
                        Free storm damage <span className="text-primary">inspection</span>.
                      </>
                    }
                    subtitle="Send your phone number — we'll reach out fast."
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Urgency strip — facts, not pressure */}
        <section className="bg-amber-50 border-y border-amber-200 py-4">
          <div className="container mx-auto max-w-6xl px-4 flex items-center justify-center gap-3 text-center text-sm font-semibold text-amber-900">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              Florida hurricane season runs June 1 – November 30. Document storm
              damage as soon as it's safe — many policies have time limits.
            </span>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-2">
                What we do
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground leading-tight">
                Storm-ready, insurance-ready, code-ready.
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

        {/* REAL JOB PHOTOS — repair gallery for trust */}
        <section className="py-16 md:py-20 bg-muted/40">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-2">
                Real repairs by our crew
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground leading-tight">
                Storm damage we've fixed in Southwest Florida.
              </h2>
              <p className="text-sm text-muted-foreground mt-3 max-w-xl mx-auto">
                Every photo is a real CHS Roofing job, taken by our team on
                site. No stock images.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
              {FOUNDER_PHOTOS.repair.slice(0, 6).map((src, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-2xl overflow-hidden border border-border/60 bg-card shadow-sm"
                >
                  <img
                    src={src}
                    alt={`CHS Roofing repair work — example ${i + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-2">
                How it works
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground leading-tight">
                From phone call to permanent repair.
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  n: "1",
                  title: "Call or request an inspection",
                  body: "We'll get a crew out to assess damage, photograph everything, and tarp the roof if water is actively getting in.",
                },
                {
                  n: "2",
                  title: "Full inspection report",
                  body: "Within 24–48 hours you get a written assessment with photos and measurements — built so your insurance adjuster can act on it.",
                },
                {
                  n: "3",
                  title: "Permanent repair to FL wind code",
                  body: "Once your claim is sorted, we do the permanent repair to current Florida code — important for safety and future insurability.",
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

        {/* TESTIMONIALS */}
        <section className="py-16 md:py-20 bg-muted/40">
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
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto max-w-3xl px-4">
            <div className="text-center mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-2">
                Frequently asked
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground leading-tight">
                Storm damage, answered straight.
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
              Storm hit your roof?{" "}
              <span className="text-primary">Don't wait to document it.</span>
            </h2>
            <p className="text-gray-300/95 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
              Free inspection. Written report you can hand your insurance company. No
              high-pressure sales — just an honest assessment from a licensed Florida
              contractor.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <a
                href={`tel:${SITE.phoneTel}`}
                className="bg-primary hover:bg-primary/90 text-white px-7 py-4 rounded-full font-semibold text-base tracking-tight shadow-lg shadow-primary/40 hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Call {SITE.phoneDisplay}
              </a>
              <a
                href="#quote-form"
                className="bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/25 text-white px-7 py-4 rounded-full font-semibold text-base tracking-tight inline-flex items-center justify-center gap-2"
              >
                Request inspection
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <BBBBadges variant="dark" />
          </div>
        </section>
      </main>

      {/* Compliance footer */}
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
                <Link href="/services/storm-damage" className="hover:text-primary">
                  Learn more about storm damage
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto max-w-6xl px-4 pt-6 mt-6 border-t border-white/10 text-xs text-secondary-foreground/60">
          <p className="leading-relaxed">
            By submitting the form on this page you consent to {SITE.brand} contacting you by
            phone, text, or email about your inspection request. Message and data rates may
            apply. You can opt out at any time. See our{" "}
            <Link href="/privacy" className="underline hover:text-secondary-foreground">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="underline hover:text-secondary-foreground">
              Terms of Service
            </Link>{" "}
            for details. {SITE.brand} does not represent or work for any insurance company
            — we're an independent licensed roofing contractor.
          </p>
          <p className="mt-3 text-center">
            © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
