import { Phone, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { SITE } from "@/lib/site-config";

export default function StickyMobileBar() {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`md:hidden fixed bottom-3 left-3 right-3 z-50 transition-all duration-500 ease-out ${
        show ? "translate-y-0 opacity-100" : "translate-y-[140%] opacity-0 pointer-events-none"
      }`}
      role="region"
      aria-label="Quick contact"
    >
      <div className="glass-surface-dark rounded-2xl border border-white/10 shadow-2xl shadow-black/30 flex overflow-hidden p-1.5 gap-1.5">
        <a
          href={`tel:${SITE.phoneTel}`}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold tracking-tight text-sm active:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
          aria-label={t("common.callLabel", { phone: SITE.phoneDisplay })}
        >
          <Phone className="w-4 h-4 text-primary" />
          {t("common.callNow")}
        </a>
        <Link
          href="/contact"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-semibold tracking-tight text-sm shadow-md shadow-primary/40 active:bg-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
        >
          {t("common.freeQuote")}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
