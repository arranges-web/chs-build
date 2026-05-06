import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { SUPPORTED_LANGUAGES, type LanguageCode } from "@/i18n";

type Props = {
  variant?: "light" | "dark" | "ghost";
  className?: string;
};

export default function LanguageSwitcher({ variant = "ghost", className = "" }: Props) {
  const { i18n, t } = useTranslation();
  const current: LanguageCode = (i18n.language?.split("-")[0] as LanguageCode) ?? "en";

  const setLang = (code: LanguageCode) => {
    if (code !== current) void i18n.changeLanguage(code);
  };

  const containerBase =
    variant === "dark"
      ? "bg-white/5 border border-white/10 text-white/90"
      : variant === "light"
      ? "bg-card border border-border/60 text-foreground"
      : "bg-foreground/[0.04] border border-transparent text-foreground/80";

  return (
    <div
      role="group"
      aria-label={t("languageSwitcher.label")}
      className={`inline-flex items-center gap-1 rounded-full p-1 ${containerBase} ${className}`}
    >
      <Globe className="w-3.5 h-3.5 opacity-70 ml-1.5" aria-hidden="true" />
      {SUPPORTED_LANGUAGES.map((lng) => {
        const isActive = lng.code === current;
        return (
          <button
            key={lng.code}
            type="button"
            onClick={() => setLang(lng.code)}
            aria-pressed={isActive}
            aria-label={lng.label}
            className={`px-2.5 py-1 text-[11px] font-semibold tracking-wider rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              isActive
                ? variant === "dark"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-primary text-white shadow-sm"
                : "hover:bg-foreground/[0.05]"
            }`}
          >
            {lng.short}
          </button>
        );
      })}
    </div>
  );
}
