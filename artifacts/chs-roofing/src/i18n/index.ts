import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./en.json";
import es from "./es.json";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", short: "EN" },
  { code: "es", label: "Español", short: "ES" },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

const syncHtmlLang = (lng: unknown) => {
  if (typeof document === "undefined") return;
  const code = typeof lng === "string" && lng.length > 0 ? lng.split("-")[0] : "en";
  try {
    document.documentElement.lang = code;
  } catch {
    // ignore — never crash the page over a lang attribute
  }
};

try {
  void i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        es: { translation: es },
      },
      lng: undefined, // let detector decide
      fallbackLng: "en",
      supportedLngs: SUPPORTED_LANGUAGES.map((l) => l.code),
      nonExplicitSupportedLngs: true,
      interpolation: {
        escapeValue: false, // React already escapes
      },
      detection: {
        order: ["localStorage", "navigator", "htmlTag"],
        lookupLocalStorage: "chs.lang",
        caches: ["localStorage"],
      },
      returnNull: false,
    })
    .then(() => syncHtmlLang(i18n.language))
    .catch(() => {
      // If init fails, fall back to English in-memory bundle so the
      // site still renders rather than crashing.
      syncHtmlLang("en");
    });

  i18n.on("languageChanged", syncHtmlLang);
} catch {
  // Synchronous init throw — extremely unlikely but keeps the page alive.
  syncHtmlLang("en");
}

export default i18n;
