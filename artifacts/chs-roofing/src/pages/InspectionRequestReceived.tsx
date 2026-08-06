import { useEffect, useMemo } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Images,
  Mail,
  MessageSquare,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import BBBBadges from "@/components/BBBBadges";
import { GoogleReviewsBadge } from "@/components/GoogleLogo";
import Seo from "@/components/Seo";
import { usePageViewTracker } from "@/hooks/usePageViewTracker";
import { SITE } from "@/lib/site-config";
import { fireInspectionLead, gaEvent } from "@/lib/gtag";

/**
 * /inspection-request-received — dedicated thank-you page for the
 * 21-point inspection form. Fires the Meta Pixel `Lead` event on
 * mount (per spec: "fire after the form is successfully accepted
 * or when the dedicated thank-you page loads") plus the GA4
 * `inspection_form_submit` event. Never fires from a submit-button
 * click, so failed submissions or refreshes aren't counted as
 * conversions.
 */
export default function InspectionRequestReceived() {
  usePageViewTracker();

  const firstName = useMemo(() => {
    if (typeof window === "undefined") return "";
    const p = new URLSearchParams(window.location.search);
    const raw = (p.get("name") ?? "").trim();
    return raw.split(/\s+/)[0] ?? "";
  }, []);

  useEffect(() => {
    const previous = document.title;
    document.title = `Inspection request received — ${SITE.brand}`;
    // Fire Meta Pixel `Lead` + GA4 `inspection_form_submit` exactly
    // once when this page mounts. Empty deps intentional — the
    // dedicated URL is the source of truth for a completed conversion.
    fireInspectionLead();
    return () => {
      document.title = previous;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo
        title="Your Inspection Request Has Been Received | CHS Roofing"
        description="Thank you for requesting a free 21-point roof inspection. A CHS Roofing team member will reach out within 24 hours."
        path="/inspection-request-received"
        noIndex
      />

      {/* Minimal header — logo + call. No nav so the page stays focused. */}
      <header className="border-b border-border/60 bg-white/95 backdrop-blur-xl">
        <div className="container mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src={SITE.logo} alt={`${SITE.brand} logo`} className="w-10 h-10 object-contain" />
            <div className="flex flex-col">
              <span className="font-display text-sm font-bold tracking-tight text-foreground leading-none">
                {SITE.brand}
              </span>
              <span className="hidden sm:block text-[10px] text-muted-foreground font-semibold tracking-[0.18em] uppercase mt-1">
                {SITE.tagline}
              </span>
            </div>
          </Link>
          <a
            href={`tel:${SITE.phoneTel}`}
            onClick={() => gaEvent("click_to_call", { location: "ty-header" })}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-foreground hover:text-primary"
          >
            <Phone className="w-4 h-4 text-primary" />
            <span className="hidden sm:inline">{SITE.phoneDisplay}</span>
            <span className="sm:hidden">Call</span>
          </a>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO — clear confirmation */}
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
              {firstName ? (
                <>
                  Thanks, <span className="text-primary">{firstName}</span> — your{" "}
                </>
              ) : (
                <>Your </>
              )}
              inspection request <br className="hidden sm:block" />
              has been <span className="text-primary">received</span>.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Thank you for contacting CHS Roofing. A member of our team will
              review your information and contact you shortly to discuss your
              roof and schedule the inspection.
            </p>

            <div className="mt-8 inline-flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`tel:${SITE.phoneTel}`}
                onClick={() => gaEvent("click_to_call", { location: "ty-hero" })}
                className="bg-primary hover:bg-primary/90 text-white px-7 py-4 rounded-full font-semibold text-base tracking-tight shadow-lg shadow-primary/40 hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Call CHS Roofing
              </a>
              <a
                href={`sms:${SITE.phoneTel}`}
                onClick={() => gaEvent("click_to_text", { location: "ty-hero" })}
                className="bg-card hover:bg-foreground/[0.04] border border-border/60 hover:border-primary/40 text-foreground px-7 py-4 rounded-full font-semibold text-base tracking-tight transition-all inline-flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-primary" />
                Text CHS Roofing
              </a>
              <Link
                href="/gallery/residential"
                className="bg-card hover:bg-foreground/[0.04] border border-border/60 hover:border-primary/40 text-foreground px-7 py-4 rounded-full font-semibold text-base tracking-tight transition-all inline-flex items-center justify-center gap-2"
              >
                <Images className="w-4 h-4 text-primary" />
                Visit Our Project Gallery
              </Link>
            </div>
          </div>
        </section>

        {/* WHAT HAPPENS NEXT */}
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
                body="A specialist reviews your address, roof concern, and what you're after — usually within the hour."
              />
              <NextStep
                n="2"
                icon={Calendar}
                title="We schedule your inspection"
                body="We call to set up a time that works for you. Most inspections are booked within 24–48 hours."
              />
              <NextStep
                n="3"
                icon={ShieldCheck}
                title="You get a full report"
                body="Photos, a plain-English condition summary, and honest recommendations — no pressure, no obligation."
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

        {/* Portal callout */}
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
