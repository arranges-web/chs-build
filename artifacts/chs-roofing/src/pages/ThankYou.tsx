import { useEffect, useMemo } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Seo from "@/components/Seo";
import { usePageViewTracker } from "@/hooks/usePageViewTracker";
import BBBBadges from "@/components/BBBBadges";
import { GoogleReviewsBadge } from "@/components/GoogleLogo";
import { SITE } from "@/lib/site-config";
import { gaLeadConversion } from "@/lib/gtag";

/**
 * /thank-you — landing page customers see after submitting any
 * lead/quote form. Built standalone (no global header/footer chrome)
 * so it stays focused: confirmation → what happens next → high-intent
 * fallback (phone). Two query-string flavors:
 *
 *   ?from=free-quote   — paid-traffic version with a phone-first CTA
 *   ?from=contact      — standard contact-form version
 *
 * We also support ?name=Sandin to greet by first name when the form
 * already collected one. Conversion-tracking pixels (Google Ads, Meta)
 * can be wired here later — the dedicated URL makes that trivial.
 */
export default function ThankYou() {
  const { t } = useTranslation();
  usePageViewTracker();

  const { firstName, from } = useMemo(() => {
    if (typeof window === "undefined") return { firstName: "", from: "" };
    const p = new URLSearchParams(window.location.search);
    const rawName = (p.get("name") ?? "").trim();
    const first = rawName.split(/\s+/)[0] ?? "";
    return { firstName: first, from: p.get("from") ?? "" };
  }, []);

  useEffect(() => {
    const previous = document.title;
    document.title = `Thanks${firstName ? ", " + firstName : ""}! We're on it — ${SITE.brand}`;
    return () => {
      document.title = previous;
    };
  }, [firstName]);

  // Fire the conversion event exactly once when this page mounts.
  // Sends both a GA4 `generate_lead` (so it can be marked as a key
  // event in GA4) and a Google Ads `conversion` (for bidding).
  useEffect(() => {
    gaLeadConversion({ source: from || "form" });
    // Empty deps — this page is the post-submit destination, so a
    // single fire-on-mount is exactly what we want.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  void t;
  const isAds = from === "free-quote";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo
        title="Thanks — we received your quote request | CHS Roofing"
        description="Your free roof quote request was received. A CHS Roofing rep will reach out within 24 hours."
        path="/thank-you"
        noIndex
      />

      {/* Minimal header — logo only, no nav */}
      <header className="border-b border-border/60 bg-white/95 backdrop-blur-xl">
        <div className="container mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src={SITE.logo} alt={`${SITE.brand} logo`} className="w-10 h-10 object-contain" />
            <div className="flex flex-col">
              <span className="font-display text-sm font-bold tracking-tight text-foreground leading-none">
                CHS ROOFING
              </span>
              <span className="hidden sm:block text-[10px] text-muted-foreground font-semibold tracking-[0.18em] uppercase mt-1">
                {SITE.tagline}
              </span>
            </div>
          </Link>
          <a
            href={`tel:${SITE.phoneTel}`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-foreground hover:text-primary"
          >
            <Phone className="w-4 h-4 text-primary" />
            <span className="hidden sm:inline">{SITE.phoneDisplay}</span>
            <span className="sm:hidden">Call</span>
          </a>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO confirmation */}
        <section className="relative py-14 md:py-20 overflow-hidden bg-gradient-to-br from-primary/[0.06] via-background to-background">
          <div className="container mx-auto max-w-3xl px-4 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary text-white shadow-lg shadow-primary/40 mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-primary mb-3">
              <Sparkles className="w-3.5 h-3.5 inline mr-1" />
              Request received
            </p>
            <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight leading-[1.05] text-foreground mb-4">
              {firstName ? <>Thanks, <span className="text-primary">{firstName}</span> —</> : <>Thanks — </>}
              <br className="hidden sm:block" />
              we're <span className="text-primary">on it</span>.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Your free roof quote request is in. A CHS Roofing team member
              will reach out within <span className="font-bold text-foreground">24 hours</span> with
              a transparent, no-pressure estimate.
            </p>

            <div className="mt-8 inline-flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`tel:${SITE.phoneTel}`}
                className="bg-primary hover:bg-primary/90 text-white px-7 py-4 rounded-full font-semibold text-base tracking-tight shadow-lg shadow-primary/40 hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                {isAds ? `Skip the wait — call ${SITE.phoneDisplay}` : `Call us: ${SITE.phoneDisplay}`}
              </a>
              <a
                href={`sms:${SITE.phoneTel}`}
                className="bg-card hover:bg-foreground/[0.04] border border-border/60 hover:border-primary/40 text-foreground px-7 py-4 rounded-full font-semibold text-base tracking-tight transition-all inline-flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-primary" />
                Text us
              </a>
            </div>
          </div>
        </section>

        {/* WHAT HAPPENS NEXT — short 3-step explainer */}
        <section className="py-14 md:py-16 bg-muted/40 border-y border-border/60">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="text-center mb-10">
              <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-primary mb-2">
                What happens next
              </p>
              <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-foreground leading-tight">
                Three quick steps from here.
              </h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <NextStep
                n="1"
                icon={Mail}
                title="We review your details"
                body="A specialist looks over your address, roof age, and what you're after — usually within the hour."
              />
              <NextStep
                n="2"
                icon={Calendar}
                title="We schedule a free inspection"
                body="If it makes sense, we set up a no-pressure on-site look at a time that works for you."
              />
              <NextStep
                n="3"
                icon={ShieldCheck}
                title="You get a clear written quote"
                body="Line-itemed, plain-English estimate within 24–48 hours. No hidden fees. No high-pressure sales."
              />
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="py-10 bg-background">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-foreground/80">
              <span className="flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-4 h-4 text-primary" />
                FL License {SITE.license}
              </span>
              <span className="hidden md:block w-px h-5 bg-border" />
              <GoogleReviewsBadge />
              <span className="hidden md:block w-px h-5 bg-border" />
              <span className="flex items-center gap-1.5 font-semibold">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                5-star service
              </span>
              <span className="hidden md:block w-px h-5 bg-border" />
              <span className="flex items-center gap-1.5 font-semibold">
                <Clock className="w-4 h-4 text-primary" />
                Family-owned since {SITE.established}
              </span>
            </div>
            <div className="mt-6 flex justify-center">
              <BBBBadges />
            </div>
          </div>
        </section>

        {/* Soft fallback — back to site / portal */}
        <section className="pb-16 bg-background">
          <div className="container mx-auto max-w-3xl px-4">
            <div className="bg-secondary text-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-primary mb-1">
                  Already a customer?
                </p>
                <p className="font-display font-bold text-xl tracking-tight">
                  Track your project in the portal.
                </p>
                <p className="text-sm text-secondary-foreground/80 mt-1 leading-relaxed">
                  Status updates, photos, and team messages — anytime.
                </p>
              </div>
              <Link
                href="/portal"
                className="self-start md:self-auto inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-3 rounded-full font-semibold text-sm tracking-tight shadow-md shadow-primary/30 transition-colors"
              >
                Open my portal
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Want to keep exploring?{" "}
              <Link href="/" className="text-primary font-semibold hover:underline">
                Head back to chs-roofing.com
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
      </footer>
    </div>
  );
}

function NextStep({
  n,
  icon: Icon,
  title,
  body,
}: {
  n: string;
  icon: typeof Mail;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm h-full">
      <div className="flex items-center gap-3 mb-3">
        <span className="w-9 h-9 rounded-full bg-primary text-white font-display font-bold text-base flex items-center justify-center shadow-md shadow-primary/30">
          {n}
        </span>
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <h3 className="font-display font-bold text-base tracking-tight text-foreground mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}
