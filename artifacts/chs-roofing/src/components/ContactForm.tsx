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
  Building2,
  HardHat,
  Paintbrush,
  Droplets,
} from "lucide-react";
import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";

const SERVICE_OPTIONS = [
  { value: "installation", icon: Home, key: "installation" },
  { value: "new-construction", icon: HardHat, key: "newConstruction" },
  { value: "commercial-roofing", icon: Building2, key: "commercialRoofing" },
  { value: "repair", icon: Wrench, key: "repair" },
  { value: "maintenance", icon: ShieldCheck, key: "maintenance" },
  { value: "storm-damage", icon: CloudLightning, key: "stormDamage" },
  { value: "specialty-roofing", icon: Sparkles, key: "specialty" },
  { value: "roof-coating", icon: Paintbrush, key: "roofCoating" },
  { value: "gutters", icon: Droplets, key: "gutters" },
] as const;

const URGENCY_KEYS = ["emergency", "soon", "planning"] as const;

export default function ContactForm() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [photoName, setPhotoName] = useState<string | null>(null);

  const formSchema = useMemo(
    () =>
      z.object({
        serviceType: z.string().min(1, t("contactForm.errors.service")),
        address: z.string().min(3, t("contactForm.errors.address")),
        zip: z
          .string()
          .min(5, t("contactForm.errors.zip5"))
          .max(10, t("contactForm.errors.zipLong"))
          .regex(/^\d{5}(-\d{4})?$/, t("contactForm.errors.zipFormat")),
        roofAge: z.string().min(1, t("contactForm.errors.ageRange")),
        urgency: z.string().min(1, t("contactForm.errors.urgency")),
        name: z.string().min(2, t("contactForm.errors.name")),
        phone: z.string().min(10, t("contactForm.errors.phone")),
        email: z.string().email(t("contactForm.errors.email")),
        message: z.string().optional(),
      }),
    [t],
  );

  type FormValues = z.infer<typeof formSchema>;

  const STEPS: { id: number; titleKey: string; fields: (keyof FormValues)[] }[] = [
    { id: 1, titleKey: "contactForm.stepTitles.0", fields: ["serviceType"] },
    { id: 2, titleKey: "contactForm.stepTitles.1", fields: ["address", "zip", "roofAge", "urgency"] },
    { id: 3, titleKey: "contactForm.stepTitles.2", fields: ["name", "phone", "email"] },
    { id: 4, titleKey: "contactForm.stepTitles.3", fields: [] },
  ];

  const ROOF_AGE_KEYS = [0, 1, 2, 3, 4];

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
      title: t("contactForm.success.toastTitle"),
      description: t("contactForm.success.toastDesc"),
    });
    form.reset();
    setPhotoName(null);
    setStep(1);
  };

  if (isSuccess) {
    return (
      <div className="bg-card border border-border/60 p-10 rounded-3xl text-center flex flex-col items-center justify-center space-y-4 shadow-xl">
        <motion.div
          initial={reducedMotion ? false : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 240, damping: 18 }
          }
          className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center"
        >
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </motion.div>
        <div>
          <h3 className="text-2xl font-bold text-foreground tracking-tight">{t("contactForm.success.title")}</h3>
          <p className="text-muted-foreground mt-2 leading-relaxed">
            {t("contactForm.success.body")}
          </p>
        </div>
        <Button variant="outline" onClick={() => setIsSuccess(false)} className="mt-4">
          {t("contactForm.buttons.submitAnother")}
        </Button>
      </div>
    );
  }

  const progressPct = (step / STEPS.length) * 100;
  const currentTitle = t(STEPS[step - 1].titleKey);
  const values = form.watch();

  return (
    <div className="bg-card p-6 md:p-8 rounded-3xl shadow-xl border border-border/60 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary to-primary/60" />

      {/* Header + Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-primary">
              {t("contactForm.step", { current: step, total: STEPS.length })}
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
            transition={
              reducedMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 140, damping: 22 }
            }
          />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              initial={reducedMotion ? false : { opacity: 0, x: direction * 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -direction * 28 }}
              transition={{ duration: reducedMotion ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              {step === 1 && (
                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <div role="radiogroup" aria-label={t("contactForm.stepTitles.0")} className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {SERVICE_OPTIONS.map((opt) => {
                          const selected = field.value === opt.value;
                          const label = t(`contactForm.service.${opt.key}.label`);
                          const hint = t(`contactForm.service.${opt.key}.hint`);
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
                                  {label}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                                  {hint}
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
                          <MapPin className="w-3.5 h-3.5 text-primary" /> {t("contactForm.fields.address")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("contactForm.fields.addressPlaceholder")}
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
                          <FormLabel className="font-semibold text-sm">{t("contactForm.fields.zip")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("contactForm.fields.zipPlaceholder")}
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
                            <CalendarDays className="w-3.5 h-3.5 text-primary" /> {t("contactForm.fields.roofAge")}
                          </FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              data-testid="select-roof-age"
                            >
                              <option value="">{t("contactForm.fields.selectAge")}</option>
                              {ROOF_AGE_KEYS.map((idx) => {
                                const label = t(`contactForm.roofAgeOptions.${idx}`);
                                return (
                                  <option key={idx} value={label}>{label}</option>
                                );
                              })}
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
                          <Clock3 className="w-3.5 h-3.5 text-primary" /> {t("contactForm.fields.urgency")}
                        </FormLabel>
                        <div role="radiogroup" aria-label={t("contactForm.fields.urgency")} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {URGENCY_KEYS.map((urgKey) => {
                            const selected = field.value === urgKey;
                            const label = t(`contactForm.urgencyOptions.${urgKey}.label`);
                            const hint = t(`contactForm.urgencyOptions.${urgKey}.hint`);
                            return (
                              <button
                                type="button"
                                key={urgKey}
                                role="radio"
                                aria-checked={selected}
                                onClick={() => field.onChange(urgKey)}
                                className={`text-left rounded-xl border p-3 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                                  selected
                                    ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                                    : "border-border/60 bg-background hover:border-primary/40"
                                }`}
                                data-testid={`urgency-${urgKey}`}
                              >
                                <p className="font-semibold text-sm tracking-tight text-foreground">{label}</p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">{hint}</p>
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
                      <span>{photoName ? t("contactForm.fields.photoAttached") : t("contactForm.fields.photo")}</span>
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
                            <User className="w-3.5 h-3.5 text-primary" /> {t("contactForm.fields.fullName")}
                          </FormLabel>
                          <FormControl>
                            <Input placeholder={t("contactForm.fields.namePlaceholder")} autoComplete="name" {...field} className="bg-background" data-testid="input-name" />
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
                            <Phone className="w-3.5 h-3.5 text-primary" /> {t("contactForm.fields.phone")}
                          </FormLabel>
                          <FormControl>
                            <Input placeholder={t("contactForm.fields.phonePlaceholder")} type="tel" autoComplete="tel" {...field} className="bg-background" data-testid="input-phone" />
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
                          <Mail className="w-3.5 h-3.5 text-primary" /> {t("contactForm.fields.email")}
                        </FormLabel>
                        <FormControl>
                          <Input placeholder={t("contactForm.fields.emailPlaceholder")} type="email" autoComplete="email" {...field} className="bg-background" data-testid="input-email" />
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
                        <FormLabel className="font-semibold text-sm">{t("contactForm.fields.message")}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t("contactForm.fields.messagePlaceholder")}
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
                    {t("contactForm.review.intro")}
                  </p>
                  <ReviewRow
                    label={t("contactForm.review.service")}
                    editLabel={t("contactForm.review.service")}
                    value={
                      values.serviceType
                        ? t(
                            `contactForm.service.${
                              SERVICE_OPTIONS.find((o) => o.value === values.serviceType)?.key ?? "installation"
                            }.label`,
                          )
                        : ""
                    }
                    onEdit={() => jumpTo(1)}
                  />
                  <ReviewRow
                    label={t("contactForm.review.property")}
                    editLabel={t("contactForm.review.property")}
                    value={`${values.address}${values.address ? ", " : ""}${values.zip}`}
                    onEdit={() => jumpTo(2)}
                  />
                  <ReviewRow
                    label={t("contactForm.review.roof")}
                    editLabel={t("contactForm.review.roof")}
                    value={`${values.roofAge} · ${
                      values.urgency
                        ? t(`contactForm.urgencyOptions.${values.urgency}.label`)
                        : ""
                    }${photoName ? ` · 📎 ${photoName}` : ""}`}
                    onEdit={() => jumpTo(2)}
                  />
                  <ReviewRow
                    label={t("contactForm.review.contact")}
                    editLabel={t("contactForm.review.contact")}
                    value={`${values.name} · ${values.phone} · ${values.email}`}
                    onEdit={() => jumpTo(3)}
                  />
                  {values.message && (
                    <ReviewRow label={t("contactForm.review.notes")} editLabel={t("contactForm.review.notes")} value={values.message} onEdit={() => jumpTo(3)} />
                  )}
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-start gap-2 mt-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-foreground/80 leading-relaxed">
                      {t("contactForm.review.promise")}
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
                <ArrowLeft className="w-4 h-4 mr-1.5" /> {t("contactForm.buttons.back")}
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
                {step === STEPS.length - 1 ? t("contactForm.buttons.review") : t("contactForm.buttons.continue")} <ChevronRight className="w-4 h-4 ml-1.5" />
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
                  <span className="flex items-center gap-2">{t("contactForm.buttons.sending")}</span>
                ) : (
                  <span className="flex items-center gap-2">
                    {t("contactForm.buttons.send")} <Send className="w-4 h-4 ml-1" />
                  </span>
                )}
              </Button>
            )}
          </div>

          <p className="text-[11px] text-center text-muted-foreground mt-4">
            {t("contactForm.consent")}{" "}
            <a href="/privacy" className="underline hover:text-foreground">
              {t("contactForm.consentSee")}
            </a>{" "}
            {t("common.and")}{" "}
            <a href="/terms" className="underline hover:text-foreground">
              {t("contactForm.consentTerms")}
            </a>
            .
          </p>
        </form>
      </Form>
    </div>
  );
}

function ReviewRow({
  label,
  editLabel,
  value,
  onEdit,
}: {
  label: string;
  editLabel: string;
  value: string;
  onEdit: () => void;
}) {
  const { t } = useTranslation();
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
        aria-label={`${t("common.edit")} ${editLabel}`}
        data-testid={`review-edit-${editLabel.toLowerCase()}`}
      >
        <Pencil className="w-3 h-3" /> {t("common.edit")}
      </button>
    </div>
  );
}
