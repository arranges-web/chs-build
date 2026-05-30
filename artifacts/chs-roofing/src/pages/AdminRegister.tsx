import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle2, Lock, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";
import { SITE } from "@/lib/site-config";
import Seo from "@/components/Seo";

/**
 * /admin/join?invite=<token>
 *
 * Public-facing landing page for an invite link. Validates the token,
 * shows a friendly name/email/password form, and on submit creates the
 * admin account (which also drops the session cookie) before bouncing
 * over to /admin.
 */
export default function AdminRegisterPage() {
  const [, navigate] = useLocation();

  // wouter doesn't parse query strings, so read them off window.location.
  const token = useMemo(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    return params.get("invite") ?? params.get("token") ?? "";
  }, []);

  const [loadingInvite, setLoadingInvite] = useState(true);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [lockedEmail, setLockedEmail] = useState<string | null>(null);
  const [presetName, setPresetName] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!token) {
      setLoadingInvite(false);
      setInviteError("This page needs an invite link. Ask the person who sent it to share the full URL.");
      return;
    }
    (async () => {
      const res = await api.adminInviteLookup(token);
      if (cancelled) return;
      if ("error" in res) {
        setInviteError(res.error);
      } else {
        if (res.data.invite.email) {
          setLockedEmail(res.data.invite.email);
          setEmail(res.data.invite.email);
        }
        if (res.data.invite.name) {
          setPresetName(res.data.invite.name);
          setName(res.data.invite.name);
        }
      }
      setLoadingInvite(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (password !== confirm) {
      setSubmitError("The two passwords don't match.");
      return;
    }
    if (password.length < 10) {
      setSubmitError("Use at least 10 characters for your password.");
      return;
    }
    if (!name.trim()) {
      setSubmitError("Please add your name.");
      return;
    }
    if (!email.trim()) {
      setSubmitError("Please add your email.");
      return;
    }

    setSubmitting(true);
    const res = await api.adminRegister({
      token,
      name: name.trim(),
      email: email.trim(),
      password,
    });
    setSubmitting(false);

    if ("error" in res) {
      setSubmitError(res.error);
      return;
    }
    // Cookie is set — straight to admin.
    navigate("/admin");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-secondary via-secondary to-secondary/95 flex items-center justify-center px-4 py-12">
      <Seo title="Create your admin account | CHS Roofing" description="Set up your CHS Roofing admin account." noIndex path="/admin/join" />

      <div className="w-full max-w-lg">
        <div className="flex items-center gap-3 mb-6 justify-center">
          <img src={SITE.logo} alt="" aria-hidden="true" className="w-12 h-12 object-contain" />
          <div className="text-white text-center">
            <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-primary">{SITE.brand}</p>
            <h1 className="font-display font-bold tracking-tight text-2xl">Admin account setup</h1>
          </div>
        </div>

        <div className="bg-card border border-border/60 rounded-3xl shadow-xl p-7 md:p-8">
          {loadingInvite ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Checking your invite link…
            </div>
          ) : inviteError ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-destructive">
                <Lock className="w-5 h-5" />
                <p className="font-display font-bold text-lg">Invite link invalid</p>
              </div>
              <p className="text-sm text-muted-foreground">{inviteError}</p>
              <p className="text-xs text-muted-foreground">
                If you already created your account, head straight to{" "}
                <a href="/admin" className="text-primary underline-offset-2 hover:underline">/admin</a>{" "}
                to sign in.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-primary mb-1">
                <ShieldCheck className="w-4 h-4" />
                <p className="text-[11px] uppercase tracking-[0.22em] font-semibold">Invite verified</p>
              </div>
              <h2 className="font-display font-bold tracking-tight text-xl text-foreground">
                {presetName ? `Welcome, ${presetName.split(" ")[0]}` : "Create your login"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1 mb-5">
                Pick a strong password. We'll keep you signed in for 30 days on this browser.
              </p>

              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Full name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    placeholder="Your full name"
                    required
                    className="w-full h-11 px-3.5 rounded-xl border border-border/60 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Email
                    {lockedEmail && (
                      <span className="ml-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                        (locked by invite)
                      </span>
                    )}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    placeholder="you@cordovahomeservices.com"
                    required
                    disabled={!!lockedEmail}
                    className="w-full h-11 px-3.5 rounded-xl border border-border/60 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    placeholder="At least 10 characters"
                    required
                    minLength={10}
                    className="w-full h-11 px-3.5 rounded-xl border border-border/60 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Confirm password</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="new-password"
                    placeholder="Type it again"
                    required
                    minLength={10}
                    className="w-full h-11 px-3.5 rounded-xl border border-border/60 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                {submitError && (
                  <p className="text-xs text-destructive">{submitError}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-white h-11 rounded-xl font-semibold text-sm tracking-tight shadow-md shadow-primary/30 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {submitting ? "Creating account…" : "Create my admin account"}
                </button>
              </form>

              <p className="mt-5 text-[11px] text-muted-foreground leading-relaxed">
                Already have an account? Sign in at{" "}
                <a href="/admin" className="text-primary underline-offset-2 hover:underline">/admin</a>.
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
