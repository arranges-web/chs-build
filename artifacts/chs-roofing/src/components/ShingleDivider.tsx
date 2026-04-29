interface Props {
  className?: string;
  variant?: "light" | "dark";
  /** Number of shingle tabs per row. Default 28. */
  tabs?: number;
}

const TAB_W = 20;
const GAP = 1.5;

export default function ShingleDivider({
  className = "",
  variant = "light",
  tabs = 28,
}: Props) {
  const fill =
    variant === "light"
      ? "rgba(31,33,38,0.07)"
      : "rgba(255,255,255,0.08)";
  const fillRow2 =
    variant === "light"
      ? "rgba(31,33,38,0.10)"
      : "rgba(255,255,255,0.11)";
  const baseLine =
    variant === "light"
      ? "rgba(31,33,38,0.10)"
      : "rgba(255,255,255,0.10)";
  const totalW = tabs * TAB_W;

  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center py-7 ${className}`}
    >
      <svg
        width="100%"
        height="26"
        viewBox={`0 0 ${totalW} 26`}
        preserveAspectRatio="xMidYMid meet"
        className="max-w-md w-full select-none"
      >
        {/* Row 1 (back row of shingles) */}
        {Array.from({ length: tabs }).map((_, i) => (
          <rect
            key={`a${i}`}
            x={i * TAB_W}
            y={3}
            width={TAB_W - GAP}
            height={9}
            rx={1.5}
            fill={fill}
          />
        ))}
        {/* Row 2 (front row, offset by half-tab — staggered like real architectural shingles) */}
        {Array.from({ length: tabs + 1 }).map((_, i) => (
          <rect
            key={`b${i}`}
            x={i * TAB_W - TAB_W / 2}
            y={13}
            width={TAB_W - GAP}
            height={9}
            rx={1.5}
            fill={fillRow2}
          />
        ))}
        {/* Eave line */}
        <line
          x1={0}
          y1={23}
          x2={totalW}
          y2={23}
          stroke={baseLine}
          strokeWidth="0.75"
        />
        {/* Crimson brand pin in the center */}
        <circle cx={totalW / 2} cy={23} r={2} fill="hsl(var(--primary))" />
      </svg>
    </div>
  );
}
