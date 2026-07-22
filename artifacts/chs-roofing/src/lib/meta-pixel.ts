/**
 * Thin typed wrapper around the Meta Pixel (fbq) global.
 * The base pixel + PageView are fired from index.html on every hard load.
 * Use `trackLead()` after a successful form submission to fire the Lead event.
 */
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackLead(): void {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "Lead");
  }
}
