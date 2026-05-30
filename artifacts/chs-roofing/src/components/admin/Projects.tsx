import { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Hammer,
  Mail,
  Pause,
  Phone,
  RefreshCw,
  Search,
} from "lucide-react";
import { api, type AdminJob } from "@/lib/api";

const STATUS_META: Record<string, { label: string; cls: string; icon: typeof Clock }> = {
  scheduled: { label: "Scheduled", cls: "bg-foreground/[0.05] text-foreground/80", icon: Clock },
  in_progress: { label: "In progress", cls: "bg-primary/10 text-primary", icon: Hammer },
  complete: { label: "Complete", cls: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  on_hold: { label: "On hold", cls: "bg-amber-100 text-amber-700", icon: Pause },
};

type Filter = "all" | "active" | "scheduled" | "in_progress" | "complete" | "on_hold";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "active", label: "Active" },
  { id: "scheduled", label: "Scheduled" },
  { id: "in_progress", label: "In progress" },
  { id: "on_hold", label: "On hold" },
  { id: "complete", label: "Complete" },
  { id: "all", label: "All" },
];

const fmtDate = (s?: string | null) => {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime())
    ? s
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

type Props = {
  adminKey: string;
  onOpenCustomer?: (customerId: number) => void;
  onOpenJob?: (jobId: number, customerId: number) => void;
};

export default function Projects({ adminKey, onOpenCustomer, onOpenJob }: Props) {
  const [rows, setRows] = useState<AdminJob[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("active");
  const [query, setQuery] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    const res = await api.listAllJobs(adminKey);
    if ("data" in res) {
      setRows(res.data.rows);
    } else {
      setError(res.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    let out = rows ?? [];
    if (filter === "active") {
      out = out.filter((j) => j.status === "in_progress" || j.status === "scheduled");
    } else if (filter !== "all") {
      out = out.filter((j) => j.status === filter);
    }
    const q = query.trim().toLowerCase();
    if (q) {
      out = out.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          (j.customerName ?? "").toLowerCase().includes(q) ||
          (j.serviceType ?? "").toLowerCase().includes(q),
      );
    }
    return out;
  }, [rows, filter, query]);

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by customer, title, or service…"
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-border/60 bg-card text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-1.5 px-3 h-10 rounded-full text-xs font-semibold text-foreground bg-card border border-border/60 hover:border-primary/40"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => {
          const isActive = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "bg-card border border-border/60 text-foreground hover:border-primary/40"
              }`}
            >
              {f.label}
              {rows && (
                <span className={`ml-1 text-[10px] ${isActive ? "text-white/80" : "text-muted-foreground"}`}>
                  ({countFor(rows, f.id)})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-xl border border-destructive/40 bg-destructive/5 text-destructive text-sm whitespace-pre-line">
          {error}
        </div>
      )}

      {loading && !rows ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border/60 rounded-2xl p-10 text-center">
          <Briefcase className="w-8 h-8 mx-auto text-muted-foreground/60 mb-3" />
          <p className="font-semibold text-foreground">No projects match.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try a different filter, or add a project from a customer's detail page.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((j) => {
            const meta = STATUS_META[j.status] ?? STATUS_META.scheduled;
            const StatusIcon = meta.icon;
            return (
              <article
                key={j.id}
                className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
                  <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] font-semibold px-2 py-0.5 rounded-full ${meta.cls}`}>
                    <StatusIcon className="w-3 h-3" />
                    {meta.label}
                  </span>
                  {j.serviceType && (
                    <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-foreground/70 bg-foreground/[0.04] px-2 py-0.5 rounded-full capitalize">
                      {j.serviceType.replace(/-/g, " ")}
                    </span>
                  )}
                  <span className="ml-auto text-[11px] text-muted-foreground">
                    Job #{j.id}
                  </span>
                </div>

                <h3 className="font-display font-bold text-foreground text-lg leading-tight">
                  {j.title}
                </h3>

                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted-foreground">
                  <button
                    type="button"
                    onClick={() => onOpenCustomer?.(j.customerId)}
                    className="font-semibold text-foreground hover:text-primary"
                  >
                    {j.customerName ?? "—"}
                  </button>
                  {j.customerPhone && (
                    <a
                      href={`tel:${j.customerPhone}`}
                      className="inline-flex items-center gap-1 hover:text-primary"
                    >
                      <Phone className="w-3 h-3" />
                      {j.customerPhone}
                    </a>
                  )}
                  {j.customerEmail && (
                    <a
                      href={`mailto:${j.customerEmail}`}
                      className="inline-flex items-center gap-1 hover:text-primary truncate max-w-[280px]"
                    >
                      <Mail className="w-3 h-3" />
                      {j.customerEmail}
                    </a>
                  )}
                  {j.startDate && <span>Start: {fmtDate(j.startDate)}</span>}
                  {j.estimatedCompletion && <span>ETA: {fmtDate(j.estimatedCompletion)}</span>}
                </div>

                <div className="mt-4">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground">
                      Progress
                    </span>
                    <span className="text-sm font-semibold text-foreground">{j.progress}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(0, Math.min(100, j.progress))}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-muted-foreground">
                    Created {fmtDate(j.createdAt)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenCustomer?.(j.customerId)}
                      className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                    >
                      Open customer
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenJob?.(j.id, j.customerId)}
                      className="inline-flex items-center gap-1 bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm shadow-primary/30 hover:bg-primary/90"
                    >
                      Open project
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function countFor(rows: AdminJob[], filter: Filter): number {
  if (filter === "all") return rows.length;
  if (filter === "active") return rows.filter((r) => r.status === "in_progress" || r.status === "scheduled").length;
  return rows.filter((r) => r.status === filter).length;
}
