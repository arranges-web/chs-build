import { useEffect, useState } from "react";
import { BarChart3, Eye, RefreshCw, TrendingUp, Users } from "lucide-react";
import { api, type AnalyticsResponse } from "@/lib/api";

const RANGES = [
  { id: 7, label: "Last 7 days" },
  { id: 14, label: "Last 14 days" },
  { id: 30, label: "Last 30 days" },
  { id: 60, label: "Last 60 days" },
  { id: 90, label: "Last 90 days" },
];

const fmt = (n: number) => n.toLocaleString("en-US");

export default function Analytics({ adminKey }: { adminKey: string }) {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (range: number) => {
    setLoading(true);
    setError(null);
    const res = await api.getAnalytics(adminKey, range);
    if (res) {
      setData(res);
    } else {
      setError("Couldn't load analytics. The DB tables may not be migrated yet — run pnpm --filter @workspace/db run push.");
    }
    setLoading(false);
  };

  useEffect(() => {
    void load(days);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  return (
    <div className="space-y-5">
      {/* Range toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {RANGES.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setDays(r.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              days === r.id
                ? "bg-primary text-white"
                : "bg-card border border-border/60 text-foreground hover:border-primary/40"
            }`}
          >
            {r.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => void load(days)}
          className="ml-auto inline-flex items-center gap-1.5 px-3 h-9 rounded-full text-xs font-semibold text-foreground bg-card border border-border/60 hover:border-primary/40"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-destructive/40 bg-destructive/5 text-destructive text-sm whitespace-pre-line">
          {error}
        </div>
      )}

      {!data && !error ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : data ? (
        <>
          {/* Totals */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Total icon={Eye} label="Pageviews" value={fmt(data.totals.views)} />
            <Total icon={TrendingUp} label="Sessions" value={fmt(data.totals.sessions)} />
            <Total icon={BarChart3} label="New leads" value={fmt(data.totals.leads)} />
            <Total icon={Users} label="New customers" value={fmt(data.totals.customers)} />
          </div>

          {/* Day-by-day chart */}
          <section className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
            <h3 className="font-display font-bold text-foreground text-base mb-3">
              Traffic by day
            </h3>
            <DayChart data={data.pageviewsByDay} />
          </section>

          {/* Top paths + referrers */}
          <div className="grid lg:grid-cols-2 gap-4">
            <section className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
              <h3 className="font-display font-bold text-foreground text-base mb-3">Top pages</h3>
              <BarList items={data.topPaths.map((r) => ({ label: r.path, value: r.views }))} />
            </section>
            <section className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
              <h3 className="font-display font-bold text-foreground text-base mb-3">
                Top referrers
              </h3>
              <BarList
                items={data.topReferrers.map((r) => ({ label: r.referrer || "(direct)", value: r.views }))}
              />
            </section>
          </div>

          <p className="text-[11px] text-muted-foreground">
            Tracker is built-in, anonymous, and self-hosted — no Google Analytics or third-party
            cookies. Pageviews fire once per route change from every public page; admin and portal
            screens are excluded.
          </p>
        </>
      ) : null}
    </div>
  );
}

function Total({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Eye;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-card border border-border/60 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
      </div>
      <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground">
        {label}
      </p>
      <p className="font-display font-bold text-2xl text-foreground tracking-tight mt-0.5">
        {value}
      </p>
    </div>
  );
}

function DayChart({ data }: { data: Array<{ day: string; views: number; sessions: number }> }) {
  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">No visits in this range yet.</p>;
  }
  const max = Math.max(...data.map((d) => d.views), 1);
  return (
    <div>
      <div className="flex items-end gap-1 h-48">
        {data.map((d) => {
          const h = (d.views / max) * 100;
          return (
            <div
              key={d.day}
              className="flex-1 flex flex-col items-center gap-1 group"
              title={`${d.day} · ${d.views} views · ${d.sessions} sessions`}
            >
              <div className="w-full flex-1 flex items-end">
                <div
                  className="w-full bg-primary/80 group-hover:bg-primary rounded-t-sm transition-colors"
                  style={{ height: `${Math.max(h, 3)}%` }}
                />
              </div>
              <span className="text-[9px] text-muted-foreground/70 truncate">
                {d.day.slice(5)}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground">
        <span>Views per day</span>
        <span>Peak {max}</span>
      </div>
    </div>
  );
}

function BarList({ items }: { items: Array<{ label: string; value: number }> }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No data yet.</p>;
  }
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it.label}>
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <span className="text-[12px] text-foreground truncate font-mono">{it.label}</span>
            <span className="text-[12px] font-semibold text-foreground tabular-nums shrink-0">
              {fmt(it.value)}
            </span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${(it.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
