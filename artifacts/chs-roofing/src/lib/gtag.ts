/**
 * Tiny typed wrapper around the global `gtag()` function injected by
 * googletagmanager.com/gtag/js. We use it for:
 *
 *  • Manual GA4 page_view events on SPA route changes — the gtag
 *    snippet auto-fires once at hard load but doesn't see wouter's
 *    client-side navigations, so usePageViewTracker calls
 *    `gaPageView(path)` on every navigation.
 *  • Conversion events on /thank-you (generate_lead) for both GA4
 *    and Google Ads.
 *
 * Every call is a no-op when window.gtag isn't defined (e.g. SSR,
 * ad-block, dev server before the script loads).
 */

declare global {
  interface Window {
    // gtag accepts (command, ...args) tuples. Loose-typing it as the
    // third-party docs do avoids fighting variadic generics for no win.
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const GA4_ID = "G-JZHD1SE7W4";
export const ADS_ID = "AW-17007714087";

function fire(...args: unknown[]): void {
  if (typeof window === "undefined") return;
  // Push to dataLayer directly so events queue safely even if the
  // gtag.js script hasn't finished loading yet.
  try {
    window.dataLayer ??= [];
    if (typeof window.gtag === "function") {
      window.gtag(...args);
    } else {
      window.dataLayer.push(args);
    }
  } catch {
    // Never let analytics break the app.
  }
}

/** Fire a GA4 page_view for a SPA route change. */
export function gaPageView(path: string, title?: string): void {
  fire("event", "page_view", {
    send_to: GA4_ID,
    page_path: path,
    page_location:
      typeof window !== "undefined" ? window.location.href : undefined,
    page_title: title ?? (typeof document !== "undefined" ? document.title : undefined),
  });
}

/**
 * Fire a generate_lead conversion. Sent to BOTH GA4 (so it shows up
 * as a key event) and Google Ads (so paid-traffic conversions get
 * attributed). Idempotent per route — wrap in a `useEffect` so it
 * fires once when /thank-you mounts.
 */
export function gaLeadConversion(opts: { source?: string; value?: number } = {}): void {
  const { source = "form", value = 1 } = opts;
  fire("event", "generate_lead", {
    send_to: GA4_ID,
    currency: "USD",
    value,
    source,
  });
  fire("event", "conversion", {
    send_to: ADS_ID,
    value,
    currency: "USD",
  });
}
