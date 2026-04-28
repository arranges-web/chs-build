import { TESTIMONIALS } from "@/lib/site-config";
import { Quote } from "lucide-react";

export default function TestimonialMarquee() {
  const items = [...TESTIMONIALS, ...TESTIMONIALS];
  return (
    <div
      className="relative overflow-hidden mt-14 group"
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-muted to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-muted to-transparent z-10" />
      <div className="flex gap-4 animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {items.map((t, i) => (
          <div
            key={`${t.name}-${i}`}
            className="shrink-0 inline-flex items-center gap-3 bg-card border border-border/60 rounded-full pl-3 pr-5 py-2 shadow-sm"
          >
            <Quote className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="text-sm text-foreground/80 italic max-w-md truncate">
              "{t.text.split(".")[0]}."
            </span>
            <span className="text-xs font-semibold text-muted-foreground tracking-wide whitespace-nowrap">
              — {t.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
