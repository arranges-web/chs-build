import { useState } from "react";
import { ArrowRight, RefreshCw, Sparkles } from "lucide-react";
import { api } from "@/lib/api";

type Props = { adminKey: string };

/**
 * Loads (or resets) the CHS-DEMO01 sample customer so the team can
 * open the customer portal end-to-end with a realistic project in
 * it. Lives under Settings — it's a setup tool, not a daily-driver.
 */
export default function DemoCard({ adminKey }: Props) {
  const [state, setState] = useState<
    | { kind: "idle" }
    | { kind: "loading"; reset: boolean }
    | { kind: "ready"; portalUrl: string; reset: boolean }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  const run = async (reset: boolean) => {
    setState({ kind: "loading", reset });
    const res = await api.loadDemo(adminKey, reset);
    if ("error" in res) {
      setState({ kind: "error", message: res.error });
      return;
    }
    const portalUrl = `${window.location.origin}/portal?account=${encodeURIComponent(res.data.accountNumber)}`;
    setState({ kind: "ready", portalUrl, reset });
  };

  return (
    <section className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-primary" />
          </span>
          <div className="min-w-0">
            <h3 className="font-display font-bold text-foreground text-base">Demo customer portal</h3>
            <p className="text-[13px] text-muted-foreground mt-0.5">
              Loads a sample project (Cordero · Palm Drive) with milestones, photo
              albums, documents, inspections, warranty, and messages so you can
              see exactly what a customer sees. Safe to reset any time.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 md:shrink-0">
          <button
            type="button"
            onClick={() => void run(false)}
            disabled={state.kind === "loading"}
            className="inline-flex items-center justify-center gap-1.5 bg-primary text-white text-sm font-semibold px-4 h-10 rounded-full shadow-md shadow-primary/30 hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {state.kind === "loading" && !state.reset ? "Loading…" : "Load demo data"}
          </button>
          <button
            type="button"
            onClick={() => {
              if (!confirm("Reset the demo customer? This wipes the current demo data and re-seeds it fresh. Real customers are untouched.")) return;
              void run(true);
            }}
            disabled={state.kind === "loading"}
            className="inline-flex items-center justify-center gap-1.5 bg-card border border-border/60 text-foreground text-sm font-semibold px-4 h-10 rounded-full hover:border-primary/40 disabled:opacity-60 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${state.kind === "loading" && state.reset ? "animate-spin" : ""}`} />
            Reset demo
          </button>
        </div>
      </div>

      {state.kind === "error" && <p className="mt-3 text-[12px] text-destructive">{state.message}</p>}
      {state.kind === "ready" && (
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 bg-muted/40 border border-border/60 rounded-xl p-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-primary">
              {state.reset ? "Demo reset — ready" : "Demo ready"}
            </p>
            <p className="font-mono text-[12px] text-foreground/85 truncate">{state.portalUrl}</p>
          </div>
          <a
            href={state.portalUrl}
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
  );
}
