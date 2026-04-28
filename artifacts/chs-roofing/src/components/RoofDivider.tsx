interface Props {
  className?: string;
  variant?: "light" | "dark";
}

export default function RoofDivider({ className = "", variant = "dark" }: Props) {
  const stroke = variant === "light" ? "rgba(255,255,255,0.18)" : "rgba(31,33,38,0.18)";
  return (
    <div className={`flex items-center justify-center gap-3 py-6 ${className}`} aria-hidden="true">
      <span className="h-px w-16 bg-current opacity-20" />
      <svg width="48" height="20" viewBox="0 0 48 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M2 18 L24 4 L46 18"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="24" cy="4" r="1.5" fill="hsl(var(--primary))" />
      </svg>
      <span className="h-px w-16 bg-current opacity-20" />
    </div>
  );
}
