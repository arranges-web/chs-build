import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Briefcase,
  Check,
  Copy,
  HardHat,
  Loader2,
  Mail,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  UserPlus,
} from "lucide-react";
import { api, type TeamMember } from "@/lib/api";

/**
 * The team roster: who has a login, what kind, and how much work is on
 * them. Replaces the old invite-only screen — inviting someone was
 * visible but the people you'd already invited were not, so there was
 * no way to answer "who can get into this thing?".
 */

type InviteResult = { url: string; role: string; name: string | null };

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function relative(iso: string | null): string {
  if (!iso) return "Never signed in";
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return "Never signed in";
  const days = Math.floor((Date.now() - t) / 86_400_000);
  if (days <= 0) return "Signed in today";
  if (days === 1) return "Signed in yesterday";
  if (days < 30) return `Signed in ${days} days ago`;
  return `Last seen ${fmtDate(iso)}`;
}

export default function Team({ adminKey }: { adminKey: string }) {
  const [rows, setRows] = useState<TeamMember[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Invite form
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "crew">("crew");
  const [inviting, setInviting] = useState(false);
  const [invite, setInvite] = useState<InviteResult | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setLoadError(null);
    const r = await api.listTeam();
    if ("error" in r) {
      setLoadError(r.error);
      return;
    }
    setRows(r.data.rows);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const list = rows ?? [];
    const needle = q.trim().toLowerCase();
    if (!needle) return list;
    return list.filter(
      (m) =>
        m.name.toLowerCase().includes(needle) ||
        m.email.toLowerCase().includes(needle) ||
        m.role.includes(needle),
    );
  }, [rows, q]);

  const admins = filtered.filter((m) => m.role !== "crew");
  const crew = filtered.filter((m) => m.role === "crew");

  async function changeRole(m: TeamMember, role: "admin" | "crew") {
    setBusyId(m.id);
    setActionError(null);
    const r = await api.setTeamRole(m.id, role);
    setBusyId(null);
    if ("error" in r) {
      setActionError(r.error);
      return;
    }
    await load();
  }

  async function remove(m: TeamMember) {
    const ok = window.confirm(
      `Remove ${m.name}'s login?\n\nThey won't be able to sign in again. Their ${m.assignedJobs} assigned job${
        m.assignedJobs === 1 ? "" : "s"
      } will NOT be deleted — the work stays and simply becomes unassigned so you can hand it to someone else.`,
    );
    if (!ok) return;
    setBusyId(m.id);
    setActionError(null);
    const r = await api.removeTeamMember(m.id);
    setBusyId(null);
    if ("error" in r) {
      setActionError(r.error);
      return;
    }
    await load();
  }

  async function sendInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviting(true);
    setInviteError(null);
    setInvite(null);
    const r = await api.adminCreateInvite(
      {
        name: inviteName.trim() || undefined,
        email: inviteEmail.trim() || undefined,
        role: inviteRole,
      },
      adminKey,
    );
    setInviting(false);
    if ("error" in r) {
      setInviteError(r.error);
      return;
    }
    setInvite({
      url: `${window.location.origin}/admin/join?invite=${r.data.invite.token}`,
      role: inviteRole,
      name: r.data.invite.name,
    });
    setInviteName("");
    setInviteEmail("");
    await load();
  }

  async function copyLink() {
    if (!invite) return;
    try {
      await navigator.clipboard.writeText(invite.url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Invite */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 md:p-7">
        <div className="flex items-start gap-3 mb-5">
          <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <UserPlus className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-display font-bold tracking-tight text-lg text-foreground">
              Add someone to the team
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Generate a signup link. They pick their own password — you never
              handle it.
            </p>
          </div>
        </div>

        <form onSubmit={sendInvite} className="space-y-4">
          {/* Role picker — the important choice, so it's first and visual. */}
          <div className="grid sm:grid-cols-2 gap-3">
            <RoleCard
              active={inviteRole === "crew"}
              onClick={() => setInviteRole("crew")}
              icon={HardHat}
              title="Crew"
              lines={[
                "Sees only the jobs you assign them",
                "Can post progress, photos, milestones",
                "No leads, estimates, customers, or money",
              ]}
            />
            <RoleCard
              active={inviteRole === "admin"}
              onClick={() => setInviteRole("admin")}
              icon={ShieldCheck}
              title="Admin (office)"
              lines={[
                "Full access to everything you see",
                "Can add customers, jobs, and teammates",
                "Give this out sparingly",
              ]}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-semibold text-foreground">Their name</span>
              <input
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="e.g. Roberto Martinez"
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-foreground">
                Their email <span className="text-muted-foreground font-normal">(optional)</span>
              </span>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="name@example.com"
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground"
              />
            </label>
          </div>
          <p className="text-[11px] text-muted-foreground -mt-1">
            Set the email to lock the link to that address. Leave it blank and
            whoever opens the link chooses their own.
          </p>

          <button
            type="submit"
            disabled={inviting}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white px-5 py-2.5 rounded-full text-sm font-semibold"
          >
            {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            Create {inviteRole === "crew" ? "crew" : "admin"} signup link
          </button>
        </form>

        {inviteError && (
          <p className="mt-3 text-sm text-destructive flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            {inviteError}
          </p>
        )}

        {invite && (
          <div className="mt-5 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/30">
            <p className="text-sm font-semibold text-foreground mb-1">
              {invite.role === "crew" ? "Crew" : "Admin"} link ready
              {invite.name ? ` for ${invite.name}` : ""} — expires in 7 days.
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              Text or email this to them. It works once.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <code className="flex-1 min-w-[220px] text-[11px] font-mono bg-background border border-border rounded-lg px-3 py-2 break-all text-foreground/80">
                {invite.url}
              </code>
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex items-center gap-1.5 bg-foreground text-background px-4 py-2 rounded-full text-xs font-semibold"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Roster */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="font-display font-bold tracking-tight text-lg text-foreground">
              Who has an account
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {rows === null
                ? "Loading…"
                : `${rows.length} ${rows.length === 1 ? "person" : "people"} can sign in · ${
                    rows.filter((m) => m.role === "crew").length
                  } crew`}
            </p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search team…"
              className="pl-9 pr-3 py-2 rounded-full border border-border bg-background text-sm w-56 text-foreground"
            />
          </div>
        </div>

        {actionError && (
          <p className="mb-4 p-3 rounded-xl border border-destructive/40 bg-destructive/5 text-destructive text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            {actionError}
          </p>
        )}

        {loadError ? (
          <div className="p-4 rounded-xl border border-destructive/40 bg-destructive/5 text-destructive text-sm">
            Couldn't load the team: {loadError}
            <button
              type="button"
              onClick={() => void load()}
              className="ml-2 underline font-semibold"
            >
              Retry
            </button>
          </div>
        ) : rows === null ? (
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading team…
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {q ? "Nobody matches that search." : "No accounts yet."}
          </p>
        ) : (
          <div className="space-y-6">
            <RosterGroup
              label="Office"
              hint="Full access"
              members={admins}
              busyId={busyId}
              onChangeRole={changeRole}
              onRemove={remove}
            />
            <RosterGroup
              label="Crew"
              hint="Assigned jobs only"
              members={crew}
              busyId={busyId}
              onChangeRole={changeRole}
              onRemove={remove}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function RoleCard({
  active,
  onClick,
  icon: Icon,
  title,
  lines,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Shield;
  title: string;
  lines: string[];
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`text-left rounded-xl border p-4 transition-colors ${
        active
          ? "border-primary bg-primary/5 ring-1 ring-primary/30"
          : "border-border/60 bg-background hover:border-primary/40"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
        <span className="font-semibold text-sm text-foreground">{title}</span>
        {active && <Check className="w-4 h-4 text-primary ml-auto" />}
      </div>
      <ul className="space-y-1">
        {lines.map((l) => (
          <li key={l} className="text-[11px] text-muted-foreground leading-snug">
            {l}
          </li>
        ))}
      </ul>
    </button>
  );
}

function RosterGroup({
  label,
  hint,
  members,
  busyId,
  onChangeRole,
  onRemove,
}: {
  label: string;
  hint: string;
  members: TeamMember[];
  busyId: number | null;
  onChangeRole: (m: TeamMember, role: "admin" | "crew") => void;
  onRemove: (m: TeamMember) => void;
}) {
  if (members.length === 0) return null;
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mb-3">
        {label} <span className="font-medium normal-case tracking-normal">· {hint}</span>
      </p>
      <div className="grid md:grid-cols-2 gap-3">
        {members.map((m) => {
          const isOwner = m.role === "owner";
          const isCrew = m.role === "crew";
          const busy = busyId === m.id;
          return (
            <div
              key={m.id}
              className="bg-background border border-border/60 rounded-xl p-4 flex flex-col"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    isCrew ? "bg-amber-500/10 text-amber-600" : "bg-primary/10 text-primary"
                  }`}
                >
                  {isCrew ? <HardHat className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-sm text-foreground truncate">{m.name}</p>
                    {isOwner && (
                      <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-primary text-white">
                        Owner
                      </span>
                    )}
                    {m.isYou && (
                      <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        You
                      </span>
                    )}
                  </div>
                  <a
                    href={`mailto:${m.email}`}
                    className="text-xs text-muted-foreground hover:text-primary break-all"
                  >
                    {m.email}
                  </a>
                  <p className="text-[11px] text-muted-foreground mt-1">{relative(m.lastLoginAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/60">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-foreground">
                  <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                  {m.assignedJobs} job{m.assignedJobs === 1 ? "" : "s"}
                </span>
                <div className="ml-auto flex items-center gap-1.5">
                  {busy ? (
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  ) : isOwner ? (
                    <span className="text-[11px] text-muted-foreground">Can't be changed</span>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => onChangeRole(m, isCrew ? "admin" : "crew")}
                        disabled={m.isYou}
                        title={
                          m.isYou
                            ? "You can't change your own role"
                            : isCrew
                              ? "Give full office access"
                              : "Restrict to assigned jobs only"
                        }
                        className="text-[11px] font-semibold px-2.5 py-1.5 rounded-full border border-border hover:border-primary/50 hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed text-foreground"
                      >
                        {isCrew ? "Make admin" : "Make crew"}
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemove(m)}
                        disabled={m.isYou}
                        title={m.isYou ? "You can't remove yourself" : "Remove this login"}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label={`Remove ${m.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
