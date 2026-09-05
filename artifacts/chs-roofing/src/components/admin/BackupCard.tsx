import { useEffect, useState } from "react";
import { CheckCircle2, Database, Download, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

const LAST_BACKUP_KEY = "chs.admin.lastBackup.v1";

/**
 * One-click full-database backup for the owner. Downloads a dated
 * JSON file containing every customer, job, lead, estimate, portal
 * record, message, and SMS row. Remembers when it was last run so the
 * dashboard can nudge if it's been a while.
 */
export default function BackupCard() {
  const [state, setState] = useState<
    | { kind: "idle" }
    | { kind: "working" }
    | { kind: "done"; filename: string }
    | { kind: "error"; message: string }
  >({ kind: "idle" });
  const [lastBackup, setLastBackup] = useState<string | null>(null);

  useEffect(() => {
    try {
      setLastBackup(localStorage.getItem(LAST_BACKUP_KEY));
    } catch {
      // ignore
    }
  }, []);

  const run = async () => {
    setState({ kind: "working" });
    const res = await api.downloadBackup();
    if ("error" in res) {
      setState({ kind: "error", message: res.error });
      return;
    }
    const now = new Date().toISOString();
    try {
      localStorage.setItem(LAST_BACKUP_KEY, now);
    } catch {
      // ignore
    }
    setLastBackup(now);
    setState({ kind: "done", filename: res.filename });
  };

  const lastLabel = lastBackup
    ? new Date(lastBackup).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : null;
  const staleDays = lastBackup
    ? Math.floor((Date.now() - new Date(lastBackup).getTime()) / 86_400_000)
    : null;
  const nudge = staleDays === null ? "No backup downloaded yet from this browser." : staleDays >= 30 ? `Last backup was ${staleDays} days ago — worth taking a fresh one.` : null;

  return (
    <section className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5 text-primary" />
          </span>
          <div className="min-w-0">
            <h3 className="font-display font-bold text-foreground text-base">
              Back up all data
            </h3>
            <p className="text-[13px] text-muted-foreground mt-0.5">
              Downloads one dated JSON file with every customer, job, lead,
              estimate, portal record, message, and text-message thread.
              Keep it anywhere you like — it's yours, independent of hosting.
            </p>
            <p className="text-[12px] mt-1.5">
              {lastLabel ? (
                <span className="text-muted-foreground">Last backup: <span className="text-foreground font-medium">{lastLabel}</span></span>
              ) : null}
              {nudge && (
                <span className={`${lastLabel ? "ml-2 " : ""}text-amber-700 font-medium`}>{nudge}</span>
              )}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void run()}
          disabled={state.kind === "working"}
          className="inline-flex items-center justify-center gap-1.5 bg-primary text-white text-sm font-semibold px-4 h-10 rounded-full shadow-md shadow-primary/30 hover:bg-primary/90 disabled:opacity-60 transition-colors md:shrink-0"
        >
          {state.kind === "working" ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          {state.kind === "working" ? "Preparing…" : "Download backup"}
        </button>
      </div>

      {state.kind === "done" && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-[12px] text-emerald-700 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Saved <span className="font-mono">{state.filename}</span> to your downloads.
        </p>
      )}
      {state.kind === "error" && (
        <p className="mt-3 text-[12px] text-destructive">{state.message}</p>
      )}
    </section>
  );
}
