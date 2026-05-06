import { Phone, ShieldCheck, Star, Home as HomeIcon, Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { SITE, SERVICES, MATERIALS } from "@/lib/site-config";
import HurricaneSeasonPill from "@/components/HurricaneSeasonPill";
import LanguageSwitcher from "@/components/LanguageSwitcher";

type NavGroup = { label: string; href: string; children?: { label: string; href: string }[] };

export default function Header() {
  const { t } = useTranslation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();

  const NAV: NavGroup[] = [
    {
      label: t("header.nav.services"),
      href: "/services/installation",
      children: SERVICES.map((s) => ({
        label: t(`services.${s.slug}.title`, { defaultValue: s.title }),
        href: s.href,
      })),
    },
    {
      label: t("header.nav.materials"),
      href: "/materials/asphalt-shingles",
      children: MATERIALS.map((m) => ({
        label: t(`materials.${m.slug}.title`, { defaultValue: m.title }),
        href: m.href,
      })),
    },
    {
      label: t("header.nav.gallery"),
      href: "/gallery/residential",
      children: [
        { label: t("header.nav.residentialGallery"), href: "/gallery/residential" },
        { label: t("header.nav.commercialGallery"), href: "/gallery/commercial" },
        { label: t("header.nav.multifamilyGallery"), href: "/gallery/multifamily" },
      ],
    },
    { label: t("header.nav.estimator"), href: "/estimator" },
    { label: t("header.nav.about"), href: "/about" },
    { label: t("header.nav.contact"), href: "/contact" },
  ];

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeAll = () => {
    setOpenMenu(null);
    setMobileOpen(false);
    setMobileGroup(null);
  };

  const goToContact = () => {
    closeAll();
    setLocation("/contact");
  };

  return (
    <>
      {/* Top Utility Bar */}
      <div className="bg-secondary text-secondary-foreground py-2 px-4 text-xs font-medium hidden md:block border-b border-white/5">
        <div className="container mx-auto max-w-7xl flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              {t("header.topBar.licensed", { license: SITE.license })}
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-[hsl(var(--accent-gold))] fill-[hsl(var(--accent-gold))]" />
              {t("header.topBar.googleStar")}
            </span>
            <span className="flex items-center gap-1.5">
              <HomeIcon className="w-3.5 h-3.5 text-primary" />
              {t("trust.familyOwnedSince", { year: SITE.established })}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <HurricaneSeasonPill />
            <span className="hidden lg:inline">{t("trust.bilingual")}</span>
            <span className="text-[hsl(var(--accent-gold))] font-semibold">{t("trust.servingAllSWFL")}</span>
            <LanguageSwitcher variant="dark" />
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-50 glass-surface border-b border-border/60">
        <div className="container mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0" aria-label={`${SITE.brand} - ${SITE.legalName}`} onClick={closeAll}>
            <img src={SITE.logo} alt={`${SITE.brand} logo`} className="w-12 h-12 md:w-14 md:h-14 object-contain transition-transform group-hover:scale-105" />
            <div className="hidden sm:flex flex-col">
              <span className="font-display text-base md:text-lg font-bold tracking-tight text-foreground leading-none">
                CHS ROOFING
              </span>
              <span className="text-[9px] md:text-[10px] text-muted-foreground font-semibold tracking-[0.18em] uppercase mt-1">
                {SITE.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav ref={navRef} className="hidden lg:flex items-center gap-1" aria-label={t("header.ariaPrimary")}>
            {NAV.map(group => (
              <div key={group.label} className="relative">
                {group.children ? (
                  <button
                    onClick={() => setOpenMenu(openMenu === group.label ? null : group.label)}
                    onMouseEnter={() => setOpenMenu(group.label)}
                    className="px-3 py-2 rounded-full text-sm font-semibold text-foreground/80 hover:text-foreground hover:bg-foreground/[0.04] transition-colors flex items-center gap-1"
                    aria-haspopup="menu"
                    aria-expanded={openMenu === group.label}
                  >
                    {group.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openMenu === group.label ? "rotate-180" : ""}`} />
                  </button>
                ) : (
                  <Link
                    href={group.href}
                    onClick={() => setOpenMenu(null)}
                    className="px-3 py-2 rounded-full text-sm font-semibold text-foreground/80 hover:text-foreground hover:bg-foreground/[0.04] transition-colors block"
                  >
                    {group.label}
                  </Link>
                )}

                {group.children && openMenu === group.label && (
                  <div
                    onMouseLeave={() => setOpenMenu(null)}
                    className="absolute top-full left-0 mt-2 min-w-[240px] bg-card/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-xl overflow-hidden py-2"
                    role="menu"
                  >
                    {group.children.map(child => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpenMenu(null)}
                        className="block px-4 py-2.5 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors"
                        role="menuitem"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:block lg:hidden">
              <LanguageSwitcher />
            </div>
            <a
              href={`tel:${SITE.phoneTel}`}
              className="hidden md:flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4 text-primary" />
              <span className="hidden xl:inline">{SITE.phoneDisplay}</span>
            </a>
            <button
              onClick={goToContact}
              className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground px-4 lg:px-5 py-2.5 rounded-full font-semibold tracking-tight transition-all duration-300 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 items-center gap-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {t("common.freeQuote")}
            </button>
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="lg:hidden p-2 rounded-xl text-foreground hover:bg-foreground/[0.05] transition-colors"
              aria-label={mobileOpen ? t("header.closeMenu") : t("header.openMenu")}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 top-[68px] z-40 bg-background/95 backdrop-blur-xl overflow-y-auto pb-32">
            <nav className="container mx-auto max-w-7xl px-4 py-6 space-y-2" aria-label={t("header.ariaMobile")}>
              {NAV.map(group => (
                <div key={group.label} className="border-b border-border/40">
                  {group.children ? (
                    <>
                      <button
                        onClick={() => setMobileGroup(mobileGroup === group.label ? null : group.label)}
                        className="w-full flex items-center justify-between py-4 text-left text-base font-semibold text-foreground"
                        aria-expanded={mobileGroup === group.label}
                      >
                        {group.label}
                        <ChevronDown className={`w-5 h-5 transition-transform ${mobileGroup === group.label ? "rotate-180" : ""}`} />
                      </button>
                      {mobileGroup === group.label && (
                        <div className="pb-4 pl-3 space-y-1">
                          {group.children.map(child => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={closeAll}
                              className="block py-2.5 text-sm font-medium text-foreground/80 hover:text-primary"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={group.href}
                      onClick={closeAll}
                      className="block py-4 text-base font-semibold text-foreground"
                    >
                      {group.label}
                    </Link>
                  )}
                </div>
              ))}

              <div className="pt-6 space-y-3">
                <div className="flex justify-center">
                  <LanguageSwitcher />
                </div>
                <a
                  href={`tel:${SITE.phoneTel}`}
                  onClick={closeAll}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-full border-2 border-primary text-primary font-semibold"
                >
                  <Phone className="w-4 h-4" />
                  {t("common.callLabel", { phone: SITE.phoneDisplay })}
                </a>
                <button
                  onClick={goToContact}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/30"
                >
                  {t("common.getFreeQuote")}
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
