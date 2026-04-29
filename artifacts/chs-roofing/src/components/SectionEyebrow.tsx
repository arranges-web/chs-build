type Props = {
  number: string;
  label: string;
  className?: string;
};

/**
 * Section number/label eyebrow with a small crimson roof-peak (▲) glyph
 * that subtly nods to the CHS roof brand identity.
 */
export default function SectionEyebrow({ number, label, className = "" }: Props) {
  return (
    <div
      className={`inline-flex items-center gap-2 mb-4 text-[11px] font-semibold tracking-[0.22em] uppercase ${className}`}
    >
      <svg
        aria-hidden="true"
        width="9"
        height="7"
        viewBox="0 0 9 7"
        className="text-primary shrink-0"
      >
        <path d="M4.5 0 L9 7 L0 7 Z" fill="currentColor" />
      </svg>
      <span className="text-primary">{number}</span>
      <span aria-hidden="true" className="w-6 h-px bg-border" />
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}
