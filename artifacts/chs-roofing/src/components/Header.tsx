import {
  Phone,
  ShieldCheck,
  Star,
  Home as HomeIcon,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Wrench,
  Layers,
  Image as ImageIcon,
  Calculator,
  Users,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SITE, SERVICES, MATERIALS } from "@/lib/site-config";
import HurricaneSeasonPill from "@/components/HurricaneSeasonPill";
import LanguageSwitcher from "@/components/LanguageSwitcher";

type NavItem = { label: string; href: string };
type NavGroup = {
  key: string;
  label: string;
  href: string;
  icon: typeof HomeIcon;
  children?: NavItem[];
};

export default function Header() {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useLocation();

  const NAV: NavGroup[] = [
    {
      key: "services",
      label: t("header.nav.services"),
      href: "/services/installation",
      icon: Wrench,
      children: SERVICES.map((s) => ({
        label: t(`services.${s.slug}.title`, { defaultValue: s.title }),
        href: s.href,
      })),
    },
    {
      key: "materials",
      label: t("header.nav.materials"),
      href: "/materials/asphalt-shingles",
      icon: Layers,
      children: MATERIALS.map((m) => ({
        label: t(`materials.${m.slug}.title`, { defaultValue: m.title }),
        href: m.href,
      })),
    },
    {
      key: "gallery",
      label: t("header.nav.gallery"),
      href: "/gallery/residential",
      icon: ImageIcon,
      children: [
        { label: t("header.nav.residentialGallery"), href: "/gallery/residential" },
        { label: t("header.nav.commercialGallery"), href: "/gallery/commercial" },
        { label: t("header.nav.multifamilyGallery"), href: "/gallery/multifamily" },
      ],
    },
    {
      key: "estimator",
      label: t("header.nav.estimator"),
      href: "/estimator",
      icon: Calculator,
    },
    {
      key: "about",
      label: t("header.nav.about"),
      href: "/about",
      icon: Users,
    },
    {
      key: "contact",
      label: t("header.nav.contact"),
      href: "/contact",
      icon: Mail,
    },
  ];

  const isItemActive = (href: string) => {
    if (href === "/") return location === "/";
    return location === href;
  };

  const isGroupActive = (group: NavGroup) => {
    if (group.children) {
      return group.children.some((c) => isItemActive(c.href));
    }
    return isItemActive(group.href);
  };

  // Close hover dropdowns on outside click.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Lock body scroll while drawer open + escape to close.
  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  // Auto-close drawer on route change.
  useEffect(() => {
    setMobileOpen(false);
    setMobileGroup(null);
    setOpenMenu(null);
  }, [location]);

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
      {/* Top Utility Bar — desktop only. Slim, breathable, just the
          two most useful things (quick call + serving area) plus the
          contextual hurricane pill and language switcher. */}
      <div className="bg-secondary text-secondary-foreground py-2.5 px-4 text-xs font-medium hidden md:block border-b border-white/5">
        <div className="container mx-auto max-w-7xl flex justify-between items-center gap-6">
          <div className="flex items-center gap-5 min-w-0">
            <a
              href={`tel:${SITE.phoneTel}`}
              className="flex items-center gap-2 hover:text-primary transition-colors whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-primary" />
              <span className="font-semibold">{SITE.phoneDisplay}</span>
            </a>
            <span className="hidden lg:flex items-center gap-2 text-secondary-foreground/70 whitespace-nowrap">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              {t("trust.license", { license: SITE.license })}
            </span>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <HurricaneSeasonPill />
            <span className="hidden xl:inline text-[hsl(var(--accent-gold))] font-semibold whitespace-nowrap">
              {t("trust.servingAllSWFL")}
            </span>
            <LanguageSwitcher variant="dark" />
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-50 glass-surface border-b border-border/60">
        <div className="container mx-auto max-w-7xl px-4 py-2.5 md:py-3 flex items-center justify-between gap-3">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
            aria-label={`${SITE.brand} — ${SITE.legalName}`}
            onClick={closeAll}
          >
            <img
              src={SITE.logo}
              alt={`${SITE.brand} logo`}
              className="w-11 h-11 md:w-13 md:h-13 lg:w-14 lg:h-14 object-contain transition-transform group-hover:scale-105"
            />
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
          <nav
            ref={navRef}
            className="hidden lg:flex items-center gap-0.5"
            aria-label={t("header.ariaPrimary")}
          >
            {NAV.map((group) => {
              const active = isGroupActive(group);
              return (
                <div key={group.key} className="relative">
                  {group.children ? (
                    <button
                      type="button"
                      onClick={() => setOpenMenu(openMenu === group.key ? null : group.key)}
                      onMouseEnter={() => setOpenMenu(group.key)}
                      className={`px-3 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                        active
                          ? "text-primary bg-primary/10"
                          : "text-foreground/80 hover:text-foreground hover:bg-foreground/[0.04]"
                      }`}
                      aria-haspopup="menu"
                      aria-expanded={openMenu === group.key}
                    >
                      {group.label}
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${openMenu === group.key ? "rotate-180" : ""}`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={group.href}
                      onClick={() => setOpenMenu(null)}
                      className={`px-3 py-2 rounded-full text-sm font-semibold transition-colors block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                        active
                          ? "text-primary bg-primary/10"
                          : "text-foreground/80 hover:text-foreground hover:bg-foreground/[0.04]"
                      }`}
                    >
                      {group.label}
                    </Link>
                  )}

                  <AnimatePresence>
                    {group.children && openMenu === group.key && (
                      <motion.div
                        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                        onMouseLeave={() => setOpenMenu(null)}
                        className="absolute top-full left-0 mt-2 min-w-[260px] bg-card/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-xl overflow-hidden py-2"
                        role="menu"
                      >
                        {group.children.map((child) => {
                          const childActive = isItemActive(child.href);
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setOpenMenu(null)}
                              className={`flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset ${
                                childActive
                                  ? "text-primary bg-primary/5"
                                  : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                              }`}
                              role="menuitem"
                            >
                              <span>{child.label}</span>
                              <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            {/* Tablet language switcher (desktop has it in utility bar) */}
            <div className="hidden md:block lg:hidden">
              <LanguageSwitcher />
            </div>
            {/* Phone — desktop */}
            <a
              href={`tel:${SITE.phoneTel}`}
              className="hidden md:flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg px-2 py-1"
              aria-label={t("common.callLabel", { phone: SITE.phoneDisplay })}
            >
              <Phone className="w-4 h-4 text-primary" />
              <span className="hidden xl:inline">{SITE.phoneDisplay}</span>
            </a>
            {/* Phone — mobile (icon-only quick tap) */}
            <a
              href={`tel:${SITE.phoneTel}`}
              className="md:hidden w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={t("common.callLabel", { phone: SITE.phoneDisplay })}
            >
              <Phone className="w-4.5 h-4.5" />
            </a>
            {/* Free Quote CTA */}
            <button
              type="button"
              onClick={goToContact}
              className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground px-4 lg:px-5 py-2.5 rounded-full font-semibold tracking-tight transition-all duration-300 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 items-center gap-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {t("common.freeQuote")}
            </button>
            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden w-10 h-10 rounded-full text-foreground hover:bg-foreground/[0.05] transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={mobileOpen ? t("header.closeMenu") : t("header.openMenu")}
              aria-expanded={mobileOpen}
              aria-controls="mobile-drawer"
            >
              {mobileOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer + Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm"
              aria-hidden="true"
            />
            <motion.aside
              key="drawer"
              ref={drawerRef}
              id="mobile-drawer"
              role="dialog"
              aria-modal="true"
              aria-label={t("header.ariaMobile")}
              initial={reducedMotion ? { opacity: 0 } : { x: "100%" }}
              animate={reducedMotion ? { opacity: 1 } : { x: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { x: "100%" }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden fixed inset-y-0 right-0 z-[60] w-[88vw] max-w-sm bg-background shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 bg-card">
                <Link
                  href="/"
                  onClick={closeAll}
                  className="flex items-center gap-2.5"
                  aria-label={SITE.brand}
                >
                  <img src={SITE.logo} alt="" aria-hidden="true" className="w-10 h-10 object-contain" />
                  <div className="flex flex-col">
                    <span className="font-display text-base font-bold tracking-tight text-foreground leading-none">
                      CHS ROOFING
                    </span>
                    <span className="text-[9px] text-muted-foreground font-semibold tracking-[0.18em] uppercase mt-0.5">
                      {SITE.tagline}
                    </span>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="w-9 h-9 rounded-full text-foreground/70 hover:text-foreground hover:bg-foreground/[0.05] transition-colors flex items-center justify-center"
                  aria-label={t("header.closeMenu")}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Top Action Strip */}
              <div className="px-4 pt-4 pb-3 border-b border-border/60 bg-card/60 flex items-center gap-2">
                <LanguageSwitcher className="shrink-0" />
                <a
                  href={`tel:${SITE.phoneTel}`}
                  onClick={closeAll}
                  className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-3 rounded-full border-2 border-primary text-primary font-semibold text-sm tracking-tight active:bg-primary/5 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span className="truncate">{SITE.phoneDisplay}</span>
                </a>
              </div>

              {/* Nav list */}
              <nav className="flex-1 overflow-y-auto overscroll-contain px-2 py-3" aria-label={t("header.ariaMobile")}>
                {NAV.map((group) => {
                  const active = isGroupActive(group);
                  const expanded = mobileGroup === group.key;
                  if (!group.children) {
                    return (
                      <Link
                        key={group.key}
                        href={group.href}
                        onClick={closeAll}
                        className={`flex items-center gap-3 px-3.5 py-3.5 rounded-xl text-base font-semibold transition-colors ${
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-foreground/[0.04]"
                        }`}
                      >
                        <span
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            active ? "bg-primary text-white" : "bg-primary/10 text-primary"
                          }`}
                        >
                          <group.icon className="w-4.5 h-4.5" />
                        </span>
                        <span className="flex-1">{group.label}</span>
                        <ChevronRight className="w-4 h-4 opacity-40" />
                      </Link>
                    );
                  }
                  return (
                    <div key={group.key} className="mb-0.5">
                      <button
                        type="button"
                        onClick={() => setMobileGroup(expanded ? null : group.key)}
                        className={`w-full flex items-center gap-3 px-3.5 py-3.5 rounded-xl text-base font-semibold transition-colors ${
                          active || expanded
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-foreground/[0.04]"
                        }`}
                        aria-expanded={expanded}
                      >
                        <span
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            active || expanded ? "bg-primary text-white" : "bg-primary/10 text-primary"
                          }`}
                        >
                          <group.icon className="w-4.5 h-4.5" />
                        </span>
                        <span className="flex-1 text-left">{group.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform opacity-60 ${expanded ? "rotate-180" : ""}`}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {expanded && (
                          <motion.div
                            key="submenu"
                            initial={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                            animate={reducedMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                            exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="pl-14 pr-2 pt-1 pb-2 space-y-0.5">
                              {group.children.map((child) => {
                                const childActive = isItemActive(child.href);
                                return (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    onClick={closeAll}
                                    className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                      childActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-foreground/75 hover:text-primary hover:bg-primary/5"
                                    }`}
                                  >
                                    <span>{child.label}</span>
                                    <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {/* Trust strip */}
                <div className="mt-4 mx-2 px-3.5 py-3 rounded-xl bg-muted/40 border border-border/60 text-[11px] text-muted-foreground space-y-1.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                    <span>{t("header.topBar.licensed", { license: SITE.license })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 text-[hsl(var(--accent-gold))] fill-[hsl(var(--accent-gold))]" />
                    <span>{t("header.topBar.googleStar")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HomeIcon className="w-3.5 h-3.5 text-primary" />
                    <span>{t("trust.familyOwnedSince", { year: SITE.established })}</span>
                  </div>
                </div>
              </nav>

              {/* Sticky bottom CTA */}
              <div className="px-4 py-3 border-t border-border/60 bg-card">
                <button
                  type="button"
                  onClick={goToContact}
                  className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-full bg-primary text-primary-foreground font-semibold text-base shadow-lg shadow-primary/30 active:scale-[0.98] transition-all"
                >
                  {t("common.getFreeQuote")}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
