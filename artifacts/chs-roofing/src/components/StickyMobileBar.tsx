import { Phone, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { SITE } from "@/lib/site-config";

export default function StickyMobileBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`md:hidden fixed bottom-3 left-3 right-3 z-50 transition-all duration-500 ease-out ${show ? "translate-y-0 opacity-100" : "translate-y-[120%] opacity-0"}`}
      role="region"
      aria-label="Quick contact actions"
    >
      <div className="glass-surface-dark rounded-2xl border border-white/10 shadow-2xl flex overflow-hidden p-1.5 gap-1.5">
        <a
          href={`tel:${SITE.phoneTel}`}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold tracking-tight text-sm active:bg-white/10 transition-colors"
        >
          <Phone className="w-4 h-4 text-primary" />
          Call Now
        </a>
        <Link
          href="/contact"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-semibold tracking-tight text-sm shadow-md shadow-primary/40 active:bg-primary/80 transition-colors"
        >
          Free Quote
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
