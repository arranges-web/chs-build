import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useToast } from "@/hooks/use-toast";
import {
  Send,
  CheckCircle2,
  Home,
  Wrench,
  ShieldCheck,
  CloudLightning,
  Sparkles,
  ArrowLeft,
  Camera,
  Clock3,
  CalendarDays,
  Mail,
  Phone,
  User,
  ChevronRight,
  MapPin,
  Pencil,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SERVICE_OPTIONS = [
  { value: "installation", label: "New Roof Install", icon: Home, hint: "Full residential or commercial roof" },
  { value: "repair", label: "Roof Repair", icon: Wrench, hint: "Leak, flashing, missing shingles" },
  { value: "maintenance", label: "Maintenance", icon: ShieldCheck, hint: "Inspection or annual care" },
  { value: "storm-damage", label: "Storm Damage", icon: CloudLightning, hint: "Hurricane / emergency response" },
  { value: "specialty-roofing", label: "Specialty Roofing", icon: Sparkles, hint: "Skylights, copper, custom flashing" },
] as const;

const URGENCY_OPTIONS = [
  { value: "emergency", label: "Emergency", hint: "Active leak / storm damage" },
  { value: "soon", label: "Within 30 days", hint: "Planning a project soon" },
  { value: "planning", label: "Just exploring", hint: "Researching options" },
] as const;

const ROOF_AGE = ["Under 5 years", "5–10 years", "10–20 years", "20+ years", "Not sure"] as const;

const formSchema = z.object({
  serviceType: z.string().min(1, "Please pick a service"),
  address: z.string().min(3, "Enter your street address"),
  zip: z
    .string()
    .min(5, "Enter a 5-digit ZIP")
    .max(10, "ZIP looks too long")
    .regex(/^\d{5}(-\d{4})?$/, "Use a US ZIP like 33904"),
  roofAge: z.string().min(1, "Pick an age range"),
  urgency: z.string().min(1, "Pick an urgency"),
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const STEPS: { id: number; title: string; fields: (keyof FormValues)[] }[] = [
  { id: 1, title: "What do you need?", fields: ["serviceType"] },
  { id: 2, title: "Tell us about your property", fields: ["address", "zip", "roofAge", "urgency"] },
  { id: 3, title: "How can we reach you?", fields: ["name", "phone", "email"] },
  { id: 4, title: "Quick review", fields: [] },
];

export default function ContactForm() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [photoName, setPhotoName] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      serviceType: "",
      address: "",
      zip: "",
      roofAge: "",
      urgency: "",
      name: "",
      phone: "",
      email: "",
      message: "",
    },
  });

  const goNext = async () => {
    const fields = STEPS[step - 1].fields;
    if (fields.length) {
      const ok = await form.trigger(fields, { shouldFocus: true });
      if (!ok) return;
    }
    setDirection(1);
    setStep((s) => Math.min(STEPS.length, s + 1));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(1, s - 1));
  };

  const jumpTo = (target: number) => {
    setDirection(target < step ? -1 : 1);
    setStep(target);
  };

  const onSubmit = async (_data: FormValues) => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    toast({
      title: "Request Received",
      description: "We'll be in touch shortly to provide your free quote.",
    });
    form.reset();
    setPhotoName(null);
    setStep(1);
  };

  if (isSuccess) {
    return (
      <div className="bg-card border border-border/60 p-10 rounded-3xl text-center flex flex-col items-center justify-center space-y-4 shadow-xl">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 18 }}
          className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center"
        >
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </motion.div>
        <div>
          <h3 className="text-2xl font-bold text-foreground tracking-tight">Request Received!</h3>
          <p className="text-muted-foreground mt-2 leading-relaxed">
            Thank you for choosing CHS Roofing. Our team will contact you shortly to schedule your free estimate.
          </p>
        </div>
        <Button variant="outline" onClick={() => setIsSuccess(false)} className="mt-4">
          Submit Another Request
        </Button>
      </div>
    );
  }

  const progressPct = (step / STEPS.length) * 100;
  const currentTitle = STEPS[step - 1].title;
  const values = form.watch();

  return (
    <div className="bg-card p-6 md:p-8 rounded-3xl shadow-xl border border-border/60 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary to-primary/60" />

      {/* Header + Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-primary">
              Free Quote · Step {step} of {STEPS.length}
            </p>
            <h3 className="text-xl md:text-2xl font-bold font-display tracking-tight text-foreground mt-1">
              {currentTitle}
            </h3>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            {STEPS.map((s) => (
              <span
                key={s.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s.id === step ? "w-6 bg-primary" : s.id < step ? "w-3 bg-primary/60" : "w-3 bg-border"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={false}
            animate={{ width: `${progressPct}%` }}
            transition={{ type: "spring", stiffness: 140, damping: 22 }}
          />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              initial={{ opacity: 0, x: direction * 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 28 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              {step === 1 && (
                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <div role="radiogroup" aria-label="Service needed" className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {SERVICE_OPTIONS.map((opt) => {
                          const selected = field.value === opt.value;
                          return (
                            <button
                              type="button"
                              key={opt.value}
                              role="radio"
                              aria-checked={selected}
                              onClick={() => field.onChange(opt.value)}
                              className={`group text-left rounded-2xl border p-3.5 transition-all duration-200 flex items-start gap-3 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                                selected
                                  ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary/30"
                                  : "border-border/60 bg-background hover:border-primary/40"
                              }`}
                              data-testid={`service-option-${opt.value}`}
                            >
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                  selected ? "bg-primary text-white" : "bg-primary/10 text-primary"
                                }`}
                              >
                                <opt.icon className="w-4.5 h-4.5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-sm text-foreground tracking-tight leading-tight">
                                  {opt.label}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                                  {opt.hint}
                                </p>
                              </div>
                              {selected && <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-1" />}
                            </button>
                          );
                        })}
                      </div>
                      <FormMessage className="mt-2" />
                    </FormItem>
                  )}
                />
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-sm flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-primary" /> Property address
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="1234 Sunset Dr"
                            autoComplete="street-address"
                            {...field}
                            className="bg-background"
                            data-testid="input-address"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="zip"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-sm">ZIP code</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. 33904"
                              inputMode="numeric"
                              autoComplete="postal-code"
                              maxLength={10}
                              {...field}
                              className="bg-background"
                              data-testid="input-zip"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="roofAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-sm flex items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5 text-primary" /> Roof age
                          </FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              data-testid="select-roof-age"
                            >
                              <option value="">Select age</option>
                              {ROOF_AGE.map((a) => (
                                <option key={a} value={a}>{a}</option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="urgency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-sm flex items-center gap-1.5">
                          <Clock3 className="w-3.5 h-3.5 text-primary" /> How soon?
                        </FormLabel>
                        <div role="radiogroup" aria-label="Project urgency" className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {URGENCY_OPTIONS.map((opt) => {
                            const selected = field.value === opt.value;
                            return (
                              <button
                                type="button"
                                key={opt.value}
                                role="radio"
                                aria-checked={selected}
                                onClick={() => field.onChange(opt.value)}
                                className={`text-left rounded-xl border p-3 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                                  selected
                                    ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                                    : "border-border/60 bg-background hover:border-primary/40"
                                }`}
                                data-testid={`urgency-${opt.value}`}
                              >
                                <p className="font-semibold text-sm tracking-tight text-foreground">{opt.label}</p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">{opt.hint}</p>
                              </button>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-muted/40 border border-dashed border-border rounded-xl p-3 flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground cursor-pointer hover:text-primary transition-colors">
                      <Camera className="w-4 h-4 text-primary" />
                      <span>{photoName ? "Photo attached" : "Attach a roof photo (optional)"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setPhotoName(e.target.files?.[0]?.name ?? null)}
                        data-testid="input-photo"
                      />
                    </label>
                    {photoName && (
                      <span className="text-xs text-muted-foreground truncate">{photoName}</span>
                    )}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-sm flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-primary" /> Full name
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Jane Doe" autoComplete="name" {...field} className="bg-background" data-testid="input-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-sm flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-primary" /> Phone
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="(239) 555-0199" type="tel" autoComplete="tel" {...field} className="bg-background" data-testid="input-phone" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-sm flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-primary" /> Email
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="jane@example.com" type="email" autoComplete="email" {...field} className="bg-background" data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-sm">Anything else? (optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us anything that helps us prep your quote…"
                            className="resize-none min-h-[88px] bg-background"
                            {...field}
                            data-testid="input-message"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 4 && (
                <div className="space-y-3" data-testid="review-summary">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Quick check — make sure everything looks right, then send it our way. We'll respond within 24 hours.
                  </p>
                  <ReviewRow
                    label="Service"
                    value={SERVICE_OPTIONS.find((o) => o.value === values.serviceType)?.label ?? values.serviceType}
                    onEdit={() => jumpTo(1)}
                  />
                  <ReviewRow
                    label="Property"
                    value={`${values.address}${values.address ? ", " : ""}${values.zip}`}
                    onEdit={() => jumpTo(2)}
                  />
                  <ReviewRow
                    label="Roof"
                    value={`${values.roofAge} · ${URGENCY_OPTIONS.find((o) => o.value === values.urgency)?.label ?? ""}${photoName ? ` · 📎 ${photoName}` : ""}`}
                    onEdit={() => jumpTo(2)}
                  />
                  <ReviewRow
                    label="Contact"
                    value={`${values.name} · ${values.phone} · ${values.email}`}
                    onEdit={() => jumpTo(3)}
                  />
                  {values.message && (
                    <ReviewRow label="Notes" value={values.message} onEdit={() => jumpTo(3)} />
                  )}
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-start gap-2 mt-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-foreground/80 leading-relaxed">
                      We'll reach out within 24 hours with a transparent, no-pressure quote. Your info is never sold or shared.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="mt-6 flex items-center gap-3">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                className="h-12 px-4"
                data-testid="button-back"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
              </Button>
            )}
            {step < STEPS.length ? (
              <Button
                type="button"
                onClick={goNext}
                size="lg"
                className="flex-1 h-12 text-base font-semibold tracking-tight shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all"
                data-testid="button-next"
              >
                {step === STEPS.length - 1 ? "Review" : "Continue"} <ChevronRight className="w-4 h-4 ml-1.5" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="flex-1 h-12 text-base font-semibold tracking-tight shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all"
                data-testid="button-submit"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">Sending…</span>
                ) : (
                  <span className="flex items-center gap-2">
                    Send My Free Quote Request <Send className="w-4 h-4 ml-1" />
                  </span>
                )}
              </Button>
            )}
          </div>

          <p className="text-[11px] text-center text-muted-foreground mt-4">
            By submitting, you agree to be contacted by CHS Roofing about your inquiry.
          </p>
        </form>
      </Form>
    </div>
  );
}

function ReviewRow({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 bg-muted/30 border border-border/60 rounded-xl p-3">
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground">
          {label}
        </p>
        <p className="text-sm font-semibold text-foreground mt-0.5 break-words">{value || "—"}</p>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 shrink-0 mt-1"
        data-testid={`review-edit-${label.toLowerCase()}`}
      >
        <Pencil className="w-3 h-3" /> Edit
      </button>
    </div>
  );
}
