import { Link } from "wouter";
import { Facebook, Instagram, MapPin, Phone, Mail, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SITE, SERVICES, MATERIALS } from "@/lib/site-config";
import BBBBadges from "@/components/BBBBadges";
import { GoogleLogo, GoogleReviewsBadge } from "@/components/GoogleLogo";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-secondary text-secondary-foreground border-t border-border/10 pt-16 pb-24 md:pb-8 relative overflow-hidden">
      {/* Monogram watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-12 -right-10 select-none font-display font-bold tracking-tighter text-white/[0.04] leading-none"
        style={{ fontSize: "clamp(220px, 28vw, 480px)" }}
      >
        CHS
      </div>
      <div className="container mx-auto max-w-7xl px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12 relative">

        {/* Brand Col */}
        <div className="space-y-5 lg:col-span-2">
          <Link href="/" className="flex items-center gap-3">
            <img src={SITE.logo} alt="CHS Roofing" className="h-16 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold tracking-tight text-white leading-none">CHS ROOFING</span>
              <span className="text-[10px] text-secondary-foreground/70 font-semibold tracking-[0.18em] uppercase mt-1">
                {SITE.tagline}
              </span>
            </div>
          </Link>
          <p className="text-sm text-secondary-foreground/80 leading-relaxed max-w-md">
            {t("footer.brandTagline", { year: SITE.established })}
          </p>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] font-semibold text-secondary-foreground/60">
            <span className="h-px w-6 bg-primary/70" />
            {t("footer.established", { year: SITE.established })}
            <span className="opacity-50">·</span>
            <span>{SITE.city}</span>
          </div>
          <div className="flex gap-3">
            <a
              href={SITE.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("footer.facebookAria")}
              className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
            >
              <Facebook className="w-5 h-5" aria-hidden="true" />
            </a>
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("footer.instagramAria")}
              className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
            >
              <Instagram className="w-5 h-5" aria-hidden="true" />
            </a>
            <a
              href={SITE.social.google}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("footer.googleAria")}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-primary/10 transition-colors"
            >
              <GoogleLogo size={20} />
            </a>
          </div>
          <div className="pt-2">
            <GoogleReviewsBadge variant="dark" />
          </div>
          <div className="pt-2">
            <BBBBadges variant="dark" layout="row" className="justify-start" />
          </div>
        </div>

        {/* Services Col */}
        <div>
          <h4 className="font-display text-xs font-semibold mb-5 text-white tracking-[0.2em] uppercase">{t("footer.services")}</h4>
          <ul className="space-y-2.5 text-sm">
            {SERVICES.map(s => (
              <li key={s.slug}>
                <Link href={s.href} className="hover:text-primary transition-colors">
                  {t(`services.${s.slug}.title`, { defaultValue: s.title })}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Materials Col */}
        <div>
          <h4 className="font-display text-xs font-semibold mb-5 text-white tracking-[0.2em] uppercase">{t("footer.materials")}</h4>
          <ul className="space-y-2.5 text-sm">
            {MATERIALS.map(m => (
              <li key={m.slug}>
                <Link href={m.href} className="hover:text-primary transition-colors">
                  {t(`materials.${m.slug}.title`, { defaultValue: m.title })}
                </Link>
              </li>
            ))}
          </ul>
          <h4 className="font-display text-xs font-semibold mt-6 mb-3 text-white tracking-[0.2em] uppercase">{t("footer.more")}</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/gallery/residential" className="hover:text-primary transition-colors">{t("header.nav.residentialGallery")}</Link></li>
            <li><Link href="/gallery/commercial" className="hover:text-primary transition-colors">{t("header.nav.commercialGallery")}</Link></li>
            <li><Link href="/gallery/multifamily" className="hover:text-primary transition-colors">{t("header.nav.multifamilyGallery")}</Link></li>
            <li><Link href="/estimator" className="hover:text-primary transition-colors">{t("footer.roofingEstimator")}</Link></li>
            <li><Link href="/portal" className="hover:text-primary transition-colors">{t("header.topBar.customerPortal")}</Link></li>
            <li><Link href="/about" className="hover:text-primary transition-colors">{t("footer.aboutUs")}</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">{t("footer.contact")}</Link></li>
          </ul>
        </div>

        {/* Contact Col */}
        <div>
          <h4 className="font-display text-xs font-semibold mb-5 text-white tracking-[0.2em] uppercase">{t("footer.contact")}</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <a href={`tel:${SITE.phoneTel}`} className="block text-white font-bold hover:text-primary transition-colors">
                  {SITE.phoneDisplay}
                </a>
                <span className="text-xs text-secondary-foreground/70">{t("footer.emergencyLine")}</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-primary mt-0.5" />
              <a href={`mailto:${SITE.email}`} className="hover:text-primary transition-colors break-all">
                {SITE.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <span>{SITE.city}<br />{t("footer.servingSWFL")}</span>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary mt-0.5" />
              <span>{SITE.hours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-secondary-foreground/60 relative">
        <p>{t("footer.rights", { year: new Date().getFullYear(), name: SITE.legalName, brand: SITE.brand, license: SITE.license })}</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-white transition-colors">{t("footer.privacy")}</Link>
          <Link href="/terms" className="hover:text-white transition-colors">{t("footer.terms")}</Link>
        </div>
      </div>

      {/* Designer credit — minimal, low contrast, dead-center. */}
      <div className="container mx-auto max-w-7xl px-4 pt-3 text-center">
        <p className="text-[10px] tracking-wider text-secondary-foreground/40">
          Designed by{" "}
          <a
            href="https://arrangesmarketing.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-secondary-foreground/70 transition-colors underline-offset-2 hover:underline"
          >
            Arranges Marketing
          </a>
        </p>
      </div>
    </footer>
  );
}
