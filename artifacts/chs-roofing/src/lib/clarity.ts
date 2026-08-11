/**
 * Microsoft Clarity loader — reads the project ID from the
 * VITE_CLARITY_ID environment variable at build time. Add the ID
 * in Replit's Secrets (or Vercel env vars) and the script loads
 * automatically for every session that visits the site.
 *
 * We deliberately gate on the env var being present + non-placeholder
 * so no half-configured tracker hits Clarity's servers from local
 * dev or preview builds.
 *
 * Call installClarity() once from main.tsx — it is idempotent.
 */

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

let installed = false;

export function installClarity(): void {
  if (installed) return;
  if (typeof window === "undefined") return;

  const rawId = (import.meta.env.VITE_CLARITY_ID as string | undefined) ?? "";
  const id = rawId.trim();
  // Ignore obvious placeholder values so we don't pollute a real
  // Clarity project with test traffic from a mis-configured deploy.
  if (!id || /^(your|placeholder|xxxx|todo|change|replace)/i.test(id)) {
    return;
  }

  installed = true;

  // Standard Clarity snippet, inlined. Nothing custom, just wrapped
  // in TypeScript so it plays nicely with the rest of the bundle.
  (function (c: Window, l: Document, a: string, r: string, i: string) {
    const anyC = c as unknown as Record<string, unknown>;
    anyC[a] =
      anyC[a] ||
      function (...args: unknown[]) {
        (
          (anyC[a] as { q?: unknown[][] }).q =
            (anyC[a] as { q?: unknown[][] }).q || []
        ).push(args);
      };
    const t = l.createElement(r) as HTMLScriptElement;
    t.async = true;
    t.src = "https://www.clarity.ms/tag/" + i;
    const y = l.getElementsByTagName(r)[0];
    y?.parentNode?.insertBefore(t, y);
  })(window, document, "clarity", "script", id);
}
