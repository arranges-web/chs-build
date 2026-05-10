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

async function patchJson<T extends object>(
  path: string,
  body: unknown,
  init?: RequestInit,
): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      ...init,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function deleteJson(path: string, init?: RequestInit): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}${path}`, { ...init, method: "DELETE" });
    return res.ok;
  } catch {
    return false;
  }
}

async function postJsonAuthed<T extends object>(
  path: string,
  body: unknown,
  key: string,
): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": key },
      body: JSON.stringify(body),
    });
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

// ─── Customer portal types ─────────────────────────────────────
export type Customer = {
  id: number;
  accountNumber: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
};

export type JobUpdate = {
  id: number;
  jobId: number;
  body: string;
  authorName: string | null;
  createdAt: string;
};

export type JobPhoto = {
  id: number;
  jobId: number;
  url: string;
  caption: string | null;
  createdAt: string;
};

export type Job = {
  id: number;
  customerId: number;
  title: string;
  serviceType: string | null;
  status: string;
  progress: number;
  startDate: string | null;
  estimatedCompletion: string | null;
  createdAt: string;
  updates: JobUpdate[];
  photos: JobPhoto[];
};

export type PortalLookupResponse = {
  customer: Customer;
  jobs: Job[];
};

export const api = {
  submitLead: (payload: LeadPayload) =>
    postJson<{ ok: true; id: number }>("/leads", payload),
  submitEstimate: (payload: EstimatePayload) =>
    postJson<{ ok: true; id: number }>("/estimates", payload),

  // Public portal
  portalLookup: (identifier: string) =>
    postJson<PortalLookupResponse>("/portal/lookup", { identifier }),

  // Admin (key required)
  listLeads: (key: string) =>
    getJson<{ rows: Record<string, unknown>[] }>("/admin/leads", {
      headers: { "x-admin-key": key },
    }),
  listEstimates: (key: string) =>
    getJson<{ rows: Record<string, unknown>[] }>("/admin/estimates", {
      headers: { "x-admin-key": key },
    }),

  // Admin · CRM
  listCustomers: (key: string) =>
    getJson<{ rows: Customer[] }>("/admin/customers", {
      headers: { "x-admin-key": key },
    }),
  getCustomer: (id: number, key: string) =>
    getJson<{ customer: Customer; jobs: Job[] }>(`/admin/customers/${id}`, {
      headers: { "x-admin-key": key },
    }),
  createCustomer: (
    payload: { name: string; email?: string; phone?: string; address?: string; notes?: string },
    key: string,
  ) => postJsonAuthed<{ row: Customer }>("/admin/customers", payload, key),
  updateCustomer: (
    id: number,
    payload: Partial<Customer> & { notes?: string },
    key: string,
  ) =>
    patchJson<{ row: Customer }>(`/admin/customers/${id}`, payload, {
      headers: { "x-admin-key": key },
    }),

  createJob: (
    payload: {
      customerId: number;
      title: string;
      serviceType?: string;
      status?: string;
      progress?: number;
      startDate?: string;
      estimatedCompletion?: string;
    },
    key: string,
  ) => postJsonAuthed<{ row: Job }>("/admin/jobs", payload, key),
  updateJob: (id: number, payload: Partial<Job>, key: string) =>
    patchJson<{ row: Job }>(`/admin/jobs/${id}`, payload, {
      headers: { "x-admin-key": key },
    }),
  deleteJob: (id: number, key: string) =>
    deleteJson(`/admin/jobs/${id}`, { headers: { "x-admin-key": key } }),

  addJobUpdate: (
    payload: { jobId: number; body: string; authorName?: string },
    key: string,
  ) => postJsonAuthed<{ row: JobUpdate }>("/admin/job-updates", payload, key),
  deleteJobUpdate: (id: number, key: string) =>
    deleteJson(`/admin/job-updates/${id}`, { headers: { "x-admin-key": key } }),

  addJobPhoto: (
    payload: { jobId: number; url: string; caption?: string },
    key: string,
  ) => postJsonAuthed<{ row: JobPhoto }>("/admin/job-photos", payload, key),
  deleteJobPhoto: (id: number, key: string) =>
    deleteJson(`/admin/job-photos/${id}`, { headers: { "x-admin-key": key } }),
};
