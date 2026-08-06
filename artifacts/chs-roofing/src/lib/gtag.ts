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
    // Meta Pixel — loaded in index.html. Same variadic shape.
    fbq?: (...args: unknown[]) => void;
  }
}

export const GA4_ID = "G-JZHD1SE7W4";
export const ADS_ID = "AW-17007714087";
export const META_PIXEL_ID = "1394670238570653";

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

/**
 * Fire an arbitrary GA4 event by name — used for the campaign-
 * specific milestones called out in the /free-roof-inspection spec
 * (view_free_inspection_page, inspection_form_start,
 * inspection_form_submit, click_to_call, click_to_text).
 */
export function gaEvent(name: string, params?: Record<string, unknown>): void {
  fire("event", name, { send_to: GA4_ID, ...(params ?? {}) });
}

/**
 * Fire a Meta Pixel event. Wraps window.fbq with the same no-op
 * fallback the gtag helpers use, so ad-block or slow loads never
 * break the page.
 */
export function metaEvent(
  name: string,
  params?: Record<string, unknown>,
): void {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.fbq === "function") {
      if (params) {
        window.fbq("track", name, params);
      } else {
        window.fbq("track", name);
      }
    }
  } catch {
    // Never let analytics break the app.
  }
}

/**
 * Post-conversion firehose for the inspection-request thank-you
 * page. Sends the Meta Pixel Lead event (the spec says fire it
 * only when the form is *successfully* accepted, i.e. on the
 * dedicated thank-you page mounting), plus the GA4 event.
 */
export function fireInspectionLead(): void {
  metaEvent("Lead", {
    content_name: "Free 21-Point Roof Inspection",
    content_category: "Roof Inspection",
  });
  gaEvent("inspection_form_submit", {
    content_name: "Free 21-Point Roof Inspection",
  });
  // Reuse the shared GA4 generate_lead so this conversion also
  // shows up in the same GA4 report as the /free-quote and
  // /contact leads.
  gaLeadConversion({ source: "free-roof-inspection" });
}
