import { useEffect, useState } from "react";
import { CloudLightning, Sun } from "lucide-react";

type Info =
  | { active: true; day: number; total: number }
  | { active: false };

function getHurricaneInfo(now = new Date()): Info {
  const year = now.getFullYear();
  // Atlantic hurricane season: June 1 – Nov 30 inclusive.
  const seasonStart = new Date(year, 5, 1, 0, 0, 0);
  const seasonEnd = new Date(year, 10, 30, 23, 59, 59);
  if (now >= seasonStart && now <= seasonEnd) {
    const msPerDay = 86400000;
    const day = Math.floor((now.getTime() - seasonStart.getTime()) / msPerDay) + 1;
    const total =
      Math.floor((seasonEnd.getTime() - seasonStart.getTime()) / msPerDay) + 1;
    return { active: true, day, total };
  }
  return { active: false };
}

export default function HurricaneSeasonPill({
  className = "",
}: {
  className?: string;
}) {
  // Compute on mount so SSR-safe and avoids hydration mismatch.
  const [info, setInfo] = useState<Info | null>(null);
  useEffect(() => {
    setInfo(getHurricaneInfo());
  }, []);

  if (!info) return null;

  if (info.active) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-[10.5px] font-semibold tracking-wider uppercase ${className}`}
        title={`Day ${info.day} of ${info.total} of the Atlantic hurricane season`}
        data-testid="hurricane-pill-active"
      >
        <CloudLightning className="w-3 h-3" />
        Hurricane Season · Day {info.day}/{info.total}
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[hsl(var(--accent-gold))]/15 border border-[hsl(var(--accent-gold))]/30 text-[hsl(var(--accent-gold))] text-[10.5px] font-semibold tracking-wider uppercase ${className}`}
      title="Atlantic hurricane season runs June 1 – November 30. Off-season is the best time to re-roof."
      data-testid="hurricane-pill-offseason"
    >
      <Sun className="w-3 h-3" />
      Off-Season · Best Time to Re-Roof
    </span>
  );
}
