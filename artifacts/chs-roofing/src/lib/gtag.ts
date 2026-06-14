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

/**
 * Fire a page_view for a SPA route change. NO `send_to` filter — we
 * want it to land on BOTH configured tags (GA4 + Google Ads). This
 * matters for two reasons:
 *  • GA4 sees the virtual pageview (we set send_page_view:false so
 *    auto-fire is off; this is now the source of truth).
 *  • Google Ads URL-based conversions need a page_view event on
 *    every wouter navigation, otherwise Ads only "sees" the very
 *    first hard load and never registers the user reaching
 *    /thank-you via client-side routing.
 */
export function gaPageView(path: string, title?: string): void {
  fire("event", "page_view", {
    page_path: path,
    page_location:
      typeof window !== "undefined" ? window.location.href : undefined,
    page_title: title ?? (typeof document !== "undefined" ? document.title : undefined),
  });
}

/**
 * Fire a GA4 generate_lead key event. We deliberately do NOT also
 * fire a Google Ads `conversion` event here — the Ads account is
 * configured with a URL-based conversion that triggers when a visitor
 * reaches /thank-you, and the page_view above is what makes Ads see
 * that URL on SPA navigation. Firing both would double-count.
 *
 * Use this for GA4 reporting only (mark it as a key event in GA4 to
 * separate lead-submission sessions from regular traffic).
 */
export function gaLeadConversion(opts: { source?: string; value?: number } = {}): void {
  const { source = "form", value = 1 } = opts;
  fire("event", "generate_lead", {
    send_to: GA4_ID,
    currency: "USD",
    value,
    source,
  });
}
