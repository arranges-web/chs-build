import { useMemo, useRef, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { SITE } from "@/lib/site-config";
import { gaEvent } from "@/lib/gtag";

/**
 * Repair-specific lead form for /roof-repair. Adds "type of roof"
 * and "describe the problem" over the inspection form so the
 * dispatcher can size the visit before calling back. Redirects to
 * /thank-you-repair on success — Meta Pixel Lead fires from there.
 * UTMs are preserved through the source field and forwarded to the
 * thank-you URL.
 */

const ROOF_TYPES = [
  { value: "shingle", label: "Shingle" },
  { value: "tile", label: "Tile" },
  { value: "metal", label: "Metal" },
  { value: "flat", label: "Flat / commercial" },
  { value: "not-sure", label: "Not sure" },
] as const;

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

type Props = { variant?: string };

export default function RepairForm({ variant }: Props) {
  const [, navigate] = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const startFired = useRef(false);

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, "Please add your name."),
        phone: z
          .string()
          .min(10, "Add a phone number we can call.")
          .regex(/^[0-9 ()+\-]+$/, "Digits only, please."),
        email: z.string().email("That email doesn't look right."),
        address: z.string().min(4, "Add your property address."),
        roofType: z.string().min(1, "Pick a roof type."),
        problem: z.string().min(4, "Add a short description of the problem."),
        consent: z.literal(true, {
          errorMap: () => ({ message: "Please agree to be contacted." }),
        }),
      }),
    [],
  );

  type Values = z.infer<typeof schema>;

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      roofType: "",
      problem: "",
      consent: false as unknown as true,
    },
  });

  const onFieldFocus = () => {
    if (startFired.current) return;
    startFired.current = true;
    gaEvent("repair_form_start", { form: "roof-repair" });
  };

  const onSubmit = async (data: Values) => {
    setSubmitting(true);
    setSubmitError(null);

    const utms = readUtms();
    const utmSuffix = utms.utm_campaign
      ? `:${utms.utm_source ?? "unknown"}/${utms.utm_campaign}`
      : "";
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
      serviceType: "repair",
      message: `Roof type: ${data.roofType}\nProblem: ${data.problem}${utmSummary}`,
      source: `roof-repair${variant ? `:${variant}` : ""}${utmSuffix}`,
    });
    setSubmitting(false);

    if (!res) {
      setSubmitError(
        `Couldn't submit — please try again or call us at ${SITE.phoneDisplay}.`,
      );
      return;
    }

    const params = new URLSearchParams();
    if (data.name) params.set("name", data.name);
    for (const k of UTM_KEYS) {
      if (utms[k]) params.set(k, utms[k]);
    }
    const qs = params.toString();
    navigate(`/thank-you-repair${qs ? `?${qs}` : ""}`);
  };

  return (
    <div className="bg-card p-6 md:p-7 rounded-3xl shadow-xl border border-border/60 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary to-primary/60" />

      <div className="mb-5">
        <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-primary mb-1.5">
          <Sparkles className="w-3.5 h-3.5 inline mr-1" />
          Fast · No obligation
        </p>
        <h3 className="font-display font-bold text-2xl tracking-tight text-foreground leading-tight">
          Schedule Your Roof Inspection
        </h3>
        <p className="text-sm text-muted-foreground mt-1.5">
          A CHS Roofing rep will reach out — often same-day.
        </p>
      </div>

      <a
        href={`tel:${SITE.phoneTel}`}
        onClick={() => gaEvent("click_to_call", { location: "repair-form" })}
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
                <FormLabel className="font-semibold text-sm">Full name</FormLabel>
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
                  <FormLabel className="font-semibold text-sm">Email</FormLabel>
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
            name="roofType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-sm">Type of roof</FormLabel>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ROOF_TYPES.map((o) => {
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
          <FormField
            control={form.control}
            name="problem"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-sm">Describe the problem</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="e.g. Water stain in the ceiling above the master bedroom after last week's storm."
                    rows={3}
                    className="bg-background text-sm resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="consent"
            render={({ field }) => (
              <FormItem>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-border accent-primary cursor-pointer"
                  />
                  <span className="text-[12px] text-foreground/80 leading-snug">
                    I agree to be contacted by {SITE.brand} by phone, text, or email
                    about my roof repair request. Message and data rates may apply.
                  </span>
                </label>
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
                Schedule My Inspection
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>

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
