import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Clock,
  Hammer,
  Mail,
  MessageSquare,
  Pause,
  Phone,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import { api, type Customer, type Job, type JobPhoto, type JobUpdate } from "@/lib/api";
import { compressImage, dataUrlBytes, formatBytes } from "@/lib/imageUpload";

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
              <PhotosPanel adminKey={adminKey} job={job} onChanged={load} />
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

function PhotosPanel({
  adminKey,
  job,
  onChanged,
}: {
  adminKey: string;
  job: Job;
  onChanged: () => void;
}) {
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photos = job.photos;

  const onPickFiles = async (filesList: FileList | null) => {
    if (!filesList || filesList.length === 0) return;
    setError(null);
    setUploading(true);
    const files = Array.from(filesList);
    let failed = 0;
    for (const f of files) {
      try {
        const dataUrl = await compressImage(f);
        const res = await api.addJobPhoto(
          { jobId: job.id, url: dataUrl, caption: caption || undefined },
          adminKey,
        );
        if ("error" in res) {
          failed++;
          setError(res.error);
        }
      } catch (err) {
        failed++;
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    }
    setUploading(false);
    setCaption("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    onChanged();
    if (failed > 0 && failed < files.length) {
      setError(`${failed} of ${files.length} photos failed to upload.`);
    }
  };

  const addByUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setUploading(true);
    setError(null);
    const res = await api.addJobPhoto(
      { jobId: job.id, url: url.trim(), caption: caption || undefined },
      adminKey,
    );
    setUploading(false);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    setUrl("");
    setCaption("");
    onChanged();
  };

  return (
    <section className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
      <h3 className="font-display font-bold text-foreground text-base mb-3 inline-flex items-center gap-2">
        <Camera className="w-4 h-4 text-primary" />
        Photos
      </h3>

      {/* Upload from device */}
      <div className="mb-3 p-3 rounded-xl border border-dashed border-border/60 bg-muted/30">
        <label className="block text-[11px] font-semibold text-foreground mb-1">
          Caption (optional)
        </label>
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="e.g. dry-in complete, north side"
          className="w-full h-9 px-3 rounded-lg border border-border/60 bg-background text-sm mb-2"
        />
        <div className="flex items-center gap-2 flex-wrap">
          <label className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-semibold px-3 py-2 rounded-full shadow-sm shadow-primary/30 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            {uploading ? "Uploading…" : "Upload photo(s)"}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              disabled={uploading}
              onChange={(e) => void onPickFiles(e.target.files)}
              className="hidden"
            />
          </label>
          <p className="text-[11px] text-muted-foreground">
            Photos are auto-compressed (up to ~1200px wide) before upload.
          </p>
        </div>
      </div>

      {/* Or paste a URL */}
      <details className="mb-3">
        <summary className="text-[12px] font-semibold text-foreground/80 cursor-pointer hover:text-foreground">
          Or paste an image URL
        </summary>
        <form onSubmit={addByUrl} className="grid sm:grid-cols-[1fr_auto] gap-2 mt-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/photo.jpg"
            className="h-9 px-3 rounded-lg border border-border/60 bg-background text-sm"
          />
          <button
            type="submit"
            disabled={uploading || !url.trim()}
            className="h-9 px-3 rounded-lg bg-card border border-border/60 hover:border-primary/40 text-foreground text-sm font-semibold disabled:opacity-60"
          >
            Add URL
          </button>
        </form>
      </details>

      {error && (
        <p className="mb-3 text-[11px] text-destructive whitespace-pre-line">{error}</p>
      )}

      {photos.length === 0 ? (
        <p className="text-sm text-muted-foreground">No photos yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {photos.map((p: JobPhoto) => (
            <PhotoTile
              key={p.id}
              photo={p}
              onDelete={async () => {
                if (!confirm("Delete this photo?")) return;
                await api.deleteJobPhoto(p.id, adminKey);
                onChanged();
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function PhotoTile({
  photo,
  onDelete,
}: {
  photo: JobPhoto;
  onDelete: () => void;
}) {
  const sizeHint = useMemo(() => {
    if (photo.url.startsWith("data:")) return formatBytes(dataUrlBytes(photo.url));
    return null;
  }, [photo.url]);
  return (
    <div className="aspect-square rounded-lg overflow-hidden border border-border/60 bg-muted/30 relative group">
      <img
        src={photo.url}
        alt={photo.caption ?? ""}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {photo.caption && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-[10px] text-white">
          {photo.caption}
        </div>
      )}
      {sizeHint && (
        <span className="absolute top-1 left-1 text-[9px] uppercase tracking-wider font-semibold bg-black/40 text-white px-1.5 py-0.5 rounded">
          {sizeHint}
        </span>
      )}
      <button
        type="button"
        onClick={onDelete}
        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Delete photo"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}
