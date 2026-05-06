import { Star } from "lucide-react";
import { SITE } from "@/lib/site-config";

type Size = number | string;

/**
 * Official Google "G" 4-color mark. Always renders the original
 * Google brand colors so it remains recognizable on light or dark
 * backgrounds.
 */
export function GoogleLogo({
  size = 16,
  className = "",
}: {
  size?: Size;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Google"
    >
      <path
        d="M43.6 20.5H24v7h11.1c-1.1 5.4-5.8 9-11.1 9a12.5 12.5 0 010-25c3.1 0 5.9 1.1 8.1 3l5-5A21 21 0 003 24a21 21 0 0021 21 21 21 0 0020.6-25.5z"
        fill="#4285F4"
      />
      <path
        d="M6.3 14.7l5.8 4.3A12.5 12.5 0 0124 11.5c3.1 0 5.9 1.1 8.1 3l5-5A21 21 0 006.3 14.7z"
        fill="#EA4335"
      />
      <path
        d="M24 45a21 21 0 0014.6-5.8l-6.7-5.5A12.5 12.5 0 0124 36.5a12.4 12.4 0 01-11.7-8.2l-5.9 4.5A21 21 0 0024 45z"
        fill="#34A853"
      />
      <path
        d="M43.6 20.5H24v7h11.1a11.3 11.3 0 01-4.2 5.7l6.7 5.5C41.5 35 44 30 44 24c0-1.2-.1-2.4-.4-3.5z"
        fill="#FBBC05"
      />
    </svg>
  );
}

/**
 * Compact "Reviews on Google" pill badge. Renders the colored G,
 * the rating + star count, and links out to the Google Business
 * review URL when used as an `<a>`.
 */
export function GoogleReviewsBadge({
  rating = "5.0",
  variant = "light",
  href,
  className = "",
}: {
  rating?: string;
  variant?: "light" | "dark";
  href?: string;
  className?: string;
}) {
  const target = href ?? SITE.social.google;
  const isDark = variant === "dark";
  const Inner = (
    <>
      <GoogleLogo size={20} />
      <span className="flex flex-col leading-tight">
        <span className={`text-[9px] uppercase tracking-[0.18em] font-semibold ${isDark ? "text-white/70" : "text-muted-foreground"}`}>
          Google Reviews
        </span>
        <span className="flex items-center gap-1">
          <span className={`text-sm font-bold tracking-tight ${isDark ? "text-white" : "text-foreground"}`}>
            {rating}
          </span>
          <span className="flex gap-px">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-3.5 h-3.5 fill-[#FBBC05] text-[#FBBC05]"
              />
            ))}
          </span>
        </span>
      </span>
    </>
  );

  const baseClasses = `inline-flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 transition-all hover:-translate-y-0.5 hover:shadow-md ${
    isDark
      ? "bg-white/10 border border-white/15 hover:bg-white/15"
      : "bg-card border border-border/60 shadow-sm hover:border-primary/40"
  } ${className}`;

  return (
    <a
      href={target}
      target="_blank"
      rel="noopener noreferrer"
      className={baseClasses}
      aria-label={`See CHS Roofing reviews on Google — ${rating} stars`}
    >
      {Inner}
    </a>
  );
}
