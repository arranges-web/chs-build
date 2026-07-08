import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  FileText,
  Link2,
  ListTree,
  MapPin,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { SEO_CHANGES, seoChangesInLastNDays, type SeoChangeCategory } from "@/lib/seo-log";

const CATEGORY_STYLES: Record<SeoChangeCategory, { icon: typeof FileText; color: string }> = {
  "New Page": { icon: FileText, color: "bg-primary/10 text-primary" },
  "Structured Data": { icon: ListTree, color: "bg-blue-500/10 text-blue-600" },
  "Meta & Titles": { icon: Search, color: "bg-purple-500/10 text-purple-600" },
  Sitemap: { icon: MapPin, color: "bg-emerald-500/10 text-emerald-600" },
  "Internal Linking": { icon: Link2, color: "bg-amber-500/10 text-amber-600" },
  Content: { icon: Sparkles, color: "bg-rose-500/10 text-rose-600" },
};

function fmtDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function SeoActivity() {
  const changes = useMemo(() => seoChangesInLastNDays(30), []);
  const [sitemapCount, setSitemapCount] = useState<number | null>(null);

  // Count real, live sitemap entries rather than hardcoding a number —
  // this stays accurate as pages are added or removed.
  useEffect(() => {
    let cancelled = false;
    fetch("/sitemap.xml")
      .then((r) => r.text())
      .then((xml) => {
        if (cancelled) return;
        const matches = xml.match(/<url>/g);
        setSitemapCount(matches ? matches.length : null);
      })
      .catch(() => setSitemapCount(null));
    return () => {
      cancelled = true;
    };
  }, []);

  const newPages = changes.filter((c) => c.category === "New Page").length;
  const schemaChanges = changes.filter((c) => c.category === "Structured Data").length;

  const grouped = useMemo(() => {
    const byDate = new Map<string, typeof changes>();
    for (const c of changes) {
      const list = byDate.get(c.date) ?? [];
      list.push(c);
      byDate.set(c.date, list);
    }
    return Array.from(byDate.entries());
  }, [changes]);

  return (
    <div className="space-y-6">
      {/* Hero stat strip */}
      <div className="relative overflow-hidden rounded-2xl bg-secondary text-white p-6 md:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-primary/20" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-8 -right-6 select-none font-display font-bold tracking-tighter text-white/[0.05] leading-none"
          style={{ fontSize: "clamp(140px, 18vw, 260px)" }}
        >
          SEO
        </div>
        <div className="relative z-10">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary bg-white/10 px-3 py-1 rounded-full mb-4">
            <TrendingUp className="w-3.5 h-3.5" /> SEO Activity — Last 30 Days
          </p>
          <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight leading-tight mb-2">
            Genuine, verifiable work — every change ships to the live site.
          </h2>
          <p className="text-sm text-white/70 max-w-2xl">
            This log tracks real search-optimization changes shipped to chs-roofing.com —
            new location pages, structured data, sitemap updates, and internal linking. No
            placeholder or hypothetical entries.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <StatCard icon={FileText} label="New pages published" value={String(newPages)} />
            <StatCard icon={ListTree} label="Schema blocks added" value={String(schemaChanges)} />
            <StatCard
              icon={MapPin}
              label="Pages in sitemap"
              value={sitemapCount !== null ? String(sitemapCount) : "…"}
              hint="live count"
            />
            <StatCard icon={CheckCircle2} label="Total changes logged" value={String(changes.length)} />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 md:p-7">
        <h3 className="font-display font-bold tracking-tight text-lg text-foreground mb-1">
          Change timeline
        </h3>
        <p className="text-xs text-muted-foreground mb-6">
          Grouped by ship date, most recent first. Sourced from {SEO_CHANGES.length} logged
          entries.
        </p>

        <div className="relative pl-6 space-y-8">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" aria-hidden="true" />
          {grouped.map(([date, items]) => (
            <div key={date} className="relative">
              <span
                className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-primary/15"
                aria-hidden="true"
              />
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-foreground mb-3">
                {fmtDate(date)}
              </p>
              <div className="space-y-3">
                {items.map((c, i) => {
                  const style = CATEGORY_STYLES[c.category];
                  const Icon = style.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-3 bg-background border border-border/60 rounded-xl p-4"
                    >
                      <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${style.color}`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground text-sm">{c.title}</h4>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${style.color}`}
                          >
                            {c.category}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{c.description}</p>
                        {c.pages && c.pages.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {c.pages.map((p) => (
                              <code
                                key={p}
                                className="text-[11px] bg-muted px-2 py-0.5 rounded-md text-foreground/80 font-mono"
                              >
                                {p}
                              </code>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof FileText;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <Icon className="w-4 h-4 text-primary mb-2" />
      <p className="font-display font-bold text-2xl tracking-tight leading-none">{value}</p>
      <p className="text-[11px] text-white/60 mt-1.5 leading-tight">
        {label}
        {hint && <span className="block text-white/40">{hint}</span>}
      </p>
    </div>
  );
}
