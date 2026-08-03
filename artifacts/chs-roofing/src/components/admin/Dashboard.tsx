import { useEffect, useState } from "react";
import {
  ArrowRight,
  Briefcase,
  Calculator,
  CheckCircle2,
  Eye,
  HardHat,
  Inbox,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  api,
  type AdminJob,
  type AnalyticsResponse,
  type Customer,
} from "@/lib/api";
import type { AdminSection } from "./AdminShell";

type AnyRow = Record<string, unknown>;

type Props = {
  adminKey: string;
  leads: AnyRow[] | null;
  estimates: AnyRow[] | null;
  onNavigate: (s: AdminSection) => void;
  onOpenJob?: (jobId: number, customerId: number) => void;
};

const STATUS_META: Record<string, { label: string; cls: string }> = {
  scheduled: { label: "Scheduled", cls: "bg-foreground/[0.05] text-foreground/80" },
  in_progress: { label: "In progress", cls: "bg-primary/10 text-primary" },
  complete: { label: "Complete", cls: "bg-emerald-100 text-emerald-700" },
  on_hold: { label: "On hold", cls: "bg-amber-100 text-amber-700" },
};

const fmtDate = (s?: string | null) => {
  if (!s) return "—";
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? s : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const fmtNumber = (n: number) => n.toLocaleString("en-US");

export default function Dashboard({ adminKey, leads, estimates, onNavigate, onOpenJob }: Props) {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [customers, setCustomers] = useState<Customer[] | null>(null);
  const [jobs, setJobs] = useState<AdminJob[] | null>(null);
  const [demoState, setDemoState] = useState<
    | { kind: "idle" }
    | { kind: "loading"; reset: boolean }
    | { kind: "ready"; portalUrl: string; reset: boolean }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [a, c, j] = await Promise.all([
        api.getAnalytics(adminKey, 30),
        api.listCustomers(adminKey),
        api.listAllJobs(adminKey),
      ]);
      if (cancelled) return;
      if ("data" in a) setAnalytics(a.data);
      if (c) setCustomers(c.rows);
      if ("data" in j) setJobs(j.data.rows);
    })();
    return () => {
      cancelled = true;
    };
  }, [adminKey]);

  const loadDemo = async (reset: boolean) => {
    setDemoState({ kind: "loading", reset });
    const res = await api.loadDemo(adminKey, reset);
    if ("error" in res) {
      setDemoState({ kind: "error", message: res.error });
      return;
    }
    const portalUrl = `${window.location.origin}/portal?account=${encodeURIComponent(
      res.data.accountNumber,
    )}`;
    setDemoState({ kind: "ready", portalUrl, reset });
  };

  const activeJobs = (jobs ?? []).filter(
    (j) => j.status === "in_progress" || j.status === "scheduled",
  );
  const recentLeads = (leads ?? []).slice(0, 5);
  const recentEstimates = (estimates ?? []).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Demo portal launcher — click "Load demo data" and the CHS
          founder can open the customer portal end-to-end with a
          realistic project already populated. Reset wipes and
          re-seeds it, so it's safe to click around and reset. */}
      <section className="bg-gradient-to-br from-primary/[0.06] via-card to-card border border-primary/25 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Demo portal
            </div>
            <h3 className="font-display font-bold text-foreground text-lg">
              See exactly what your customers see.
            </h3>
            <p className="text-[13px] text-muted-foreground mt-0.5">
              Loads a rich sample project (Cordero · Palm Drive) with
              milestones, photos, documents, inspections, warranty, and
              messages — then opens the portal for you.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 md:shrink-0">
            <button
              type="button"
              onClick={() => void loadDemo(false)}
              disabled={demoState.kind === "loading"}
              className="inline-flex items-center justify-center gap-1.5 bg-primary text-white text-sm font-semibold px-4 h-10 rounded-full shadow-md shadow-primary/30 hover:bg-primary/90 disabled:opacity-60 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {demoState.kind === "loading" && !demoState.reset ? "Loading…" : "Load demo data"}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!confirm("Reset the demo customer? This wipes the current demo data and re-seeds it fresh.")) return;
                void loadDemo(true);
              }}
              disabled={demoState.kind === "loading"}
              className="inline-flex items-center justify-center gap-1.5 bg-card border border-border/60 text-foreground text-sm font-semibold px-4 h-10 rounded-full hover:border-primary/40 disabled:opacity-60 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${demoState.kind === "loading" && demoState.reset ? "animate-spin" : ""}`} />
              Reset demo
            </button>
          </div>
        </div>

        {demoState.kind === "error" && (
          <p className="mt-3 text-[12px] text-destructive">
            {demoState.message}
          </p>
        )}
        {demoState.kind === "ready" && (
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 bg-card border border-border/60 rounded-xl p-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-primary">
                {demoState.reset ? "Demo reset — ready" : "Demo ready"}
              </p>
              <p className="font-mono text-[12px] text-foreground/85 truncate">
                {demoState.portalUrl}
              </p>
            </div>
            <a
              href={demoState.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 bg-primary text-white text-sm font-semibold px-4 h-10 rounded-full hover:bg-primary/90 shrink-0"
            >
              Open portal
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </section>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          icon={Users}
          label="Customers"
          value={customers ? fmtNumber(customers.length) : "—"}
          sub="total in CRM"
          onClick={() => onNavigate("clients")}
        />
        <MetricCard
          icon={Briefcase}
          label="Active projects"
          value={fmtNumber(activeJobs.length)}
          sub="scheduled + in progress"
          onClick={() => onNavigate("projects" as AdminSection)}
        />
        <MetricCard
          icon={Inbox}
          label="Leads"
          value={leads ? fmtNumber(leads.length) : "—"}
          sub="all time"
          onClick={() => onNavigate("leads")}
        />
        <MetricCard
          icon={Calculator}
          label="Estimates"
          value={estimates ? fmtNumber(estimates.length) : "—"}
          sub="all time"
          onClick={() => onNavigate("estimates")}
        />
        <MetricCard
          icon={Eye}
          label="Pageviews"
          value={analytics ? fmtNumber(analytics.totals.views) : "—"}
          sub={`last ${analytics?.days ?? 30} days`}
          onClick={() => onNavigate("analytics" as AdminSection)}
        />
        <MetricCard
          icon={TrendingUp}
          label="Sessions"
          value={analytics ? fmtNumber(analytics.totals.sessions) : "—"}
          sub={`last ${analytics?.days ?? 30} days`}
          onClick={() => onNavigate("analytics" as AdminSection)}
        />
      </div>

      {/* 30-day trend */}
      {analytics && analytics.pageviewsByDay.length > 0 && (
        <section className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-foreground text-base">
              Pageviews · last 30 days
            </h3>
            <button
              type="button"
              onClick={() => onNavigate("analytics" as AdminSection)}
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              Full analytics <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <Sparkline data={analytics.pageviewsByDay} />
        </section>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Active projects */}
        <section className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-foreground text-base inline-flex items-center gap-2">
              <HardHat className="w-4 h-4 text-primary" />
              Active projects
            </h3>
            <button
              type="button"
              onClick={() => onNavigate("projects" as AdminSection)}
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              See all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          {activeJobs.length === 0 ? (
            <EmptyState text="No active projects." />
          ) : (
            <ul className="space-y-3">
              {activeJobs.slice(0, 5).map((j) => {
                const meta = STATUS_META[j.status] ?? STATUS_META.scheduled;
                return (
                  <li key={j.id}>
                    <button
                      type="button"
                      onClick={() => onOpenJob?.(j.id, j.customerId)}
                      className="w-full text-left rounded-lg hover:bg-muted/40 -mx-2 px-2 py-1.5 transition-colors"
                    >
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <p className="font-semibold text-foreground text-sm truncate">{j.title}</p>
                        <span className={`text-[10px] uppercase tracking-[0.16em] font-semibold px-2 py-0.5 rounded-full ${meta.cls}`}>
                          {meta.label}
                        </span>
                      </div>
                      <p className="text-[12px] text-muted-foreground mt-0.5 truncate">
                        {j.customerName ?? "—"}
                        {j.estimatedCompletion ? ` · ETA ${fmtDate(j.estimatedCompletion)}` : ""}
                      </p>
                      <ProgressBar progress={j.progress} className="mt-2" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Recent leads */}
        <section className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-foreground text-base inline-flex items-center gap-2">
              <Inbox className="w-4 h-4 text-primary" />
              Latest leads
            </h3>
            <button
              type="button"
              onClick={() => onNavigate("leads")}
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              See all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          {recentLeads.length === 0 ? (
            <EmptyState text="No leads yet." />
          ) : (
            <ul className="space-y-3">
              {recentLeads.map((r, i) => (
                <li key={(r.id as number | undefined) ?? i}>
                  <p className="font-semibold text-foreground text-sm">
                    {(r.name as string) || "Anonymous lead"}
                  </p>
                  <p className="text-[12px] text-muted-foreground">
                    {(r.serviceType as string) || "—"}
                    {r.email ? ` · ${r.email}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recent estimates */}
        <section className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-foreground text-base inline-flex items-center gap-2">
              <Calculator className="w-4 h-4 text-primary" />
              Latest estimates
            </h3>
            <button
              type="button"
              onClick={() => onNavigate("estimates")}
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              See all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          {recentEstimates.length === 0 ? (
            <EmptyState text="No estimates yet." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wider text-foreground/60">
                    <th className="text-left font-semibold px-2 py-2">Contact</th>
                    <th className="text-left font-semibold px-2 py-2">Material</th>
                    <th className="text-right font-semibold px-2 py-2">Range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {recentEstimates.map((r, i) => (
                    <tr key={(r.id as number | undefined) ?? i}>
                      <td className="px-2 py-2">
                        <p className="font-semibold text-foreground">
                          {(r.name as string) || "—"}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                          {(r.email as string) ?? ""}
                        </p>
                      </td>
                      <td className="px-2 py-2 capitalize">
                        {((r.material as string) ?? "").replace(/-/g, " ")}
                      </td>
                      <td className="px-2 py-2 text-right font-semibold text-foreground whitespace-nowrap">
                        {fmtCurrency(r.lowEstimate)} – {fmtCurrency(r.highEstimate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
  onClick,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  sub: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left bg-card border border-border/60 rounded-2xl p-4 shadow-sm hover:border-primary/40 hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between mb-2">
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
      <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
    </button>
  );
}

function ProgressBar({ progress, className = "" }: { progress: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, Number.isFinite(progress) ? progress : 0));
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground">
          Progress
        </span>
        <span className="text-[11px] font-semibold text-foreground">{pct}%</span>
      </div>
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Sparkline({
  data,
}: {
  data: Array<{ day: string; views: number; sessions: number }>;
}) {
  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">No data yet.</p>;
  }
  const max = Math.max(...data.map((d) => d.views), 1);
  const widthPct = 100 / data.length;
  return (
    <div className="flex items-end gap-1 h-32">
      {data.map((d) => {
        const h = (d.views / max) * 100;
        return (
          <div
            key={d.day}
            className="flex-1 flex flex-col items-center gap-1"
            title={`${d.day} · ${d.views} views · ${d.sessions} sessions`}
            style={{ minWidth: `${widthPct}%` }}
          >
            <div className="w-full flex-1 flex items-end">
              <div
                className="w-full bg-primary/80 hover:bg-primary rounded-t-sm transition-colors"
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
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <p className="text-sm text-muted-foreground inline-flex items-center gap-1.5">
      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
      {text}
    </p>
  );
}

function fmtCurrency(raw: unknown): string {
  const n = Number(raw);
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}
