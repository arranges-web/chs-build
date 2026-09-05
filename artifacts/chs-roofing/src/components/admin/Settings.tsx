import { ArrowRight, KeyRound, UserPlus } from "lucide-react";
import type { AdminSection } from "./AdminShell";
import BackupCard from "./BackupCard";
import DemoCard from "./DemoCard";

type Props = {
  adminKey: string;
  onNavigate: (s: AdminSection) => void;
};

/**
 * Settings & Backup — the setup / housekeeping tools that used to
 * crowd the top of the dashboard. Nothing here is a daily task, so it
 * lives off the main path.
 */
export default function SettingsPanel({ adminKey, onNavigate }: Props) {
  return (
    <div className="space-y-4">
      <BackupCard />
      <DemoCard adminKey={adminKey} />

      <section className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <UserPlus className="w-5 h-5 text-primary" />
            </span>
            <div className="min-w-0">
              <h3 className="font-display font-bold text-foreground text-base">Team access</h3>
              <p className="text-[13px] text-muted-foreground mt-0.5">
                Send a teammate a one-time signup link. They pick their own
                password and sign in from any device. Links expire in 7 days.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("invites")}
            className="inline-flex items-center justify-center gap-1.5 bg-primary text-white text-sm font-semibold px-4 h-10 rounded-full shadow-md shadow-primary/30 hover:bg-primary/90 md:shrink-0"
          >
            Invite a teammate
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      <section className="bg-muted/40 border border-border/60 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 rounded-xl bg-card border border-border/60 flex items-center justify-center shrink-0">
            <KeyRound className="w-5 h-5 text-muted-foreground" />
          </span>
          <div className="text-[13px] text-foreground/80 leading-relaxed">
            <p className="font-semibold text-foreground">Recovery key</p>
            <p className="mt-0.5">
              The <code className="text-[12px] bg-card px-1.5 py-0.5 rounded border border-border/60">ADMIN_KEY</code> in
              Replit Secrets is the owner's fallback. If anyone is ever locked
              out, the sign-in screen's <em>Use admin key</em> mode can create a
              fresh owner account from it in seconds. Keep it in Secrets only —
              never in a file, email, or chat.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
