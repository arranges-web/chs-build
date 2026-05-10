import { useEffect, useState } from "react";
import { Lock, LogOut, RefreshCw, Mail, Phone, MapPin, Calculator, Inbox, Users } from "lucide-react";
import { api } from "@/lib/api";
import { SITE } from "@/lib/site-config";
import Clients from "@/components/admin/Clients";

type AnyRow = Record<string, unknown>;

const ADMIN_KEY_STORAGE = "chs.admin.key.v1";

function fmtDate(value: unknown): string {
  if (typeof value !== "string") return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function safeStr(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  return String(v);
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState<string>("");
  const [authedKey, setAuthedKey] = useState<string | null>(null);
  const [leads, setLeads] = useState<AnyRow[] | null>(null);
  const [estimates, setEstimates] = useState<AnyRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"clients" | "leads" | "estimates">("clients");

  useEffect(() => {
    const previous = document.title;
    document.title = `Admin — ${SITE.brand}`;
    return () => {
      document.title = previous;
    };
  }, []);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(ADMIN_KEY_STORAGE);
      if (saved) {
        setAuthedKey(saved);
      }
    } catch {
      // ignore
    }
  }, []);

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

  // ─── Login screen ──────────────────────────────────────────────
  if (!authedKey) {
    return (
      <main className="min-h-[80vh] bg-background flex items-center justify-center px-4 py-16">
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
                Sign in to view leads
              </h1>
            </div>
          </div>
          <form onSubmit={submitKey} className="space-y-3">
            <label className="block text-xs font-semibold text-foreground">
              Admin key
            </label>
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
            The key is stored only in this browser tab and cleared when you
            close it. Set the matching value as the <code>ADMIN_KEY</code>{" "}
            environment variable on the API server.
          </p>
        </div>
      </main>
    );
  }

  // ─── Dashboard ─────────────────────────────────────────────────
  const rows = tab === "leads" ? leads ?? [] : estimates ?? [];

  return (
    <main className="bg-background min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-primary">
              {SITE.brand} Admin
            </p>
            <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground">
              Inbox
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Every quote request and saved estimate from the website.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => authedKey && void loadAll(authedKey)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold text-foreground bg-card border border-border/60 hover:border-primary/40 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold text-foreground/70 hover:text-foreground hover:bg-foreground/[0.04] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </header>

        <div className="flex items-center gap-2 border-b border-border/60 mb-6 overflow-x-auto">
          <button
            type="button"
            onClick={() => setTab("clients")}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap ${
              tab === "clients"
                ? "border-primary text-primary"
                : "border-transparent text-foreground/60 hover:text-foreground"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <Users className="w-4 h-4" />
              Clients
            </span>
          </button>
          <button
            type="button"
            onClick={() => setTab("leads")}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap ${
              tab === "leads"
                ? "border-primary text-primary"
                : "border-transparent text-foreground/60 hover:text-foreground"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <Inbox className="w-4 h-4" />
              Leads {leads ? `(${leads.length})` : ""}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setTab("estimates")}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap ${
              tab === "estimates"
                ? "border-primary text-primary"
                : "border-transparent text-foreground/60 hover:text-foreground"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Estimates {estimates ? `(${estimates.length})` : ""}
            </span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl border border-destructive/40 bg-destructive/5 text-destructive text-sm">
            {error}
          </div>
        )}

        {tab === "clients" ? (
          <Clients adminKey={authedKey} />
        ) : loading && rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <div className="bg-card border border-border/60 rounded-2xl p-10 text-center">
            <Inbox className="w-8 h-8 mx-auto text-muted-foreground/60 mb-3" />
            <p className="font-semibold text-foreground">Nothing here yet.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Submissions from the website will show up here as they come in.
            </p>
          </div>
        ) : tab === "leads" ? (
          <LeadsTable rows={rows} />
        ) : (
          <EstimatesTable rows={rows} />
        )}
      </div>
    </main>
  );
}

function LeadsTable({ rows }: { rows: AnyRow[] }) {
  return (
    <div className="space-y-3">
      {rows.map((r, i) => {
        const name = safeStr(r.name);
        const serviceType = safeStr(r.serviceType);
        const plan = safeStr(r.plan);
        const urgency = safeStr(r.urgency);
        const phone = safeStr(r.phone);
        const email = safeStr(r.email);
        const address = safeStr(r.address);
        const zip = safeStr(r.zip);
        const roofAge = safeStr(r.roofAge);
        const message = safeStr(r.message);
        const source = safeStr(r.source);
        const referrer = safeStr(r.referrer);
        return (
          <article
            key={(r.id as number | undefined) ?? i}
            className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-3">
              <h3 className="font-display font-bold text-lg text-foreground">
                {name || "Anonymous lead"}
              </h3>
              {serviceType && (
                <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {serviceType}
                </span>
              )}
              {plan && (
                <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[hsl(var(--accent-gold))] bg-[hsl(var(--accent-gold))]/10 px-2 py-0.5 rounded-full">
                  Plan: {plan}
                </span>
              )}
              {urgency && (
                <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-foreground/70 bg-foreground/[0.04] px-2 py-0.5 rounded-full">
                  {urgency}
                </span>
              )}
              <span className="ml-auto text-[11px] text-muted-foreground">
                {fmtDate(r.createdAt)}
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-2 text-sm text-foreground/80">
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center gap-2 hover:text-primary"
                >
                  <Phone className="w-3.5 h-3.5 text-primary" /> {phone}
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 hover:text-primary truncate"
                >
                  <Mail className="w-3.5 h-3.5 text-primary" /> {email}
                </a>
              )}
              {(address || zip) && (
                <span className="inline-flex items-center gap-2 sm:col-span-2">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  {address}{address && zip ? ", " : ""}{zip}
                </span>
              )}
              {roofAge && (
                <span className="text-muted-foreground text-xs">
                  Roof age: {roofAge}
                </span>
              )}
            </div>
            {message && (
              <p className="mt-3 text-sm text-foreground/85 bg-muted/40 border border-border/60 rounded-lg p-3 leading-relaxed">
                {message}
              </p>
            )}
            {(source || referrer) && (
              <p className="mt-3 text-[10px] text-muted-foreground/70 tracking-wider uppercase">
                {source ? `Source: ${source}` : ""}
                {source && referrer ? " · " : ""}
                {referrer ? `Referrer: ${referrer}` : ""}
              </p>
            )}
          </article>
        );
      })}
    </div>
  );
}

const fmtUSD = (raw: unknown) => {
  const n = Number(raw);
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
};

function EstimatesTable({ rows }: { rows: AnyRow[] }) {
  return (
    <div className="overflow-auto bg-card border border-border/60 rounded-2xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/40 text-foreground/70 text-[11px] uppercase tracking-wider">
            <th className="text-left font-semibold px-4 py-3">Date</th>
            <th className="text-left font-semibold px-4 py-3">Contact</th>
            <th className="text-left font-semibold px-4 py-3">Material</th>
            <th className="text-left font-semibold px-4 py-3">Pitch</th>
            <th className="text-right font-semibold px-4 py-3">Sq ft</th>
            <th className="text-right font-semibold px-4 py-3">Range</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {rows.map((r, i) => (
            <tr key={(r.id as number | undefined) ?? i} className="hover:bg-muted/20">
              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                {fmtDate(r.createdAt)}
              </td>
              <td className="px-4 py-3">
                <p className="font-semibold text-foreground">
                  {safeStr(r.name) || "—"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {safeStr(r.phone)}
                  {r.phone && r.email ? " · " : ""}
                  {safeStr(r.email)}
                </p>
                {safeStr(r.address) && (
                  <p className="text-xs text-muted-foreground">{safeStr(r.address)}</p>
                )}
              </td>
              <td className="px-4 py-3 capitalize">{safeStr(r.material).replace(/-/g, " ")}</td>
              <td className="px-4 py-3 capitalize">{safeStr(r.pitch).replace(/-/g, " ")}</td>
              <td className="px-4 py-3 text-right text-muted-foreground">
                {safeStr(r.footprintSf)}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-foreground whitespace-nowrap">
                {fmtUSD(r.lowEstimate)} – {fmtUSD(r.highEstimate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
