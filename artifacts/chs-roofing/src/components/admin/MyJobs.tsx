import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Loader2,
  MapPin,
  Phone,
  Search,
} from "lucide-react";
import { api, type MyJobRow } from "@/lib/api";

/**
 * The crew view. A crew login sees this and nothing else — no leads,
 * no estimates, no customer list, no money. Built phone-first because
 * that's where it gets used: on a roof, one-handed, in the sun.
 */

const STATUS_STYLE: Record<string, { label: string; cls: string }> = {
  scheduled: { label: "Scheduled", cls: "bg-blue-500/10 text-blue-600" },
  in_progress: { label: "In progress", cls: "bg-amber-500/10 text-amber-700" },
  on_hold: { label: "On hold", cls: "bg-red-500/10 text-red-600" },
  complete: { label: "Complete", cls: "bg-emerald-500/10 text-emerald-700" },
};

type Filter = "active" | "all" | "complete";

function fmtDate(v: string | null): string {
  if (!v) return "No date set";
  const d = new Date(`${v}T00:00:00`);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function isPastDue(job: MyJobRow): boolean {
  if (job.status === "complete" || !job.estimatedCompletion) return false;
  const t = new Date(`${job.estimatedCompletion}T23:59:59`).getTime();
  return Number.isFinite(t) && t < Date.now();
}

export default function MyJobs({ onOpenJob }: { onOpenJob: (jobId: number, customerId: number) => void }) {
  const [rows, setRows] = useState<MyJobRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("active");
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    setError(null);
    const r = await api.listMyJobs();
    if ("error" in r) {
      setError(r.error);
      return;
    }
    setRows(r.data.rows);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = useMemo(() => {
    const list = rows ?? [];
    const byFilter = list.filter((j) =>
      filter === "all" ? true : filter === "complete" ? j.status === "complete" : j.status !== "complete",
    );
    const needle = q.trim().toLowerCase();
    if (!needle) return byFilter;
    return byFilter.filter(
      (j) =>
        j.title.toLowerCase().includes(needle) ||
        (j.customerName ?? "").toLowerCase().includes(needle) ||
        (j.customerAddress ?? "").toLowerCase().includes(needle),
    );
  }, [rows, filter, q]);

  const activeCount = (rows ?? []).filter((j) => j.status !== "complete").length;
  const dueCount = (rows ?? []).filter(isPastDue).length;

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Stat label="Active jobs" value={rows === null ? "…" : String(activeCount)} />
        <Stat
          label="Past their date"
          value={rows === null ? "…" : String(dueCount)}
          alert={dueCount > 0}
        />
        <Stat
          label="Completed"
          value={rows === null ? "…" : String((rows ?? []).filter((j) => j.status === "complete").length)}
        />
      </div>

      <div className="bg-card border border-border/60 rounded-2xl p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-1.5">
            {(["active", "complete", "all"] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                  filter === f
                    ? "bg-primary text-white"
                    : "bg-background border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search my jobs…"
              className="pl-9 pr-3 py-2 rounded-full border border-border bg-background text-sm w-full sm:w-56 text-foreground"
            />
          </div>
        </div>

        {error ? (
          <div className="p-4 rounded-xl border border-destructive/40 bg-destructive/5 text-destructive text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Couldn't load your jobs: {error}{" "}
              <button type="button" onClick={() => void load()} className="underline font-semibold">
                Retry
              </button>
            </span>
          </div>
        ) : rows === null ? (
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading your jobs…
          </p>
        ) : visible.length === 0 ? (
          <div className="text-center py-10">
            <CheckCircle2 className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
            <p className="font-semibold text-foreground text-sm">
              {q
                ? "Nothing matches that search."
                : rows.length === 0
                  ? "No jobs assigned to you yet."
                  : `No ${filter} jobs.`}
            </p>
            {rows.length === 0 && !q && (
              <p className="text-xs text-muted-foreground mt-1">
                When the office assigns you a project it'll show up here.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {visible.map((j) => {
              const style = STATUS_STYLE[j.status] ?? {
                label: j.status,
                cls: "bg-muted text-muted-foreground",
              };
              const late = isPastDue(j);
              return (
                <button
                  key={j.id}
                  type="button"
                  onClick={() => onOpenJob(j.id, j.customerId)}
                  className="w-full text-left bg-background border border-border/60 rounded-xl p-4 hover:border-primary/40 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground text-sm">{j.title}</h4>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${style.cls}`}
                        >
                          {style.label}
                        </span>
                        {late && (
                          <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-red-500/10 text-red-600">
                            Past date
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{j.customerName ?? "—"}</p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5">
                        {j.customerAddress && (
                          <a
                            href={`https://maps.google.com/?q=${encodeURIComponent(j.customerAddress)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary"
                          >
                            <MapPin className="w-3.5 h-3.5" />
                            {j.customerAddress}
                          </a>
                        )}
                        {j.customerPhone && (
                          <a
                            href={`tel:${j.customerPhone.replace(/[^\d+]/g, "")}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            {j.customerPhone}
                          </a>
                        )}
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs ${
                            late ? "text-red-600 font-semibold" : "text-muted-foreground"
                          }`}
                        >
                          <CalendarDays className="w-3.5 h-3.5" />
                          {fmtDate(j.estimatedCompletion)}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${Math.max(0, Math.min(100, j.progress))}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-muted-foreground tabular-nums">
                          {j.progress}%
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 mt-1" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, alert }: { label: string; value: string; alert?: boolean }) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        alert ? "border-red-500/40 bg-red-500/5" : "border-border/60 bg-card"
      }`}
    >
      <p
        className={`font-display font-bold text-2xl tracking-tight leading-none ${
          alert ? "text-red-600" : "text-foreground"
        }`}
      >
        {value}
      </p>
      <p className="text-[11px] text-muted-foreground mt-1.5 leading-tight">{label}</p>
    </div>
  );
}
