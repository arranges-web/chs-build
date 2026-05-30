import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { api } from "@/lib/api";
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

type AnyRow = Record<string, unknown>;

const ADMIN_KEY_STORAGE = "chs.admin.key.v1";
const SECTION_STORAGE = "chs.admin.section.v1";

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [authedKey, setAuthedKey] = useState<string | null>(null);
  const [leads, setLeads] = useState<AnyRow[] | null>(null);
  const [estimates, setEstimates] = useState<AnyRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [section, setSection] = useState<AdminSection>("dashboard");
  // When Projects view opens a customer, route to Clients with that id.
  const [pendingClientOpen, setPendingClientOpen] = useState<number | null>(null);
  void pendingClientOpen;
  // Prefill payload passed from Leads → Clients when the user clicks
  // "Convert to client" on a lead row.
  const [clientPrefill, setClientPrefill] = useState<CustomerPrefill | null>(null);

  // Title + restore last section
  useEffect(() => {
    const previous = document.title;
    document.title = `Admin — ${SITE.brand}`;
    try {
      const saved = sessionStorage.getItem(ADMIN_KEY_STORAGE);
      if (saved) setAuthedKey(saved);
      const lastSection = localStorage.getItem(SECTION_STORAGE) as AdminSection | null;
      if (lastSection) setSection(lastSection);
    } catch {
      // ignore
    }
    return () => {
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

  const loadAll = async (key: string) => {
    setLoading(true);
    setError(null);
    const [leadsRes, estRes] = await Promise.all([
      api.listLeads(key),
      api.listEstimates(key),
    ]);
    if (!leadsRes || !estRes) {
      setError("Could not load data. Check your admin key and try again.");
      setLeads(null);
      setEstimates(null);
      setAuthedKey(null);
      try {
        sessionStorage.removeItem(ADMIN_KEY_STORAGE);
      } catch {
        // ignore
      }
    } else {
      setLeads(leadsRes.rows);
      setEstimates(estRes.rows);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authedKey) void loadAll(authedKey);
  }, [authedKey]);

  const submitKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) return;
    try {
      sessionStorage.setItem(ADMIN_KEY_STORAGE, adminKey.trim());
    } catch {
      // ignore
    }
    setAuthedKey(adminKey.trim());
  };

  const signOut = () => {
    try {
      sessionStorage.removeItem(ADMIN_KEY_STORAGE);
    } catch {
      // ignore
    }
    setAuthedKey(null);
    setAdminKey("");
    setLeads(null);
    setEstimates(null);
  };

  const onConvertLead = (prefill: CustomerPrefill) => {
    setClientPrefill(prefill);
    setSection("clients");
  };

  // ─── Login screen ──────────────────────────────────────────────
  if (!authedKey) {
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
          <form onSubmit={submitKey} className="space-y-3">
            <label className="block text-xs font-semibold text-foreground">Admin key</label>
            <input
              type="password"
              autoComplete="current-password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Paste your admin key"
              className="w-full h-11 px-3.5 rounded-xl border border-border/60 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            {error && <p className="text-[11px] text-destructive">{error}</p>}
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white h-11 rounded-xl font-semibold text-sm tracking-tight shadow-md shadow-primary/30 transition-all"
            >
              Sign in
            </button>
          </form>
          <p className="mt-4 text-[11px] text-muted-foreground leading-relaxed">
            The key is stored only in this browser tab and cleared when you close it. Set the
            matching value as the <code>ADMIN_KEY</code> environment variable on the API server.
          </p>
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
        onRefresh={() => authedKey && void loadAll(authedKey)}
        onSignOut={signOut}
        counts={{ leads: leads?.length ?? 0, estimates: estimates?.length ?? 0 }}
      >
        {error && (
          <div className="mb-6 p-4 rounded-xl border border-destructive/40 bg-destructive/5 text-destructive text-sm">
            {error}
          </div>
        )}
        {section === "dashboard" && (
          <Dashboard
            adminKey={authedKey}
            leads={leads}
            estimates={estimates}
            onNavigate={setSection}
          />
        )}
        {section === "clients" && (
          <Clients
            adminKey={authedKey}
            initialPrefill={clientPrefill}
            onConsumePrefill={() => setClientPrefill(null)}
          />
        )}
        {section === "projects" && (
          <Projects
            adminKey={authedKey}
            onOpenCustomer={(id) => {
              setPendingClientOpen(id);
              setSection("clients");
            }}
          />
        )}
        {section === "leads" && (
          <Leads rows={leads} loading={loading} onConvert={onConvertLead} />
        )}
        {section === "estimates" && <Estimates rows={estimates} loading={loading} />}
        {section === "analytics" && <Analytics adminKey={authedKey} />}
        {section === "responses" && <ChatResponses />}
        {section === "signature" && <EmailSignature />}
        {section === "links" && <QuoteLinks />}
      </AdminShell>
    </>
  );
}
