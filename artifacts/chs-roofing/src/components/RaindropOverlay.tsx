interface Props {
  /** How many raindrops to render. */
  count?: number;
  /** Tint of the raindrop stroke (white for dark backgrounds, dark for light). */
  tint?: "light" | "dark";
  className?: string;
}

/**
 * A decorative, slow-drifting raindrop layer used on storm-themed sections.
 * Pure CSS animation; respects prefers-reduced-motion (see .raindrop in index.css).
 */
export default function RaindropOverlay({
  count = 22,
  tint = "light",
  className = "",
}: Props) {
  const stroke = tint === "light" ? "white" : "hsl(220 10% 18%)";
  const drops = Array.from({ length: count }).map((_, i) => {
    // Pseudo-random but deterministic placement so SSR / re-renders stay stable.
    const seed = i * 9301 + 49297;
    const r1 = (seed % 233280) / 233280;
    const r2 = ((seed * 1103) % 233280) / 233280;
    const r3 = ((seed * 7919) % 233280) / 233280;
    return {
      left: `${(r1 * 100).toFixed(2)}%`,
      delay: `${(r2 * 5).toFixed(2)}s`,
      duration: `${(5.5 + r3 * 4).toFixed(2)}s`,
      opacity: 0.32 + r2 * 0.35,
      length: 12 + Math.round(r3 * 8),
    };
  });

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {drops.map((d, i) => (
        <span
          key={i}
          className="raindrop absolute -top-6"
          style={{
            left: d.left,
            opacity: d.opacity,
            animationDelay: d.delay,
            animationDuration: d.duration,
          }}
        >
          <svg width="2" height={d.length} viewBox={`0 0 2 ${d.length}`}>
            <line
              x1="1"
              y1="0"
              x2="1"
              y2={d.length}
              stroke={stroke}
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        </span>
      ))}
    </div>
  );
}
