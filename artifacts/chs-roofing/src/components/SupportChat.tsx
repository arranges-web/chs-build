import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "wouter";
import { SITE, SERVICES } from "@/lib/site-config";

type Step = "intro" | "name" | "phone" | "email" | "service" | "connect";

const STORAGE_KEY = "chs.support.lead.v1";

type Lead = {
  name?: string;
  phone?: string;
  email?: string;
  service?: string;
};

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isValidPhone = (v: string) => v.replace(/\D/g, "").length >= 10;

export default function SupportChat() {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("intro");
  const [lead, setLead] = useState<Lead>({});
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Lead;
        setLead(parsed);
        if (parsed.email) setStep("connect");
        else if (parsed.phone) setStep("email");
        else if (parsed.name) setStep("phone");
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(lead));
    } catch {
      // ignore
    }
  }, [lead]);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 220);
    return () => window.clearTimeout(id);
  }, [open, step]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const messages = useMemo(() => buildTranscript(step, lead, t), [step, lead, t]);

  const advance = () => {
    setError(null);
    const v = draft.trim();
    if (step === "intro") {
      setStep("name");
      return;
    }
    if (step === "name") {
      if (v.length < 2) return setError(t("supportChat.errors.name"));
      setLead((l) => ({ ...l, name: v }));
      setDraft("");
      setStep("phone");
      return;
    }
    if (step === "phone") {
      if (!isValidPhone(v)) return setError(t("supportChat.errors.phone"));
      setLead((l) => ({ ...l, phone: v }));
      setDraft("");
      setStep("email");
      return;
    }
    if (step === "email") {
      if (!isValidEmail(v)) return setError(t("supportChat.errors.email"));
      setLead((l) => ({ ...l, email: v }));
      setDraft("");
      setStep("service");
      return;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      advance();
    }
  };

  const pickService = (slug: string, title: string) => {
    setLead((l) => ({ ...l, service: title }));
    setStep("connect");
    void slug;
  };

  const reset = () => {
    setLead({});
    setDraft("");
    setError(null);
    setStep("intro");
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const placeholder = (() => {
    switch (step) {
      case "name":
        return t("supportChat.placeholders.name");
      case "phone":
        return t("supportChat.placeholders.phone");
      case "email":
        return t("supportChat.placeholders.email");
      default:
        return "";
    }
  })();

  const inputType = step === "phone" ? "tel" : step === "email" ? "email" : "text";

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t("supportChat.launcherClose") : t("supportChat.launcherOpen")}
        aria-expanded={open}
        className="fixed z-[60] right-4 md:right-6 bottom-24 md:bottom-6 h-14 w-14 md:h-[60px] md:w-[60px] rounded-full bg-primary text-white shadow-xl shadow-primary/40 flex items-center justify-center transition-all hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        initial={false}
        animate={{ rotate: open ? 90 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[hsl(var(--accent-gold))] border-2 border-background animate-pulse" />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label={t("supportChat.headerTitle")}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-[60] right-4 md:right-6 bottom-44 md:bottom-24 w-[calc(100vw-2rem)] sm:w-[380px] max-h-[min(560px,calc(100vh-9rem))] bg-card border border-border/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="bg-secondary text-white px-5 py-4 flex items-center gap-3 border-b border-white/5">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-md shadow-primary/40">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold tracking-tight text-base leading-tight">
                  {t("supportChat.headerTitle")}
                </p>
                <p className="text-[11px] text-white/70 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  {t("supportChat.headerStatus")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("supportChat.launcherClose")}
                className="text-white/70 hover:text-white p-1.5 rounded-md hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-muted/30">
              {messages.map((m, i) => (
                <ChatBubble key={i} from={m.from} reducedMotion={!!reducedMotion}>
                  {m.body}
                </ChatBubble>
              ))}
            </div>

            <div className="border-t border-border/60 bg-card p-3">
              {error && (
                <p role="alert" className="text-[11px] text-destructive mb-2 px-1">
                  {error}
                </p>
              )}

              {step === "intro" && (
                <button
                  type="button"
                  onClick={advance}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white px-4 py-3 rounded-xl font-semibold text-sm tracking-tight shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all"
                >
                  {t("supportChat.getStarted")}
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {(step === "name" || step === "phone" || step === "email") && (
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={onKeyDown}
                    type={inputType}
                    autoComplete={
                      step === "name" ? "given-name" : step === "phone" ? "tel" : "email"
                    }
                    inputMode={step === "phone" ? "tel" : step === "email" ? "email" : "text"}
                    placeholder={placeholder}
                    className="flex-1 h-11 px-3.5 text-sm rounded-xl border border-border/60 bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label={placeholder}
                  />
                  <button
                    type="button"
                    onClick={advance}
                    aria-label={t("supportChat.send")}
                    className="h-11 w-11 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/30 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              )}

              {step === "service" && (
                <div className="grid grid-cols-1 gap-1.5 max-h-44 overflow-y-auto -mx-1 px-1">
                  {SERVICES.map((s) => {
                    const label = t(`services.${s.slug}.title`, { defaultValue: s.title });
                    return (
                      <button
                        key={s.slug}
                        type="button"
                        onClick={() => pickService(s.slug, label)}
                        className="text-left text-sm font-medium px-3.5 py-2.5 rounded-xl border border-border/60 bg-background hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-colors"
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}

              {step === "connect" && (
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2 bg-primary/5 border border-primary/20 rounded-xl p-3">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-[12px] text-foreground/80 leading-relaxed">
                      {t("supportChat.thanks", { name: lead.name ? `, ${lead.name}` : "" })}
                    </p>
                  </div>
                  <a
                    href={`tel:${SITE.phoneTel}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white px-4 py-3 rounded-xl font-semibold text-sm tracking-tight shadow-md shadow-primary/30 hover:-translate-y-0.5 transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    {t("supportChat.callNow", { phone: SITE.phoneDisplay })}
                  </a>
                  <Link
                    href="/contact"
                    onClick={() => setOpen(false)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-card border border-border/60 text-foreground px-4 py-3 rounded-xl font-semibold text-sm tracking-tight hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    {t("supportChat.continueForm")}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={reset}
                    className="w-full text-[11px] text-muted-foreground hover:text-foreground py-1.5"
                  >
                    {t("supportChat.startOver")}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ChatBubble({
  from,
  children,
  reducedMotion,
}: {
  from: "agent" | "user";
  children: React.ReactNode;
  reducedMotion: boolean;
}) {
  const isAgent = from === "agent";
  return (
    <motion.div
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isAgent ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`max-w-[85%] text-sm leading-relaxed px-3.5 py-2.5 rounded-2xl ${
          isAgent
            ? "bg-card border border-border/60 text-foreground rounded-tl-md"
            : "bg-primary text-white rounded-tr-md shadow-sm shadow-primary/30"
        }`}
      >
        {children}
      </div>
    </motion.div>
  );
}

function buildTranscript(
  step: Step,
  lead: Lead,
  t: (key: string, opts?: Record<string, unknown>) => string,
) {
  const out: { from: "agent" | "user"; body: React.ReactNode }[] = [];

  out.push({ from: "agent", body: t("supportChat.intro") });

  if (step === "intro") return out;

  out.push({
    from: "agent",
    body: <Trans i18nKey="supportChat.askName" components={{ strong: <strong /> }} />,
  });
  if (lead.name) out.push({ from: "user", body: lead.name });
  if (step === "name") return out;

  out.push({
    from: "agent",
    body: (
      <Trans
        i18nKey="supportChat.askPhone"
        values={{ name: lead.name ? `, ${lead.name}` : "" }}
        components={{ strong: <strong /> }}
      />
    ),
  });
  if (lead.phone) out.push({ from: "user", body: lead.phone });
  if (step === "phone") return out;

  out.push({
    from: "agent",
    body: <Trans i18nKey="supportChat.askEmail" components={{ strong: <strong /> }} />,
  });
  if (lead.email) out.push({ from: "user", body: lead.email });
  if (step === "email") return out;

  out.push({
    from: "agent",
    body: <Trans i18nKey="supportChat.askService" components={{ strong: <strong /> }} />,
  });
  if (lead.service) out.push({ from: "user", body: lead.service });
  if (step === "service") return out;

  out.push({ from: "agent", body: t("supportChat.ready") });
  return out;
}
