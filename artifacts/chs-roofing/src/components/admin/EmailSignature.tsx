import { useMemo, useRef, useState } from "react";
import { Check, Copy, Eye, Mail } from "lucide-react";
import { SITE } from "@/lib/site-config";

type Profile = {
  name: string;
  role: string;
  phone: string;
  mobile: string;
  email: string;
  showLicense: boolean;
  showSocials: boolean;
  bilingual: boolean;
};

const DEFAULTS: Profile = {
  name: "",
  role: "Owner",
  phone: SITE.phoneDisplay,
  mobile: "",
  email: SITE.email,
  showLicense: true,
  showSocials: true,
  bilingual: false,
};

// Brand colours pulled from the site theme. Inlining hex on every node
// is required for email clients — they strip <style> tags.
const PRIMARY = "#C5172A";
const SECONDARY = "#0E1726";
const MUTED = "#6B7280";
const BORDER = "#E5E7EB";
const ACCENT_GOLD = "#C99B2E";

function buildHtml(p: Profile): string {
  const safe = (s: string) => s.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const phoneTel = p.phone.replace(/[^\d+]/g, "");
  const mobileTel = p.mobile.replace(/[^\d+]/g, "");
  const licenseLine = p.showLicense
    ? `<div style="font-size:11px;color:${MUTED};margin-top:6px;">FL License ${SITE.license.replace("#", "")} · Fully Insured · BBB A+</div>`
    : "";
  const bilingual = p.bilingual
    ? `<div style="font-size:11px;color:${ACCENT_GOLD};font-weight:600;margin-top:2px;">Bilingual service · English / Español</div>`
    : "";

  const socialIcon = (label: string, href: string, dot: string) =>
    `<a href="${href}" style="display:inline-block;text-decoration:none;color:${MUTED};font-size:11px;margin-right:10px;border-bottom:1px solid ${BORDER};padding-bottom:1px;"><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${dot};margin-right:5px;vertical-align:middle;"></span>${label}</a>`;

  const socialRow = p.showSocials
    ? `<div style="margin-top:10px;">
         ${socialIcon("Facebook", SITE.social.facebook, "#1877F2")}
         ${socialIcon("Instagram", SITE.social.instagram, "#E1306C")}
         ${socialIcon("Google Reviews", SITE.social.google, "#4285F4")}
       </div>`
    : "";

  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${SECONDARY};line-height:1.4;">
  <tr>
    <td style="padding-right:18px;border-right:3px solid ${PRIMARY};vertical-align:top;">
      <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${PRIMARY};font-weight:700;margin-bottom:4px;">${SITE.brand}</div>
      <div style="font-size:18px;font-weight:700;color:${SECONDARY};">${safe(p.name || "Your Name")}</div>
      <div style="font-size:13px;color:${MUTED};margin-top:1px;">${safe(p.role || "Role")} · ${safe(SITE.legalName)}</div>
    </td>
    <td style="padding-left:18px;vertical-align:top;">
      <div style="font-size:12px;color:${SECONDARY};">
        <a href="tel:${phoneTel}" style="color:${SECONDARY};text-decoration:none;font-weight:600;">${safe(p.phone)}</a>${
    p.mobile
      ? ` <span style="color:${MUTED};">·</span> <a href="tel:${mobileTel}" style="color:${SECONDARY};text-decoration:none;">cell ${safe(p.mobile)}</a>`
      : ""
  }
      </div>
      <div style="font-size:12px;margin-top:3px;">
        <a href="mailto:${safe(p.email)}" style="color:${PRIMARY};text-decoration:none;font-weight:600;">${safe(p.email)}</a>
      </div>
      <div style="font-size:12px;margin-top:3px;">
        <a href="https://chs-roofing.com" style="color:${MUTED};text-decoration:none;">chs-roofing.com</a> <span style="color:${MUTED};">·</span> <span style="color:${MUTED};">${safe(SITE.city)}</span>
      </div>
      ${licenseLine}
      ${bilingual}
      ${socialRow}
    </td>
  </tr>
</table>`;
}

export default function EmailSignature() {
  const [profile, setProfile] = useState<Profile>(DEFAULTS);
  const [copied, setCopied] = useState<"html" | "rich" | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const html = useMemo(() => buildHtml(profile), [profile]);

  const set = <K extends keyof Profile>(k: K, v: Profile[K]) =>
    setProfile((p) => ({ ...p, [k]: v }));

  const copyHtml = async () => {
    try {
      await navigator.clipboard.writeText(html);
      setCopied("html");
      window.setTimeout(() => setCopied((c) => (c === "html" ? null : c)), 1800);
    } catch {
      // ignore
    }
  };

  const copyRich = async () => {
    try {
      const node = previewRef.current;
      if (!node) return;
      const range = document.createRange();
      range.selectNodeContents(node);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      document.execCommand("copy");
      sel?.removeAllRanges();
      setCopied("rich");
      window.setTimeout(() => setCopied((c) => (c === "rich" ? null : c)), 1800);
    } catch {
      // ignore
    }
  };

  return (
    <div className="grid lg:grid-cols-[420px_1fr] gap-6">
      {/* Form */}
      <section className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
        <h2 className="font-display font-bold text-foreground text-lg mb-1">Your details</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Fill these in once — preview updates as you type. Copy and paste into your email client's
          signature settings (Gmail, Outlook, Apple Mail all accept it).
        </p>
        <div className="space-y-3">
          <Field label="Full name" value={profile.name} onChange={(v) => set("name", v)} placeholder="e.g. Gustavo Cordova" />
          <Field label="Role" value={profile.role} onChange={(v) => set("role", v)} placeholder="Owner · Project Manager · Estimator" />
          <Field label="Office phone" value={profile.phone} onChange={(v) => set("phone", v)} />
          <Field label="Cell phone (optional)" value={profile.mobile} onChange={(v) => set("mobile", v)} placeholder="(239) 555-0123" />
          <Field label="Email" value={profile.email} onChange={(v) => set("email", v)} type="email" />

          <div className="pt-3 mt-2 border-t border-border/60 space-y-2.5">
            <Checkbox
              label="Include license number, insured & BBB line"
              checked={profile.showLicense}
              onChange={(v) => set("showLicense", v)}
            />
            <Checkbox
              label="Include Facebook / Instagram / Google links"
              checked={profile.showSocials}
              onChange={(v) => set("showSocials", v)}
            />
            <Checkbox
              label="Add bilingual (English / Español) note"
              checked={profile.bilingual}
              onChange={(v) => set("bilingual", v)}
            />
          </div>
        </div>
      </section>

      {/* Preview + actions */}
      <section className="space-y-4">
        <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4 text-primary" />
            <h2 className="font-display font-bold text-foreground text-base">Live preview</h2>
          </div>
          <div className="bg-white p-5 rounded-xl border border-border/60 overflow-x-auto">
            <div ref={previewRef} dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
          <h3 className="font-display font-bold text-foreground text-base mb-2">Install it</h3>
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
            "Copy as image-and-styles" works for Gmail, Outlook web, and Apple Mail (use the
            rich-copy button). For Outlook desktop and most other clients, paste the raw HTML in
            the signature editor.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={copyRich}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full transition-colors ${
                copied === "rich" ? "bg-emerald-100 text-emerald-700" : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              {copied === "rich" ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy as rich signature</>}
            </button>
            <button
              type="button"
              onClick={copyHtml}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full transition-colors ${
                copied === "html" ? "bg-emerald-100 text-emerald-700" : "bg-card border border-border/60 text-foreground hover:border-primary/40"
              }`}
            >
              {copied === "html" ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Mail className="w-3.5 h-3.5" /> Copy raw HTML</>}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold text-foreground mb-1">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 px-3 rounded-lg border border-border/60 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />
    </label>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-2 text-sm text-foreground cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 w-4 h-4 accent-primary cursor-pointer"
      />
      <span>{label}</span>
    </label>
  );
}
