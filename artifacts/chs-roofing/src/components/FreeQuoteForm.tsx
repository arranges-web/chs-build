import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
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

/**
 * One-step, conversion-optimized quote form for paid-traffic landing
 * pages. Trimmed to the four fields advertisers actually need to act
 * on a lead: name, phone, ZIP, service. Email is collected (single
 * input) because it's still a high-value piece of contact info, but
 * we keep it optional so people can submit with just a phone — a
 * core conversion-rate trick on cold ad traffic.
 *
 * Hands off to /thank-you on success so we get a clean conversion
 * URL for Google Ads / Meta to fire on.
 */

const SERVICE_OPTIONS = [
  { value: "installation", label: "New roof" },
  { value: "repair", label: "Repair" },
  { value: "storm-damage", label: "Storm damage" },
  { value: "maintenance", label: "Maintenance" },
  { value: "roof-coating", label: "Coating" },
  { value: "gutters", label: "Gutters" },
] as const;

export default function FreeQuoteForm() {
  const [, navigate] = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, "Please add your name."),
        phone: z
          .string()
          .min(10, "Add a phone number we can call.")
          .regex(/^[0-9 ()+\-]+$/, "Use digits only."),
        zip: z
          .string()
          .min(5, "5-digit ZIP, please.")
          .max(10, "That ZIP looks too long.")
          .regex(/^\d{5}(-\d{4})?$/, "5-digit ZIP, please."),
        serviceType: z.string().min(1, "Pick what you need."),
        email: z
          .string()
          .email("That email doesn't look right.")
          .optional()
          .or(z.literal("")),
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
      zip: "",
      serviceType: "",
      email: "",
    },
  });

  // Pre-select a service from /free-quote?service=installation
  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    const s = p.get("service");
    const valid = SERVICE_OPTIONS.find((o) => o.value === s)?.value;
    if (valid && !form.getValues("serviceType")) {
      form.setValue("serviceType", valid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: Values) => {
    setSubmitting(true);
    setSubmitError(null);
    const ref =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("ref") ?? undefined
        : undefined;
    const res = await api.submitLead({
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      zip: data.zip,
      serviceType: data.serviceType,
      source: ref ? `free-quote:${ref}` : "free-quote",
    });
    setSubmitting(false);
    if (!res) {
      setSubmitError(
        "Couldn't submit — please try again or call us at " + SITE.phoneDisplay + ".",
      );
      return;
    }
    const params = new URLSearchParams();
    params.set("from", "free-quote");
    if (data.name) params.set("name", data.name);
    navigate(`/thank-you?${params.toString()}`);
  };

  return (
    <div className="bg-card p-6 md:p-7 rounded-3xl shadow-xl border border-border/60 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary to-primary/60" />

      <div className="mb-5">
        <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-primary mb-1.5">
          <Sparkles className="w-3.5 h-3.5 inline mr-1" />
          Free, no-pressure quote
        </p>
        <h3 className="font-display font-bold text-2xl tracking-tight text-foreground leading-tight">
          Get your quote in <span className="text-primary">60 seconds</span>.
        </h3>
        <p className="text-sm text-muted-foreground mt-1.5">
          We'll call or text you within 24 hours.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-sm">Full name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="name"
                    placeholder="First and last"
                    className="h-12 bg-background"
                  />
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
                  <FormLabel className="font-semibold text-sm">Phone</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="(239) 555-1234"
                      className="h-12 bg-background"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-sm">ZIP code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      inputMode="numeric"
                      autoComplete="postal-code"
                      maxLength={10}
                      placeholder="33904"
                      className="h-12 bg-background"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="serviceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-sm">What do you need?</FormLabel>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SERVICE_OPTIONS.map((o) => {
                    const selected = field.value === o.value;
                    return (
                      <button
                        type="button"
                        key={o.value}
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-sm flex items-center gap-1.5">
                  Email
                  <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-normal">
                    Optional
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="h-12 bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {submitError && (
            <p className="text-[12px] text-destructive">{submitError}</p>
          )}

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
                Get my free quote
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 pt-2 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Your info stays private
            </span>
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-primary" />
              Licensed FL {SITE.license}
            </span>
            <span className="inline-flex items-center gap-1">
              <Phone className="w-3 h-3 text-primary" />
              <a href={`tel:${SITE.phoneTel}`} className="hover:text-foreground hover:underline">
                Or call {SITE.phoneDisplay}
              </a>
            </span>
          </div>
        </form>
      </Form>
    </div>
  );
}
