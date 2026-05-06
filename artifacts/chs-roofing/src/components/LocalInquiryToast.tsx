import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, MapPin, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const SERVICE_AREAS = [
  "Cape Coral",
  "Fort Myers",
  "Naples",
  "Bonita Springs",
  "Estero",
  "Punta Gorda",
  "Sanibel",
  "Lehigh Acres",
  "North Port",
  "Sarasota",
] as const;

const FIRST_NAMES = [
  "Melissa",
  "James",
  "Karen",
  "Brian",
  "Jennifer",
  "Carlos",
  "Angela",
  "Michael",
  "Christine",
  "David",
  "Maria",
  "Tom",
  "Laura",
  "Ricardo",
  "Stephanie",
] as const;

const SERVICES_REL = [
  "a free roof inspection",
  "a roof repair quote",
  "a hurricane-damage assessment",
  "a metal roof estimate",
  "a tile re-roof quote",
  "a maintenance plan",
  "a flat-roof repair",
  "a gutter installation quote",
] as const;

const TIME_LABELS = [
  "just now",
  "1 minute ago",
  "3 minutes ago",
  "8 minutes ago",
  "12 minutes ago",
  "23 minutes ago",
] as const;

const STORAGE_KEY = "chs.inquiry.toast.dismissed.v1";
const FIRST_DELAY_MS = 8000;
const VISIBLE_MS = 7000;
const GAP_MS = 18000;

type Notice = {
  id: number;
  name: string;
  city: string;
  service: string;
  time: string;
};

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildNotice(id: number): Notice {
  return {
    id,
    name: pick(FIRST_NAMES),
    city: pick(SERVICE_AREAS),
    service: pick(SERVICES_REL),
    time: pick(TIME_LABELS),
  };
}

export default function LocalInquiryToast() {
  const reducedMotion = useReducedMotion();
  const [dismissed, setDismissed] = useState(true);
  const [current, setCurrent] = useState<Notice | null>(null);
  const counterRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  // Don't render at all on the contact page — they're already inquiring.
  const onContactPage = useMemo(
    () => typeof window !== "undefined" && window.location.pathname.endsWith("/contact"),
    [],
  );

  useEffect(() => {
    if (onContactPage) return;
    try {
      const isDismissed = sessionStorage.getItem(STORAGE_KEY) === "1";
      setDismissed(isDismissed);
    } catch {
      setDismissed(false);
    }
  }, [onContactPage]);

  useEffect(() => {
    if (dismissed || onContactPage) return;

    const showOnce = () => {
      counterRef.current += 1;
      const next = buildNotice(counterRef.current);
      setCurrent(next);
      timerRef.current = window.setTimeout(() => {
        setCurrent(null);
        timerRef.current = window.setTimeout(showOnce, GAP_MS);
      }, VISIBLE_MS);
    };

    timerRef.current = window.setTimeout(showOnce, FIRST_DELAY_MS);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [dismissed, onContactPage]);

  const dismiss = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setDismissed(true);
    setCurrent(null);
    if (timerRef.current) window.clearTimeout(timerRef.current);
  };

  if (dismissed || onContactPage) return null;

  return (
    <div
      className="fixed z-[55] left-3 md:left-5 bottom-24 md:bottom-6 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.id}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -28, y: 8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -28, y: 8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto max-w-[320px] bg-card/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-xl overflow-hidden"
            role="status"
          >
            <div className="flex items-start gap-3 p-3.5 pr-9 relative">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 relative">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[hsl(var(--accent-gold))] border-2 border-card" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary mb-0.5">
                  New local inquiry
                </p>
                <p className="text-[13px] text-foreground leading-snug">
                  <span className="font-semibold">{current.name}.</span> from{" "}
                  <span className="inline-flex items-center gap-0.5 font-semibold">
                    <MapPin className="w-3 h-3 text-primary" />
                    {current.city}
                  </span>{" "}
                  just requested {current.service}.
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">{current.time}</p>
              </div>
              <button
                type="button"
                onClick={dismiss}
                aria-label="Dismiss notification"
                className="absolute top-2 right-2 w-6 h-6 rounded-md text-muted-foreground hover:text-foreground hover:bg-foreground/5 flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
