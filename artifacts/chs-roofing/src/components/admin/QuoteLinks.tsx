import { useMemo, useState } from "react";
import { Check, Copy, Link as LinkIcon, MessageSquare, QrCode } from "lucide-react";

const SITE_URL = "https://chs-roofing.com";

const SERVICES = [
  { value: "", label: "Any service" },
  { value: "installation", label: "New Roof Install" },
  { value: "new-construction", label: "New Construction" },
  { value: "commercial-roofing", label: "Commercial Roofing" },
  { value: "repair", label: "Roof Repair" },
  { value: "maintenance", label: "Maintenance" },
  { value: "storm-damage", label: "Storm Damage" },
  { value: "specialty-roofing", label: "Specialty Roofing" },
  { value: "roof-coating", label: "Roof Coating" },
  { value: "gutters", label: "Gutters" },
];

const MAINT_PLANS = [
  { value: "", label: "(no plan)" },
  { value: "basic", label: "Basic Plan" },
  { value: "pro", label: "Pro Plan" },
  { value: "premium", label: "Premium Plan" },
];

type Destination = "contact" | "free-quote" | "estimator" | "portal";

const DESTINATIONS: { value: Destination; label: string; help: string }[] = [
  { value: "contact", label: "/contact (full quote form)", help: "Best for warm leads ready to share details." },
  { value: "free-quote", label: "/free-quote (ad landing)", help: "Stripped-down landing page for ad traffic." },
  { value: "estimator", label: "/estimator (self-serve estimate)", help: "Send for ballpark pricing." },
  { value: "portal", label: "/portal (existing customer)", help: "For people you've already added to the CRM." },
];

export default function QuoteLinks() {
  const [destination, setDestination] = useState<Destination>("contact");
  const [service, setService] = useState("");
  const [plan, setPlan] = useState("");
  const [campaign, setCampaign] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const url = useMemo(() => {
    const params = new URLSearchParams();
    if (service) params.set("service", service);
    if (service === "maintenance" && plan) params.set("plan", plan);
    if (campaign) params.set("ref", campaign);
    const qs = params.toString();
    return `${SITE_URL}/${destination}${qs ? `?${qs}` : ""}`;
  }, [destination, service, plan, campaign]);

  const smsBody = `Hi! Here's your CHS Roofing link to fill out your details so we can get back to you with a quote: ${url}`;
  const emailSubject = `Your CHS Roofing quote link`;
  const emailBody = `Hi,\n\nThanks for reaching out. Click this link to share your details and we'll get back to you with a transparent, line-itemed estimate within 24–48 hours:\n\n${url}\n\nTalk soon,\nCHS Roofing`;

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1800);
    } catch {
      // ignore
    }
  };

  const qrSrc = useMemo(
    () =>
      `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(url)}&margin=10`,
    [url],
  );

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <section className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
        <h2 className="font-display font-bold text-foreground text-lg mb-1">Build a link</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Pre-fill the contact form or send customers straight to the estimator. The link is safe
          to share by text, email, or QR.
        </p>

        <div className="space-y-3">
          <div>
            <span className="block text-[11px] font-semibold text-foreground mb-1">Destination</span>
            <div className="grid grid-cols-1 gap-1.5">
              {DESTINATIONS.map((d) => {
                const selected = d.value === destination;
                return (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDestination(d.value)}
                    className={`text-left rounded-xl border px-3.5 py-2.5 transition-colors ${
                      selected
                        ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                        : "border-border/60 bg-background hover:border-primary/40"
                    }`}
                  >
                    <p className="font-semibold text-sm text-foreground">{d.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{d.help}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {(destination === "contact" || destination === "free-quote") && (
            <label className="block">
              <span className="block text-[11px] font-semibold text-foreground mb-1">Pre-fill service</span>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border/60 bg-background text-sm"
              >
                {SERVICES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          )}

          {destination === "contact" && service === "maintenance" && (
            <label className="block">
              <span className="block text-[11px] font-semibold text-foreground mb-1">Pre-fill maintenance plan</span>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border/60 bg-background text-sm"
              >
                {MAINT_PLANS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="block">
            <span className="block text-[11px] font-semibold text-foreground mb-1">
              Campaign tag (optional)
            </span>
            <input
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              placeholder="e.g. yard-sign · fb-feb · door-hanger"
              className="w-full h-10 px-3 rounded-lg border border-border/60 bg-background text-sm"
            />
            <span className="block text-[11px] text-muted-foreground mt-1">
              Shows up under "Source" on the lead — helps you see which channel drove the visit.
            </span>
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <LinkIcon className="w-4 h-4 text-primary" />
            <h3 className="font-display font-bold text-foreground text-base">Your link</h3>
          </div>
          <div className="bg-background border border-border/60 rounded-lg px-3 py-2.5 break-all text-[13px] font-mono text-foreground">
            {url}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => copy("url", url)}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full transition-colors ${
                copiedKey === "url"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              {copiedKey === "url" ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy link
                </>
              )}
            </button>
            <a
              href={`sms:?&body=${encodeURIComponent(smsBody)}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full bg-card border border-border/60 hover:border-primary/40 text-foreground hover:text-primary transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Send as SMS
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full bg-card border border-border/60 hover:border-primary/40 text-foreground hover:text-primary transition-colors"
            >
              Send as Email
            </a>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full bg-card border border-border/60 hover:border-primary/40 text-foreground hover:text-primary transition-colors"
            >
              Preview
            </a>
          </div>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <QrCode className="w-4 h-4 text-primary" />
            <h3 className="font-display font-bold text-foreground text-base">Scan-to-go QR</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Drop on yard signs, door hangers, business cards. Updates automatically as you tweak
            the link above.
          </p>
          <img
            src={qrSrc}
            alt="QR code for the generated link"
            width={240}
            height={240}
            className="bg-white p-2 rounded-xl border border-border/60"
          />
        </div>
      </section>
    </div>
  );
}
