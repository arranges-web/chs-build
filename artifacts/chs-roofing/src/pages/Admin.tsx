import { useCallback, useEffect, useState } from "react";
import { ChevronDown, KeyRound, Lock } from "lucide-react";
import {
  ADMIN_UNAUTHORIZED_EVENT,
  api,
  clearAdminAuth,
  getAdminKey,
  setAdminKey as storeAdminKey,
  type AdminCustomerMessageRow,
  type AdminProfile,
  type AdminServiceRequestRow,
  isFullAccessRole,
} from "@/lib/api";
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
import Team from "@/components/admin/Team";
import MyJobs from "@/components/admin/MyJobs";
import CrewJobDetail from "@/components/admin/CrewJobDetail";
import SettingsPanel from "@/components/admin/Settings";
import PortalInbox from "@/components/admin/PortalInbox";
import Outreach from "@/components/admin/Outreach";
import { withoutDemo } from "@/lib/demo";

type AnyRow = Record<string, unknown>;

const SECTION_STORAGE = "chs.admin.section.v1";

export default function AdminPage() {
  // ─── Auth state ────────────────────────────────────────────────
  // Two sign-in paths, both handled by the api client's token store
  // (see lib/api.ts):
  //   1. Email + password → server returns a bearer token, stored in
  //      localStorage and sent as `Authorization: Bearer` on every
  //      admin request. Preferred. Works through any proxy.
  //   2. ADMIN_KEY → stored in sessionStorage and sent as
  //      `x-admin-key`. Bootstrap / recovery path for the owner
  //      before any account exists.
  // Every helper in api.ts attaches whichever credential is stored,
  // so components don't need to thread anything through.
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
  // "Create owner account with admin key" — lives under key mode.
  const [bootOpen, setBootOpen] = useState(false);
  const [bootName, setBootName] = useState("");
  const [bootEmail, setBootEmail] = useState("");
  const [bootPassword, setBootPassword] = useState("");

  // App state
  const [leads, setLeads] = useState<AnyRow[] | null>(null);
  const [estimates, setEstimates] = useState<AnyRow[] | null>(null);
  // Portal inbox data lives here (not in the Dashboard) so the sidebar
  // badge and the dashboard share one fetch.
  const [requests, setRequests] = useState<AdminServiceRequestRow[] | null>(null);
  const [messages, setMessages] = useState<AdminCustomerMessageRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [section, setSection] = useState<AdminSection>("dashboard");
  const [pendingClientOpen, setPendingClientOpen] = useState<number | null>(null);
  const [openJob, setOpenJob] = useState<{ jobId: number; customerId: number } | null>(null);
  const [clientPrefill, setClientPrefill] = useState<CustomerPrefill | null>(null);

  // ─── Sign-out (shared by the button and the 401 auto-recovery) ──
  const resetToLogin = useCallback((message?: string) => {
    clearAdminAuth();
    setMe(null);
    setAuthedKey(null);
    setAdminKey("");
    setPassword("");
    setLeads(null);
    setEstimates(null);
    setRequests(null);
    setMessages(null);
    setOpenJob(null);
    setError(null);
    if (message) setLoginError(message);
  }, []);

  // ─── Boot: restore + verify ────────────────────────────────────
  useEffect(() => {
    const previous = document.title;
    document.title = `Admin — ${SITE.brand}`;

    let cancelled = false;
    (async () => {
      let lastSection: AdminSection | null = null;
      try {
        lastSection = localStorage.getItem(SECTION_STORAGE) as AdminSection | null;
      } catch {
        // ignore
      }
      // Don't restore a section that's been hidden from the nav (e.g.
      // "outreach" is parked) — the owner would land on a dead screen
      // with no way to see where they are.
      if (lastSection && lastSection !== "outreach" && !cancelled) setSection(lastSection);

      // whoAmI sends whatever credential is stored (bearer token
      // and/or admin key). One round trip tells us if we're in.
      const res = await api.whoAmI();
      if (cancelled) return;
      if ("data" in res) {
        if (res.data.admin) setMe(res.data.admin);
        // A crew login only has "My Jobs" — a restored section from a
        // previous admin session on this browser would be a dead end.
        if (res.data.admin && !isFullAccessRole(res.data.admin.role)) setSection("myJobs");
        if (res.data.via === "admin-key") setAuthedKey(getAdminKey());
      } else if (res.status === 401) {
        // Credentials are genuinely dead — forget them so the user
        // gets a clean login screen instead of a stale session.
        clearAdminAuth();
      } else {
        // A server/DB hiccup (500, network). KEEP the stored token —
        // clearing it here would log the owner out over a blip. Show
        // the reason on the login screen; a reload retries.
        setLoginError(`Couldn't verify your session: ${res.error}. Reload to try again.`);
      }
      setChecking(false);
    })();

    return () => {
      cancelled = true;
      document.title = previous;
    };
  }, []);

  // ─── 401 auto-recovery ─────────────────────────────────────────
  // If any admin request comes back Unauthorized (expired session,
  // server restart wiped sessions, etc.) drop straight back to the
  // login screen with a clear message instead of rendering a wall of
  // "Unauthorized" tiles.
  useEffect(() => {
    const onUnauthorized = () => {
      resetToLogin("Your session expired. Please sign in again.");
    };
    window.addEventListener(ADMIN_UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(ADMIN_UNAUTHORIZED_EVENT, onUnauthorized);
  }, [resetToLogin]);

  useEffect(() => {
    try {
      localStorage.setItem(SECTION_STORAGE, section);
    } catch {
      // ignore
    }
  }, [section]);

  const isAuthed = !!me || !!authedKey;
  // Key-auth (no profile) is the owner's recovery credential, so it
  // counts as office access. Mirrors the server's requireFullAccess.
  const officeAccess = me ? isFullAccessRole(me.role) : true;
  // Components still take an `adminKey` prop and pass it as
  // `x-admin-key`. The api client now auto-attaches the stored bearer
  // token and stored key on every request, so this value is purely
  // informational — an empty string is fine when signed in by password.
  const effectiveKey = authedKey ?? "";

  // ─── Data loading ─────────────────────────────────────────────
  // Load leads + estimates in parallel. Failures on one shouldn't
  // block the other — a missing column on `leads` should not hide
  // your `estimates` list. Real server-side errors are surfaced
  // verbatim so we're not stuck with a generic "try again" toast.
  const loadAll = async (key: string) => {
    setLoading(true);
    setError(null);
    // A crew login has no access to leads, estimates, or the portal
    // inbox — firing those would 403 and paint an error banner over a
    // screen they can't act on. Their view loads its own data.
    if (!officeAccess) {
      setLeads(null);
      setEstimates(null);
      setRequests(null);
      setMessages(null);
      setLoading(false);
      return;
    }
    const [leadsRes, estRes, reqRes, msgRes] = await Promise.all([
      api.listLeads(key),
      api.listEstimates(key),
      api.listServiceRequests(key),
      api.listCustomerMessages(key),
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
    // Inbox feeds the badge + dashboard. A failure here shouldn't block
    // the rest of the admin, so it's reported but not fatal.
    if ("data" in reqRes) setRequests(reqRes.data.rows);
    else errors.push(`Requests: ${reqRes.error}`);
    if ("data" in msgRes) setMessages(msgRes.data.rows);
    else errors.push(`Messages: ${msgRes.error}`);
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

  const submitKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const key = adminKey.trim();
    if (!key) return;
    setSubmitting(true);
    // Store it, then VERIFY it against the server before we show the
    // dashboard. Previously we trusted the key blindly and let every
    // tile fail with "Unauthorized" if it was wrong.
    storeAdminKey(key);
    const res = await api.whoAmI();
    setSubmitting(false);
    if ("error" in res || res.data.via !== "admin-key") {
      storeAdminKey(null);
      setLoginError(
        "That admin key wasn't accepted. Check the ADMIN_KEY value in Replit Secrets and try again.",
      );
      return;
    }
    setAuthedKey(key);
  };

  /** Turn the ADMIN_KEY into a real owner account in one step. */
  const submitBootstrap = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const key = adminKey.trim();
    if (!key) {
      setLoginError("Paste your admin key above first.");
      return;
    }
    if (!bootName.trim() || !bootEmail.trim() || !bootPassword) {
      setLoginError("Name, email, and a password (10+ characters) are all required.");
      return;
    }
    setSubmitting(true);
    const res = await api.adminBootstrap({
      key,
      name: bootName.trim(),
      email: bootEmail.trim(),
      password: bootPassword,
    });
    setSubmitting(false);
    if ("error" in res) {
      setLoginError(res.error);
      return;
    }
    // Token is stored by api.adminBootstrap; drop straight in.
    setMe(res.data.admin);
    setBootPassword("");
    setAdminKey("");
  };

  const signOut = async () => {
    await api.adminLogout(); // clears the stored token/key too
    resetToLogin();
    setEmail("");
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

              {/* Owner-account creation from the key. Nothing ever
                  deletes an admin row, but this guarantees the owner
                  can always (re)create their login in 30 seconds. */}
              <div className="mt-3 pt-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => {
                    setLoginError(null);
                    setBootOpen((o) => !o);
                  }}
                  className="w-full inline-flex items-center justify-between text-[12px] font-semibold text-foreground hover:text-primary transition-colors"
                >
                  <span>Create my owner account with this key</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${bootOpen ? "rotate-180" : ""}`} />
                </button>
                {bootOpen && (
                  <div className="mt-3 space-y-2.5">
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Sets up an email + password login you can use from any
                      device — no invite link needed. Uses the key you pasted above.
                    </p>
                    <input
                      value={bootName}
                      onChange={(e) => setBootName(e.target.value)}
                      autoComplete="name"
                      placeholder="Your name"
                      className="w-full h-11 px-3.5 rounded-xl border border-border/60 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <input
                      type="email"
                      value={bootEmail}
                      onChange={(e) => setBootEmail(e.target.value)}
                      autoComplete="email"
                      placeholder="you@cordovahomeservices.com"
                      className="w-full h-11 px-3.5 rounded-xl border border-border/60 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <input
                      type="password"
                      value={bootPassword}
                      onChange={(e) => setBootPassword(e.target.value)}
                      autoComplete="new-password"
                      placeholder="Choose a password (10+ characters)"
                      minLength={10}
                      className="w-full h-11 px-3.5 rounded-xl border border-border/60 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <button
                      type="button"
                      onClick={(e) => void submitBootstrap(e)}
                      disabled={submitting}
                      className="w-full inline-flex items-center justify-center gap-2 bg-secondary hover:opacity-90 disabled:opacity-60 text-white h-11 rounded-xl font-semibold text-sm tracking-tight transition-all"
                    >
                      {submitting ? "Creating…" : "Create owner account"}
                    </button>
                  </div>
                )}
              </div>

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
                fresh one from the admin dashboard → Team.
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
        role={me?.role}
        section={section}
        onChangeSection={setSection}
        loading={loading}
        onRefresh={() => isAuthed && void loadAll(effectiveKey)}
        onSignOut={signOut}
        counts={{
          newLeads: (leads ?? []).filter((r) => {
            const t = new Date(String(r.createdAt ?? "")).getTime();
            return Number.isFinite(t) && Date.now() - t <= 7 * 86_400_000;
          }).length,
          // Badges exclude the seeded demo customer — see lib/demo.ts.
          inbox:
            withoutDemo(messages ?? []).filter((m) => m.sender === "customer" && !m.readByTeam)
              .length + withoutDemo(requests ?? []).filter((r) => r.status === "new").length,
        }}
      >
        {error && (
          <div className="mb-6 p-4 rounded-xl border border-destructive/40 bg-destructive/5 text-destructive text-sm">
            {error}
          </div>
        )}
        {openJob && !officeAccess ? (
          // Crew get the stripped-down job view — the full JobDetail
          // loads the CRM record, which the API refuses them.
          <CrewJobDetail jobId={openJob.jobId} onBack={() => setOpenJob(null)} />
        ) : openJob ? (
          <JobDetail
            adminKey={effectiveKey}
            jobId={openJob.jobId}
            customerId={openJob.customerId}
            onBack={() => setOpenJob(null)}
          />
        ) : (
          <>
            {section === "myJobs" && (
              <MyJobs onOpenJob={(jobId, customerId) => setOpenJob({ jobId, customerId })} />
            )}
            {section === "dashboard" && (
              <Dashboard
                adminKey={effectiveKey}
                leads={leads}
                estimates={estimates}
                requests={requests}
                messages={messages}
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
            {section === "portalInbox" && (
              <PortalInbox
                adminKey={effectiveKey}
                // Reload so the sidebar badge and dashboard tiles drop
                // messages the moment they're marked read here.
                onChanged={() => void loadAll(effectiveKey)}
              />
            )}
            {section === "outreach" && <Outreach adminKey={effectiveKey} />}
            {section === "invites" && <Team adminKey={effectiveKey} />}
            {section === "settings" && (
              <SettingsPanel adminKey={effectiveKey} onNavigate={setSection} />
            )}
          </>
        )}
      </AdminShell>
    </>
  );
}
