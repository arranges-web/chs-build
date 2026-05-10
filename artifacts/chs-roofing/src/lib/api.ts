/**
 * Frontend API client. The base URL is read from VITE_API_BASE_URL
 * at build time. When unset (local dev) we default to "/api" which
 * is what Replit's reverse proxy is configured to forward to the
 * api-server.
 */
const BASE = (import.meta.env.VITE_API_BASE_URL ?? "/api").replace(/\/$/, "");

async function postJson<T extends object>(path: string, body: unknown): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function getJson<T extends object>(
  path: string,
  init?: RequestInit,
): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, init);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export type LeadPayload = {
  serviceType?: string | null;
  plan?: string | null;
  address?: string | null;
  zip?: string | null;
  roofAge?: string | null;
  urgency?: string | null;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  message?: string | null;
  source?: string | null;
};

export type EstimatePayload = {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  material?: string | null;
  colorOption?: "yes" | "no" | null;
  pitch?: string | null;
  complexity?: string | null;
  footprintSf?: string | null;
  squares?: string | null;
  lowEstimate?: string | null;
  highEstimate?: string | null;
  midEstimate?: string | null;
  source?: string | null;
};

export const api = {
  submitLead: (payload: LeadPayload) =>
    postJson<{ ok: true; id: number }>("/leads", payload),
  submitEstimate: (payload: EstimatePayload) =>
    postJson<{ ok: true; id: number }>("/estimates", payload),

  // Admin
  listLeads: (key: string) =>
    getJson<{ rows: Record<string, unknown>[] }>("/admin/leads", {
      headers: { "x-admin-key": key },
    }),
  listEstimates: (key: string) =>
    getJson<{ rows: Record<string, unknown>[] }>("/admin/estimates", {
      headers: { "x-admin-key": key },
    }),
};
