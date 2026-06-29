import { useMemo, useState } from "react";
import { Check, Copy, Mail, MessageSquare, Send, UserPlus } from "lucide-react";
import { api } from "@/lib/api";

// Use the current origin so invite links work on any host —
// chs-roofing.com in production, the Replit preview URL while testing,
// staging hosts, localhost during dev. Hardcoding the URL was breaking
// invite links when the dashboard was opened from any non-canonical
// host because the recipient landed on a domain that wasn't deployed.
const SITE_URL = typeof window !== "undefined" ? window.location.origin : "https://chs-roofing.com";

type Props = {
  adminKey: string;
};

/**
 * Generates an invite link the recipient can use to set up their own
 * admin account. Calls POST /admin/auth/invites (gated by the ADMIN_KEY
 * header so the existing key-based session can still create the very
 * first owner account before any DB-backed user exists).
 *
 * Built to look and feel like the QuoteLinks tool so the team has one
 * consistent "share-a-link" workflow across the dashboard.
 */
export default function InviteTeammates({ adminKey }: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [label, setLabel] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const inviteUrl = useMemo(() => {
    if (!token) return "";
    return `${SITE_URL}/admin/join?invite=${encodeURIComponent(token)}`;
  }, [token]);

  const recipientName = (name || "there").trim().split(" ")[0] || "there";
  const smsBody = `Hi ${recipientName} — here's your CHS Roofing admin signup link. It expires in 7 days. ${inviteUrl}`;
  const emailSubject = `Your CHS Roofing admin invite`;
  const emailBody = `Hi ${recipientName},\n\nYou've been invited to set up an admin account for CHS Roofing. Click the link below to create your login (it expires in 7 days):\n\n${inviteUrl}\n\nOnce you're in, you'll be able to manage clients, projects, leads, and the website.\n\nTalk soon,\nCHS Roofing`;

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCreating(true);
    const payload: { email?: string; name?: string; label?: string } = {};
    if (email.trim()) payload.email = email.trim();
    if (name.trim()) payload.name = name.trim();
    if (label.trim()) payload.label = label.trim();
    const res = await api.adminCreateInvite(payload, adminKey);
    setCreating(false);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    setToken(res.data.invite.token);
    setExpiresAt(res.data.invite.expiresAt);
  };

  const copy = async (key: string, text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1800);
    } catch {
      // clipboard probably blocked — user can long-press and copy manually
    }
  };

  const reset = () => {
    setToken(null);
    setExpiresAt(null);
    setEmail("");
    setName("");
    setLabel("");
  };

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* Form */}
      <div className="lg:col-span-2 bg-card border border-border/60 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <UserPlus className="w-4 h-4 text-primary" />
          <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-primary">Invite</p>
        </div>
        <h3 className="font-display font-bold tracking-tight text-lg text-foreground">
          Create an admin invite
        </h3>
        <p className="text-xs text-muted-foreground mt-1 mb-4">
          Generate a one-time signup link the recipient can use to set their own password. Links expire after 7 days.
        </p>

        <form onSubmit={create} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-foreground mb-1">Recipient name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Gustavo Cordova"
              className="w-full h-10 px-3 rounded-xl border border-border/60 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-foreground mb-1">
              Lock to email <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="gustavo@cordovahomeservices.com"
              className="w-full h-10 px-3 rounded-xl border border-border/60 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <p className="text-[10px] text-muted-foreground mt-1">
              If set, the recipient can only register that exact email.
            </p>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-foreground mb-1">
              Your label <span className="font-normal text-muted-foreground">(audit trail)</span>
            </label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. owner-sandin"
              maxLength={64}
              className="w-full h-10 px-3 rounded-xl border border-border/60 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {error && <p className="text-[11px] text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={creating}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white h-10 rounded-xl font-semibold text-sm tracking-tight shadow-md shadow-primary/30 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            {creating ? "Creating…" : token ? "Generate another" : "Generate invite link"}
          </button>
          {token && (
            <button
              type="button"
              onClick={reset}
              className="w-full text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear and start over
            </button>
          )}
        </form>
      </div>

      {/* Link output */}
      <div className="lg:col-span-3 space-y-4">
        <div className="bg-card border border-border/60 rounded-2xl p-5">
          <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-primary mb-2">
            Invite link
          </p>
          {token ? (
            <>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-background border border-border/60 mb-3 break-all">
                <code className="flex-1 text-[12px] text-foreground font-mono">{inviteUrl}</code>
                <button
                  type="button"
                  onClick={() => copy("url", inviteUrl)}
                  className="shrink-0 inline-flex items-center gap-1 px-2.5 h-8 rounded-lg text-[11px] font-semibold bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  {copiedKey === "url" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === "url" ? "Copied" : "Copy"}
                </button>
              </div>
              {expiresAt && (
                <p className="text-[11px] text-muted-foreground">
                  Expires {new Date(expiresAt).toLocaleString()}. Single-use — burns the moment the recipient finishes signing up.
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground py-6 text-center">
              Fill out the form to generate a fresh signup link.
            </p>
          )}
        </div>

        {token && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-card border border-border/60 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-primary">SMS</p>
              </div>
              <textarea
                readOnly
                value={smsBody}
                rows={5}
                className="w-full text-[12px] p-3 rounded-xl border border-border/60 bg-background font-mono resize-none"
              />
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => copy("sms", smsBody)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-lg text-[12px] font-semibold bg-foreground/[0.04] hover:bg-foreground/[0.07] text-foreground transition-colors"
                >
                  {copiedKey === "sms" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === "sms" ? "Copied" : "Copy SMS"}
                </button>
                <a
                  href={`sms:?&body=${encodeURIComponent(smsBody)}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-lg text-[12px] font-semibold bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Open Messages
                </a>
              </div>
            </div>

            <div className="bg-card border border-border/60 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-primary" />
                <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-primary">Email</p>
              </div>
              <textarea
                readOnly
                value={emailBody}
                rows={5}
                className="w-full text-[12px] p-3 rounded-xl border border-border/60 bg-background font-mono resize-none"
              />
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => copy("email", emailBody)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-lg text-[12px] font-semibold bg-foreground/[0.04] hover:bg-foreground/[0.07] text-foreground transition-colors"
                >
                  {copiedKey === "email" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === "email" ? "Copied" : "Copy email"}
                </button>
                <a
                  href={`mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-lg text-[12px] font-semibold bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Open mail app
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-primary/30 bg-primary/[0.04] p-4 text-[12px] text-foreground/80 leading-relaxed">
          <strong className="text-foreground">How it works.</strong> Every invite link is one-time use and expires after 7 days. The recipient picks their own password and stays signed in for 30 days. You can keep using your existing admin key as a backup at any time.
        </div>
      </div>
    </div>
  );
}
