import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock,
  ExternalLink,
  Hammer,
  HardHat,
  Home as HomeIcon,
  Images,
  KeyRound,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  Pause,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "wouter";
import { api, type Job, type PortalLookupResponse } from "@/lib/api";
import Seo from "@/components/Seo";
import { SITE } from "@/lib/site-config";

const STORAGE_KEY = "chs.portal.identifier.v1";

type Status = "scheduled" | "in_progress" | "complete" | "on_hold" | string;

const STATUS_META: Record<
  Status,
  { label: string; bg: string; text: string; icon: typeof Clock }
> = {
  scheduled: { label: "Scheduled", bg: "bg-foreground/[0.05]", text: "text-foreground/80", icon: Clock },
  in_progress: { label: "In progress", bg: "bg-primary/10", text: "text-primary", icon: Hammer },
  complete: { label: "Complete", bg: "bg-emerald-100", text: "text-emerald-700", icon: CheckCircle2 },
  on_hold: { label: "On hold", bg: "bg-amber-100", text: "text-amber-700", icon: Pause },
};

const fmtDate = (s?: string | null) => {
  if (!s) return "";
  const d = new Date(s);
  return Number.isNaN(d.getTime())
    ? String(s)
    : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
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

export default function PortalPage() {
  const [identifier, setIdentifier] = useState("");
  const [data, setData] = useState<PortalLookupResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const previous = document.title;
    document.title = `My Project — ${SITE.brand}`;
    return () => {
      document.title = previous;
    };
  }, []);

  // Auto-restore last identifier OR honour a shared link like
  // `/portal?account=CHS-XXXX` / `/portal?email=…` / `/portal?id=…`.
  // Shared-link params take precedence so a forwarded link always
  // shows the right project even if the browser remembered a
  // different one. `id` is supported for backward-compat with the
  // earlier deep-link format.
  useEffect(() => {
    let cancelled = false;
    const fromQuery = (() => {
      if (typeof window === "undefined") return null;
      const params = new URLSearchParams(window.location.search);
      const q =
        params.get("account") ??
        params.get("acct") ??
        params.get("id") ??
        params.get("email") ??
        null;
      return q ? q.trim() : null;
    })();
    const saved = (() => {
      try {
        return localStorage.getItem(STORAGE_KEY);
      } catch {
        return null;
      }
    })();
    const value = fromQuery ?? saved;
    if (!value) return;
    setIdentifier(value);
    setLoading(true);
    void api.portalLookup(value).then((res) => {
      if (cancelled) return;
      if (res) {
        setData(res);
        // Persist so they don't have to repaste next time.
        try {
          localStorage.setItem(STORAGE_KEY, value);
        } catch {
          // ignore
        }
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = identifier.trim();
    if (!value) return;
    setLoading(true);
    setError(null);
    const res = await api.portalLookup(value);
    setLoading(false);
    if (res) {
      setData(res);
      try {
        localStorage.setItem(STORAGE_KEY, value);
      } catch {
        // ignore
      }
    } else {
      setError(
        "We couldn't find an account with that email or account number. Double-check the spelling, or call us at " +
          SITE.phoneDisplay +
          ".",
      );
    }
  };

  const signOut = () => {
    setData(null);
    setIdentifier("");
    setError(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  // ─── Login screen ──────────────────────────────────────────────
  if (!data) {
    return (
      <main className="min-h-[80vh] bg-background flex items-center justify-center px-4 py-16">
        <Seo
          title="Customer Portal | CHS Roofing"
          description="Sign in with your email or CHS account number to view your roofing project status, photos, and team updates."
          path="/portal"
          noIndex
        />
        <div className="w-full max-w-md bg-card border border-border/60 rounded-3xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <KeyRound className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-primary">
                {SITE.brand} Customer Portal
              </p>
              <h1 className="font-display font-bold tracking-tight text-2xl text-foreground">
                See your project status
              </h1>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            Enter the email on file or your CHS account number to view your
            project timeline, photos, and progress.
          </p>
          <form onSubmit={onSubmit} className="space-y-3">
            <label className="block text-xs font-semibold text-foreground">
              Email or account number
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="you@example.com  ·  or  ·  CHS-A2K9P3"
              autoComplete="email"
              autoFocus
              className="w-full h-12 px-4 rounded-xl border border-border/60 bg-background text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            {error && <p className="text-[12px] text-destructive leading-snug">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white h-12 rounded-xl font-semibold text-base tracking-tight shadow-md shadow-primary/30 transition-all disabled:opacity-60"
            >
              {loading ? "Looking up…" : "View my project"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          <p className="mt-5 text-[11px] text-muted-foreground leading-relaxed">
            Don't have an account yet? Once a CHS rep schedules your first
            project, we'll text you your account number. In the meantime, give
            us a call at{" "}
            <a className="underline hover:text-foreground" href={`tel:${SITE.phoneTel}`}>
              {SITE.phoneDisplay}
            </a>
            .
          </p>
        </div>
      </main>
    );
  }

  // ─── Dashboard ─────────────────────────────────────────────────
  return (
    <main className="bg-background min-h-screen">
      <Seo
        title={`${data.customer.name.split(" ")[0]}'s Project | CHS Roofing Portal`}
        description="View your CHS Roofing project status, progress, photos and team updates."
        path="/portal"
        noIndex
      />
      <div className="container mx-auto max-w-4xl px-4 py-10">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-primary">
              Welcome back
            </p>
            <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground">
              Hi, {data.customer.name.split(" ")[0]}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Account{" "}
              <span className="font-mono font-semibold text-foreground tracking-wide">
                {data.customer.accountNumber}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="self-start md:self-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold text-foreground/70 hover:text-foreground hover:bg-foreground/[0.04] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </header>

        {/* Customer info card */}
        <section className="bg-card border border-border/60 rounded-2xl p-5 mb-8 shadow-sm">
          <div className="grid sm:grid-cols-2 gap-3 text-sm text-foreground/80">
            {data.customer.email && (
              <span className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-primary" />
                {data.customer.email}
              </span>
            )}
            {data.customer.phone && (
              <span className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-primary" />
                {data.customer.phone}
              </span>
            )}
            {data.customer.address && (
              <span className="flex items-center gap-2 sm:col-span-2">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {data.customer.address}
              </span>
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-border/60 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Need anything?
            </span>
            <a className="hover:text-primary inline-flex items-center gap-1.5" href={`tel:${SITE.phoneTel}`}>
              <Phone className="w-3.5 h-3.5" />
              {SITE.phoneDisplay}
            </a>
            <a className="hover:text-primary inline-flex items-center gap-1.5" href={`mailto:${SITE.email}`}>
              <Mail className="w-3.5 h-3.5" />
              {SITE.email}
            </a>
          </div>
        </section>

        {data.jobs.length === 0 ? (
          <div className="bg-card border border-border/60 rounded-3xl p-10 text-center">
            <Sparkles className="w-8 h-8 mx-auto text-primary mb-3" />
            <h2 className="font-display font-bold text-xl text-foreground">
              No active project yet
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              Once your CHS rep schedules your project, you'll see updates,
              photos, and progress right here.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Get a free quote
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {data.jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function JobCard({ job }: { job: Job }) {
  const meta =
    STATUS_META[job.status as Status] ?? STATUS_META.scheduled;
  const StatusIcon = meta.icon;

  const updates = useMemo(() => job.updates.slice(0, 10), [job.updates]);
  const photos = useMemo(() => job.photos, [job.photos]);

  return (
    <article className="bg-card border border-border/60 rounded-3xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 md:p-7 border-b border-border/60">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 ${meta.bg} ${meta.text} text-[10px] font-semibold uppercase tracking-[0.18em] px-3 py-1 rounded-full`}
          >
            <StatusIcon className="w-3 h-3" />
            {meta.label}
          </span>
          {job.serviceType && (
            <span className="inline-flex items-center gap-1.5 bg-foreground/[0.04] text-foreground/70 text-[10px] font-semibold uppercase tracking-[0.18em] px-3 py-1 rounded-full">
              <HardHat className="w-3 h-3" />
              {job.serviceType.replace(/-/g, " ")}
            </span>
          )}
        </div>
        <h2 className="font-display font-bold text-2xl text-foreground tracking-tight">
          {job.title}
        </h2>
        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-muted-foreground">
          {job.startDate && (
            <span>Started: <span className="text-foreground/80">{fmtDate(job.startDate)}</span></span>
          )}
          {job.estimatedCompletion && (
            <span>Est. completion: <span className="text-foreground/80">{fmtDate(job.estimatedCompletion)}</span></span>
          )}
        </div>

        {/* Progress */}
        <div className="mt-5">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Progress
            </span>
            <span className="text-sm font-semibold text-foreground">{job.progress}%</span>
          </div>
          <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700"
              style={{ width: `${Math.max(0, Math.min(100, job.progress))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Photo album — primary photo experience. Linked to an external
          gallery (Google Photos / Drive / Dropbox) that the team
          maintains. We try to embed; some providers block iframes, so
          we always show a clear "Open in new tab" button too. */}
      {job.photoAlbumUrl && (
        <div className="p-6 md:p-7 border-b border-border/60">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <h3 className="font-display font-bold text-base text-foreground tracking-tight flex items-center gap-2">
              <Images className="w-4 h-4 text-primary" />
              Photo album
            </h3>
            <a
              href={job.photoAlbumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary hover:text-primary/80"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open the full album
            </a>
          </div>
          <div className="rounded-2xl overflow-hidden border border-border/60 bg-muted/30 aspect-video relative">
            <iframe
              src={job.photoAlbumUrl}
              title="Project photo album"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            If the preview above doesn't load, tap "Open the full album" — some
            sharing providers block embedded views for security.
          </p>
        </div>
      )}

      {/* Fallback: any per-photo entries that are external URLs. We
          stripped legacy base64 uploads server-side. */}
      {photos.length > 0 && (
        <div className="p-6 md:p-7 border-b border-border/60">
          <h3 className="font-display font-bold text-base text-foreground tracking-tight mb-3 flex items-center gap-2">
            <Camera className="w-4 h-4 text-primary" />
            More photos
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {photos.map((p) => (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square rounded-xl overflow-hidden border border-border/60 bg-muted/30 group"
              >
                <img
                  loading="lazy"
                  src={p.url}
                  alt={p.caption ?? ""}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Updates */}
      <div className="p-6 md:p-7">
        <h3 className="font-display font-bold text-base text-foreground tracking-tight mb-3 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          Updates from the team
        </h3>
        {updates.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No updates yet. Your CHS rep will post here as your project moves
            forward.
          </p>
        ) : (
          <ol className="space-y-4">
            {updates.map((u) => (
              <li
                key={u.id}
                className="relative pl-5 border-l-2 border-primary/20"
              >
                <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-primary" />
                <p className="text-[13px] text-foreground/85 whitespace-pre-line leading-relaxed">
                  {u.body}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {u.authorName ? `${u.authorName} · ` : ""}
                  {fmtDateTime(u.createdAt)}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="bg-muted/40 px-6 md:px-7 py-4 flex flex-wrap items-center justify-between gap-3">
        <span className="text-[12px] text-muted-foreground inline-flex items-center gap-1.5">
          <HomeIcon className="w-3.5 h-3.5 text-primary" />
          Job #{job.id} · created {fmtDate(job.createdAt)}
        </span>
        <a
          href={`tel:${SITE.phoneTel}`}
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary hover:text-primary/80"
        >
          <Phone className="w-3.5 h-3.5" /> Call us
        </a>
      </div>
    </article>
  );
}
