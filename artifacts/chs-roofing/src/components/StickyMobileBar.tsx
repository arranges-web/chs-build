import { Phone, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function StickyMobileBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${show ? "translate-y-0" : "translate-y-full"}`}
      role="region"
      aria-label="Quick contact actions"
    >
      <div className="bg-secondary border-t-2 border-primary shadow-[0_-10px_30px_rgba(0,0,0,0.25)] flex">
        <a
          href="tel:+12390000000"
          className="flex-1 flex items-center justify-center gap-2 py-4 text-white font-display font-bold uppercase tracking-wide text-sm border-r border-white/10 active:bg-white/5"
        >
          <Phone className="w-4 h-4 text-primary" />
          Call Now
        </a>
        <button
          onClick={scrollToContact}
          className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary text-white font-display font-bold uppercase tracking-wide text-sm active:bg-primary/80"
        >
          Free Quote
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
