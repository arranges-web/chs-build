import { useEffect, useState } from "react";
import { ChevronDown, KeyRound, Lock } from "lucide-react";
import { api, type AdminProfile } from "@/lib/api";
import { SITE } from "@/lib/site-config";
import Seo from "@/components/Seo";
import AdminShell, {
  type AdminSection,
  type CustomerPrefill,
} from "@/components/admin/AdminShell";
import Clients from "@/components/admin/Clients";
import Leads from "@/components/admin/Leads";
import Estimates from "@/components/admin/Estimates";
import ChatResponses from "@/components/admin/ChatResponses";
import EmailSignature from "@/components/admin/EmailSignature";
import QuoteLinks from "@/components/admin/QuoteLinks";
import Dashboard from "@/components/admin/Dashboard";
import Projects from "@/components/admin/Projects";
import Analytics from "@/components/admin/Analytics";
import SeoActivity from "@/components/admin/SeoActivity";
import JobDetail from "@/components/admin/JobDetail";
import InviteTeammates from "@/components/admin/InviteTeammates";

type AnyRow = Record<string, unknown>;

const ADMIN_KEY_STORAGE = "chs.admin.key.v1";
const SECTION_STORAGE = "chs.admin.section.v1";

export default function AdminPage() {
  // ─── Auth state ────────────────────────────────────────────────
  // We support TWO sign-in paths that coexist:
  //   1. Email + password → sets an httpOnly cookie. Preferred.
  //   2. ADMIN_KEY header → legacy bootstrap path so the very first
  //      owner can sign in before any DB-backed admin exists. We still
  //      attach it as the `x-admin-key` header on existing endpoints
  //      that haven't been migrated to cookie auth yet.
  const [me, setMe] = useState<AdminProfile | null>(null);
  const [authedKey, setAuthedKey] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  // Login form
  const [mode, setMode] = useState<"password" | "key">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // App state
  const [leads, setLeads] = useState<AnyRow[] | null>(null);
  const [estimates, setEstimates] = useState<AnyRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [section, setSection] = useState<AdminSection>("dashboard");
  const [pendingClientOpen, setPendingClientOpen] = useState<number | null>(null);
  const [openJob, setOpenJob] = useState<{ jobId: number; customerId: number } | null>(null);
  const [clientPrefill, setClientPrefill] = useState<CustomerPrefill | null>(null);

  // ─── Boot: restore + verify ────────────────────────────────────
  useEffect(() => {
    const previous = document.title;
    document.title = `Admin — ${SITE.brand}`;

    let cancelled = false;
    (async () => {
      let savedKey: string | null = null;
      let lastSection: AdminSection | null = null;
      try {
        savedKey = sessionStorage.getItem(ADMIN_KEY_STORAGE);
        lastSection = localStorage.getItem(SECTION_STORAGE) as AdminSection | null;
      } catch {
        // ignore
      }
      if (lastSection && !cancelled) setSection(lastSection);

      // Try cookie first (with optional key fallback).
      const res = await api.whoAmI(savedKey ?? undefined);
      if (cancelled) return;
      if ("data" in res) {
        if (res.data.admin) setMe(res.data.admin);
        if (res.data.via === "admin-key" && savedKey) setAuthedKey(savedKey);
      } else if (savedKey) {
        // Cookie call failed and key fallback also failed — drop it.
        try {
          sessionStorage.removeItem(ADMIN_KEY_STORAGE);
        } catch {
          // ignore
        }
      }
      setChecking(false);
    })();

    return () => {
      cancelled = true;
      document.title = previous;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(SECTION_STORAGE, section);
    } catch {
      // ignore
    }
  }, [section]);

  const isAuthed = !!me || !!authedKey;
  // For legacy endpoints still expecting x-admin-key. When signed in
  // via cookie only, we send an empty string and the middleware accepts
  // the cookie path. NOTE: existing endpoints have `adminAuth` middleware
  // that accepts EITHER, so this works either way.
  const effectiveKey = authedKey ?? "";

  // ─── Data loading ─────────────────────────────────────────────
  // Load leads + estimates in parallel. Failures on one shouldn't
  // block the other — a missing column on `leads` should not hide
  // your `estimates` list. Real server-side errors are surfaced
  // verbatim so we're not stuck with a generic "try again" toast.
  const loadAll = async (key: string) => {
    setLoading(true);
    setError(null);
    const [leadsRes, estRes] = await Promise.all([
      api.listLeads(key),
      api.listEstimates(key),
    ]);
    const errors: string[] = [];
    if ("data" in leadsRes) setLeads(leadsRes.data.rows);
    else {
      setLeads(null);
      errors.push(`Leads: ${leadsRes.error}`);
    }
    if ("data" in estRes) setEstimates(estRes.data.rows);
    else {
      setEstimates(null);
      errors.push(`Estimates: ${estRes.error}`);
    }
    if (errors.length) setError(errors.join(" · "));
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthed) void loadAll(effectiveKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthed]);

  // ─── Login handlers ───────────────────────────────────────────
  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!email.trim() || !password) {
      setLoginError("Enter your email and password.");
      return;
    }
    setSubmitting(true);
    const res = await api.adminLogin(email.trim(), password);
    setSubmitting(false);
    if ("error" in res) {
      setLoginError(res.error);
      return;
    }
    setMe(res.data.admin);
    setPassword("");
  };

  const submitKey = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!adminKey.trim()) return;
    try {
      sessionStorage.setItem(ADMIN_KEY_STORAGE, adminKey.trim());
    } catch {
      // ignore
    }
    setAuthedKey(adminKey.trim());
  };

  const signOut = async () => {
    try {
      sessionStorage.removeItem(ADMIN_KEY_STORAGE);
    } catch {
      // ignore
    }
    await api.adminLogout();
    setMe(null);
    setAuthedKey(null);
    setAdminKey("");
    setEmail("");
    setPassword("");
    setLeads(null);
    setEstimates(null);
  };

  const onConvertLead = (prefill: CustomerPrefill) => {
    setClientPrefill(prefill);
    setSection("clients");
  };

  // ─── Login screen ─────────────────────────────────────────────
  if (checking) {
    return (
      <main className="min-h-[80vh] bg-background flex items-center justify-center">
        <div className="w-9 h-9 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </main>
    );
  }

  if (!isAuthed) {
    return (
      <main className="min-h-[80vh] bg-background flex items-center justify-center px-4 py-16">
        <Seo title="Admin | CHS Roofing" description="Internal admin." noIndex path="/admin" />
        <div className="w-full max-w-md bg-card border border-border/60 rounded-3xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-primary">
                {SITE.brand} Admin
              </p>
              <h1 className="font-display font-bold tracking-tight text-2xl text-foreground">
                Sign in
              </h1>
            </div>
          </div>

          {mode === "password" ? (
            <form onSubmit={submitPassword} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Email</label>
                <input
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@cordovahomeservices.com"
                  required
                  className="w-full h-11 px-3.5 rounded-xl border border-border/60 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Password</label>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  className="w-full h-11 px-3.5 rounded-xl border border-border/60 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              {loginError && <p className="text-[11px] text-destructive">{loginError}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white h-11 rounded-xl font-semibold text-sm tracking-tight shadow-md shadow-primary/30 transition-all"
              >
                {submitting ? "Signing in…" : "Sign in"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginError(null);
                  setMode("key");
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors mt-2"
              >
                <KeyRound className="w-3 h-3" />
                Use admin key instead
                <ChevronDown className="w-3 h-3" />
              </button>
            </form>
          ) : (
            <form onSubmit={submitKey} className="space-y-3">
              <label className="block text-xs font-semibold text-foreground">Admin key</label>
              <input
                type="password"
                autoComplete="current-password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Paste your admin key"
                className="w-full h-11 px-3.5 rounded-xl border border-border/60 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {loginError && <p className="text-[11px] text-destructive">{loginError}</p>}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white h-11 rounded-xl font-semibold text-sm tracking-tight shadow-md shadow-primary/30 transition-all"
              >
                Sign in with key
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginError(null);
                  setMode("password");
                }}
                className="w-full text-[11px] text-muted-foreground hover:text-foreground transition-colors mt-2"
              >
                Use email and password instead
              </button>
            </form>
          )}

          <div className="mt-5 pt-5 border-t border-border/60 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Trouble signing in?
            </p>
            <ul className="text-[12px] text-foreground/80 leading-relaxed space-y-1.5 list-disc pl-4">
              <li>
                <strong>New teammate?</strong> Open the invite link the owner
                sent you (looks like <code className="text-[11px]">/admin/join?invite=…</code>) —
                that's how you set your email and password the first time.
              </li>
              <li>
                <strong>Forgot your invite?</strong> Ask the owner to send a
                fresh one from the admin dashboard → Invite Teammates.
              </li>
              <li>
                <strong>Owner / first-time setup?</strong> Use the admin key
                (the <code className="text-[11px]">ADMIN_KEY</code> value in
                Replit Secrets) — click{" "}
                <button
                  type="button"
                  onClick={() => {
                    setLoginError(null);
                    setMode("key");
                  }}
                  className="text-primary hover:underline font-semibold"
                >
                  Use admin key instead
                </button>{" "}
                above.
              </li>
              <li>
                <strong>Still stuck?</strong> Text or call{" "}
                <a
                  href={`tel:${SITE.phoneTel}`}
                  className="text-primary hover:underline font-semibold"
                >
                  {SITE.phoneDisplay}
                </a>
                .
              </li>
            </ul>
          </div>
        </div>
      </main>
    );
  }

  // ─── Authed shell ──────────────────────────────────────────────
  return (
    <>
      <Seo title="Admin | CHS Roofing" description="Internal admin." noIndex path="/admin" />
      <AdminShell
        section={section}
        onChangeSection={setSection}
        loading={loading}
        onRefresh={() => isAuthed && void loadAll(effectiveKey)}
        onSignOut={signOut}
        counts={{ leads: leads?.length ?? 0, estimates: estimates?.length ?? 0 }}
      >
        {error && (
          <div className="mb-6 p-4 rounded-xl border border-destructive/40 bg-destructive/5 text-destructive text-sm">
            {error}
          </div>
        )}
        {openJob ? (
          <JobDetail
            adminKey={effectiveKey}
            jobId={openJob.jobId}
            customerId={openJob.customerId}
            onBack={() => setOpenJob(null)}
          />
        ) : (
          <>
            {section === "dashboard" && (
              <Dashboard
                adminKey={effectiveKey}
                leads={leads}
                estimates={estimates}
                onNavigate={setSection}
                onOpenJob={(jobId, customerId) => setOpenJob({ jobId, customerId })}
              />
            )}
            {section === "clients" && (
              <Clients
                adminKey={effectiveKey}
                initialPrefill={clientPrefill}
                onConsumePrefill={() => setClientPrefill(null)}
                initialActiveId={pendingClientOpen}
                onConsumeActiveId={() => setPendingClientOpen(null)}
                onOpenJob={(jobId, customerId) => setOpenJob({ jobId, customerId })}
              />
            )}
            {section === "projects" && (
              <Projects
                adminKey={effectiveKey}
                onOpenCustomer={(id) => {
                  setPendingClientOpen(id);
                  setSection("clients");
                }}
                onOpenJob={(jobId, customerId) => setOpenJob({ jobId, customerId })}
              />
            )}
            {section === "leads" && (
              <Leads rows={leads} loading={loading} onConvert={onConvertLead} />
            )}
            {section === "estimates" && <Estimates rows={estimates} loading={loading} />}
            {section === "analytics" && <Analytics adminKey={effectiveKey} />}
            {section === "seo" && <SeoActivity />}
            {section === "responses" && <ChatResponses />}
            {section === "signature" && <EmailSignature />}
            {section === "links" && <QuoteLinks />}
            {section === "invites" && <InviteTeammates adminKey={effectiveKey} />}
          </>
        )}
      </AdminShell>
    </>
  );
}
