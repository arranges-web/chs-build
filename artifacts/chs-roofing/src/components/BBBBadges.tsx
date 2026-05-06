type Layout = "row" | "stack";

const BADGES = [
  {
    label: "BBB Business Review for Cordova Home Services LLC",
    href: "https://www.bbb.org/us/fl/cape-coral/profile/roofing-contractors/cordova-home-services-llc-0653-90450754/#sealclick",
    src: "https://seal-westflorida.bbb.org/seals/blue-seal-250-52-whitetxt-bbb-90450754.png",
    width: 250,
    height: 52,
  },
  {
    label: "Request a quote from Cordova Home Services LLC on BBB",
    href: "https://www.bbb.org/west-florida/quote/request-cordova-home-services-llc-90450754/#buttonclick",
    src: "https://seal-westflorida.bbb.org/request-a-quote/blue-badge-90-144-blue-bbb-90450754.png",
    width: 144,
    height: 90,
  },
  {
    label: "Leave a customer review for Cordova Home Services LLC on BBB",
    href: "https://www.bbb.org/west-florida/customer-reviews/roofing-contractors/cordova-home-services-llc-in-cape-coral-fl-90450754/add/",
    src: "https://seal-westflorida.bbb.org/customer-reviews/badge-7-bbb-90450754.png",
    width: 220,
    height: 80,
  },
] as const;

type Props = {
  layout?: Layout;
  className?: string;
  variant?: "light" | "dark";
};

export default function BBBBadges({ layout = "row", className = "", variant = "light" }: Props) {
  const isDark = variant === "dark";
  return (
    <div
      className={`flex ${
        layout === "stack" ? "flex-col items-start" : "flex-wrap items-center justify-center"
      } gap-4 md:gap-5 ${className}`}
      aria-label="BBB Accreditation badges for Cordova Home Services LLC"
    >
      {BADGES.map((b) => (
        <a
          key={b.src}
          href={b.href}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className={`inline-flex items-center justify-center rounded-xl border ${
            isDark ? "border-white/10 bg-white/5" : "border-border/60 bg-card"
          } px-3 py-2 hover:-translate-y-0.5 hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
        >
          <img
            src={b.src}
            alt={b.label}
            width={b.width}
            height={b.height}
            loading="lazy"
            decoding="async"
            className="block h-auto w-auto max-h-[72px] md:max-h-[88px]"
            style={{ border: 0 }}
          />
        </a>
      ))}
    </div>
  );
}
