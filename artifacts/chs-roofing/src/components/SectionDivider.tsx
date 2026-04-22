import Monogram from "./Monogram";

export default function SectionDivider({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-4 py-2" aria-hidden="true">
      <span className={`h-px w-16 ${light ? "bg-white/20" : "bg-border"}`} />
      <Monogram className={`w-7 h-7 ${light ? "text-[hsl(var(--accent-gold))]" : "text-primary"}`} variant="outline" />
      <span className={`h-px w-16 ${light ? "bg-white/20" : "bg-border"}`} />
    </div>
  );
}
