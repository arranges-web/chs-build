import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Circle,
  Clock,
  Loader2,
  MapPin,
  Phone,
  Plus,
  Send,
} from "lucide-react";
import {
  api,
  type Job,
  type JobMilestone,
  type JobUpdate,
} from "@/lib/api";

/**
 * What a crew member sees when they open one of their jobs. A
 * deliberately small surface: move the job along, log what happened,
 * tick milestones. No customer email, no notes, no documents, no
 * money — the API won't serve those to a crew login anyway.
 */

type CrewCustomer = {
  id: number;
  name: string;
  phone: string | null;
  address: string | null;
  accountNumber: string;
};

const STATUSES = [
  { id: "scheduled", label: "Scheduled" },
  { id: "in_progress", label: "In progress" },
  { id: "on_hold", label: "On hold" },
  { id: "complete", label: "Complete" },
];

export default function CrewJobDetail({
  jobId,
  onBack,
}: {
  jobId: number;
  onBack: () => void;
}) {
  const [job, setJob] = useState<Job | null>(null);
  const [customer, setCustomer] = useState<CrewCustomer | null>(null);
  const [updates, setUpdates] = useState<JobUpdate[]>([]);
  const [milestones, setMilestones] = useState<JobMilestone[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [note, setNote] = useState("");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const r = await api.getMyJob(jobId);
    if ("error" in r) {
      setError(r.error);
      return;
    }
    setJob(r.data.job);
    setCustomer(r.data.customer);
    setUpdates(r.data.updates);
    setMilestones(r.data.milestones);
  }, [jobId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function patchJob(patch: Record<string, unknown>) {
    setSaving(true);
    setError(null);
    const r = await api.updateJob(jobId, patch, "");
    setSaving(false);
    if ("error" in r) {
      setError(r.error);
      return;
    }
    await load();
  }

  async function postUpdate(e: React.FormEvent) {
    e.preventDefault();
    const body = note.trim();
    if (!body) return;
    setPosting(true);
    setPostError(null);
    const r = await api.addJobUpdate({ jobId, body }, "");
    setPosting(false);
    if ("error" in r) {
      setPostError(r.error);
      return;
    }
    setNote("");
    await load();
  }

  async function toggleMilestone(m: JobMilestone) {
    const next = m.status === "complete" ? "in_progress" : "complete";
    const r = await api.updateJobMilestone(
      m.id,
      {
        status: next,
        completedDate: next === "complete" ? new Date().toISOString().slice(0, 10) : null,
      },
      "",
    );
    if ("error" in r) {
      setError(r.error);
      return;
    }
    await load();
  }

  if (error && !job) {
    return (
      <div className="space-y-4">
        <BackButton onBack={onBack} />
        <div className="p-4 rounded-xl border border-destructive/40 bg-destructive/5 text-destructive text-sm flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="space-y-4">
        <BackButton onBack={onBack} />
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading job…
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <BackButton onBack={onBack} />

      {error && (
        <div className="p-3 rounded-xl border border-destructive/40 bg-destructive/5 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Header */}
      <section className="bg-card border border-border/60 rounded-2xl p-5 md:p-6">
        <h2 className="font-display font-bold tracking-tight text-xl text-foreground">
          {job.title}
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">{customer?.name ?? "—"}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
          {customer?.address && (
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(customer.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary"
            >
              <MapPin className="w-3.5 h-3.5" />
              {customer.address}
            </a>
          )}
          {customer?.phone && (
            <a
              href={`tel:${customer.phone.replace(/[^\d+]/g, "")}`}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary"
            >
              <Phone className="w-3.5 h-3.5" />
              {customer.phone}
            </a>
          )}
        </div>
      </section>

      {/* Status + progress */}
      <section className="bg-card border border-border/60 rounded-2xl p-5 md:p-6">
        <h3 className="font-display font-bold text-foreground text-base mb-3">Where it stands</h3>

        <div className="flex flex-wrap gap-2 mb-5">
          {STATUSES.map((st) => (
            <button
              key={st.id}
              type="button"
              disabled={saving}
              onClick={() => void patchJob({ status: st.id })}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-colors disabled:opacity-50 ${
                job.status === st.id
                  ? "bg-primary text-white"
                  : "bg-background border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        <label className="block">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground">Progress</span>
            <span className="text-sm font-bold text-primary tabular-nums">{job.progress}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={job.progress}
            disabled={saving}
            onChange={(e) => setJob({ ...job, progress: Number(e.target.value) })}
            onPointerUp={(e) => void patchJob({ progress: Number(e.currentTarget.value) })}
            onKeyUp={(e) => void patchJob({ progress: Number(e.currentTarget.value) })}
            className="w-full accent-primary"
          />
        </label>
        {saving && <p className="text-[11px] text-muted-foreground mt-2">Saving…</p>}
      </section>

      {/* Milestones */}
      {milestones.length > 0 && (
        <section className="bg-card border border-border/60 rounded-2xl p-5 md:p-6">
          <h3 className="font-display font-bold text-foreground text-base mb-3">Milestones</h3>
          <ul className="space-y-2">
            {milestones.map((m) => {
              const done = m.status === "complete";
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => void toggleMilestone(m)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-background border border-border/60 hover:border-primary/40 text-left transition-colors"
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        done ? "bg-emerald-500 text-white" : "border-2 border-border"
                      }`}
                    >
                      {done ? <Check className="w-3.5 h-3.5" /> : <Circle className="w-2 h-2 opacity-0" />}
                    </span>
                    <span
                      className={`text-sm flex-1 ${
                        done ? "text-muted-foreground line-through" : "text-foreground font-medium"
                      }`}
                    >
                      {m.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Post an update */}
      <section className="bg-card border border-border/60 rounded-2xl p-5 md:p-6">
        <h3 className="font-display font-bold text-foreground text-base mb-1">Post an update</h3>
        <p className="text-[11px] text-muted-foreground mb-3">
          The customer sees this on their portal, so write it for them.
        </p>
        <form onSubmit={postUpdate} className="space-y-3">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="e.g. Tear-off finished, decking inspected — no rot found. Underlayment goes down tomorrow."
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground"
          />
          <button
            type="submit"
            disabled={posting || !note.trim()}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-5 py-2.5 rounded-full text-sm font-semibold"
          >
            {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Post update
          </button>
          {postError && <p className="text-xs text-destructive">{postError}</p>}
        </form>

        {updates.length > 0 && (
          <ul className="mt-5 space-y-3 pt-4 border-t border-border/60">
            {updates.map((u) => (
              <li key={u.id} className="flex gap-3">
                <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Plus className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-foreground leading-relaxed">{u.body}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })
                      : "—"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="w-4 h-4" />
      All my jobs
    </button>
  );
}
