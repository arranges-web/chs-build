import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Calendar,
  CalendarCheck,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Clock,
  CreditCard,
  CloudLightning,
  Copy,
  Download,
  Droplets,
  ExternalLink,
  FileText,
  Gift,
  Hammer,
  HardHat,
  Home as HomeIcon,
  Images,
  KeyRound,
  ListChecks,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  Pause,
  Phone,
  RefreshCw,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  User,
  Wrench,
  X,
  XCircle,
} from "lucide-react";
import { Link } from "wouter";
import {
  api,
  type CustomerMessage,
  type Job,
  type JobDocument,
  type JobInspection,
  type JobPhoto,
  type JobUpdate,
  type PortalLookupResponse,
  type ServiceRequest,
} from "@/lib/api";
import Seo from "@/components/Seo";
import { SITE } from "@/lib/site-config";

const STORAGE_KEY = "chs.portal.identifier.v1";

// ─── Status metadata ───────────────────────────────────────────

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

const INSPECTION_META: Record<
  string,
  { label: string; bg: string; text: string; dot: string; icon: typeof Clock }
> = {
  upcoming: { label: "Upcoming", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", icon: Clock },
  passed: { label: "Passed", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", icon: CheckCircle2 },
  failed: { label: "Failed", bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", icon: XCircle },
  reinspection: { label: "Re-inspection", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", icon: RefreshCw },
};

const REQUEST_STATUS_META: Record<string, { label: string; bg: string; text: string }> = {
  new: { label: "Received", bg: "bg-blue-50", text: "text-blue-700" },
  in_progress: { label: "In progress", bg: "bg-amber-50", text: "text-amber-700" },
  closed: { label: "Closed", bg: "bg-emerald-50", text: "text-emerald-700" },
};

// ─── Service request types ─────────────────────────────────────

type RequestTypeDef = { type: string; label: string; icon: typeof Clock; blurb: string };

const REQUEST_TYPES: Record<string, RequestTypeDef> = {
  leak: { type: "leak", label: "Roof Leak Inspection", icon: Droplets, blurb: "Water spot, drip, or active leak" },
  warranty: { type: "warranty", label: "Warranty Service", icon: ShieldCheck, blurb: "An issue covered by your warranty" },
  annual: { type: "annual", label: "Annual Roof Inspection", icon: CalendarCheck, blurb: "Yearly checkup to protect your roof" },
  storm: { type: "storm", label: "Storm Damage Inspection", icon: CloudLightning, blurb: "After a hurricane or heavy storm" },
  maintenance: { type: "maintenance", label: "Schedule Maintenance", icon: Wrench, blurb: "Sealants, boots, and preventative care" },
  cleaning: { type: "cleaning", label: "Request Roof Cleaning", icon: Sparkles, blurb: "Debris, algae, and gutter-line cleanup" },
  general: { type: "general", label: "General Service Request", icon: ClipboardList, blurb: "Anything else — we'll route it" },
};

// ─── Photo categories ──────────────────────────────────────────

const PHOTO_CATEGORY_ORDER: string[] = [
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

const PHOTO_CATEGORY_LABELS: Record<string, string> = {
  before: "Before Photos",
  "tear-off": "Tear-Off",
  "deck-repairs": "Deck Repairs",
  underlayment: "Underlayment",
  "dry-in": "Dry-In",
  installation: "Installation",
  flashing: "Flashing",
  drone: "Drone Photos",
  final: "Final Roof",
  warranty: "Warranty Photos",
};

const MAINTENANCE_CHECKLIST = [
  { title: "Clean gutters & downspouts", detail: "Clogged gutters back water up under the roof edge — clear them at least twice a year." },
  { title: "Clean valleys & clear debris", detail: "Leaves and branches trap moisture in valleys, the most leak-prone part of any roof." },
  { title: "Inspect sealants & caulking", detail: "Florida sun breaks down sealants — have them checked and refreshed before they crack." },
  { title: "Check pipe boots & penetrations", detail: "Rubber pipe boots are the #1 source of small leaks. A quick look catches them early." },
  { title: "Annual professional roof inspection", detail: "A yearly CHS inspection catches small issues before hurricane season tests your roof." },
];

// ─── Section navigation ────────────────────────────────────────

const NAV_ITEMS = [
  { id: "portal-project", label: "My Project", icon: Hammer },
  { id: "portal-photos", label: "Photos", icon: Images },
  { id: "portal-documents", label: "Documents", icon: FileText },
  { id: "portal-schedule", label: "Schedule", icon: Calendar },
  { id: "portal-inspections", label: "Inspections", icon: ClipboardCheck },
  { id: "portal-payments", label: "Payments", icon: CreditCard },
  { id: "portal-warranty", label: "Warranty", icon: ShieldCheck },
  { id: "portal-maintenance", label: "Maintenance", icon: Wrench },
  { id: "portal-messages", label: "Messages", icon: MessageSquare },
  { id: "portal-contact", label: "Contact CHS", icon: Phone },
] as const;

const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

/**
 * Scroll-spy: track which section is currently in view so the sticky
 * nav can highlight it. Uses IntersectionObserver with a top rootMargin
 * that matches the sticky nav's approx height (~56px) plus a little
 * headroom, so a section "activates" the moment its heading crosses
 * under the nav bar.
 */
function useActiveSection(ids: readonly string[]): string {
  const [active, setActive] = useState<string>(ids[0] ?? "");
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;
    const observed = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (observed.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        // Track every intersecting section, pick the topmost one.
        const inView = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (inView[0]) {
          setActive(inView[0].target.id);
        }
      },
      // Push the top boundary down by the sticky nav height so
      // "active" flips right as the section's heading passes the nav.
      { rootMargin: "-72px 0px -60% 0px", threshold: 0 },
    );
    observed.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

// ─── Date helpers ──────────────────────────────────────────────

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

const fmtTime = (s?: string | null) => {
  if (!s) return "";
  const d = new Date(s);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

const dayLabel = (s: string) => {
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return String(s);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
};

/** "John Smith" → "John" · "John & Jane Smith" → "John & Jane". */
const firstNames = (full: string) => {
  const parts = full
    .split(/\s*(?:&|\band\b)\s*/i)
    .map((p) => p.trim())
    .filter(Boolean);
  const names = parts.map((p) => p.split(/\s+/)[0]).filter(Boolean);
  return names.join(" & ") || full;
};

// ═══════════════════════════════════════════════════════════════
// Page
// ═══════════════════════════════════════════════════════════════

export default function PortalPage() {
  const [identifier, setIdentifier] = useState("");
  const [data, setData] = useState<PortalLookupResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Customer-level collections kept in local state so we can append
  // optimistically after a successful send/submit.
  const [messages, setMessages] = useState<CustomerMessage[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

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
      if ("data" in res) {
        setData(res.data);
        // Persist so they don't have to repaste next time.
        try {
          localStorage.setItem(STORAGE_KEY, value);
        } catch {
          // ignore
        }
      } else {
        // A bad ?account= link or a stale remembered identifier used
        // to fail silently — the form just sat there prefilled with a
        // value that didn't work. Surface the server's reason and drop
        // the remembered value so the next visit starts clean.
        setError(res.error);
        try {
          localStorage.removeItem(STORAGE_KEY);
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

  // Sync customer-level collections + selected job whenever a fresh
  // lookup lands.
  useEffect(() => {
    if (!data) return;
    setMessages(data.messages);
    setRequests(data.requests);
    setSelectedJobId((prev) =>
      prev != null && data.jobs.some((j) => j.id === prev) ? prev : data.jobs[0]?.id ?? null,
    );
  }, [data]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = identifier.trim();
    if (!value) return;
    setLoading(true);
    setError(null);
    const res = await api.portalLookup(value);
    setLoading(false);
    if ("data" in res) {
      setData(res.data);
      try {
        localStorage.setItem(STORAGE_KEY, value);
      } catch {
        // ignore
      }
    } else {
      // Server message first (it knows whether the account is missing
      // or the DB is down); fall back to the friendly default.
      setError(
        res.status === 404 || !res.error
          ? "We couldn't find an account with that email or account number. Double-check the spelling, or call us at " +
              SITE.phoneDisplay +
              "."
          : res.error,
      );
    }
  };

  const signOut = () => {
    setData(null);
    setIdentifier("");
    setError(null);
    setMessages([]);
    setRequests([]);
    setSelectedJobId(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const onRequestSubmitted = useCallback((row: ServiceRequest) => {
    setRequests((prev) => [row, ...prev]);
  }, []);

  const onMessageSent = useCallback((row: CustomerMessage) => {
    setMessages((prev) => [...prev, row]);
  }, []);

  // ─── Login screen ──────────────────────────────────────────────
  if (!data) {
    return (
      <main className="min-h-[80vh] bg-background bg-wash-warm flex items-center justify-center px-4 py-16">
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
            project timeline, daily photos, documents, inspections, and
            warranty — all in one place.
          </p>
          <form onSubmit={onSubmit} className="space-y-3">
            <label htmlFor="portal-identifier" className="block text-xs font-semibold text-foreground">
              Email or account number
            </label>
            <input
              id="portal-identifier"
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
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Looking up…
                </>
              ) : (
                <>
                  View my project
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
          <div className="mt-5 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
            {[
              { icon: Images, label: "Daily photo updates" },
              { icon: ClipboardCheck, label: "Inspection results" },
              { icon: FileText, label: "Permits & documents" },
              { icon: ShieldCheck, label: "Warranty info" },
            ].map((f) => (
              <span key={f.label} className="inline-flex items-center gap-1.5">
                <f.icon className="w-3.5 h-3.5 text-primary" />
                {f.label}
              </span>
            ))}
          </div>
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
  const jobs = data.jobs;
  const selectedJob = jobs.find((j) => j.id === selectedJobId) ?? jobs[0] ?? null;
  const anyComplete = jobs.some((j) => j.status === "complete");

  return (
    <main className="bg-background min-h-screen">
      <Seo
        title={`${data.customer.name.split(" ")[0]}'s Project | CHS Roofing Portal`}
        description="View your CHS Roofing project status, progress, photos and team updates."
        path="/portal"
        noIndex
      />

      <div className="container mx-auto max-w-4xl px-4 pt-8 pb-4">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-primary">
              {SITE.brand} Customer Portal
            </p>
            <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground">
              Welcome, {firstNames(data.customer.name)}
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
            className="self-start md:self-auto inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold text-foreground/70 hover:text-foreground hover:bg-foreground/[0.04] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </header>
      </div>

      {jobs.length === 0 ? (
        <div className="container mx-auto max-w-4xl px-4 pb-16 space-y-6">
          <div className="bg-card border border-border/60 rounded-3xl p-10 text-center shadow-sm">
            <Sparkles className="w-8 h-8 mx-auto text-primary mb-3" />
            <h2 className="font-display font-bold text-xl text-foreground">No active project yet</h2>
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
          <MessagingSection identifier={identifier} messages={messages} onSent={onMessageSent} />
          <ContactSection />
        </div>
      ) : (
        <>
          {/* Job switcher — only when the customer has multiple jobs. */}
          {jobs.length > 1 && selectedJob && (
            <div className="container mx-auto max-w-4xl px-4 pb-4">
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                {jobs.map((j) => {
                  const active = j.id === selectedJob.id;
                  return (
                    <button
                      key={j.id}
                      type="button"
                      onClick={() => setSelectedJobId(j.id)}
                      className={`flex-none inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold border transition-colors ${
                        active
                          ? "bg-primary text-white border-primary shadow-md shadow-primary/25"
                          : "bg-card text-foreground/75 border-border/60 hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      <HardHat className="w-3.5 h-3.5" />
                      {j.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {selectedJob && (
            <div className="container mx-auto max-w-4xl px-4">
              <WelcomeCard customer={data.customer} job={selectedJob} />
            </div>
          )}

          {/* Sticky section navigation with scroll-spy active state.
              The active chip auto-scrolls into view on desktop and mobile
              so a customer three sections deep still sees where they are. */}
          <PortalNav />

          <div className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
            {selectedJob && (
              <>
                <TimelineSection job={selectedJob} />
                <UpdatesFeed updates={selectedJob.updates} />
                <PhotoSection job={selectedJob} />
                <DocumentsSection documents={selectedJob.documents} />
                <ScheduleSection job={selectedJob} />
                <InspectionsSection
                  job={selectedJob}
                  identifier={identifier}
                  requests={requests}
                  jobs={jobs}
                  onSubmitted={onRequestSubmitted}
                />
                <PaymentsSection job={selectedJob} />
                <WarrantySection job={selectedJob} identifier={identifier} onSubmitted={onRequestSubmitted} />
                <MaintenanceSection jobId={selectedJob.id} identifier={identifier} onSubmitted={onRequestSubmitted} />
              </>
            )}

            {/* Customer-level sections — independent of the selected job. */}
            <MessagingSection identifier={identifier} messages={messages} onSent={onMessageSent} />
            {anyComplete && <ReferralSection job={selectedJob} />}
            <ContactSection />
          </div>
        </>
      )}
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════
// Shared shell
// ═══════════════════════════════════════════════════════════════

/**
 * Sticky section nav with live scroll-spy. The current chip is
 * outlined so a customer can scan the strip and immediately see
 * where they are in the page. The active chip also gets scrolled
 * into the horizontal strip's own view so it doesn't fall off
 * screen on mobile as they scroll.
 */
function PortalNav() {
  const activeIds = useMemo(() => NAV_ITEMS.map((n) => n.id), []);
  const active = useActiveSection(activeIds);

  // Auto-scroll the active chip into the strip's visible area.
  useEffect(() => {
    const el = document.querySelector<HTMLButtonElement>(
      `[data-nav-chip="${active}"]`,
    );
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  return (
    <nav
      aria-label="Portal sections"
      className="sticky top-0 z-30 glass-surface border-b border-border/60 mt-6"
    >
      <div className="container mx-auto max-w-4xl px-4">
        <div className="flex gap-1.5 overflow-x-auto py-2.5 -mx-1 px-1 no-scrollbar">
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === active;
            return (
              <button
                key={item.id}
                type="button"
                data-nav-chip={item.id}
                onClick={() => scrollToSection(item.id)}
                aria-current={isActive ? "true" : undefined}
                className={`flex-none inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-primary text-white shadow-sm shadow-primary/25"
                    : "text-foreground/70 hover:text-primary hover:bg-primary/[0.06]"
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function Section({
  id,
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  id?: string;
  icon: typeof Clock;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="bg-card border border-border/60 rounded-3xl shadow-sm p-6 md:p-7">
        <header className="mb-5">
          <h2 className="font-display font-bold text-xl text-foreground tracking-tight flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-none">
              <Icon className="w-4.5 h-4.5 text-primary" />
            </span>
            {title}
          </h2>
          {subtitle && <p className="text-[13px] text-muted-foreground mt-1.5 leading-relaxed">{subtitle}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-muted-foreground bg-muted/40 border border-border/60 rounded-2xl px-4 py-5 text-center">
      {children}
    </p>
  );
}

// ═══════════════════════════════════════════════════════════════
// Welcome dashboard card
// ═══════════════════════════════════════════════════════════════

function WelcomeCard({
  customer,
  job,
}: {
  customer: PortalLookupResponse["customer"];
  job: Job;
}) {
  const meta = STATUS_META[job.status as Status] ?? STATUS_META.scheduled;
  const StatusIcon = meta.icon;
  const pmPhone = job.projectManagerPhone?.replace(/[^\d+]/g, "") || SITE.phoneTel;
  const startLabel = job.status === "scheduled" ? "Estimated start" : "Started";

  return (
    <section className="bg-card border border-border/60 rounded-3xl shadow-md overflow-hidden">
      <div className="p-6 md:p-7">
        <div className="flex flex-wrap items-center gap-2 mb-3">
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

        <h2 className="font-display font-bold text-2xl text-foreground tracking-tight">{job.title}</h2>

        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-muted-foreground">
          {customer.address && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span className="text-foreground/80">{customer.address}</span>
            </span>
          )}
          {job.startDate && (
            <span>
              {startLabel}: <span className="text-foreground/80 font-medium">{fmtDate(job.startDate)}</span>
            </span>
          )}
          {job.estimatedCompletion && (
            <span>
              Est. completion:{" "}
              <span className="text-foreground/80 font-medium">{fmtDate(job.estimatedCompletion)}</span>
            </span>
          )}
        </div>

        {/* Progress */}
        <div className="mt-5">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Overall progress
            </span>
            <span className="text-sm font-semibold text-foreground">{job.progress}%</span>
          </div>
          <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700"
              style={{ width: `${Math.max(0, Math.min(100, job.progress))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Project manager */}
      <div className="bg-muted/40 border-t border-border/60 px-6 md:px-7 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-none">
            <User className="w-5 h-5 text-primary" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-muted-foreground">
              Your Project Manager
            </p>
            <p className="font-semibold text-foreground truncate">
              {job.projectManager ?? `${SITE.brand} Team`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <a
            href={`tel:${pmPhone}`}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 text-white px-5 h-11 rounded-full text-sm font-semibold shadow-sm transition-colors"
          >
            <Phone className="w-4 h-4" />
            Call
          </a>
          <button
            type="button"
            onClick={() => scrollToSection("portal-messages")}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-card border border-border/60 hover:border-primary/40 text-foreground px-5 h-11 rounded-full text-sm font-semibold transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Message
          </button>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// My Project — milestone timeline
// ═══════════════════════════════════════════════════════════════

function TimelineSection({ job }: { job: Job }) {
  const milestones = useMemo(
    () => [...job.milestones].sort((a, b) => a.sortOrder - b.sortOrder),
    [job.milestones],
  );

  return (
    <Section
      id="portal-project"
      icon={Hammer}
      title="My Project"
      subtitle="Every stage of your roof, from permit to final inspection."
    >
      {milestones.length === 0 ? (
        <EmptyNote>
          Timeline coming soon — your CHS team will map out your project stages here.
        </EmptyNote>
      ) : (
        <ol className="relative">
          {milestones.map((m, i) => {
            const isLast = i === milestones.length - 1;
            const complete = m.status === "complete";
            const inProgress = m.status === "in_progress";
            return (
              <li key={m.id} className="relative flex gap-4 pb-1">
                {/* Rail */}
                <div className="flex flex-col items-center">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-none border-2 ${
                      complete
                        ? "bg-primary border-primary text-white"
                        : inProgress
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-muted border-border text-muted-foreground/60"
                    }`}
                  >
                    {complete ? (
                      <CheckCircle2 className="w-4.5 h-4.5" />
                    ) : inProgress ? (
                      <Hammer className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </span>
                  {!isLast && (
                    <span
                      className={`w-0.5 flex-1 min-h-6 ${complete ? "bg-primary/60" : "bg-border"}`}
                    />
                  )}
                </div>
                {/* Content */}
                <div className={`pb-5 flex-1 min-w-0 ${inProgress ? "" : ""}`}>
                  <div
                    className={`${
                      inProgress
                        ? "bg-primary/[0.05] border border-primary/25 rounded-2xl px-4 py-3 -mt-1"
                        : "pt-0.5"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <p
                        className={`font-semibold ${
                          complete
                            ? "text-foreground"
                            : inProgress
                              ? "text-primary"
                              : "text-muted-foreground"
                        }`}
                      >
                        {m.title}
                      </p>
                      {inProgress && (
                        <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full">
                          Happening now
                        </span>
                      )}
                      {complete && m.completedDate && (
                        <span className="text-[12px] text-muted-foreground">
                          {/* completedDate is freeform ("July 14") — only
                              format strings that are real ISO dates. */}
                          {/^\d{4}-\d{2}-\d{2}/.test(m.completedDate)
                            ? fmtDate(m.completedDate)
                            : m.completedDate}
                        </span>
                      )}
                    </div>
                    {m.notes && (
                      <p className="mt-1 text-[13px] text-foreground/70 leading-relaxed whitespace-pre-line">
                        {m.notes}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════
// Daily updates feed
// ═══════════════════════════════════════════════════════════════

function UpdatesFeed({ updates }: { updates: JobUpdate[] }) {
  const groups = useMemo(() => {
    const sorted = [...updates].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const out: Array<{ label: string; items: JobUpdate[] }> = [];
    for (const u of sorted) {
      const label = dayLabel(u.createdAt);
      const last = out[out.length - 1];
      if (last && last.label === label) last.items.push(u);
      else out.push({ label, items: [u] });
    }
    return out;
  }, [updates]);

  return (
    <Section
      icon={MessageSquare}
      title="Daily Updates"
      subtitle="Notes from your crew as your project moves forward."
    >
      {groups.length === 0 ? (
        <EmptyNote>
          No updates yet. Your CHS rep will post here as your project moves forward.
        </EmptyNote>
      ) : (
        <div className="space-y-6">
          {groups.map((g) => (
            <div key={g.label}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">
                {g.label}
              </p>
              <ol className="space-y-3">
                {g.items.map((u) => (
                  <li key={u.id} className="bg-muted/40 border border-border/60 rounded-2xl px-4 py-3.5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-none">
                        <HardHat className="w-3.5 h-3.5 text-primary" />
                      </span>
                      <p className="text-[12px] font-semibold text-foreground">
                        {u.authorName ?? `${SITE.brand} Team`}
                      </p>
                      <span className="text-[11px] text-muted-foreground ml-auto">
                        {fmtTime(u.createdAt) || fmtDate(u.createdAt)}
                      </span>
                    </div>
                    <p className="text-[13px] text-foreground/85 whitespace-pre-line leading-relaxed">
                      {u.body}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════
// Photo gallery
// ═══════════════════════════════════════════════════════════════

type PhotoGroup = { key: string; label: string; photos: JobPhoto[] };

function groupPhotos(photos: JobPhoto[]): PhotoGroup[] {
  const map = new Map<string, JobPhoto[]>();
  for (const p of photos) {
    const key = p.category ?? "__uncategorized";
    const arr = map.get(key);
    if (arr) arr.push(p);
    else map.set(key, [p]);
  }
  const known: PhotoGroup[] = PHOTO_CATEGORY_ORDER.filter((k) => map.has(k)).map((k) => ({
    key: k,
    label: PHOTO_CATEGORY_LABELS[k],
    photos: map.get(k) as JobPhoto[],
  }));
  const unknown: PhotoGroup[] = [...map.keys()]
    .filter((k) => k !== "__uncategorized" && !PHOTO_CATEGORY_ORDER.includes(k))
    .sort()
    .map((k) => ({
      key: k,
      label: k.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      photos: map.get(k) as JobPhoto[],
    }));
  const uncategorized: PhotoGroup[] = map.has("__uncategorized")
    ? [{ key: "__uncategorized", label: "Project Photos", photos: map.get("__uncategorized") as JobPhoto[] }]
    : [];
  return [...known, ...unknown, ...uncategorized];
}

function PhotoSection({ job }: { job: Job }) {
  const groups = useMemo(() => groupPhotos(job.photos), [job.photos]);
  const [active, setActive] = useState<JobPhoto | null>(null);

  // Close lightbox on Escape.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const hasAlbums = job.albums.length > 0 || Boolean(job.photoAlbumUrl);
  const hasAnything = hasAlbums || groups.length > 0;

  return (
    <Section
      id="portal-photos"
      icon={Images}
      title="Photo Gallery"
      subtitle="Your project documented at every stage — tap any photo to view it full-size."
    >
      {!hasAnything && (
        <EmptyNote>
          Photos will appear here once your crew starts documenting the project.
        </EmptyNote>
      )}

      {/* Photo albums — each labeled gallery (Google Photos / Drive /
          Dropbox) embedded with a guaranteed-to-work "Open in new tab"
          fallback. Falls back to the legacy single-album field on jobs
          that haven't migrated yet. External albums are the primary
          gallery mechanism. */}
      {hasAlbums && (
        <div className="space-y-6 mb-6">
          {job.albums.length > 0
            ? job.albums.map((album) => (
                <AlbumEmbed key={album.id} label={album.label} url={album.url} />
              ))
            : job.photoAlbumUrl && <AlbumEmbed label="Photo album" url={job.photoAlbumUrl} />}
          <p className="text-[11px] text-muted-foreground">
            If a preview doesn't load, tap "Open the full album" — some sharing
            providers block embedded views for security.
          </p>
        </div>
      )}

      {groups.length > 0 && (
        <div className="space-y-6">
          {groups.map((g) => (
            <div key={g.key}>
              <div className="flex items-center gap-2 mb-2.5">
                <Camera className="w-4 h-4 text-primary" />
                <h3 className="font-display font-bold text-[15px] text-foreground tracking-tight">
                  {g.label}
                </h3>
                <span className="text-[11px] text-muted-foreground">
                  {g.photos.length} photo{g.photos.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {g.photos.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActive(p)}
                    className="aspect-square rounded-xl overflow-hidden border border-border/60 bg-muted/30 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={p.caption ?? "View photo full-size"}
                  >
                    <img
                      loading="lazy"
                      src={p.url}
                      alt={p.caption ?? ""}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-label="Close photo"
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={active.url}
            alt={active.caption ?? ""}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl"
          />
          <div
            className="mt-4 flex flex-wrap items-center justify-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {active.caption && (
              <p className="w-full text-center text-sm text-white/85">{active.caption}</p>
            )}
            <a
              href={active.url}
              download
              className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white px-5 h-11 rounded-full text-sm font-semibold transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </a>
            <a
              href={active.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-5 h-11 rounded-full text-sm font-semibold transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open full size
            </a>
          </div>
        </div>
      )}
    </Section>
  );
}

function AlbumEmbed({ label, url }: { label: string; url: string }) {
  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
        <p className="font-semibold text-sm text-foreground">{label}</p>
        <a
          href={url}
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
          src={url}
          title={`Photo album — ${label}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 w-full h-full"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Documents Center
// ═══════════════════════════════════════════════════════════════

function DocumentsSection({ documents }: { documents: JobDocument[] }) {
  return (
    <Section
      id="portal-documents"
      icon={FileText}
      title="Documents Center"
      subtitle="Contracts, permits, warranties, and everything else on file for your project."
    >
      {documents.length === 0 ? (
        <EmptyNote>
          No documents yet. Your contract, permit, and warranty paperwork will
          appear here as they're finalized.
        </EmptyNote>
      ) : (
        <ul className="space-y-2.5">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center gap-3 bg-muted/40 border border-border/60 rounded-2xl px-4 py-3.5"
            >
              <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-none">
                <FileText className="w-4.5 h-4.5 text-primary" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">{doc.label}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {doc.category && (
                    <span className="inline-flex bg-foreground/[0.06] text-foreground/70 text-[10px] font-semibold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full">
                      {doc.category.replace(/-/g, " ")}
                    </span>
                  )}
                  <span className="text-[11px] text-muted-foreground">{fmtDate(doc.createdAt)}</span>
                </div>
              </div>
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-none inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white px-4 h-11 rounded-full text-[13px] font-semibold transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════
// Schedule
// ═══════════════════════════════════════════════════════════════

function ScheduleSection({ job }: { job: Job }) {
  const nextInspection = useMemo(() => {
    const upcoming = job.inspections
      .filter((i) => i.status === "upcoming" && i.date)
      .sort((a, b) => new Date(a.date as string).getTime() - new Date(b.date as string).getTime());
    return upcoming[0] ?? null;
  }, [job.inspections]);

  const currentMilestone = useMemo(
    () =>
      [...job.milestones]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .find((m) => m.status === "in_progress") ?? null,
    [job.milestones],
  );

  const items: Array<{ icon: typeof Clock; label: string; value: string; hint?: string }> = [];
  if (job.startDate) {
    items.push({
      icon: Calendar,
      label: job.status === "scheduled" ? "Estimated start" : "Project started",
      value: fmtDate(job.startDate),
    });
  }
  if (job.estimatedCompletion) {
    items.push({ icon: CalendarCheck, label: "Estimated completion", value: fmtDate(job.estimatedCompletion) });
  }
  if (currentMilestone) {
    items.push({ icon: Hammer, label: "Current stage", value: currentMilestone.title });
  }
  if (nextInspection) {
    items.push({
      icon: ClipboardCheck,
      label: "Next inspection",
      value: fmtDate(nextInspection.date),
      hint: [nextInspection.inspectionType, nextInspection.timeWindow].filter(Boolean).join(" · "),
    });
  }

  return (
    <Section
      id="portal-schedule"
      icon={Calendar}
      title="Schedule"
      subtitle="Key dates for your project. Weather and inspections can shift things — we'll keep you posted here."
    >
      {items.length === 0 ? (
        <EmptyNote>Dates will appear here once your project is scheduled.</EmptyNote>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {items.map((it) => (
            <div key={it.label} className="bg-muted/40 border border-border/60 rounded-2xl px-4 py-4 flex items-start gap-3">
              <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-none">
                <it.icon className="w-4.5 h-4.5 text-primary" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-muted-foreground">
                  {it.label}
                </p>
                <p className="font-semibold text-foreground mt-0.5">{it.value}</p>
                {it.hint && <p className="text-[12px] text-muted-foreground mt-0.5">{it.hint}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════
// Inspection Center + service requests
// ═══════════════════════════════════════════════════════════════

function InspectionRow({ inspection }: { inspection: JobInspection }) {
  const meta = INSPECTION_META[inspection.status] ?? INSPECTION_META.upcoming;
  const MetaIcon = meta.icon;
  return (
    <li className="flex gap-3.5 bg-muted/40 border border-border/60 rounded-2xl px-4 py-4">
      <span className={`w-10 h-10 rounded-full ${meta.bg} flex items-center justify-center flex-none`}>
        <MetaIcon className={`w-5 h-5 ${meta.text}`} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <p className="font-semibold text-foreground">{inspection.inspectionType}</p>
          <span
            className={`inline-flex items-center gap-1 ${meta.bg} ${meta.text} text-[10px] font-semibold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
            {meta.label}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-[13px] text-muted-foreground">
          {inspection.date && (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {fmtDate(inspection.date)}
            </span>
          )}
          {inspection.timeWindow && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {inspection.timeWindow}
            </span>
          )}
          {inspection.county && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {inspection.county}
            </span>
          )}
        </div>
        {inspection.inspectorNotes && (
          <p className="mt-2 text-[13px] text-foreground/75 bg-card border border-border/60 rounded-xl px-3 py-2 leading-relaxed whitespace-pre-line">
            {inspection.inspectorNotes}
          </p>
        )}
      </div>
    </li>
  );
}

/**
 * Reusable "pick a request type → optional message → submit" panel.
 * Used by the Inspection, Warranty, and Maintenance centers with
 * different subsets of request types.
 */
function RequestServicePanel({
  types,
  identifier,
  jobId,
  onSubmitted,
  columns = 2,
}: {
  types: RequestTypeDef[];
  identifier: string;
  jobId?: number;
  onSubmitted: (row: ServiceRequest) => void;
  columns?: 1 | 2;
}) {
  const [activeType, setActiveType] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [doneLabel, setDoneLabel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const active = activeType ? types.find((t) => t.type === activeType) ?? null : null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!active || busy) return;
    setBusy(true);
    setError(null);
    const res = await api.portalSubmitRequest({
      identifier,
      requestType: active.type,
      message: message.trim() || undefined,
      jobId,
    });
    setBusy(false);
    if ("data" in res) {
      onSubmitted(res.data.row);
      setDoneLabel(active.label);
      setActiveType(null);
      setMessage("");
    } else {
      setError(res.error);
    }
  };

  if (doneLabel) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-6 text-center">
        <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
        <p className="font-semibold text-emerald-800">Request received — our office has been notified.</p>
        <p className="text-[13px] text-emerald-700 mt-1">
          {doneLabel} · We'll reach out shortly to schedule.
        </p>
        <button
          type="button"
          onClick={() => setDoneLabel(null)}
          className="mt-4 inline-flex items-center justify-center bg-card border border-emerald-200 text-emerald-800 px-5 h-11 rounded-full text-sm font-semibold hover:bg-emerald-100/50 transition-colors"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className={`grid gap-2.5 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
        {types.map((t) => {
          const isActive = t.type === activeType;
          return (
            <button
              key={t.type}
              type="button"
              onClick={() => {
                setActiveType(isActive ? null : t.type);
                setError(null);
              }}
              aria-expanded={isActive}
              className={`text-left flex items-center gap-3 rounded-2xl border px-4 py-3.5 min-h-[64px] transition-colors ${
                isActive
                  ? "border-primary bg-primary/[0.06] shadow-sm"
                  : "border-border/60 bg-card hover:border-primary/40"
              }`}
            >
              <span
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-none ${
                  isActive ? "bg-primary text-white" : "bg-primary/10 text-primary"
                }`}
              >
                <t.icon className="w-4.5 h-4.5" />
              </span>
              <span className="min-w-0">
                <span className={`block font-semibold text-sm ${isActive ? "text-primary" : "text-foreground"}`}>
                  {t.label}
                </span>
                <span className="block text-[12px] text-muted-foreground">{t.blurb}</span>
              </span>
            </button>
          );
        })}
      </div>

      {active && (
        <form onSubmit={submit} className="mt-4 bg-muted/40 border border-border/60 rounded-2xl p-4 space-y-3">
          <label htmlFor={`request-message-${active.type}`} className="block text-xs font-semibold text-foreground">
            Anything we should know? <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <textarea
            id={`request-message-${active.type}`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="Where you're seeing the issue, best days for a visit, gate codes…"
            className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background text-base leading-relaxed resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {error && <p className="text-[12px] text-destructive leading-snug">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={busy}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white h-12 rounded-xl font-semibold text-sm shadow-md shadow-primary/25 transition-all disabled:opacity-60"
            >
              {busy ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Sending…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Submit request
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveType(null)}
              className="inline-flex items-center justify-center px-5 h-12 rounded-xl border border-border/60 bg-card text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function InspectionsSection({
  job,
  jobs,
  identifier,
  requests,
  onSubmitted,
}: {
  job: Job;
  jobs: Job[];
  identifier: string;
  requests: ServiceRequest[];
  onSubmitted: (row: ServiceRequest) => void;
}) {
  const inspections = useMemo(
    () =>
      [...job.inspections].sort((a, b) => {
        const ta = a.date ? new Date(a.date).getTime() : 0;
        const tb = b.date ? new Date(b.date).getTime() : 0;
        return tb - ta;
      }),
    [job.inspections],
  );

  const sortedRequests = useMemo(
    () =>
      [...requests].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [requests],
  );

  const jobTitle = (jobId: number | null) =>
    jobId == null ? null : jobs.find((j) => j.id === jobId)?.title ?? null;

  return (
    <Section
      id="portal-inspections"
      icon={ClipboardCheck}
      title="Inspection Center"
      subtitle="County inspections tracked like a package — you'll always know where your roof stands."
    >
      {inspections.length === 0 ? (
        <EmptyNote>No inspections scheduled yet. They'll appear here once permits are pulled.</EmptyNote>
      ) : (
        <ul className="space-y-3">
          {inspections.map((i) => (
            <InspectionRow key={i.id} inspection={i} />
          ))}
        </ul>
      )}

      {/* Request service */}
      <div className="mt-7 pt-6 border-t border-border/60">
        <h3 className="font-display font-bold text-lg text-foreground tracking-tight mb-1">
          Request Service
        </h3>
        <p className="text-[13px] text-muted-foreground mb-4">
          Need us out? Pick what fits and our office will call you to schedule.
        </p>
        <RequestServicePanel
          types={[
            REQUEST_TYPES.leak,
            REQUEST_TYPES.warranty,
            REQUEST_TYPES.annual,
            REQUEST_TYPES.storm,
            REQUEST_TYPES.general,
          ]}
          identifier={identifier}
          jobId={job.id}
          onSubmitted={onSubmitted}
        />
      </div>

      {/* Existing requests */}
      {sortedRequests.length > 0 && (
        <div className="mt-7 pt-6 border-t border-border/60">
          <h3 className="font-display font-bold text-lg text-foreground tracking-tight mb-3">
            Your service requests
          </h3>
          <ul className="space-y-2.5">
            {sortedRequests.map((r) => {
              const meta = REQUEST_STATUS_META[r.status] ?? REQUEST_STATUS_META.new;
              const def = REQUEST_TYPES[r.requestType];
              const title = jobTitle(r.jobId);
              return (
                <li
                  key={r.id}
                  className="flex items-start gap-3 bg-muted/40 border border-border/60 rounded-2xl px-4 py-3.5"
                >
                  <span className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-none mt-0.5">
                    {def ? (
                      <def.icon className="w-4 h-4 text-primary" />
                    ) : (
                      <ClipboardList className="w-4 h-4 text-primary" />
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                      <p className="font-semibold text-sm text-foreground">
                        {def?.label ?? r.requestType.replace(/-/g, " ")}
                      </p>
                      <span
                        className={`inline-flex ${meta.bg} ${meta.text} text-[10px] font-semibold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full`}
                      >
                        {meta.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {fmtDateTime(r.createdAt)}
                      {title ? ` · ${title}` : ""}
                    </p>
                    {r.message && (
                      <p className="text-[13px] text-foreground/70 mt-1 leading-relaxed whitespace-pre-line">
                        {r.message}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════
// Warranty Center
// ═══════════════════════════════════════════════════════════════

function WarrantySection({
  job,
  identifier,
  onSubmitted,
}: {
  job: Job;
  identifier: string;
  onSubmitted: (row: ServiceRequest) => void;
}) {
  const warrantyDoc = useMemo(
    () => job.documents.find((d) => d.category === "warranty") ?? null,
    [job.documents],
  );

  const cells: Array<{ label: string; value: string | null }> = [
    { label: "Roof system", value: job.roofSystem },
    { label: "Manufacturer warranty", value: job.warrantyManufacturer },
    { label: "Workmanship warranty", value: job.warrantyWorkmanship },
    { label: "Warranty start date", value: job.warrantyStartDate ? fmtDate(job.warrantyStartDate) : null },
  ];

  return (
    <Section
      id="portal-warranty"
      icon={ShieldCheck}
      title="Warranty Center"
      subtitle="What's covering your roof — and one tap to file a warranty claim if anything comes up."
    >
      <div className="grid sm:grid-cols-2 gap-3 mb-5">
        {cells.map((c) => (
          <div key={c.label} className="bg-muted/40 border border-border/60 rounded-2xl px-4 py-4">
            <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-muted-foreground">
              {c.label}
            </p>
            <p className={`mt-0.5 font-semibold ${c.value ? "text-foreground" : "text-muted-foreground/70"}`}>
              {c.value ?? "On file with CHS"}
            </p>
          </div>
        ))}
      </div>

      {warrantyDoc && (
        <a
          href={warrantyDoc.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-5 inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-secondary text-secondary-foreground hover:opacity-90 px-6 h-12 rounded-xl text-sm font-semibold transition-opacity"
        >
          <Download className="w-4 h-4" />
          Download Warranty
        </a>
      )}

      <RequestServicePanel
        types={[REQUEST_TYPES.warranty]}
        identifier={identifier}
        jobId={job.id}
        onSubmitted={onSubmitted}
        columns={1}
      />
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════
// Payments — surfaces invoice / receipt documents and points to the
// office for anything else. We don't process payments in-app on
// purpose (no PCI scope), so this section stays informational and
// leans on the Documents feed for the actual invoice PDFs.
// ═══════════════════════════════════════════════════════════════

function PaymentsSection({ job }: { job: Job }) {
  // Any doc tagged "invoice", "receipt", or "change-order" is money-
  // related — surface them here as a shortcut so the customer doesn't
  // have to scroll back up to the Documents section for a receipt.
  const paymentDocs = useMemo(
    () =>
      job.documents.filter((d) => {
        const cat = (d.category ?? "").toLowerCase();
        return cat === "invoice" || cat === "receipt" || cat === "change-order";
      }),
    [job.documents],
  );

  return (
    <Section
      id="portal-payments"
      icon={CreditCard}
      title="Payments"
      subtitle="Invoices, receipts, and how to pay us."
    >
      {paymentDocs.length > 0 ? (
        <ul className="space-y-2 mb-5">
          {paymentDocs.map((d) => (
            <li
              key={d.id}
              className="flex items-center gap-3 bg-muted/40 border border-border/60 rounded-2xl px-4 py-3"
            >
              <FileText className="w-4 h-4 text-primary flex-none" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground truncate">{d.label}</p>
                {d.category && (
                  <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground mt-0.5">
                    {d.category.replace(/-/g, " ")}
                  </p>
                )}
              </div>
              <a
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-semibold px-3 h-9 rounded-full shadow-sm transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Open
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyNote>
          No invoices or receipts posted yet. As soon as your CHS team
          uploads them they'll show up here.
        </EmptyNote>
      )}

      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        <a
          href={`tel:${SITE.phoneTel}`}
          className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white h-12 rounded-xl text-sm font-semibold shadow-sm shadow-primary/30 transition-colors"
        >
          <Phone className="w-4 h-4" />
          Call about a payment
        </a>
        <a
          href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Payment question — ${job.title}`)}`}
          className="inline-flex items-center justify-center gap-2 bg-card border border-border/60 hover:border-primary/40 text-foreground h-12 rounded-xl text-sm font-semibold transition-colors"
        >
          <Mail className="w-4 h-4 text-primary" />
          Email us
        </a>
      </div>

      <p className="mt-4 text-[11px] text-muted-foreground leading-relaxed">
        CHS Roofing doesn't collect payments through this portal. Call or
        email us to arrange payment or ask about your invoice.
      </p>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════
// Maintenance Center
// ═══════════════════════════════════════════════════════════════

function MaintenanceSection({
  jobId,
  identifier,
  onSubmitted,
}: {
  jobId: number;
  identifier: string;
  onSubmitted: (row: ServiceRequest) => void;
}) {
  return (
    <Section
      id="portal-maintenance"
      icon={Wrench}
      title="Maintenance Center"
      subtitle="A well-maintained roof lasts years longer. Here's what we recommend for Southwest Florida."
    >
      <ul className="space-y-2.5 mb-6">
        {MAINTENANCE_CHECKLIST.map((item) => (
          <li key={item.title} className="flex gap-3 bg-muted/40 border border-border/60 rounded-2xl px-4 py-3.5">
            <ListChecks className="w-5 h-5 text-primary flex-none mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-foreground">{item.title}</p>
              <p className="text-[13px] text-muted-foreground leading-relaxed mt-0.5">{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>
      <RequestServicePanel
        types={[REQUEST_TYPES.maintenance, REQUEST_TYPES.cleaning]}
        identifier={identifier}
        jobId={jobId}
        onSubmitted={onSubmitted}
      />
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════
// Messaging
// ═══════════════════════════════════════════════════════════════

function MessagingSection({
  identifier,
  messages,
  onSent,
}: {
  identifier: string;
  messages: CustomerMessage[];
  onSent: (row: CustomerMessage) => void;
}) {
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const thread = useMemo(
    () =>
      [...messages].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ),
    [messages],
  );

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = draft.trim();
    if (!body || busy) return;
    setBusy(true);
    setError(null);
    const res = await api.portalSendMessage({ identifier, body });
    setBusy(false);
    if ("data" in res) {
      onSent(res.data.row);
      setDraft("");
    } else {
      setError(res.error);
    }
  };

  return (
    <Section
      id="portal-messages"
      icon={MessageSquare}
      title="Messages"
      subtitle="Send our office a message any time — we reply during business hours."
    >
      {thread.length === 0 ? (
        <EmptyNote>No messages yet. Say hello — we're quick to reply.</EmptyNote>
      ) : (
        <ol className="space-y-3 max-h-[420px] overflow-y-auto pr-1 mb-4">
          {thread.map((m) => {
            const mine = m.sender === "customer";
            return (
              <li key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 ${
                    mine
                      ? "bg-primary text-white rounded-br-md"
                      : "bg-muted border border-border/60 text-foreground rounded-bl-md"
                  }`}
                >
                  <p className="text-[14px] leading-relaxed whitespace-pre-line">{m.body}</p>
                  <p
                    className={`mt-1.5 text-[10px] uppercase tracking-[0.1em] font-semibold ${
                      mine ? "text-white/70" : "text-muted-foreground"
                    }`}
                  >
                    {mine ? "You" : m.authorName ?? `${SITE.brand} Team`} · {fmtDateTime(m.createdAt)}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <form onSubmit={send} className={`space-y-3 ${thread.length === 0 ? "mt-4" : ""}`}>
        <label htmlFor="portal-message-draft" className="sr-only">
          Your message
        </label>
        <textarea
          id="portal-message-draft"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          placeholder="Type your message to the CHS team…"
          className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background text-base leading-relaxed resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        {error && <p className="text-[12px] text-destructive leading-snug">{error}</p>}
        <button
          type="submit"
          disabled={busy || !draft.trim()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 h-12 rounded-xl font-semibold text-sm shadow-md shadow-primary/25 transition-all disabled:opacity-60"
        >
          {busy ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Sending…
            </>
          ) : (
            <>
              <Send className="w-4 h-4" /> Send message
            </>
          )}
        </button>
      </form>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════
// Referral & review — shown when a job is complete
// ═══════════════════════════════════════════════════════════════

function ReferralSection({ job }: { job: Job | null }) {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    job?.albums[0]?.url ??
    job?.photoAlbumUrl ??
    (typeof window !== "undefined" ? window.location.origin : "");

  const shareText = `Check out our new roof from ${SITE.brand}! ${SITE.phoneDisplay} — highly recommend.`;

  const referBody = encodeURIComponent(
    `Hi! We just had our roof done by ${SITE.brand} (${SITE.city}) and had a great experience. ` +
      `If you need roof work, give them a call at ${SITE.phoneDisplay} or visit their site. ` +
      `Tell them we sent you!`,
  );

  const sharePhotos = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: `Our new roof — ${SITE.brand}`, text: shareText, url: shareUrl });
        return;
      } catch {
        // fall through to copy (user may have cancelled — copying is harmless)
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <Section
      icon={Gift}
      title="Thank You From the CHS Family"
      subtitle="Your project is complete — it was an honor to work on your home. If we earned it, here are three ways to help a family-owned business grow."
    >
      <div className="grid sm:grid-cols-3 gap-3">
        <a
          href={SITE.social.google}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center text-center gap-2.5 bg-primary text-white rounded-2xl px-4 py-6 hover:bg-primary/90 shadow-md shadow-primary/25 transition-colors"
        >
          <Star className="w-6 h-6" />
          <span className="font-semibold text-sm leading-tight">Leave a Google Review</span>
          <span className="text-[11px] text-white/75 leading-snug">Takes about a minute — it means the world</span>
        </a>
        <a
          href={`mailto:?subject=${encodeURIComponent(`You should call ${SITE.brand}`)}&body=${referBody}`}
          className="flex flex-col items-center text-center gap-2.5 bg-card border border-border/60 rounded-2xl px-4 py-6 hover:border-primary/40 transition-colors"
        >
          <Mail className="w-6 h-6 text-primary" />
          <span className="font-semibold text-sm text-foreground leading-tight">Refer a Friend</span>
          <span className="text-[11px] text-muted-foreground leading-snug">Send a neighbor our way</span>
        </a>
        <button
          type="button"
          onClick={() => void sharePhotos()}
          className="flex flex-col items-center text-center gap-2.5 bg-card border border-border/60 rounded-2xl px-4 py-6 hover:border-primary/40 transition-colors"
        >
          {copied ? <Copy className="w-6 h-6 text-emerald-600" /> : <Share2 className="w-6 h-6 text-primary" />}
          <span className="font-semibold text-sm text-foreground leading-tight">
            {copied ? "Link copied!" : "Share Before & After Photos"}
          </span>
          <span className="text-[11px] text-muted-foreground leading-snug">
            {copied ? "Paste it anywhere" : "Show off that new roof"}
          </span>
        </button>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════
// Contact CHS
// ═══════════════════════════════════════════════════════════════

function ContactSection() {
  return (
    <Section
      id="portal-contact"
      icon={Phone}
      title="Contact CHS"
      subtitle={`Family-owned and local to ${SITE.region}. ${SITE.hours}.`}
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <a
          href={`tel:${SITE.phoneTel}`}
          className="flex items-center gap-3.5 bg-primary text-white rounded-2xl px-5 py-5 hover:bg-primary/90 shadow-md shadow-primary/25 transition-colors"
        >
          <span className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center flex-none">
            <Phone className="w-5 h-5" />
          </span>
          <span>
            <span className="block text-[11px] uppercase tracking-[0.16em] font-semibold text-white/75">
              Call the office
            </span>
            <span className="block font-display font-bold text-lg tracking-tight">{SITE.phoneDisplay}</span>
          </span>
        </a>
        <a
          href={`mailto:${SITE.email}`}
          className="flex items-center gap-3.5 bg-card border border-border/60 rounded-2xl px-5 py-5 hover:border-primary/40 transition-colors"
        >
          <span className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-none">
            <Mail className="w-5 h-5 text-primary" />
          </span>
          <span className="min-w-0">
            <span className="block text-[11px] uppercase tracking-[0.16em] font-semibold text-muted-foreground">
              Email us
            </span>
            <span className="block font-semibold text-foreground text-sm truncate">{SITE.email}</span>
          </span>
        </a>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <HomeIcon className="w-3.5 h-3.5 text-primary" />
          {SITE.legalName} · {SITE.city}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          Licensed & insured · {SITE.license}
        </span>
      </div>
    </Section>
  );
}
