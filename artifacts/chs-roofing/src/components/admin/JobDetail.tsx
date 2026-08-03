import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  ExternalLink,
  FileText,
  Hammer,
  Images,
  ListChecks,
  Loader2,
  Mail,
  MessageSquare,
  Pause,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  UserCog,
  X,
} from "lucide-react";
import {
  api,
  type Customer,
  type Job,
  type JobAlbum,
  type JobInspection,
  type JobMilestone,
  type JobUpdate,
} from "@/lib/api";

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

          <div className="grid lg:grid-cols-[340px_1fr] gap-6 items-start">
            <div className="space-y-6">
              <StatusPanel adminKey={adminKey} job={job} onChanged={load} />
              <DetailsPanel adminKey={adminKey} job={job} onChanged={load} />
            </div>
            <div className="space-y-6">
              <UpdatesPanel
                adminKey={adminKey}
                job={job}
                onChanged={load}
              />
              <MilestonesPanel adminKey={adminKey} job={job} onChanged={load} />
              <InspectionsPanel adminKey={adminKey} job={job} onChanged={load} />
              <DocumentsPanel adminKey={adminKey} job={job} onChanged={load} />
              <PhotoAlbumPanel adminKey={adminKey} job={job} onChanged={load} />
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

/**
 * Photo albums for the job — many per job, each with a custom label
 * like "Part 1 done" or "Final walkthrough". Customers see every
 * album embedded in their portal in the order they're listed.
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
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  const albums = job.albums;
  const legacyCount = job.photos.length;

  // If the job still has the old single photoAlbumUrl set, surface a
  // one-click migration button so we don't quietly drop existing data.
  const legacyAlbumUrl = job.photoAlbumUrl?.trim() || null;

  const addAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!label.trim() || !url.trim()) {
      setError("Both a label and a URL are required.");
      return;
    }
    setBusy(true);
    const res = await api.addJobAlbum(
      {
        jobId: job.id,
        label: label.trim(),
        url: url.trim(),
        sortOrder: albums.length,
      },
      adminKey,
    );
    setBusy(false);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    setLabel("");
    setUrl("");
    onChanged();
  };

  const removeAlbum = async (a: JobAlbum) => {
    if (!confirm(`Remove "${a.label}" from this job?`)) return;
    await api.deleteJobAlbum(a.id, adminKey);
    onChanged();
  };

  const migrateLegacy = async () => {
    if (!legacyAlbumUrl) return;
    setBusy(true);
    setError(null);
    const res = await api.addJobAlbum(
      {
        jobId: job.id,
        label: "Photo album",
        url: legacyAlbumUrl,
        sortOrder: albums.length,
      },
      adminKey,
    );
    if (!("error" in res)) {
      // Clear the legacy column once migrated so we never double-show.
      await api.updateJob(
        job.id,
        { photoAlbumUrl: null } as Partial<Job>,
        adminKey,
      );
    } else {
      setError(res.error);
    }
    setBusy(false);
    onChanged();
  };

  const clearPhotos = async () => {
    if (
      !confirm(
        "Remove every legacy uploaded photo for this job? This frees up storage and speeds up the customer portal. Album links are not affected.",
      )
    ) {
      return;
    }
    setClearing(true);
    setError(null);
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
        Photo albums
      </h3>
      <p className="text-[11px] text-muted-foreground mb-4 leading-relaxed">
        Add as many album links as you want — Google Photos, Drive,
        Dropbox, anywhere public. Give each one a custom label like
        "Part 1 done" so the customer can tell them apart in their portal.
      </p>

      {legacyAlbumUrl && (
        <div className="mb-4 p-3 rounded-xl border border-amber-300/60 bg-amber-50 text-[12px] text-amber-900">
          <p className="font-semibold">Existing single album link found.</p>
          <p className="mt-1 leading-relaxed break-all">{legacyAlbumUrl}</p>
          <button
            type="button"
            onClick={migrateLegacy}
            disabled={busy}
            className="mt-2 inline-flex items-center gap-1.5 bg-primary text-white text-[11px] font-semibold px-3 py-1.5 rounded-full hover:bg-primary/90 disabled:opacity-60"
          >
            Move it into the new list
          </button>
        </div>
      )}

      {albums.length === 0 ? (
        <p className="text-sm text-muted-foreground mb-4">No albums yet.</p>
      ) : (
        <ol className="space-y-2 mb-4">
          {albums.map((a) => (
            <li
              key={a.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-background"
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm text-foreground truncate">{a.label}</p>
                <a
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline truncate"
                >
                  <ExternalLink className="w-3 h-3 shrink-0" />
                  <span className="truncate">{a.url}</span>
                </a>
              </div>
              <button
                type="button"
                onClick={() => void removeAlbum(a)}
                className="text-muted-foreground hover:text-destructive shrink-0"
                aria-label={`Remove ${a.label}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ol>
      )}

      <form onSubmit={addAlbum} className="space-y-2">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Label (e.g. Part 1 done)"
          maxLength={80}
          className="w-full h-10 px-3 rounded-lg border border-border/60 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://photos.app.goo.gl/… or https://drive.google.com/…"
          className="w-full h-10 px-3 rounded-lg border border-border/60 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {error && (
          <p className="text-[11px] text-destructive whitespace-pre-line">{error}</p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="w-full inline-flex items-center justify-center gap-1.5 bg-primary disabled:opacity-60 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-primary/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          {busy ? "Adding…" : "Add album link"}
        </button>
      </form>

      {legacyCount > 0 && (
        <div className="mt-4 pt-4 border-t border-border/60">
          <p className="text-[11px] font-semibold text-foreground/70 uppercase tracking-[0.16em] mb-2">
            Storage cleanup
          </p>
          <p className="text-[12px] text-muted-foreground mb-2">
            {legacyCount} legacy uploaded photo{legacyCount === 1 ? "" : "s"} still on
            this job — these are from the old per-photo upload system and aren't
            shown anymore. Wiping them speeds up the portal.
          </p>
          <button
            type="button"
            onClick={clearPhotos}
            disabled={clearing}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold bg-destructive/10 text-destructive hover:bg-destructive/15 disabled:opacity-60 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {clearing ? "Clearing…" : "Clear legacy uploads"}
          </button>
        </div>
      )}
    </section>
  );
}

// ─── Project manager + warranty details ─────────────────────────

const inputCls =
  "w-full h-10 px-3 rounded-lg border border-border/60 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/** Trim an ISO datetime down to what <input type="date"> wants. */
const toDateInput = (s: string | null | undefined) => (s ? s.slice(0, 10) : "");

function DetailsPanel({
  adminKey,
  job,
  onChanged,
}: {
  adminKey: string;
  job: Job;
  onChanged: () => void;
}) {
  const [pm, setPm] = useState(job.projectManager ?? "");
  const [pmPhone, setPmPhone] = useState(job.projectManagerPhone ?? "");
  const [roofSystem, setRoofSystem] = useState(job.roofSystem ?? "");
  const [wMfr, setWMfr] = useState(job.warrantyManufacturer ?? "");
  const [wWork, setWWork] = useState(job.warrantyWorkmanship ?? "");
  const [wStart, setWStart] = useState(toDateInput(job.warrantyStartDate));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    setPm(job.projectManager ?? "");
    setPmPhone(job.projectManagerPhone ?? "");
    setRoofSystem(job.roofSystem ?? "");
    setWMfr(job.warrantyManufacturer ?? "");
    setWWork(job.warrantyWorkmanship ?? "");
    setWStart(toDateInput(job.warrantyStartDate));
  }, [job]);

  const dirty =
    pm !== (job.projectManager ?? "") ||
    pmPhone !== (job.projectManagerPhone ?? "") ||
    roofSystem !== (job.roofSystem ?? "") ||
    wMfr !== (job.warrantyManufacturer ?? "") ||
    wWork !== (job.warrantyWorkmanship ?? "") ||
    wStart !== toDateInput(job.warrantyStartDate);

  const save = async () => {
    setSaving(true);
    setError(null);
    const res = await api.updateJob(
      job.id,
      {
        projectManager: pm.trim() || null,
        projectManagerPhone: pmPhone.trim() || null,
        roofSystem: roofSystem.trim() || null,
        warrantyManufacturer: wMfr.trim() || null,
        warrantyWorkmanship: wWork.trim() || null,
        warrantyStartDate: wStart || null,
      },
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

  return (
    <section className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
      <h3 className="font-display font-bold text-foreground text-base mb-1 inline-flex items-center gap-2">
        <UserCog className="w-4 h-4 text-primary" />
        Project &amp; warranty
      </h3>
      <p className="text-[11px] text-muted-foreground mb-4">
        Shown to the customer on their portal's project page.
      </p>

      <div className="space-y-3">
        <label className="block">
          <span className="block text-xs font-semibold text-foreground mb-1">Project manager</span>
          <input value={pm} onChange={(e) => setPm(e.target.value)} placeholder="Name" className={inputCls} />
        </label>
        <label className="block">
          <span className="block text-xs font-semibold text-foreground mb-1">PM phone</span>
          <input value={pmPhone} onChange={(e) => setPmPhone(e.target.value)} placeholder="305-555-0123" className={inputCls} />
        </label>
        <label className="block">
          <span className="block text-xs font-semibold text-foreground mb-1">Roof system</span>
          <input value={roofSystem} onChange={(e) => setRoofSystem(e.target.value)} placeholder='e.g. GAF Timberline HDZ, "Charcoal"' className={inputCls} />
        </label>
        <div className="pt-2 border-t border-border/60">
          <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground mb-2">
            Warranty
          </p>
          <div className="space-y-3">
            <label className="block">
              <span className="block text-xs font-semibold text-foreground mb-1">Manufacturer warranty</span>
              <input value={wMfr} onChange={(e) => setWMfr(e.target.value)} placeholder="e.g. 25-year limited" className={inputCls} />
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-foreground mb-1">Workmanship warranty</span>
              <input value={wWork} onChange={(e) => setWWork(e.target.value)} placeholder="e.g. 10-year CHS workmanship" className={inputCls} />
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-foreground mb-1">Warranty start date</span>
              <input type="date" value={wStart} onChange={(e) => setWStart(e.target.value)} className={inputCls} />
            </label>
          </div>
        </div>
      </div>

      {error && <p className="mt-3 text-[11px] text-destructive whitespace-pre-line">{error}</p>}

      <button
        type="button"
        onClick={() => void save()}
        disabled={!dirty || saving}
        className="mt-4 w-full inline-flex items-center justify-center gap-1.5 bg-primary disabled:opacity-60 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-primary/30 transition-all"
      >
        <Save className="w-4 h-4" />
        {saving ? "Saving…" : dirty ? "Save details" : savedAt ? "Saved" : "Up to date"}
      </button>
    </section>
  );
}

// ─── Milestones ─────────────────────────────────────────────────

const MILESTONE_CYCLE = ["pending", "in_progress", "complete"] as const;

const MILESTONE_META: Record<string, { label: string; cls: string; icon: typeof Clock }> = {
  pending: { label: "Pending", cls: "bg-foreground/[0.05] text-foreground/70", icon: Clock },
  in_progress: { label: "In progress", cls: "bg-primary/10 text-primary", icon: Hammer },
  complete: { label: "Complete", cls: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
};

function MilestonesPanel({
  adminKey,
  job,
  onChanged,
}: {
  adminKey: string;
  job: Job;
  onChanged: () => void;
}) {
  const [busyId, setBusyId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const milestones = useMemo(
    () => [...job.milestones].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id),
    [job.milestones],
  );

  const seed = async () => {
    setSeeding(true);
    setError(null);
    const res = await api.seedJobMilestones(job.id, adminKey);
    setSeeding(false);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    onChanged();
  };

  const cycleStatus = async (m: JobMilestone) => {
    const i = MILESTONE_CYCLE.indexOf(m.status as (typeof MILESTONE_CYCLE)[number]);
    const next = MILESTONE_CYCLE[(i + 1) % MILESTONE_CYCLE.length];
    setBusyId(m.id);
    setError(null);
    const res = await api.updateJobMilestone(
      m.id,
      {
        status: next,
        // Stamp today's date the first time a step completes.
        ...(next === "complete" && !m.completedDate
          ? { completedDate: new Date().toISOString().slice(0, 10) }
          : {}),
      },
      adminKey,
    );
    setBusyId(null);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    onChanged();
  };

  const openEdit = (m: JobMilestone) => {
    setEditingId(m.id);
    setEditDate(toDateInput(m.completedDate));
    setEditNotes(m.notes ?? "");
  };

  const saveEdit = async (m: JobMilestone) => {
    setBusyId(m.id);
    setError(null);
    const res = await api.updateJobMilestone(
      m.id,
      { completedDate: editDate || null, notes: editNotes.trim() || null },
      adminKey,
    );
    setBusyId(null);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    setEditingId(null);
    onChanged();
  };

  const remove = async (m: JobMilestone) => {
    if (!confirm(`Delete milestone "${m.title}"?`)) return;
    await api.deleteJobMilestone(m.id, adminKey);
    onChanged();
  };

  const addCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setAdding(true);
    setError(null);
    const res = await api.addJobMilestone(
      { jobId: job.id, title: newTitle.trim(), sortOrder: milestones.length },
      adminKey,
    );
    setAdding(false);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    setNewTitle("");
    onChanged();
  };

  return (
    <section className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
      <h3 className="font-display font-bold text-foreground text-base mb-1 inline-flex items-center gap-2">
        <ListChecks className="w-4 h-4 text-primary" />
        Timeline milestones
      </h3>
      <p className="text-[11px] text-muted-foreground mb-4">
        The step-by-step timeline the customer follows in their portal. Click a status chip to
        advance it.
      </p>

      {error && <p className="mb-3 text-[11px] text-destructive whitespace-pre-line">{error}</p>}

      {milestones.length === 0 ? (
        <div className="mb-4 p-4 rounded-xl border border-dashed border-border bg-background text-center">
          <p className="text-sm text-muted-foreground mb-3">
            No milestones yet. Start from the standard roofing timeline and tweak from there.
          </p>
          <button
            type="button"
            onClick={() => void seed()}
            disabled={seeding}
            className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-4 py-2 rounded-full shadow-sm shadow-primary/30 hover:bg-primary/90 disabled:opacity-60"
          >
            {seeding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            Add standard timeline
          </button>
        </div>
      ) : (
        <ol className="space-y-2 mb-4">
          {milestones.map((m) => {
            const meta = MILESTONE_META[m.status] ?? MILESTONE_META.pending;
            const MIcon = meta.icon;
            const isEditing = editingId === m.id;
            return (
              <li key={m.id} className="rounded-xl border border-border/60 bg-background p-3">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    disabled={busyId === m.id}
                    onClick={() => void cycleStatus(m)}
                    title="Click to cycle status"
                    className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] font-semibold px-2 py-1 rounded-full transition-colors disabled:opacity-60 ${meta.cls}`}
                  >
                    {busyId === m.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <MIcon className="w-3 h-3" />
                    )}
                    {meta.label}
                  </button>
                  <p className="font-semibold text-sm text-foreground flex-1 min-w-0 truncate">
                    {m.title}
                  </p>
                  {m.completedDate && !isEditing && (
                    <span className="text-[11px] text-muted-foreground shrink-0">
                      {fmtDate(m.completedDate)}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => (isEditing ? setEditingId(null) : openEdit(m))}
                    className="text-muted-foreground hover:text-foreground shrink-0"
                    aria-label={isEditing ? "Close editor" : `Edit ${m.title}`}
                  >
                    {isEditing ? <X className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove(m)}
                    className="text-muted-foreground hover:text-destructive shrink-0"
                    aria-label={`Delete ${m.title}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {!isEditing && m.notes && (
                  <p className="mt-1.5 text-[12px] text-muted-foreground leading-relaxed pl-1">
                    {m.notes}
                  </p>
                )}
                {isEditing && (
                  <div className="mt-2.5 grid sm:grid-cols-[160px_1fr_auto] gap-2">
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className={inputCls}
                      aria-label="Completed date"
                    />
                    <input
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Notes shown to the customer (optional)"
                      className={inputCls}
                    />
                    <button
                      type="button"
                      disabled={busyId === m.id}
                      onClick={() => void saveEdit(m)}
                      className="h-10 px-3 rounded-lg bg-primary text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 disabled:opacity-60"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}

      <form onSubmit={addCustom} className="flex gap-2">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a custom milestone…"
          maxLength={120}
          className={inputCls}
        />
        <button
          type="submit"
          disabled={adding || !newTitle.trim()}
          className="h-10 px-3 rounded-lg bg-primary text-white text-sm font-semibold inline-flex items-center gap-1.5 disabled:opacity-60 shrink-0"
        >
          <Plus className="w-4 h-4" />
          {adding ? "…" : "Add"}
        </button>
      </form>
    </section>
  );
}

// ─── Inspections ────────────────────────────────────────────────

const INSPECTION_STATUS = [
  { value: "upcoming", label: "Upcoming", cls: "bg-foreground/[0.05] text-foreground/70" },
  { value: "passed", label: "Passed", cls: "bg-emerald-100 text-emerald-700" },
  { value: "failed", label: "Failed", cls: "bg-destructive/10 text-destructive" },
  { value: "reinspection", label: "Reinspection", cls: "bg-amber-100 text-amber-700" },
];

type InspectionDraft = {
  inspectionType: string;
  status: string;
  date: string;
  timeWindow: string;
  county: string;
  inspectorNotes: string;
};

const emptyInspection: InspectionDraft = {
  inspectionType: "",
  status: "upcoming",
  date: "",
  timeWindow: "",
  county: "",
  inspectorNotes: "",
};

function InspectionForm({
  initial,
  busy,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial: InspectionDraft;
  busy: boolean;
  submitLabel: string;
  onSubmit: (draft: InspectionDraft) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<InspectionDraft>(initial);
  const set = (patch: Partial<InspectionDraft>) => setDraft((d) => ({ ...d, ...patch }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!draft.inspectionType.trim()) return;
        onSubmit(draft);
      }}
      className="p-3 rounded-xl border border-border/60 bg-background space-y-2"
    >
      <div className="grid sm:grid-cols-2 gap-2">
        <input
          value={draft.inspectionType}
          onChange={(e) => set({ inspectionType: e.target.value })}
          placeholder="Inspection type (e.g. Tin cap / dry-in)"
          className={inputCls}
        />
        <select
          value={draft.status}
          onChange={(e) => set({ status: e.target.value })}
          className={inputCls}
        >
          {INSPECTION_STATUS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={draft.date}
          onChange={(e) => set({ date: e.target.value })}
          className={inputCls}
          aria-label="Inspection date"
        />
        <input
          value={draft.timeWindow}
          onChange={(e) => set({ timeWindow: e.target.value })}
          placeholder="Time window (e.g. 8 AM – 12 PM)"
          className={inputCls}
        />
        <input
          value={draft.county}
          onChange={(e) => set({ county: e.target.value })}
          placeholder="County (e.g. Miami-Dade)"
          className={inputCls}
        />
        <input
          value={draft.inspectorNotes}
          onChange={(e) => set({ inspectorNotes: e.target.value })}
          placeholder="Inspector notes (optional)"
          className={inputCls}
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={busy || !draft.inspectionType.trim()}
          className="h-9 px-3.5 rounded-lg bg-primary text-white text-xs font-semibold inline-flex items-center gap-1.5 disabled:opacity-60"
        >
          {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="h-9 px-3 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function InspectionsPanel({
  adminKey,
  job,
  onChanged,
}: {
  adminKey: string;
  job: Job;
  onChanged: () => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const add = async (d: InspectionDraft) => {
    setBusy(true);
    setError(null);
    const res = await api.addJobInspection(
      {
        jobId: job.id,
        inspectionType: d.inspectionType.trim(),
        status: d.status,
        date: d.date || undefined,
        timeWindow: d.timeWindow.trim() || undefined,
        county: d.county.trim() || undefined,
        inspectorNotes: d.inspectorNotes.trim() || undefined,
      },
      adminKey,
    );
    setBusy(false);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    setShowAdd(false);
    onChanged();
  };

  const saveEdit = async (id: number, d: InspectionDraft) => {
    setBusy(true);
    setError(null);
    const res = await api.updateJobInspection(
      id,
      {
        inspectionType: d.inspectionType.trim(),
        status: d.status,
        date: d.date || null,
        timeWindow: d.timeWindow.trim() || null,
        county: d.county.trim() || null,
        inspectorNotes: d.inspectorNotes.trim() || null,
      },
      adminKey,
    );
    setBusy(false);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    setEditingId(null);
    onChanged();
  };

  const remove = async (i: JobInspection) => {
    if (!confirm(`Delete the "${i.inspectionType}" inspection?`)) return;
    await api.deleteJobInspection(i.id, adminKey);
    onChanged();
  };

  return (
    <section className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-display font-bold text-foreground text-base inline-flex items-center gap-2">
          <ClipboardCheck className="w-4 h-4 text-primary" />
          Inspections
        </h3>
        {!showAdd && (
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
          >
            <Plus className="w-3 h-3" />
            Add inspection
          </button>
        )}
      </div>
      <p className="text-[11px] text-muted-foreground mb-4">
        County inspections tied to this job — the customer sees dates, windows, and results.
      </p>

      {error && <p className="mb-3 text-[11px] text-destructive whitespace-pre-line">{error}</p>}

      {showAdd && (
        <div className="mb-3">
          <InspectionForm
            initial={emptyInspection}
            busy={busy}
            submitLabel="Add inspection"
            onSubmit={(d) => void add(d)}
            onCancel={() => setShowAdd(false)}
          />
        </div>
      )}

      {job.inspections.length === 0 && !showAdd ? (
        <p className="text-sm text-muted-foreground">No inspections logged yet.</p>
      ) : (
        <ol className="space-y-2">
          {job.inspections.map((i) => {
            const meta =
              INSPECTION_STATUS.find((s) => s.value === i.status) ?? INSPECTION_STATUS[0];
            if (editingId === i.id) {
              return (
                <li key={i.id}>
                  <InspectionForm
                    initial={{
                      inspectionType: i.inspectionType,
                      status: i.status,
                      date: toDateInput(i.date),
                      timeWindow: i.timeWindow ?? "",
                      county: i.county ?? "",
                      inspectorNotes: i.inspectorNotes ?? "",
                    }}
                    busy={busy}
                    submitLabel="Save changes"
                    onSubmit={(d) => void saveEdit(i.id, d)}
                    onCancel={() => setEditingId(null)}
                  />
                </li>
              );
            }
            return (
              <li key={i.id} className="rounded-xl border border-border/60 bg-background p-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[10px] uppercase tracking-[0.14em] font-semibold px-2 py-1 rounded-full shrink-0 ${meta.cls}`}
                  >
                    {meta.label}
                  </span>
                  <p className="font-semibold text-sm text-foreground flex-1 min-w-0 truncate">
                    {i.inspectionType}
                  </p>
                  <button
                    type="button"
                    onClick={() => setEditingId(i.id)}
                    className="text-muted-foreground hover:text-foreground shrink-0"
                    aria-label={`Edit ${i.inspectionType}`}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove(i)}
                    className="text-muted-foreground hover:text-destructive shrink-0"
                    aria-label={`Delete ${i.inspectionType}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[12px] text-muted-foreground">
                  {i.date && <span>{fmtDate(i.date)}</span>}
                  {i.timeWindow && <span>{i.timeWindow}</span>}
                  {i.county && <span>{i.county}</span>}
                </div>
                {i.inspectorNotes && (
                  <p className="mt-1 text-[12px] text-foreground/75 leading-relaxed">
                    {i.inspectorNotes}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

// ─── Documents ──────────────────────────────────────────────────

const DOC_CATEGORIES = [
  "contract",
  "permit",
  "insurance",
  "noa",
  "specs",
  "color",
  "change-order",
  "warranty",
  "invoice",
  "receipt",
  "other",
];

const docLabel = (c: string) =>
  c === "noa" ? "NOA" : c.replace(/-/g, " ").replace(/^\w/, (ch) => ch.toUpperCase());

function DocumentsPanel({
  adminKey,
  job,
  onChanged,
}: {
  adminKey: string;
  job: Job;
  onChanged: () => void;
}) {
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState("contract");
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !url.trim()) {
      setError("A label and a URL are both required.");
      return;
    }
    setBusy(true);
    setError(null);
    const res = await api.addJobDocument(
      { jobId: job.id, label: label.trim(), category, url: url.trim() },
      adminKey,
    );
    setBusy(false);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    setLabel("");
    setUrl("");
    onChanged();
  };

  return (
    <section className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
      <h3 className="font-display font-bold text-foreground text-base mb-1 inline-flex items-center gap-2">
        <FileText className="w-4 h-4 text-primary" />
        Documents
      </h3>
      <p className="text-[11px] text-muted-foreground mb-4">
        Contracts, permits, NOAs — link them here and the customer can open them from their portal.
      </p>

      {job.documents.length > 0 && (
        <ol className="space-y-2 mb-4">
          {job.documents.map((d) => (
            <li
              key={d.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-background"
            >
              {d.category && (
                <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-foreground/70 bg-foreground/[0.04] px-2 py-0.5 rounded-full shrink-0">
                  {docLabel(d.category)}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm text-foreground truncate">{d.label}</p>
                <a
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline truncate max-w-full"
                >
                  <ExternalLink className="w-3 h-3 shrink-0" />
                  <span className="truncate">{d.url}</span>
                </a>
              </div>
              <button
                type="button"
                onClick={async () => {
                  if (!confirm(`Remove "${d.label}"?`)) return;
                  await api.deleteJobDocument(d.id, adminKey);
                  onChanged();
                }}
                className="text-muted-foreground hover:text-destructive shrink-0"
                aria-label={`Remove ${d.label}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ol>
      )}

      <form onSubmit={add} className="space-y-2">
        <div className="grid sm:grid-cols-[1fr_170px] gap-2">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Label (e.g. Signed contract)"
            maxLength={120}
            className={inputCls}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputCls}
            aria-label="Document category"
          >
            {DOC_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {docLabel(c)}
              </option>
            ))}
          </select>
        </div>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://drive.google.com/… or any public link"
          className={inputCls}
        />
        {error && <p className="text-[11px] text-destructive whitespace-pre-line">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full inline-flex items-center justify-center gap-1.5 bg-primary disabled:opacity-60 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-primary/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          {busy ? "Adding…" : "Add document"}
        </button>
      </form>
    </section>
  );
}

// ─── Categorized photos ─────────────────────────────────────────

const PHOTO_CATEGORIES = [
  "before",
  "tear-off",
  "deck-repairs",
  "underlayment",
  "dry-in",
  "installation",
  "flashing",
  "drone",
  "final",
  "warranty",
];

const photoLabel = (c: string) => c.replace(/-/g, " ").replace(/^\w/, (ch) => ch.toUpperCase());

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
  const [category, setCategory] = useState("before");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("A photo URL is required.");
      return;
    }
    setBusy(true);
    setError(null);
    const res = await api.addJobPhoto(
      {
        jobId: job.id,
        url: url.trim(),
        caption: caption.trim() || undefined,
        category,
      },
      adminKey,
    );
    setBusy(false);
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
      <h3 className="font-display font-bold text-foreground text-base mb-1 inline-flex items-center gap-2">
        <Camera className="w-4 h-4 text-primary" />
        Job photos
      </h3>
      <p className="text-[11px] text-muted-foreground mb-4">
        Individual photo links, tagged by phase — the portal groups them by category for the
        customer.
      </p>

      {job.photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
          {job.photos.map((p) => (
            <figure
              key={p.id}
              className="relative group rounded-xl border border-border/60 bg-background overflow-hidden"
            >
              <img
                src={p.url}
                alt={p.caption ?? "Job photo"}
                loading="lazy"
                className="w-full h-28 object-cover"
              />
              <figcaption className="p-2">
                {p.category && (
                  <span className="text-[9px] uppercase tracking-[0.14em] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                    {photoLabel(p.category)}
                  </span>
                )}
                {p.caption && (
                  <p className="mt-1 text-[11px] text-muted-foreground truncate">{p.caption}</p>
                )}
              </figcaption>
              <button
                type="button"
                onClick={async () => {
                  if (!confirm("Delete this photo?")) return;
                  await api.deleteJobPhoto(p.id, adminKey);
                  onChanged();
                }}
                className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Delete photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </figure>
          ))}
        </div>
      )}

      <form onSubmit={add} className="space-y-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://… direct image link"
          className={inputCls}
        />
        <div className="grid sm:grid-cols-[1fr_170px] gap-2">
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Caption (optional)"
            maxLength={140}
            className={inputCls}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputCls}
            aria-label="Photo category"
          >
            {PHOTO_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {photoLabel(c)}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-[11px] text-destructive whitespace-pre-line">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full inline-flex items-center justify-center gap-1.5 bg-primary disabled:opacity-60 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-primary/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          {busy ? "Adding…" : "Add photo"}
        </button>
      </form>
    </section>
  );
}
