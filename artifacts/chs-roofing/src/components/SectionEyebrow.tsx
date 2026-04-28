interface Props {
  number: string;
  label: string;
  variant?: "light" | "dark";
  className?: string;
}

export default function SectionEyebrow({ number, label, variant = "dark", className = "" }: Props) {
  const numColor = variant === "light" ? "text-white/40" : "text-foreground/30";
  const labelColor = "text-primary";
  return (
    <div className={`inline-flex items-center gap-3 mb-3 ${className}`}>
      <span className={`font-display font-bold text-xs tracking-[0.3em] ${numColor}`}>{number}</span>
      <span className="h-px w-6 bg-primary/60" />
      <span className={`font-semibold text-xs tracking-[0.2em] uppercase ${labelColor}`}>{label}</span>
    </div>
  );
}
