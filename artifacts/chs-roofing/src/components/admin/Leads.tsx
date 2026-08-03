import { useState } from "react";
import { Inbox, Loader2, Mail, MapPin, Phone, Sparkles, UserPlus } from "lucide-react";
import { api } from "@/lib/api";
import { getStoredAdminKey, type CustomerPrefill } from "./AdminShell";

type AnyRow = Record<string, unknown>;

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

type Props = {
  rows: AnyRow[] | null;
  loading?: boolean;
  onConvert: (prefill: CustomerPrefill) => void;
};

export default function Leads({ rows, loading, onConvert }: Props) {
  // Per-lead "Text with AI" state: id → "ok" or an error message.
  const [engagingId, setEngagingId] = useState<number | null>(null);
  const [engageResult, setEngageResult] = useState<Record<number, string>>({});

  const engage = async (leadId: number) => {
    setEngagingId(leadId);
    const res = await api.engageLead(leadId, getStoredAdminKey());
    setEngagingId(null);
    setEngageResult((prev) => ({
      ...prev,
      [leadId]: "error" in res ? res.error : "ok",
    }));
  };

  if (loading && (rows ?? []).length === 0) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }
  if (!rows || rows.length === 0) {
    return (
      <div className="bg-card border border-border/60 rounded-2xl p-10 text-center">
        <Inbox className="w-8 h-8 mx-auto text-muted-foreground/60 mb-3" />
        <p className="font-semibold text-foreground">No leads yet.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Quote-form submissions from the website show up here as soon as they come in.
        </p>
      </div>
    );
  }

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
                  {address}
                  {address && zip ? ", " : ""}
                  {zip}
                </span>
              )}
              {roofAge && (
                <span className="text-muted-foreground text-xs">Roof age: {roofAge}</span>
              )}
            </div>
            {message && (
              <p className="mt-3 text-sm text-foreground/85 bg-muted/40 border border-border/60 rounded-lg p-3 leading-relaxed">
                {message}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-border/60">
              <button
                type="button"
                onClick={() =>
                  onConvert({
                    name: name || undefined,
                    email: email || undefined,
                    phone: phone || undefined,
                    address: [address, zip].filter(Boolean).join(", ") || undefined,
                  })
                }
                className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-3 py-2 rounded-full shadow-sm shadow-primary/30 hover:-translate-y-0.5 transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Convert to client
              </button>
              {phone && typeof r.id === "number" && (
                <LeadEngageButton
                  leadId={r.id}
                  busy={engagingId === r.id}
                  result={engageResult[r.id]}
                  onEngage={() => void engage(r.id as number)}
                />
              )}
              {phone && (
                <a
                  href={`sms:${phone}`}
                  className="inline-flex items-center gap-1.5 bg-card border border-border/60 text-foreground text-xs font-semibold px-3 py-2 rounded-full hover:border-primary/40 hover:text-primary transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Text
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-1.5 bg-card border border-border/60 text-foreground text-xs font-semibold px-3 py-2 rounded-full hover:border-primary/40 hover:text-primary transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Email
                </a>
              )}
              {(source || referrer) && (
                <p className="ml-auto text-[10px] text-muted-foreground/70 tracking-wider uppercase">
                  {source ? `Source: ${source}` : ""}
                  {source && referrer ? " · " : ""}
                  {referrer ? `Referrer: ${referrer}` : ""}
                </p>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

function LeadEngageButton({
  leadId,
  busy,
  result,
  onEngage,
}: {
  leadId: number;
  busy: boolean;
  result: string | undefined;
  onEngage: () => void;
}) {
  if (result === "ok") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-2 rounded-full">
        <Sparkles className="w-3.5 h-3.5" />
        Agent engaged — check SMS Outreach
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        disabled={busy}
        onClick={onEngage}
        aria-label={`Text lead #${leadId} with the AI agent`}
        className="inline-flex items-center gap-1.5 bg-card border border-border/60 text-foreground text-xs font-semibold px-3 py-2 rounded-full hover:border-primary/40 hover:text-primary transition-colors disabled:opacity-60"
      >
        {busy ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Sparkles className="w-3.5 h-3.5" />
        )}
        {busy ? "Engaging…" : "Text with AI"}
      </button>
      {result && result !== "ok" && (
        <span className="text-[11px] text-destructive">{result}</span>
      )}
    </span>
  );
}
