type Props = {
  className?: string;
  variant?: "filled" | "outline";
};

export default function Monogram({ className = "w-10 h-10", variant = "filled" }: Props) {
  const isOutline = variant === "outline";
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="chsCrimson" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(348, 78%, 42%)" />
          <stop offset="100%" stopColor="hsl(348, 72%, 30%)" />
        </linearGradient>
      </defs>
      <path
        d="M32 3 L60 17 L60 33 C60 47 48 57 32 61 C16 57 4 47 4 33 L4 17 Z"
        fill={isOutline ? "none" : "url(#chsCrimson)"}
        stroke={isOutline ? "currentColor" : "rgba(255,255,255,0.18)"}
        strokeWidth={isOutline ? 2 : 1}
      />
      <path
        d="M14 30 L32 16 L50 30 L50 32 L46 32 L46 44 L36 44 L36 36 L28 36 L28 44 L18 44 L18 32 L14 32 Z"
        fill={isOutline ? "currentColor" : "white"}
        opacity={isOutline ? 1 : 0.95}
      />
      <text
        x="32"
        y="55"
        textAnchor="middle"
        fontSize="7"
        fontWeight="800"
        fontFamily="Oswald, sans-serif"
        letterSpacing="1.5"
        fill={isOutline ? "currentColor" : "white"}
      >
        CHS
      </text>
    </svg>
  );
}
