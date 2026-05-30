import { useEffect } from "react";
import { useLocation } from "wouter";
import { api } from "@/lib/api";

const SESSION_KEY = "chs.session.id";
const ADMIN_BLOCKED = new Set(["/admin", "/portal"]);

function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "anon";
  }
}

/**
 * Fires one /track POST per real route change. We skip /admin and
 * /portal (they're not part of public-facing analytics) and we ignore
 * back-to-back duplicate paths so React StrictMode and re-renders
 * don't inflate the count.
 *
 * Intentionally fire-and-forget — server returns 204 on errors and we
 * never throw, so a broken tracker never blocks UX.
 */
export function usePageViewTracker(): void {
  const [location] = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const path = location || "/";
    // Don't track the admin or portal — those are private screens.
    if ([...ADMIN_BLOCKED].some((p) => path.startsWith(p))) return;
    // Coalesce duplicates within the same session of the page.
    const last = window.sessionStorage.getItem("chs.last.path");
    if (last === path) return;
    try {
      window.sessionStorage.setItem("chs.last.path", path);
    } catch {
      // ignore
    }
    const referrer = (() => {
      try {
        if (document.referrer && !document.referrer.includes(window.location.host)) {
          return document.referrer;
        }
      } catch {
        // ignore
      }
      return undefined;
    })();
    void api.trackPageView({ path, referrer, sessionId: getSessionId() });
  }, [location]);
}
