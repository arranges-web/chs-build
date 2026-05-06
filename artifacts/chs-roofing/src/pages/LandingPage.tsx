import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  HardHat,
  Home as HomeIcon,
  MapPin,
  Phone,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { Link } from "wouter";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ContactForm from "@/components/ContactForm";
import BBBBadges from "@/components/BBBBadges";
import { GoogleLogo, GoogleReviewsBadge } from "@/components/GoogleLogo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { PHOTOS, SITE, TESTIMONIALS } from "@/lib/site-config";

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.45, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export default function LandingPage() {
  const { t } = useTranslation();

  // Set focused page title for paid traffic landing — re-runs on language change.
  useEffect(() => {
    const previous = document.title;
    document.title = t("lp.docTitle", { brand: SITE.brand });
    return () => {
      document.title = previous;
    };
  }, [t]);

  const benefitIcons = [ShieldCheck, Clock, HardHat, HomeIcon];
  const benefits = (
    t("lp.benefits", {
      returnObjects: true,
      license: SITE.license,
      year: SITE.established,
      city: SITE.city,
    }) as { title: string; desc: string }[]
  ).map((b, i) => ({ ...b, icon: benefitIcons[i] ?? ShieldCheck }));

  const process = (
    t("lp.process", { returnObjects: true }) as { title: string; desc: string }[]
  ).map((p, i) => ({ ...p, n: String(i + 1) }));

  const reviews = [TESTIMONIALS[0], TESTIMONIALS[1], TESTIMONIALS[3]];

  const faqs = t("lp.faqs", { returnObjects: true }) as { q: string; a: string }[];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Minimal sticky header — no nav distractions for paid traffic */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-border/60">
        <div className="container mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label={`${SITE.brand} home`}>
            <img src={SITE.logo} alt={`${SITE.brand} logo`} className="w-10 h-10 md:w-12 md:h-12 object-contain" />
            <div className="flex flex-col">
              <span className="font-display text-sm md:text-base font-bold tracking-tight text-foreground leading-none">
                CHS ROOFING
              </span>
              <span className="hidden sm:block text-[10px] text-muted-foreground font-semibold tracking-[0.18em] uppercase mt-1">
                {SITE.tagline}
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2.5">
            <LanguageSwitcher />
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
              {t("common.freeQuote")}
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
              src={PHOTOS.beachfrontMetal}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/85 to-secondary/55" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-secondary/40" />
          </div>

          <div className="container mx-auto max-w-6xl px-4 relative z-10">
            <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 items-center">
              <div className="text-white">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/90 text-primary-foreground text-[11px] font-semibold tracking-wide uppercase shadow-md backdrop-blur-md border border-white/20 mb-5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {t("lp.heroBadge")}
                </div>
                <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05] mb-5 drop-shadow-lg">
                  {t("lp.heroTitleStart")} <span className="text-primary">{t("lp.heroTitleAccent")}</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-200/95 leading-relaxed mb-7 max-w-xl">
                  {t("lp.heroSubtitle", { year: SITE.established })}
                </p>

                <ul className="space-y-2.5 mb-7">
                  {(t("lp.heroBullets", { returnObjects: true }) as string[]).map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-white">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="font-medium text-[15px] leading-snug">{item}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-2.5 text-white">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="font-medium text-[15px] leading-snug">
                      {t("lp.heroLicensedLine", { license: SITE.license })}
                    </span>
                  </li>
                </ul>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="#quote-form"
                    className="bg-primary hover:bg-primary/90 text-white px-7 py-4 rounded-full font-semibold text-base tracking-tight shadow-lg shadow-primary/40 hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2"
                  >
                    {t("common.getMyFreeQuote")}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href={`tel:${SITE.phoneTel}`}
                    className="bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/25 text-white px-7 py-4 rounded-full font-semibold text-base tracking-tight inline-flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    {t("common.callLabel", { phone: SITE.phoneDisplay })}
                  </a>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3 text-white/90 text-sm">
                  <GoogleReviewsBadge variant="dark" />
                  <span className="flex items-center gap-1.5 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-primary" /> {t("lp.trust.bbbAccredited")}
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Users className="w-4 h-4 text-primary" /> {t("lp.trust.projects")}
                  </span>
                </div>
              </div>

              <div id="quote-form" className="relative scroll-mt-24">
                <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
                <div className="relative">
                  <ContactForm />
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
                <CheckCircle2 className="w-4 h-4 text-primary" /> {t("trust.license", { license: SITE.license })}
              </span>
              <span className="hidden md:block w-px h-5 bg-border" />
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" /> {t("trust.fullyInsured")}
              </span>
              <span className="hidden md:block w-px h-5 bg-border" />
              <span className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> {t("lp.trust.fiveStar")}
              </span>
              <span className="hidden md:block w-px h-5 bg-border" />
              <span className="flex items-center gap-2">
                <HomeIcon className="w-4 h-4 text-primary" /> {t("trust.familyOwnedSince", { year: SITE.established })}
              </span>
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground leading-tight">
                {t("lp.benefitsTitle", { brand: SITE.brand })}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {benefits.map((b, i) => (
                <FadeIn key={i} delay={i * 0.06}>
                  <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow h-full">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <b.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display font-bold text-lg tracking-tight text-foreground mb-1.5">
                      {b.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="py-16 md:py-20 bg-muted/40">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground leading-tight">
                {t("lp.processTitle")}
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {process.map((p, i) => (
                <FadeIn key={i} delay={i * 0.08}>
                  <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm h-full">
                    <div className="w-11 h-11 rounded-full bg-primary text-white font-display font-bold text-lg flex items-center justify-center mb-4 shadow-md shadow-primary/30">
                      {p.n}
                    </div>
                    <h3 className="font-display font-bold text-lg tracking-tight text-foreground mb-1.5">
                      {p.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-2">
                {t("lp.reviewsEyebrow")}
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground leading-tight">
                {t("lp.reviewsTitle")}
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {reviews.map((r, i) => (
                <FadeIn key={i} delay={i * 0.06}>
                  <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm h-full flex flex-col relative">
                    <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10" />
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
                </FadeIn>
              ))}
            </div>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <GoogleReviewsBadge />
              <a
                href={SITE.social.google}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-card border border-border/60 hover:border-primary/40 px-5 py-2.5 rounded-full text-sm font-semibold text-foreground hover:text-primary transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <GoogleLogo size={16} />
                {t("common.readAllReviewsOnGoogle")}
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-20 bg-muted/40">
          <div className="container mx-auto max-w-3xl px-4">
            <div className="text-center mb-10">
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground leading-tight">
                {t("lp.faqTitle")}
              </h2>
            </div>
            <div className="space-y-3">
              {faqs.map((f, i) => (
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
              {t("lp.finalCtaTitle")} <span className="text-primary">{t("lp.finalCtaAccent")}</span>
            </h2>
            <p className="text-gray-300/95 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
              {t("lp.finalCtaSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <a
                href="#quote-form"
                className="bg-primary hover:bg-primary/90 text-white px-7 py-4 rounded-full font-semibold text-base tracking-tight shadow-lg shadow-primary/40 hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2"
              >
                {t("common.getMyFreeQuote")}
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={`tel:${SITE.phoneTel}`}
                className="bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/25 text-white px-7 py-4 rounded-full font-semibold text-base tracking-tight inline-flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                {t("common.callLabel", { phone: SITE.phoneDisplay })}
              </a>
            </div>
            <BBBBadges variant="dark" />
          </div>
        </section>
      </main>

      {/* Minimal footer with required legal links */}
      <footer className="bg-secondary text-secondary-foreground border-t border-white/10 py-10">
        <div className="container mx-auto max-w-6xl px-4 grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="font-display font-bold text-white tracking-tight">
              {SITE.legalName} <span className="text-secondary-foreground/60 font-normal">({SITE.brand})</span>
            </p>
            <p className="text-secondary-foreground/70 mt-1">
              {t("trust.license", { license: SITE.license })} · {t("trust.fullyInsured")} · {t("trust.bbbAccredited")} A+
            </p>
            <p className="text-secondary-foreground/70 mt-1">
              {SITE.city} · {t("footer.servingSWFL")}
            </p>
          </div>
          <div className="flex md:justify-center">
            <ul className="space-y-1.5">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /><a href={`tel:${SITE.phoneTel}`} className="hover:text-primary">{SITE.phoneDisplay}</a></li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" />{SITE.city}</li>
            </ul>
          </div>
          <div className="md:text-right">
            <ul className="space-y-1.5">
              <li><Link href="/privacy" className="hover:text-primary">{t("footer.privacy")}</Link></li>
              <li><Link href="/terms" className="hover:text-primary">{t("footer.terms")}</Link></li>
              <li><Link href="/" className="hover:text-primary">{t("lp.fullSite")}</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto max-w-6xl px-4 pt-6 mt-6 border-t border-white/10 text-xs text-secondary-foreground/60 text-center">
          © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
