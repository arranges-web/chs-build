import { useEffect, useMemo, useState } from "react";
import {
  Bot,
  CalendarDays,
  CheckCircle2,
  FileText,
  Instagram,
  Facebook,
  Globe,
  Link2,
  ListTree,
  Loader2,
  MapPin,
  Search,
  Sparkles,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { SOCIAL_POSTS } from "@/lib/social-calendar";
import { SEO_CHANGES, seoChangesInLastNDays, type SeoChangeCategory } from "@/lib/seo-log";

const RANGES = [
  { id: 30, label: "Last 30 days" },
  { id: 60, label: "Last 60 days" },
  { id: 9999, label: "All time" },
];

const CATEGORY_STYLES: Record<SeoChangeCategory, { icon: typeof FileText; color: string }> = {
  "New Page": { icon: FileText, color: "bg-primary/10 text-primary" },
  "Structured Data": { icon: ListTree, color: "bg-blue-500/10 text-blue-600" },
  "Meta & Titles": { icon: Search, color: "bg-purple-500/10 text-purple-600" },
  Sitemap: { icon: MapPin, color: "bg-emerald-500/10 text-emerald-600" },
  "Internal Linking": { icon: Link2, color: "bg-amber-500/10 text-amber-600" },
  Backlinks: { icon: TrendingUp, color: "bg-teal-500/10 text-teal-600" },
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
  const [days, setDays] = useState(30);
  const changes = useMemo(() => seoChangesInLastNDays(days), [days]);
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
  const backlinksAdded = changes
    .filter((c) => c.category === "Backlinks")
    .reduce((sum, c) => sum + (c.count ?? 1), 0);

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
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary bg-white/10 px-3 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" /> SEO Activity
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {RANGES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setDays(r.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    days === r.id
                      ? "bg-primary text-white"
                      : "bg-white/10 border border-white/15 text-white/80 hover:border-white/30"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight leading-tight mb-2">
            Genuine, verifiable work — every change ships to the live site.
          </h2>
          <p className="text-sm text-white/70 max-w-2xl">
            This log tracks real search-optimization changes shipped to chs-roofing.com —
            new location pages, structured data, sitemap updates, and internal linking. No
            placeholder or hypothetical entries.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
            <StatCard icon={FileText} label="New pages published" value={String(newPages)} />
            <StatCard icon={ListTree} label="Schema blocks added" value={String(schemaChanges)} />
            <StatCard
              icon={MapPin}
              label="Pages in sitemap"
              value={sitemapCount !== null ? String(sitemapCount) : "…"}
              hint="live count"
            />
            <StatCard
              icon={TrendingUp}
              label="Backlinks added"
              value={String(backlinksAdded)}
              hint="manually reported"
            />
            <StatCard icon={CheckCircle2} label="Total changes logged" value={String(changes.length)} />
          </div>
        </div>
      </div>

      {/* GEO / AI answer-engine discoverability */}
      <DiscoverabilityPanel />

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

      {/* Social media calendar */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 md:p-7">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="font-display font-bold tracking-tight text-lg text-foreground flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" /> Social Media Calendar
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full bg-muted text-muted-foreground shrink-0">
            Scheduled manually
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-6">
          One post every {"3"} days for the next 30 days. There's no connected social API on this
          site, so these are queued and published by hand — treat this as a posting plan, not an
          automated log.
        </p>

        <div className="space-y-2.5">
          {SOCIAL_POSTS.map((p, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-background border border-border/60 rounded-xl p-4"
            >
              <span className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-secondary/10 text-secondary">
                {p.platform === "Facebook" ? (
                  <Facebook className="w-4 h-4" />
                ) : p.platform === "Instagram" ? (
                  <Instagram className="w-4 h-4" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-foreground">{fmtDate(p.date)}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">
                    {p.platform}
                  </span>
                </div>
                <h4 className="font-semibold text-foreground text-sm mb-0.5">{p.topic}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{p.notes}</p>
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

/**
 * Live status panel for the pieces that make CHS discoverable and
 * quotable by AI answer engines (ChatGPT, Claude, Perplexity,
 * Gemini). Each row HEAD-fetches the actual asset from the deployed
 * origin so this reflects what's really live — not what's declared
 * in code — the same way the sitemap counter above does.
 */
type CheckStatus = "loading" | "ok" | "missing";
type CheckRow = {
  key: string;
  label: string;
  path: string;
  what: string;
};

const DISCOVERABILITY_CHECKS: CheckRow[] = [
  {
    key: "sitemap",
    label: "sitemap.xml",
    path: "/sitemap.xml",
    what: "Lists every indexable page for search engines and AI crawlers.",
  },
  {
    key: "robots",
    label: "robots.txt",
    path: "/robots.txt",
    what: "Crawler access rules — explicit allowlist for GPTBot, ClaudeBot, PerplexityBot, Google-Extended, and more.",
  },
  {
    key: "llms",
    label: "llms.txt",
    path: "/llms.txt",
    what: "LLM-friendly site index following the llmstxt.org convention. Tells AI answer engines what CHS does, what to say about us, and where to link.",
  },
  {
    key: "ai",
    label: "ai.txt",
    path: "/ai.txt",
    what: "AI usage policy — allows answer-engine indexing, requires attribution, blocks derivative image training.",
  },
];

function DiscoverabilityPanel() {
  const [statuses, setStatuses] = useState<Record<string, CheckStatus>>(() =>
    Object.fromEntries(DISCOVERABILITY_CHECKS.map((c) => [c.key, "loading"])),
  );
  const [schemaCounts, setSchemaCounts] = useState<{
    total: number;
    types: string[];
    hasOffer: boolean;
    hasGeoCircle: boolean;
    hasCredential: boolean;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Poke each discoverability file with HEAD. HEAD is cheap and
      // enough to know it deployed.
      await Promise.all(
        DISCOVERABILITY_CHECKS.map(async (c) => {
          try {
            const r = await fetch(c.path, { method: "HEAD", cache: "no-store" });
            if (cancelled) return;
            setStatuses((s) => ({ ...s, [c.key]: r.ok ? "ok" : "missing" }));
          } catch {
            if (!cancelled) setStatuses((s) => ({ ...s, [c.key]: "missing" }));
          }
        }),
      );

      // Also introspect the JSON-LD blocks that are already loaded
      // into this page — every SPA route inherits the same
      // index.html so what's here reflects what crawlers see.
      try {
        const blocks = Array.from(
          document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]'),
        );
        const parsed = blocks
          .map((b) => {
            try {
              return JSON.parse(b.textContent ?? "");
            } catch {
              return null;
            }
          })
          .filter(Boolean) as Array<Record<string, unknown>>;
        const types = new Set<string>();
        let hasOffer = false;
        let hasGeoCircle = false;
        let hasCredential = false;
        for (const p of parsed) {
          const t = p["@type"];
          if (typeof t === "string") types.add(t);
          if (Array.isArray(t)) t.forEach((x) => typeof x === "string" && types.add(x));
          const asString = JSON.stringify(p);
          if (asString.includes('"Offer"')) hasOffer = true;
          if (asString.includes('"GeoCircle"')) hasGeoCircle = true;
          if (asString.includes('"EducationalOccupationalCredential"')) hasCredential = true;
        }
        if (!cancelled) {
          setSchemaCounts({
            total: parsed.length,
            types: Array.from(types).sort(),
            hasOffer,
            hasGeoCircle,
            hasCredential,
          });
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-5 md:p-7">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display font-bold tracking-tight text-lg text-foreground flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            AI &amp; Geo discoverability
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Live status of the files that let ChatGPT, Claude, Perplexity, and
            Gemini find and recommend CHS Roofing. Checks the deployed origin
            in real time — green means it's live for crawlers.
          </p>
        </div>
      </div>

      <ul className="grid sm:grid-cols-2 gap-3 mb-5">
        {DISCOVERABILITY_CHECKS.map((c) => {
          const status = statuses[c.key];
          return (
            <li
              key={c.key}
              className="flex items-start gap-3 bg-background border border-border/60 rounded-xl p-3.5"
            >
              <StatusIcon status={status} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <a
                    href={c.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-sm text-foreground hover:text-primary font-mono"
                  >
                    {c.label}
                  </a>
                  <StatusPill status={status} />
                </div>
                <p className="text-[12px] text-muted-foreground mt-0.5 leading-snug">
                  {c.what}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Structured data introspection — same JSON-LD Google + LLMs
          see. Reads from the DOM so it stays in sync automatically. */}
      <div className="bg-muted/40 border border-border/60 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <ListTree className="w-4 h-4 text-primary" />
          <p className="font-semibold text-sm text-foreground">
            Structured data on this page
          </p>
        </div>
        {schemaCounts ? (
          <>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              <strong className="text-foreground">{schemaCounts.total}</strong>{" "}
              JSON-LD block{schemaCounts.total === 1 ? "" : "s"} declared —{" "}
              <span className="font-mono text-[11px]">
                {schemaCounts.types.join(", ") || "no types detected"}
              </span>
              .
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <SchemaFlag ok={schemaCounts.hasCredential} label="License credential" />
              <SchemaFlag ok={schemaCounts.hasGeoCircle} label="GeoCircle service area" />
              <SchemaFlag ok={schemaCounts.hasOffer} label="Priced Offers" />
            </div>
          </>
        ) : (
          <p className="text-[13px] text-muted-foreground">Checking…</p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 items-center">
        <a
          href="https://search.google.com/test/rich-results?url=https%3A%2F%2Fchs-roofing.com%2F"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 bg-card border border-border/60 hover:border-primary/40 text-foreground text-[12px] font-semibold px-3 py-1.5 rounded-full"
        >
          <Globe className="w-3 h-3" />
          Google Rich Results Test
        </a>
        <a
          href="https://validator.schema.org/#url=https%3A%2F%2Fchs-roofing.com%2F"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 bg-card border border-border/60 hover:border-primary/40 text-foreground text-[12px] font-semibold px-3 py-1.5 rounded-full"
        >
          <Globe className="w-3 h-3" />
          Schema.org Validator
        </a>
        <a
          href="https://www.google.com/search?q=chs+roofing+cape+coral"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 bg-card border border-border/60 hover:border-primary/40 text-foreground text-[12px] font-semibold px-3 py-1.5 rounded-full"
        >
          <Search className="w-3 h-3" />
          Live Google check
        </a>
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: CheckStatus }) {
  if (status === "loading") {
    return <Loader2 className="w-4 h-4 text-muted-foreground animate-spin shrink-0 mt-0.5" />;
  }
  if (status === "ok") {
    return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />;
  }
  return <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />;
}

function StatusPill({ status }: { status: CheckStatus }) {
  const map: Record<CheckStatus, { label: string; cls: string }> = {
    loading: { label: "Checking…", cls: "bg-muted text-muted-foreground" },
    ok: { label: "Live", cls: "bg-emerald-100 text-emerald-700" },
    missing: { label: "Missing", cls: "bg-red-100 text-red-700" },
  };
  const m = map[status];
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${m.cls}`}>
      {m.label}
    </span>
  );
}

function SchemaFlag({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
        ok ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
      }`}
    >
      {ok ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
      {label}
    </span>
  );
}
