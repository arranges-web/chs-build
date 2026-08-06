import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { ArrowRight, CheckCircle2, Lock, Phone, ShieldCheck, Sparkles } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { SITE } from "@/lib/site-config";
import { gaEvent } from "@/lib/gtag";

/**
 * Dedicated form for /free-roof-inspection. Fewer fields than the
 * standard contact form (per Meta Ads best-practice: short forms
 * convert), routes to /inspection-request-received on success so
 * the Meta Pixel `Lead` event fires from the dedicated thank-you
 * page URL. UTM params are preserved through the submission's
 * `source` field AND forwarded to the thank-you page so downstream
 * tools can still see where the conversion came from.
 */

const CONCERN_OPTIONS = [
  { value: "leak", label: "Roof leak" },
  { value: "damaged-shingles", label: "Missing or damaged shingles" },
  { value: "storm", label: "Storm or wind damage" },
  { value: "replacement", label: "Roof replacement" },
  { value: "repair", label: "Roof repair" },
  { value: "insurance", label: "Insurance or home inspection" },
  { value: "not-sure", label: "Not sure — I want the roof checked" },
] as const;

type Props = {
  /** Prefix for the source field so admin can distinguish top-of-page vs bottom-of-page submits. */
  variant?: string;
};

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

function readUtms(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  for (const k of UTM_KEYS) {
    const v = p.get(k);
    if (v) out[k] = v;
  }
  return out;
}

export default function InspectionForm({ variant }: Props) {
  const [, navigate] = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const startFired = useRef(false);

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, "Please add your first and last name."),
        phone: z
          .string()
          .min(10, "Add a phone number we can call.")
          .regex(/^[0-9 ()+\-]+$/, "Digits only, please."),
        email: z.string().email("That email doesn't look right."),
        address: z.string().min(4, "Add your property address."),
        concern: z.string().min(1, "Pick what's going on with your roof."),
      }),
    [],
  );

  type Values = z.infer<typeof schema>;

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { name: "", phone: "", email: "", address: "", concern: "" },
  });

  // Fire GA4 `inspection_form_start` exactly once, the first time
  // the visitor engages with any field.
  const onFieldFocus = () => {
    if (startFired.current) return;
    startFired.current = true;
    gaEvent("inspection_form_start", { form: "free-roof-inspection" });
  };

  const onSubmit = async (data: Values) => {
    setSubmitting(true);
    setSubmitError(null);

    const utms = readUtms();
    const utmSuffix = utms.utm_campaign
      ? `:${utms.utm_source ?? "unknown"}/${utms.utm_campaign}`
      : "";
    // Bundle UTMs into the lead's `message` field so nothing is lost —
    // the admin can see the full attribution on the row.
    const utmSummary =
      Object.keys(utms).length > 0
        ? "\n\n— UTMs —\n" +
          UTM_KEYS.filter((k) => utms[k]).map((k) => `${k}: ${utms[k]}`).join("\n")
        : "";

    const res = await api.submitLead({
      name: data.name,
      phone: data.phone,
      email: data.email,
      address: data.address,
      serviceType: data.concern,
      message: `Roofing concern: ${data.concern}${utmSummary}`,
      source: `free-roof-inspection${variant ? `:${variant}` : ""}${utmSuffix}`,
    });
    setSubmitting(false);

    if (!res) {
      setSubmitError(
        `Couldn't submit — please try again or call us at ${SITE.phoneDisplay}.`,
      );
      return;
    }

    // Redirect to dedicated thank-you page — the Meta Pixel Lead
    // event fires from there (spec: "fire after form is successfully
    // accepted or when the dedicated thank-you page loads").
    const params = new URLSearchParams();
    if (data.name) params.set("name", data.name);
    // Forward UTMs so the thank-you page (and any downstream
    // tracker) still sees them.
    for (const k of UTM_KEYS) {
      if (utms[k]) params.set(k, utms[k]);
    }
    const qs = params.toString();
    navigate(`/inspection-request-received${qs ? `?${qs}` : ""}`);
  };

  return (
    <div className="bg-card p-6 md:p-7 rounded-3xl shadow-xl border border-border/60 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary to-primary/60" />

      <div className="mb-5">
        <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-primary mb-1.5">
          <Sparkles className="w-3.5 h-3.5 inline mr-1" />
          Free · No obligation
        </p>
        <h3 className="font-display font-bold text-2xl tracking-tight text-foreground leading-tight">
          Request Your Free Roof Inspection
        </h3>
        <p className="text-sm text-muted-foreground mt-1.5">
          A CHS Roofing rep will reach out to schedule.
        </p>
      </div>

      {/* Click-to-call fallback for anyone who'd rather not fill a form */}
      <a
        href={`tel:${SITE.phoneTel}`}
        onClick={() => gaEvent("click_to_call", { location: "inspection-form" })}
        className="mb-4 w-full inline-flex items-center justify-center gap-2 bg-foreground/[0.04] hover:bg-foreground/[0.07] text-foreground h-11 rounded-xl font-semibold text-sm tracking-tight border border-border/60 transition-all"
      >
        <Phone className="w-4 h-4 text-primary" />
        Or tap to call {SITE.phoneDisplay}
      </a>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5" onFocusCapture={onFieldFocus}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-sm">First and last name</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="name" placeholder="Your full name" className="h-12 bg-background text-base" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid sm:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-sm">Phone number</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" inputMode="tel" autoComplete="tel" placeholder="(239) 555-1234" className="h-12 bg-background text-base" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-sm">Email address</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" autoComplete="email" placeholder="you@example.com" className="h-12 bg-background text-base" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-sm">Property address</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="street-address" placeholder="1247 Palm Drive, Cape Coral, FL" className="h-12 bg-background text-base" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="concern"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-sm">Roofing concern</FormLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CONCERN_OPTIONS.map((o) => {
                    const selected = field.value === o.value;
                    return (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => field.onChange(o.value)}
                        className={`text-left rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          selected
                            ? "border-primary bg-primary/5 ring-2 ring-primary/30 text-foreground"
                            : "border-border/60 bg-background hover:border-primary/40 text-foreground/80"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          {selected && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                          {o.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {submitError && <p className="text-[12px] text-destructive">{submitError}</p>}

          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            className="w-full h-12 text-base font-semibold tracking-tight shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all"
          >
            {submitting ? (
              "Sending…"
            ) : (
              <span className="inline-flex items-center gap-2">
                Schedule My Free Inspection
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>

          {/* TCPA-style consent — exact language from the spec. */}
          <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
            By submitting this form, you agree that {SITE.brand} may contact
            you by phone, text, or email regarding your inspection request.
            Message and data rates may apply.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 pt-1 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Your info stays private
            </span>
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-primary" />
              FL License {SITE.license}
            </span>
          </div>
        </form>
      </Form>
    </div>
  );
}
