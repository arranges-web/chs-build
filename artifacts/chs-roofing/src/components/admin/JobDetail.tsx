import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  Hammer,
  Images,
  Mail,
  MessageSquare,
  Pause,
  Phone,
  Plus,
  RefreshCw,
  Save,
  Trash2,
} from "lucide-react";
import { api, type Customer, type Job, type JobUpdate } from "@/lib/api";

const STATUS_OPTS = [
  { value: "scheduled", label: "Scheduled", icon: Clock },
  { value: "in_progress", label: "In progress", icon: Hammer },
  { value: "complete", label: "Complete", icon: CheckCircle2 },
  { value: "on_hold", label: "On hold", icon: Pause },
];

const STATUS_BADGE: Record<string, string> = {
  scheduled: "bg-foreground/[0.05] text-foreground/80",
  in_progress: "bg-primary/10 text-primary",
  complete: "bg-emerald-100 text-emerald-700",
  on_hold: "bg-amber-100 text-amber-700",
};

const fmtDate = (s?: string | null) => {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime())
    ? s
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const fmtDateTime = (s?: string | null) => {
  if (!s) return "";
  const d = new Date(s);
  return Number.isNaN(d.getTime())
    ? String(s)
    : d.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
};

type Props = {
  adminKey: string;
  jobId: number;
  customerId: number;
  onBack: () => void;
};

export default function JobDetail({ adminKey, jobId, customerId, onBack }: Props) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const res = await api.getCustomer(customerId, adminKey);
    if ("data" in res) {
      const j = res.data.jobs.find((it) => it.id === jobId);
      if (j) {
        setCustomer(res.data.customer);
        setJob(j);
      } else {
        setError("This job no longer exists or was deleted.");
      }
    } else {
      setError(res.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, customerId]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-1.5 px-3 h-9 rounded-full text-xs font-semibold text-foreground bg-card border border-border/60 hover:border-primary/40"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-xl border border-destructive/40 bg-destructive/5 text-destructive text-sm">
          {error}
        </div>
      )}

      {!job || !customer ? (
        loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : null
      ) : (
        <>
          {/* Header */}
          <article className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm mb-6">
            <div className="flex flex-wrap items-baseline gap-3 mb-3">
              <span
                className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] font-semibold px-2 py-0.5 rounded-full ${
                  STATUS_BADGE[job.status] ?? STATUS_BADGE.scheduled
                }`}
              >
                {(STATUS_OPTS.find((o) => o.value === job.status)?.label) ?? "Scheduled"}
              </span>
              {job.serviceType && (
                <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-foreground/70 bg-foreground/[0.04] px-2 py-0.5 rounded-full capitalize">
                  {job.serviceType.replace(/-/g, " ")}
                </span>
              )}
              <span className="ml-auto text-[11px] text-muted-foreground">Job #{job.id}</span>
            </div>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground tracking-tight">
              {job.title}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-muted-foreground">
              <span>
                Customer:{" "}
                <span className="font-semibold text-foreground">{customer.name}</span>
                <span className="font-mono ml-2 text-[12px]">{customer.accountNumber}</span>
              </span>
              {customer.phone && (
                <a href={`tel:${customer.phone}`} className="inline-flex items-center gap-1 hover:text-primary">
                  <Phone className="w-3 h-3" />
                  {customer.phone}
                </a>
              )}
              {customer.email && (
                <a
                  href={`mailto:${customer.email}`}
                  className="inline-flex items-center gap-1 hover:text-primary truncate max-w-[280px]"
                >
                  <Mail className="w-3 h-3" />
                  {customer.email}
                </a>
              )}
              {job.startDate && <span>Start: {fmtDate(job.startDate)}</span>}
              {job.estimatedCompletion && <span>ETA: {fmtDate(job.estimatedCompletion)}</span>}
            </div>
          </article>

          <div className="grid lg:grid-cols-[340px_1fr] gap-6">
            <StatusPanel adminKey={adminKey} job={job} onChanged={load} />
            <div className="space-y-6">
              <UpdatesPanel
                adminKey={adminKey}
                job={job}
                onChanged={load}
              />
              <PhotoAlbumPanel adminKey={adminKey} job={job} onChanged={load} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/** Status + progress editor. */
function StatusPanel({
  adminKey,
  job,
  onChanged,
}: {
  adminKey: string;
  job: Job;
  onChanged: () => void;
}) {
  const [status, setStatus] = useState(job.status);
  const [progress, setProgress] = useState(job.progress);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    setStatus(job.status);
    setProgress(job.progress);
  }, [job.status, job.progress]);

  const dirty = status !== job.status || progress !== job.progress;

  const save = async () => {
    setSaving(true);
    setError(null);
    const res = await api.updateJob(job.id, { status, progress }, adminKey);
    setSaving(false);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    setSavedAt(Date.now());
    onChanged();
  };

  return (
    <section className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
      <h3 className="font-display font-bold text-foreground text-base mb-1">Status</h3>
      <p className="text-[11px] text-muted-foreground mb-4">
        Changes here update what the customer sees in their portal.
      </p>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {STATUS_OPTS.map((o) => {
          const Icon = o.icon;
          const selected = status === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => setStatus(o.value)}
              className={`flex items-center gap-2 text-left rounded-xl border px-3 py-2.5 transition-colors ${
                selected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                  : "border-border/60 bg-background hover:border-primary/40"
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-foreground">{o.label}</span>
            </button>
          );
        })}
      </div>

      <label className="block">
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground">
            Progress
          </span>
          <span className="text-sm font-semibold text-foreground">{progress}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="mt-1.5 h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
          {[0, 25, 50, 75, 100].map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setProgress(q)}
              className={`text-[11px] font-semibold px-2 py-1 rounded-full transition-colors ${
                progress === q
                  ? "bg-primary text-white"
                  : "bg-foreground/[0.04] text-foreground hover:bg-foreground/[0.08]"
              }`}
            >
              {q}%
            </button>
          ))}
        </div>
      </label>

      {error && (
        <p className="mt-3 text-[11px] text-destructive whitespace-pre-line">{error}</p>
      )}

      <button
        type="button"
        onClick={save}
        disabled={!dirty || saving}
        className="mt-4 w-full inline-flex items-center justify-center gap-1.5 bg-primary disabled:opacity-60 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-primary/30 transition-all"
      >
        <Save className="w-4 h-4" />
        {saving ? "Saving…" : dirty ? "Save changes" : savedAt ? "Saved" : "Up to date"}
      </button>
    </section>
  );
}

function UpdatesPanel({
  adminKey,
  job,
  onChanged,
}: {
  adminKey: string;
  job: Job;
  onChanged: () => void;
}) {
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("CHS Team");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const updates = useMemo(() => job.updates, [job.updates]);

  const post = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setPosting(true);
    setError(null);
    const res = await api.addJobUpdate(
      { jobId: job.id, body: body.trim(), authorName: author || undefined },
      adminKey,
    );
    setPosting(false);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    setBody("");
    onChanged();
  };

  return (
    <section className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
      <h3 className="font-display font-bold text-foreground text-base mb-3 inline-flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-primary" />
        Updates
      </h3>

      <form onSubmit={post} className="grid sm:grid-cols-[1fr_180px_auto] gap-2 mb-4">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Post an update visible to the customer…"
          className="h-10 px-3 rounded-lg border border-border/60 bg-background text-sm"
        />
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Author"
          className="h-10 px-3 rounded-lg border border-border/60 bg-background text-sm"
        />
        <button
          type="submit"
          disabled={posting || !body.trim()}
          className="h-10 px-3 rounded-lg bg-primary text-white text-sm font-semibold inline-flex items-center justify-center gap-1.5 disabled:opacity-60"
        >
          <Plus className="w-4 h-4" />
          {posting ? "…" : "Post"}
        </button>
      </form>

      {error && <p className="mb-3 text-[11px] text-destructive">{error}</p>}

      {updates.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No updates yet. Whatever you post here shows up on the customer's portal.
        </p>
      ) : (
        <ol className="space-y-3">
          {updates.map((u: JobUpdate) => (
            <li
              key={u.id}
              className="relative pl-5 border-l-2 border-primary/20 group"
            >
              <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-primary" />
              <p className="text-sm text-foreground/85 whitespace-pre-line leading-relaxed">{u.body}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {u.authorName ? `${u.authorName} · ` : ""}
                {fmtDateTime(u.createdAt)}
              </p>
              <button
                type="button"
                onClick={async () => {
                  if (!confirm("Delete this update?")) return;
                  await api.deleteJobUpdate(u.id, adminKey);
                  onChanged();
                }}
                className="absolute right-0 top-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Delete update"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

/**
 * Replaces the old "upload each photo" UX with a single shareable
 * gallery URL. The team puts the photos wherever they normally do
 * (Google Photos shared album, Drive folder, Dropbox), pastes the
 * link, and the portal embeds + links it for the customer.
 *
 * Keeps a "Clear old uploaded photos" action so we can wipe the
 * leftover base64 rows that were dragging the portal down.
 */
function PhotoAlbumPanel({
  adminKey,
  job,
  onChanged,
}: {
  adminKey: string;
  job: Job;
  onChanged: () => void;
}) {
  const [url, setUrl] = useState(job.photoAlbumUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [clearing, setClearing] = useState(false);

  // Keep the input in sync if the job reloads (e.g. another admin
  // updates it on a different device).
  useEffect(() => {
    setUrl(job.photoAlbumUrl ?? "");
  }, [job.photoAlbumUrl]);

  const dirty = (url.trim() || null) !== (job.photoAlbumUrl ?? null);
  const legacyCount = job.photos.length;

  const save = async () => {
    setSaving(true);
    setError(null);
    const trimmed = url.trim();
    const res = await api.updateJob(
      job.id,
      // Pass empty → server normalizes to null.
      { photoAlbumUrl: trimmed || null } as Partial<Job>,
      adminKey,
    );
    setSaving(false);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    setSavedAt(Date.now());
    onChanged();
  };

  const clear = async () => {
    if (
      !confirm(
        "Remove every uploaded photo for this job? This frees up storage and speeds up the customer portal. The photo album link is not affected.",
      )
    ) {
      return;
    }
    setClearing(true);
    setError(null);
    // `all=true` because at this point we've already migrated to
    // the album-URL workflow — nothing in job_photos is worth keeping.
    const ok = await api.clearJobPhotos(job.id, adminKey, true);
    setClearing(false);
    if (!ok) {
      setError("Couldn't clear photos. Try again or refresh.");
      return;
    }
    onChanged();
  };

  return (
    <section className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
      <h3 className="font-display font-bold text-foreground text-base mb-1 inline-flex items-center gap-2">
        <Images className="w-4 h-4 text-primary" />
        Photo album
      </h3>
      <p className="text-[11px] text-muted-foreground mb-4 leading-relaxed">
        Paste a shareable link to your photos — Google Photos shared
        album, Google Drive folder, Dropbox, anywhere public.
        The customer sees it embedded right inside their portal.
      </p>

      <div className="space-y-2">
        <label className="block text-[11px] font-semibold text-foreground">
          Album URL
        </label>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://photos.app.goo.gl/…  ·  https://drive.google.com/drive/folders/…"
          className="w-full h-10 px-3 rounded-lg border border-border/60 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] text-primary hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            Open the album in a new tab
          </a>
        )}

        {error && (
          <p className="text-[11px] text-destructive whitespace-pre-line">{error}</p>
        )}

        <button
          type="button"
          onClick={save}
          disabled={!dirty || saving}
          className="w-full inline-flex items-center justify-center gap-1.5 bg-primary disabled:opacity-60 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-primary/30 transition-all"
        >
          <Save className="w-4 h-4" />
          {saving
            ? "Saving…"
            : dirty
              ? "Save album link"
              : savedAt
                ? "Saved"
                : job.photoAlbumUrl
                  ? "Up to date"
                  : "Add album link"}
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-border/60">
        <p className="text-[11px] font-semibold text-foreground/70 uppercase tracking-[0.16em] mb-2">
          Storage cleanup
        </p>
        {legacyCount > 0 ? (
          <p className="text-[12px] text-muted-foreground mb-2">
            {legacyCount} legacy uploaded photo{legacyCount === 1 ? "" : "s"} on
            this job. Old uploads are no longer used by the portal — wiping
            them speeds things up.
          </p>
        ) : (
          <p className="text-[12px] text-muted-foreground mb-2">
            No legacy uploads on this job.
          </p>
        )}
        <button
          type="button"
          onClick={clear}
          disabled={clearing}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold bg-destructive/10 text-destructive hover:bg-destructive/15 disabled:opacity-60 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          {clearing ? "Clearing…" : "Clear all uploaded photos"}
        </button>
      </div>
    </section>
  );
}
