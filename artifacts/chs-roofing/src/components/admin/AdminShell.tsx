import { useEffect, useState } from "react";
import {
  BarChart3,
  Briefcase,
  Calculator,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  MessageSquareText,
  RefreshCw,
  Search,
  Settings as SettingsIcon,
  Sparkles,
  Users,
  X,
  Link as LinkIcon,
  HelpCircle,
  UserPlus,
} from "lucide-react";
import { SITE } from "@/lib/site-config";
import { getAdminKey } from "@/lib/api";
import Outreach from "./Outreach";
import PortalInbox from "./PortalInbox";

/**
 * The legacy admin key, if key-auth was used. Read through the api
 * client's store (single source of truth) rather than hardcoding the
 * storage key here. Bearer-token sessions return "" — the api client
 * attaches the token itself, so an empty key is fine.
 */
export function getStoredAdminKey(): string {
  return getAdminKey() ?? "";
}

export type AdminSection =
  | "dashboard"
  | "clients"
  | "projects"
  | "leads"
  | "estimates"
  | "outreach"
  | "portalInbox"
  | "analytics"
  | "seo"
  | "responses"
  | "signature"
  | "links"
  | "invites"
  | "settings";

export type CustomerPrefill = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
};

/** Badge counts — "what needs attention", not lifetime totals. */
type Counts = { newLeads: number; inbox: number };

type Props = {
  section: AdminSection;
  onChangeSection: (s: AdminSection) => void;
  loading?: boolean;
  onRefresh?: () => void;
  onSignOut?: () => void;
  counts: Counts;
  children: React.ReactNode;
};

const TITLES: Record<AdminSection, { title: string; subtitle: string }> = {
  dashboard: { title: "Today", subtitle: "What needs your attention right now, then the rest at a glance." },
  clients: { title: "Clients", subtitle: "Customer CRM, jobs, updates, and photo log." },
  projects: { title: "Projects", subtitle: "Every active job across every customer in one place." },
  leads: { title: "Leads", subtitle: "Every quote request from the website." },
  estimates: { title: "Estimates", subtitle: "Every roof estimate submitted online." },
  outreach: { title: "SMS Outreach", subtitle: "AI texting agent — conversations, drafts, and follow-ups." },
  portalInbox: { title: "Portal Inbox", subtitle: "Service requests and messages from the customer portal." },
  analytics: { title: "Website Analytics", subtitle: "Traffic, top pages, and lead-source breakdown — built in, no Google Analytics." },
  seo: { title: "SEO Activity", subtitle: "Every real search-optimization change shipped to the site, logged with dates." },
  responses: { title: "AI Chat Responses", subtitle: "Copy-paste answers for common questions." },
  signature: { title: "Email Signature", subtitle: "Generate a branded HTML signature for your team." },
  links: { title: "Quote Links", subtitle: "Build pre-filled /contact links to share with customers." },
  invites: { title: "Team", subtitle: "Send a signup link so a teammate can create their own admin login." },
  settings: { title: "Settings & Backup", subtitle: "Backups, demo data, team access, and the recovery key." },
};

type NavGroup = "today" | "sales" | "customers" | "marketing" | "settings";

/**
 * Grouped the way the office actually works: what's new (Sales),
 * who we're serving (Customers), how we get found (Marketing), and
 * housekeeping (Settings). Order within a group = frequency of use.
 */
const NAV: { id: AdminSection; label: string; icon: typeof Users; group: NavGroup }[] = [
  { id: "dashboard", label: "Today", icon: LayoutDashboard, group: "today" },

  { id: "leads", label: "Leads", icon: Inbox, group: "sales" },
  { id: "estimates", label: "Estimates", icon: Calculator, group: "sales" },

  { id: "clients", label: "Clients", icon: Users, group: "customers" },
  { id: "projects", label: "Projects", icon: Briefcase, group: "customers" },
  { id: "portalInbox", label: "Portal Inbox", icon: MessageSquare, group: "customers" },
  // SMS Outreach is parked — needs Twilio + Anthropic secrets. Section,
  // route, and component all still exist; restore this line to show it.
  // { id: "outreach", label: "SMS Outreach", icon: MessageSquareText, group: "customers" },

  { id: "analytics", label: "Analytics", icon: BarChart3, group: "marketing" },
  { id: "seo", label: "SEO Activity", icon: Search, group: "marketing" },
  { id: "links", label: "Quote Links", icon: LinkIcon, group: "marketing" },
  { id: "responses", label: "AI Responses", icon: MessageSquareText, group: "marketing" },
  { id: "signature", label: "Email Signature", icon: Mail, group: "marketing" },

  { id: "invites", label: "Team", icon: UserPlus, group: "settings" },
  { id: "settings", label: "Settings & Backup", icon: SettingsIcon, group: "settings" },
];

const GROUPS: NavGroup[] = ["today", "sales", "customers", "marketing", "settings"];

const GROUP_LABEL: Record<NavGroup, string> = {
  today: "",
  sales: "Sales",
  customers: "Customers",
  marketing: "Marketing",
  settings: "Setup",
};

export default function AdminShell({
  section,
  onChangeSection,
  loading,
  onRefresh,
  onSignOut,
  counts,
  children,
}: Props) {
  const meta = TITLES[section];
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lock body scroll when the mobile drawer is open.
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navigate = (s: AdminSection) => {
    onChangeSection(s);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 lg:w-64 bg-secondary text-white flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-5 pt-6 pb-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <img src={SITE.logo} alt="" aria-hidden="true" className="w-9 h-9 object-contain" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary leading-none">
                {SITE.brand}
              </p>
              <p className="font-display font-bold tracking-tight text-lg leading-tight mt-0.5">Admin</p>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="lg:hidden ml-auto w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 space-y-5">
          {GROUPS.map((g) => (
            <div key={g} className="px-3">
              {GROUP_LABEL[g] && (
                <p className="px-3 text-[10px] uppercase tracking-[0.22em] font-semibold text-white/40 mb-2">
                  {GROUP_LABEL[g]}
                </p>
              )}
              <ul className="space-y-1">
                {NAV.filter((n) => n.group === g).map((n) => {
                  const isActive = section === n.id;
                  // Badges mean "needs you", not lifetime totals.
                  const count =
                    n.id === "leads" ? counts.newLeads : n.id === "portalInbox" ? counts.inbox : null;
                  return (
                    <li key={n.id}>
                      <button
                        type="button"
                        onClick={() => navigate(n.id)}
                        className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                          isActive
                            ? "bg-primary text-white shadow-md shadow-primary/30"
                            : "text-white/85 hover:bg-white/[0.06]"
                        }`}
                      >
                        <span
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isActive ? "bg-white/10" : "bg-white/[0.04] group-hover:bg-white/10"
                          }`}
                        >
                          <n.icon className="w-4 h-4" />
                        </span>
                        <span className="flex-1 text-left">{n.label}</span>
                        {typeof count === "number" && count > 0 && (
                          <span
                            className={`min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold inline-flex items-center justify-center ${
                              isActive ? "bg-white text-primary" : "bg-primary text-white"
                            }`}
                          >
                            {count > 99 ? "99+" : count}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 space-y-1.5">
          <a
            href="/portal"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-semibold text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Open customer portal
          </a>
          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-semibold text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          )}
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
        />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="bg-card border-b border-border/60 sticky top-0 z-20">
          <div className="px-4 md:px-6 py-3.5 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-9 h-9 rounded-full hover:bg-foreground/5 flex items-center justify-center"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary">
                <Sparkles className="w-3 h-3 inline mr-1" />
                Admin
              </p>
              <h1 className="font-display font-bold tracking-tight text-xl md:text-2xl text-foreground leading-tight">
                {meta.title}
              </h1>
            </div>
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                className="inline-flex items-center gap-1.5 px-3 h-9 rounded-full text-xs font-semibold text-foreground bg-background border border-border/60 hover:border-primary/40 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                <span className="hidden md:inline">Refresh</span>
              </button>
            )}
          </div>
          <p className="px-4 md:px-6 pb-3 -mt-1 text-[12px] text-muted-foreground">
            {meta.subtitle}
          </p>
        </header>

        <main className="flex-1 p-4 md:p-6 max-w-[1400px] w-full mx-auto">
          {/* The two newest sections are routed here (the page-level
              switch predates them); everything else comes in as children. */}
          {section === "outreach" ? (
            <Outreach adminKey={getStoredAdminKey()} />
          ) : section === "portalInbox" ? (
            <PortalInbox adminKey={getStoredAdminKey()} />
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
