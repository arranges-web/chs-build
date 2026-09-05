import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Calculator,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Eye,
  HardHat,
  Inbox,
  MessageSquare,
  Pause,
  Phone,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  api,
  type AdminCustomerMessageRow,
  type AdminJob,
  type AdminServiceRequestRow,
  type AnalyticsResponse,
  type Customer,
  type UpcomingInspectionRow,
} from "@/lib/api";
import type { AdminSection } from "./AdminShell";
import { isDemoAccount, withoutDemo } from "@/lib/demo";

type AnyRow = Record<string, unknown>;

type Props = {
  adminKey: string;
  leads: AnyRow[] | null;
  estimates: AnyRow[] | null;
  requests: AdminServiceRequestRow[] | null;
  messages: AdminCustomerMessageRow[] | null;
  onNavigate: (s: AdminSection) => void;
  onOpenJob?: (jobId: number, customerId: number) => void;
};

const STATUS_META: Record<string, { label: string; cls: string }> = {
  scheduled: { label: "Scheduled", cls: "bg-foreground/[0.05] text-foreground/80" },
  in_progress: { label: "In progress", cls: "bg-primary/10 text-primary" },
  complete: { label: "Complete", cls: "bg-emerald-100 text-emerald-700" },
  on_hold: { label: "On hold", cls: "bg-amber-100 text-amber-700" },
};

const REQUEST_LABEL: Record<string, string> = {
  leak: "Roof leak inspection",
  warranty: "Warranty service",
  annual: "Annual inspection",
  storm: "Storm damage inspection",
  maintenance: "Maintenance",
  cleaning: "Roof cleaning",
  general: "General request",
};

const DAY = 86_400_000;

const fmtDate = (s?: string | null) => {
  if (!s) return "—";
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? s : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const fmtNumber = (n: number) => n.toLocaleString("en-US");

const relTime = (iso: string) => {
  const ms = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(ms)) return "";
  const m = Math.floor(ms / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? "yesterday" : `${d}d ago`;
};

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};

export default function Dashboard({
  adminKey,
  leads,
  estimates,
  requests,
  messages,
  onNavigate,
  onOpenJob,
}: Props) {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [customers, setCustomers] = useState<Customer[] | null>(null);
  const [jobs, setJobs] = useState<AdminJob[] | null>(null);
  const [inspections, setInspections] = useState<UpcomingInspectionRow[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [a, c, j, i] = await Promise.all([
        api.getAnalytics(adminKey, 30),
        api.listCustomers(adminKey),
        api.listAllJobs(adminKey),
        api.listUpcomingInspections(adminKey),
      ]);
      if (cancelled) return;
      if ("data" in a) setAnalytics(a.data);
      if ("data" in c) setCustomers(c.data.rows);
      if ("data" in j) setJobs(j.data.rows);
      if ("data" in i) setInspections(i.data.rows);
    })();
    return () => {
      cancelled = true;
    };
  }, [adminKey]);

  // ─── Derived "needs attention" ─────────────────────────────────
  // Everything below EXCLUDES the seeded demo customer. Demo data is
  // still browsable in Clients/Projects, but it must never masquerade
  // as real work that needs doing.
  const now = Date.now();

  const newLeads = useMemo(
    () =>
      (leads ?? []).filter((r) => {
        const t = new Date(String(r.createdAt ?? "")).getTime();
        return Number.isFinite(t) && now - t <= 7 * DAY;
      }),
    [leads, now],
  );

  const unreadByCustomer = useMemo(() => {
    const map = new Map<number, AdminCustomerMessageRow & { count: number }>();
    for (const m of messages ?? []) {
      if (m.sender !== "customer" || m.readByTeam) continue;
      if (isDemoAccount(m.accountNumber)) continue;
      const existing = map.get(m.customerId);
      if (!existing || new Date(m.createdAt) > new Date(existing.createdAt)) {
        map.set(m.customerId, { ...m, count: (existing?.count ?? 0) + 1 });
      } else {
        existing.count += 1;
      }
    }
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [messages]);
  const unreadCount = unreadByCustomer.reduce((s, m) => s + m.count, 0);

  const openRequests = useMemo(
    () =>
      withoutDemo(requests ?? [])
        .filter((r) => r.status === "new" || r.status === "in_progress")
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [requests],
  );
  const newRequestCount = openRequests.filter((r) => r.status === "new").length;

  // Jobs list keeps demo rows (they're legitimate to browse), but the
  // ALERT derivations below run on the demo-free set.
  const activeJobs = useMemo(
    () => (jobs ?? []).filter((j) => j.status === "in_progress" || j.status === "scheduled"),
    [jobs],
  );
  const realJobs = useMemo(() => withoutDemo(jobs ?? []), [jobs]);
  const onHoldJobs = useMemo(() => realJobs.filter((j) => j.status === "on_hold"), [realJobs]);
  const pastDueJobs = useMemo(
    () =>
      realJobs
        .filter((j) => j.status === "in_progress" || j.status === "scheduled")
        .filter((j) => {
          if (!j.estimatedCompletion) return false;
          const t = new Date(j.estimatedCompletion).getTime();
          return Number.isFinite(t) && t < now - DAY; // a full day past ETA
        }),
    [realJobs, now],
  );

  const upcoming = useMemo(() => withoutDemo(inspections ?? []), [inspections]);
  const attentionTotal =
    newLeads.length + unreadCount + newRequestCount + pastDueJobs.length + onHoldJobs.length;

  const recentLeads = (leads ?? []).slice(0, 6);
  const recentEstimates = (estimates ?? []).slice(0, 5);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* ─── Greeting ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-primary">{today}</p>
          <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-foreground mt-1">
            {greeting()}.{" "}
            {attentionTotal === 0 ? (
              <span className="text-muted-foreground font-medium">All clear right now.</span>
            ) : (
              <span className="text-muted-foreground font-medium">
                {attentionTotal} thing{attentionTotal === 1 ? "" : "s"} need{attentionTotal === 1 ? "s" : ""} you.
              </span>
            )}
          </h2>
        </div>
      </div>

      {/* ─── Needs attention ────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <AttentionTile
          icon={Inbox}
          label="New leads"
          hint="last 7 days"
          value={newLeads.length}
          tone="primary"
          onClick={() => onNavigate("leads")}
        />
        <AttentionTile
          icon={MessageSquare}
          label="Unread messages"
          hint="from customers"
          value={unreadCount}
          tone="primary"
          onClick={() => onNavigate("portalInbox")}
        />
        <AttentionTile
          icon={ClipboardCheck}
          label="New requests"
          hint="portal service requests"
          value={newRequestCount}
          tone="primary"
          onClick={() => onNavigate("portalInbox")}
        />
        <AttentionTile
          icon={CalendarClock}
          label="Inspections"
          hint="scheduled or pending"
          value={upcoming.length}
          tone="info"
          onClick={() => onNavigate("projects")}
        />
        <AttentionTile
          icon={AlertTriangle}
          label="Past ETA"
          hint="active jobs over date"
          value={pastDueJobs.length}
          tone="warn"
          onClick={() => onNavigate("projects")}
        />
        <AttentionTile
          icon={Pause}
          label="On hold"
          hint="jobs paused"
          value={onHoldJobs.length}
          tone="warn"
          onClick={() => onNavigate("projects")}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* ─── Needs a reply ─────────────────────────────────────── */}
        <Panel
          icon={MessageSquare}
          title="Needs a reply"
          action={{ label: "Open inbox", onClick: () => onNavigate("portalInbox") }}
        >
          {unreadByCustomer.length === 0 && openRequests.length === 0 ? (
            <Empty text="Inbox is clear." />
          ) : (
            <ul className="divide-y divide-border/40">
              {unreadByCustomer.slice(0, 4).map((m) => (
                <li key={`m-${m.customerId}`} className="py-2.5 flex items-start gap-3">
                  <span className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="font-semibold text-sm text-foreground truncate">
                        {m.customerName ?? "Customer"}
                        {m.count > 1 && (
                          <span className="ml-1.5 text-[10px] font-bold text-primary">{m.count} new</span>
                        )}
                      </p>
                      <span className="text-[11px] text-muted-foreground shrink-0">{relTime(m.createdAt)}</span>
                    </div>
                    <p className="text-[12px] text-muted-foreground truncate">{m.body}</p>
                  </div>
                </li>
              ))}
              {openRequests.slice(0, 4).map((r) => (
                <li key={`r-${r.id}`} className="py-2.5 flex items-start gap-3">
                  <span
                    className={`mt-1 w-2 h-2 rounded-full shrink-0 ${r.status === "new" ? "bg-primary" : "bg-amber-500"}`}
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="font-semibold text-sm text-foreground truncate">
                        {r.customerName ?? "Customer"}
                        <span className="ml-1.5 text-[11px] font-medium text-muted-foreground">
                          · {REQUEST_LABEL[r.requestType] ?? r.requestType}
                        </span>
                      </p>
                      <span className="text-[11px] text-muted-foreground shrink-0">{relTime(r.createdAt)}</span>
                    </div>
                    <p className="text-[12px] text-muted-foreground truncate">
                      {r.message || (r.status === "new" ? "New request — no notes" : "In progress")}
                    </p>
                  </div>
                  {r.customerPhone && (
                    <a
                      href={`tel:${r.customerPhone}`}
                      className="shrink-0 w-8 h-8 rounded-full bg-foreground/[0.04] hover:bg-primary/10 hover:text-primary flex items-center justify-center"
                      aria-label={`Call ${r.customerName ?? "customer"}`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {/* ─── Upcoming inspections ──────────────────────────────── */}
        <Panel
          icon={CalendarClock}
          title="Upcoming inspections"
          action={{ label: "All projects", onClick: () => onNavigate("projects") }}
        >
          {inspections === null ? (
            <Empty text="Loading…" muted />
          ) : upcoming.length === 0 ? (
            <Empty text="Nothing scheduled." />
          ) : (
            <ul className="divide-y divide-border/40">
              {upcoming.slice(0, 5).map((i) => (
                <li key={i.id}>
                  <button
                    type="button"
                    onClick={() => i.customerId != null && onOpenJob?.(i.jobId, i.customerId)}
                    className="w-full text-left py-2.5 flex items-start gap-3 rounded-lg hover:bg-muted/40 -mx-2 px-2 transition-colors"
                  >
                    <span className="mt-0.5 w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                      <ClipboardCheck className="w-4 h-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm text-foreground truncate">
                        {i.inspectionType}
                        {i.status === "reinspection" && (
                          <span className="ml-1.5 text-[10px] uppercase tracking-wider font-bold text-amber-700">re-inspect</span>
                        )}
                      </p>
                      <p className="text-[12px] text-muted-foreground truncate">
                        {i.customerName ?? "—"} · {i.jobTitle ?? "Job"}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[12px] font-semibold text-foreground">{i.date ?? "TBD"}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {[i.timeWindow, i.county].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {/* ─── Active projects ───────────────────────────────────── */}
        <Panel
          icon={HardHat}
          title="Active projects"
          action={{ label: "See all", onClick: () => onNavigate("projects") }}
        >
          {jobs === null ? (
            <Empty text="Loading…" muted />
          ) : activeJobs.length === 0 ? (
            <Empty text="No active projects." />
          ) : (
            <ul className="space-y-1">
              {activeJobs.slice(0, 5).map((j) => {
                const meta = STATUS_META[j.status] ?? STATUS_META.scheduled;
                const late = pastDueJobs.some((p) => p.id === j.id);
                return (
                  <li key={j.id}>
                    <button
                      type="button"
                      onClick={() => onOpenJob?.(j.id, j.customerId)}
                      className="w-full text-left rounded-lg hover:bg-muted/40 -mx-2 px-2 py-2 transition-colors"
                    >
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <p className="font-semibold text-foreground text-sm truncate">{j.title}</p>
                        <span className={`text-[10px] uppercase tracking-[0.16em] font-semibold px-2 py-0.5 rounded-full ${meta.cls}`}>
                          {meta.label}
                        </span>
                        {late && (
                          <span className="text-[10px] uppercase tracking-[0.16em] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            past ETA
                          </span>
                        )}
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
        </Panel>

        {/* ─── Latest leads ──────────────────────────────────────── */}
        <Panel
          icon={Inbox}
          title="Latest leads"
          action={{ label: "See all", onClick: () => onNavigate("leads") }}
        >
          {recentLeads.length === 0 ? (
            <Empty text="No leads yet." />
          ) : (
            <ul className="divide-y divide-border/40">
              {recentLeads.map((r, i) => {
                const created = String(r.createdAt ?? "");
                const isNew = newLeads.some((n) => n === r);
                const phone = (r.phone as string | undefined) ?? "";
                return (
                  <li key={(r.id as number | undefined) ?? i} className="py-2.5 flex items-start gap-3">
                    {isNew ? (
                      <span className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" aria-hidden="true" />
                    ) : (
                      <span className="mt-1 w-2 h-2 rounded-full bg-border shrink-0" aria-hidden="true" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="font-semibold text-foreground text-sm truncate">
                          {(r.name as string) || "Anonymous lead"}
                        </p>
                        {created && (
                          <span className="text-[11px] text-muted-foreground shrink-0">{relTime(created)}</span>
                        )}
                      </div>
                      <p className="text-[12px] text-muted-foreground truncate capitalize">
                        {((r.serviceType as string) || "—").replace(/-/g, " ")}
                        {r.zip ? ` · ${r.zip}` : ""}
                        {r.source ? ` · ${String(r.source).split(":")[0]}` : ""}
                      </p>
                    </div>
                    {phone && (
                      <a
                        href={`tel:${phone}`}
                        className="shrink-0 w-8 h-8 rounded-full bg-foreground/[0.04] hover:bg-primary/10 hover:text-primary flex items-center justify-center"
                        aria-label={`Call ${(r.name as string) || "lead"}`}
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </div>

      {/* ─── Business at a glance (secondary) ───────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          icon={Users}
          label="Customers"
          value={customers ? fmtNumber(customers.length) : "—"}
          sub="in CRM"
          onClick={() => onNavigate("clients")}
        />
        <MetricCard
          icon={Briefcase}
          label="Active projects"
          value={fmtNumber(activeJobs.length)}
          sub="scheduled + in progress"
          onClick={() => onNavigate("projects")}
        />
        <MetricCard
          icon={Eye}
          label="Site visits"
          value={analytics ? fmtNumber(analytics.totals.views) : "—"}
          sub={`last ${analytics?.days ?? 30} days`}
          onClick={() => onNavigate("analytics")}
        />
        <MetricCard
          icon={TrendingUp}
          label="Sessions"
          value={analytics ? fmtNumber(analytics.totals.sessions) : "—"}
          sub={`last ${analytics?.days ?? 30} days`}
          onClick={() => onNavigate("analytics")}
        />
      </div>

      {recentEstimates.length > 0 && (
        <Panel
          icon={Calculator}
          title="Latest estimates"
          action={{ label: "See all", onClick: () => onNavigate("estimates") }}
        >
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
                      <p className="font-semibold text-foreground">{(r.name as string) || "—"}</p>
                      <p className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                        {(r.email as string) ?? ""}
                      </p>
                    </td>
                    <td className="px-2 py-2 capitalize">{((r.material as string) ?? "").replace(/-/g, " ")}</td>
                    <td className="px-2 py-2 text-right font-semibold text-foreground whitespace-nowrap">
                      {fmtCurrency(r.lowEstimate)} – {fmtCurrency(r.highEstimate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </div>
  );
}

// ─── Building blocks ──────────────────────────────────────────

function AttentionTile({
  icon: Icon,
  label,
  hint,
  value,
  tone,
  onClick,
}: {
  icon: typeof Users;
  label: string;
  hint: string;
  value: number;
  tone: "primary" | "warn" | "info";
  onClick: () => void;
}) {
  const active = value > 0;
  const tones = {
    primary: { ring: "border-primary/50", icon: "bg-primary text-white", num: "text-primary" },
    warn: { ring: "border-amber-400/60", icon: "bg-amber-500 text-white", num: "text-amber-700" },
    info: { ring: "border-blue-400/60", icon: "bg-blue-600 text-white", num: "text-blue-700" },
  }[tone];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-2xl p-4 border transition-all hover:shadow-md ${
        active ? `bg-card ${tones.ring} shadow-sm` : "bg-muted/40 border-border/60 hover:border-border"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            active ? tones.icon : "bg-foreground/[0.06] text-muted-foreground"
          }`}
        >
          <Icon className="w-4 h-4" />
        </span>
        <span className={`font-display font-bold text-3xl leading-none tracking-tight ${active ? tones.num : "text-muted-foreground/60"}`}>
          {value}
        </span>
      </div>
      <p className={`text-[13px] font-semibold leading-tight ${active ? "text-foreground" : "text-muted-foreground"}`}>{label}</p>
      <p className="text-[11px] text-muted-foreground mt-0.5">{hint}</p>
    </button>
  );
}

function Panel({
  icon: Icon,
  title,
  action,
  children,
}: {
  icon: typeof Users;
  title: string;
  action?: { label: string; onClick: () => void };
  children: React.ReactNode;
}) {
  return (
    <section className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display font-bold text-foreground text-base inline-flex items-center gap-2">
          <Icon className="w-4 h-4 text-primary" />
          {title}
        </h3>
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            {action.label} <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
      {children}
    </section>
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
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground">{label}</p>
      <p className="font-display font-bold text-2xl text-foreground tracking-tight mt-0.5">{value}</p>
      <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
    </button>
  );
}

function ProgressBar({ progress, className = "" }: { progress: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, Number.isFinite(progress) ? progress : 0));
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground">Progress</span>
        <span className="text-[11px] font-semibold text-foreground">{pct}%</span>
      </div>
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Empty({ text, muted = false }: { text: string; muted?: boolean }) {
  return (
    <p className="text-sm text-muted-foreground inline-flex items-center gap-1.5 py-2">
      {muted ? <Clock className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
      {text}
    </p>
  );
}

function fmtCurrency(raw: unknown): string {
  const n = Number(raw);
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
