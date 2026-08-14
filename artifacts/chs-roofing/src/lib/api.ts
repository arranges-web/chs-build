/**
 * Frontend API client. The base URL is read from VITE_API_BASE_URL
 * at build time. When unset (local dev) we default to "/api" which
 * is what Replit's reverse proxy is configured to forward to the
 * api-server.
 */
const BASE = (import.meta.env.VITE_API_BASE_URL ?? "/api").replace(/\/$/, "");

async function readError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string };
    if (body?.error) return body.error;
  } catch {
    // fall through
  }
  return `Request failed (${res.status})`;
}

// All admin requests opt into sending the chs_admin_session cookie.
// The server's adminAuth middleware accepts either the cookie or the
// x-admin-key header, so legacy key-based callers still work too.
const CREDS: RequestCredentials = "include";

async function postJson<T extends object>(path: string, body: unknown): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: CREDS,
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Like postJson but returns either the parsed body or { error }. */
async function postJsonResult<T extends object>(
  path: string,
  body: unknown,
  headers: Record<string, string> = {},
): Promise<{ data: T } | { error: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      credentials: CREDS,
      body: JSON.stringify(body),
    });
    if (!res.ok) return { error: await readError(res) };
    return { data: (await res.json()) as T };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Network error" };
  }
}

async function patchJsonResult<T extends object>(
  path: string,
  body: unknown,
  headers: Record<string, string> = {},
): Promise<{ data: T } | { error: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...headers },
      credentials: CREDS,
      body: JSON.stringify(body),
    });
    if (!res.ok) return { error: await readError(res) };
    return { data: (await res.json()) as T };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Network error" };
  }
}

async function getJson<T extends object>(
  path: string,
  init?: RequestInit,
): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, { credentials: CREDS, ...init });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Like getJson but returns { data } or { error: string } so callers
 * can show the real server-side error instead of a generic null. */
async function getJsonResult<T extends object>(
  path: string,
  init?: RequestInit,
): Promise<{ data: T } | { error: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, { credentials: CREDS, ...init });
    if (!res.ok) return { error: await readError(res) };
    return { data: (await res.json()) as T };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Network error" };
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
      credentials: CREDS,
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
    const res = await fetch(`${BASE}${path}`, { ...init, credentials: CREDS, method: "DELETE" });
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
  category: string | null;
  createdAt: string;
};

export type JobAlbum = {
  id: number;
  jobId: number;
  label: string;
  url: string;
  sortOrder: number;
  createdAt: string;
};

export type JobMilestone = {
  id: number;
  jobId: number;
  title: string;
  status: "pending" | "in_progress" | "complete" | string;
  sortOrder: number;
  completedDate: string | null;
  notes: string | null;
  createdAt: string;
};

export type JobDocument = {
  id: number;
  jobId: number;
  label: string;
  category: string | null;
  url: string;
  createdAt: string;
};

export type JobInspection = {
  id: number;
  jobId: number;
  inspectionType: string;
  status: "upcoming" | "passed" | "failed" | "reinspection" | string;
  date: string | null;
  timeWindow: string | null;
  county: string | null;
  inspectorNotes: string | null;
  createdAt: string;
};

export type ServiceRequest = {
  id: number;
  customerId: number;
  jobId: number | null;
  requestType: string;
  message: string | null;
  status: "new" | "in_progress" | "closed" | string;
  createdAt: string;
};

export type CustomerMessage = {
  id: number;
  customerId: number;
  sender: "customer" | "team" | string;
  authorName: string | null;
  body: string;
  readByTeam: boolean;
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
  /** External photo gallery URL — Google Photos shared album, Drive
   *  folder, Dropbox, etc. Set per-job by the admin. */
  photoAlbumUrl: string | null;
  projectManager: string | null;
  projectManagerPhone: string | null;
  roofSystem: string | null;
  warrantyManufacturer: string | null;
  warrantyWorkmanship: string | null;
  warrantyStartDate: string | null;
  createdAt: string;
  updates: JobUpdate[];
  photos: JobPhoto[];
  albums: JobAlbum[];
  milestones: JobMilestone[];
  documents: JobDocument[];
  inspections: JobInspection[];
};

export type PortalLookupResponse = {
  customer: Customer;
  jobs: Job[];
  messages: CustomerMessage[];
  requests: ServiceRequest[];
};

export type AdminJob = {
  id: number;
  customerId: number;
  title: string;
  serviceType: string | null;
  status: string;
  progress: number;
  startDate: string | null;
  estimatedCompletion: string | null;
  photoAlbumUrl: string | null;
  createdAt: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  accountNumber: string | null;
};

export type AnalyticsResponse = {
  days: number;
  /** True when the page_views table is live and ready. */
  pageviewsTable: boolean;
  totals: {
    views: number;
    sessions: number;
    leads: number;
    estimates: number;
    customers: number;
    activeJobs: number;
  };
  pageviewsByDay: Array<{ day: string; views: number; sessions: number }>;
  topPaths: Array<{ path: string; views: number }>;
  topReferrers: Array<{ referrer: string; views: number }>;
};

// ─── SMS Outreach ──────────────────────────────────────────────
export type SmsContact = {
  id: number;
  phone: string;
  name: string | null;
  leadId: number | null;
  customerId: number | null;
  consentSource: string | null;
  optedOut: boolean;
  aiEnabled: boolean;
  lastMessageAt: string | null;
  createdAt: string;
};

export type SmsContactRow = SmsContact & {
  unread: number;
  lastBody: string | null;
  hasDraft: boolean;
};

export type SmsMessage = {
  id: number;
  contactId: number;
  direction: "inbound" | "outbound" | string;
  body: string;
  status: "draft" | "sent" | "failed" | "simulated" | "received" | string;
  authorName: string | null;
  twilioSid: string | null;
  errorMessage: string | null;
  readByTeam: boolean;
  createdAt: string;
};

export type OutreachSettings = {
  id: number;
  agentName: string;
  instructions: string | null;
  autoEngageLeads: boolean;
  autoReply: boolean;
  sendWindowStart: number;
  sendWindowEnd: number;
  timezone: string;
  updatedAt: string;
};

export type OutreachStatus = {
  twilioConfigured: boolean;
  aiConfigured: boolean;
  roofrSecretConfigured: boolean;
  settings: OutreachSettings;
};

export type AdminServiceRequestRow = ServiceRequest & {
  customerName: string | null;
  customerPhone: string | null;
  accountNumber: string | null;
};

export type AdminCustomerMessageRow = CustomerMessage & {
  customerName: string | null;
  accountNumber: string | null;
};

// ─── Admin auth ────────────────────────────────────────────────
export type AdminProfile = {
  id: number;
  email: string;
  name: string;
  role: string;
};

async function postJsonCookie<T extends object>(
  path: string,
  body: unknown,
): Promise<{ data: T } | { error: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });
    if (!res.ok) return { error: await readError(res) };
    return { data: (await res.json()) as T };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Network error" };
  }
}

async function getJsonCookie<T extends object>(
  path: string,
): Promise<{ data: T } | { error: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, { credentials: "include" });
    if (!res.ok) return { error: await readError(res) };
    return { data: (await res.json()) as T };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Network error" };
  }
}

export const api = {
  submitLead: (payload: LeadPayload) =>
    postJson<{ ok: true; id: number }>("/leads", payload),
  submitEstimate: (payload: EstimatePayload) =>
    postJson<{ ok: true; id: number }>("/estimates", payload),

  // Public pageview tracker — fire-and-forget. The server swallows
  // errors as 204 so we never raise either.
  trackPageView: (payload: { path: string; referrer?: string; sessionId?: string }) =>
    postJson<{ ok: true }>("/track", payload),

  // Public portal
  portalLookup: (identifier: string) =>
    postJson<PortalLookupResponse>("/portal/lookup", { identifier }),
  portalSubmitRequest: (payload: {
    identifier: string;
    requestType: string;
    message?: string;
    jobId?: number;
  }) => postJsonResult<{ row: ServiceRequest }>("/portal/requests", payload),
  portalSendMessage: (payload: { identifier: string; body: string }) =>
    postJsonResult<{ row: CustomerMessage }>("/portal/messages", payload),

  // Admin (key required)
  // ─── Admin auth ───────────────────────────────────────────────
  whoAmI: (key?: string) =>
    getJsonCookie<{ ok: true; via: "session" | "admin-key"; admin: AdminProfile | null }>(
      "/admin/auth/me",
    ).then(async (r) => {
      // If cookie route failed AND we have a key, fall back to a key probe.
      if ("error" in r && key) {
        const fb = await fetch(`${BASE}/admin/auth/me`, { headers: { "x-admin-key": key } });
        if (fb.ok) return { data: (await fb.json()) as { ok: true; via: "session" | "admin-key"; admin: AdminProfile | null } };
      }
      return r;
    }),
  adminLogin: (email: string, password: string) =>
    postJsonCookie<{ ok: true; admin: AdminProfile }>("/admin/auth/login", { email, password }),
  adminLogout: () => postJsonCookie<{ ok: true }>("/admin/auth/logout", {}),
  adminRegister: (payload: { token: string; name: string; email: string; password: string }) =>
    postJsonCookie<{ ok: true; admin: AdminProfile }>("/admin/auth/register", payload),
  adminInviteLookup: (token: string) =>
    getJsonCookie<{ invite: { email: string | null; name: string | null; role: string } }>(
      `/admin/auth/invites/${encodeURIComponent(token)}`,
    ),
  adminCreateInvite: (
    payload: { email?: string; name?: string; label?: string },
    key: string,
  ) =>
    postJsonResult<{
      ok: true;
      invite: { token: string; email: string | null; name: string | null; expiresAt: string };
    }>("/admin/auth/invites", payload, { "x-admin-key": key }),

  listLeads: (key: string) =>
    getJsonResult<{ rows: Record<string, unknown>[] }>("/admin/leads", {
      headers: { "x-admin-key": key },
    }),
  listAllJobs: (key: string) =>
    getJsonResult<{ rows: AdminJob[] }>("/admin/jobs", {
      headers: { "x-admin-key": key },
    }),
  getAnalytics: (key: string, days = 30) =>
    getJsonResult<AnalyticsResponse>(`/admin/analytics?days=${days}`, {
      headers: { "x-admin-key": key },
    }),
  listEstimates: (key: string) =>
    getJsonResult<{ rows: Record<string, unknown>[] }>("/admin/estimates", {
      headers: { "x-admin-key": key },
    }),

  // Admin · CRM
  listCustomers: (key: string) =>
    getJsonResult<{ rows: Customer[] }>("/admin/customers", {
      headers: { "x-admin-key": key },
    }),
  getCustomer: (id: number, key: string) =>
    getJsonResult<{ customer: Customer; jobs: Job[] }>(`/admin/customers/${id}`, {
      headers: { "x-admin-key": key },
    }),
  createCustomer: (
    payload: { name: string; email?: string; phone?: string; address?: string; notes?: string },
    key: string,
  ) => postJsonResult<{ row: Customer }>("/admin/customers", payload, { "x-admin-key": key }),
  updateCustomer: (
    id: number,
    payload: Partial<Customer> & { notes?: string },
    key: string,
  ) =>
    patchJsonResult<{ row: Customer }>(`/admin/customers/${id}`, payload, {
      "x-admin-key": key,
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
  ) => postJsonResult<{ row: Job }>("/admin/jobs", payload, { "x-admin-key": key }),
  updateJob: (id: number, payload: Partial<Job>, key: string) =>
    patchJsonResult<{ row: Job }>(`/admin/jobs/${id}`, payload, { "x-admin-key": key }),
  deleteJob: (id: number, key: string) =>
    deleteJson(`/admin/jobs/${id}`, { headers: { "x-admin-key": key } }),

  addJobUpdate: (
    payload: { jobId: number; body: string; authorName?: string },
    key: string,
  ) => postJsonResult<{ row: JobUpdate }>("/admin/job-updates", payload, { "x-admin-key": key }),
  deleteJobUpdate: (id: number, key: string) =>
    deleteJson(`/admin/job-updates/${id}`, { headers: { "x-admin-key": key } }),

  addJobPhoto: (
    payload: { jobId: number; url: string; caption?: string; category?: string },
    key: string,
  ) => postJsonResult<{ row: JobPhoto }>("/admin/job-photos", payload, { "x-admin-key": key }),
  deleteJobPhoto: (id: number, key: string) =>
    deleteJson(`/admin/job-photos/${id}`, { headers: { "x-admin-key": key } }),
  /** Wipe every photo on a job. `all=false` (default) only purges
   *  legacy base64 data: URLs; `all=true` also removes external links. */
  clearJobPhotos: (jobId: number, key: string, all = false) =>
    deleteJson(`/admin/jobs/${jobId}/photos${all ? "?all=1" : ""}`, {
      headers: { "x-admin-key": key },
    }),

  // One-click demo seed. `reset: true` wipes the DEMO account first
  // so the admin can go back to a fresh example after clicking around.
  loadDemo: (key: string, reset = false) =>
    postJsonResult<{
      ok: true;
      reset: boolean;
      accountNumber: string;
      email: string;
      jobId: number;
    }>(`/admin/demo${reset ? "?reset=1" : ""}`, {}, { "x-admin-key": key }),

  // Multiple labeled album links per job — "Part 1 done", "Final
  // walkthrough", etc. Each gets embedded in the customer portal.
  // Admin · portal content (milestones / documents / inspections)
  addJobMilestone: (
    payload: {
      jobId: number;
      title: string;
      status?: string;
      sortOrder?: number;
      completedDate?: string;
      notes?: string;
    },
    key: string,
  ) => postJsonResult<{ row: JobMilestone }>("/admin/job-milestones", payload, { "x-admin-key": key }),
  seedJobMilestones: (jobId: number, key: string) =>
    postJsonResult<{ rows: JobMilestone[] }>(`/admin/jobs/${jobId}/milestones/template`, {}, {
      "x-admin-key": key,
    }),
  updateJobMilestone: (id: number, payload: Partial<JobMilestone>, key: string) =>
    patchJsonResult<{ row: JobMilestone }>(`/admin/job-milestones/${id}`, payload, {
      "x-admin-key": key,
    }),
  deleteJobMilestone: (id: number, key: string) =>
    deleteJson(`/admin/job-milestones/${id}`, { headers: { "x-admin-key": key } }),

  addJobDocument: (
    payload: { jobId: number; label: string; category?: string; url: string },
    key: string,
  ) => postJsonResult<{ row: JobDocument }>("/admin/job-documents", payload, { "x-admin-key": key }),
  deleteJobDocument: (id: number, key: string) =>
    deleteJson(`/admin/job-documents/${id}`, { headers: { "x-admin-key": key } }),

  addJobInspection: (
    payload: {
      jobId: number;
      inspectionType: string;
      status?: string;
      date?: string;
      timeWindow?: string;
      county?: string;
      inspectorNotes?: string;
    },
    key: string,
  ) =>
    postJsonResult<{ row: JobInspection }>("/admin/job-inspections", payload, {
      "x-admin-key": key,
    }),
  updateJobInspection: (id: number, payload: Partial<JobInspection>, key: string) =>
    patchJsonResult<{ row: JobInspection }>(`/admin/job-inspections/${id}`, payload, {
      "x-admin-key": key,
    }),
  deleteJobInspection: (id: number, key: string) =>
    deleteJson(`/admin/job-inspections/${id}`, { headers: { "x-admin-key": key } }),

  // Admin · service requests + customer messages
  listServiceRequests: (key: string) =>
    getJsonResult<{ rows: AdminServiceRequestRow[] }>("/admin/service-requests", {
      headers: { "x-admin-key": key },
    }),
  updateServiceRequest: (id: number, status: string, key: string) =>
    patchJsonResult<{ row: ServiceRequest }>(`/admin/service-requests/${id}`, { status }, {
      "x-admin-key": key,
    }),
  listCustomerMessages: (key: string) =>
    getJsonResult<{ rows: AdminCustomerMessageRow[] }>("/admin/customer-messages", {
      headers: { "x-admin-key": key },
    }),
  replyCustomerMessage: (payload: { customerId: number; body: string }, key: string) =>
    postJsonResult<{ row: CustomerMessage }>("/admin/customer-messages", payload, {
      "x-admin-key": key,
    }),
  markCustomerMessagesRead: (customerId: number, key: string) =>
    postJsonResult<{ ok: true }>(`/admin/customer-messages/mark-read/${customerId}`, {}, {
      "x-admin-key": key,
    }),

  // Admin · SMS outreach
  outreachStatus: (key: string) =>
    getJsonResult<OutreachStatus>("/admin/outreach/status", { headers: { "x-admin-key": key } }),
  updateOutreachSettings: (payload: Partial<OutreachSettings>, key: string) =>
    patchJsonResult<{ settings: OutreachSettings }>("/admin/outreach/settings", payload, {
      "x-admin-key": key,
    }),
  listSmsContacts: (key: string) =>
    getJsonResult<{ rows: SmsContactRow[] }>("/admin/outreach/contacts", {
      headers: { "x-admin-key": key },
    }),
  getSmsThread: (contactId: number, key: string) =>
    getJsonResult<{ contact: SmsContact; messages: SmsMessage[] }>(
      `/admin/outreach/contacts/${contactId}/messages`,
      { headers: { "x-admin-key": key } },
    ),
  updateSmsContact: (
    id: number,
    payload: Partial<Pick<SmsContact, "name" | "aiEnabled" | "optedOut">>,
    key: string,
  ) =>
    patchJsonResult<{ row: SmsContact }>(`/admin/outreach/contacts/${id}`, payload, {
      "x-admin-key": key,
    }),
  createSmsContact: (
    payload: { phone?: string; name?: string; leadId?: number; customerId?: number },
    key: string,
  ) => postJsonResult<{ row: SmsContact }>("/admin/outreach/contacts", payload, { "x-admin-key": key }),
  sendSmsMessage: (payload: { contactId: number; body: string }, key: string) =>
    postJsonResult<{ row: SmsMessage }>("/admin/outreach/messages", payload, {
      "x-admin-key": key,
    }),
  draftSmsReply: (contactId: number, key: string) =>
    postJsonResult<{ draft: string }>(`/admin/outreach/contacts/${contactId}/draft`, {}, {
      "x-admin-key": key,
    }),
  approveSmsDraft: (draftId: number, key: string, body?: string) =>
    postJsonResult<{ row: SmsMessage }>(`/admin/outreach/drafts/${draftId}/approve`, body ? { body } : {}, {
      "x-admin-key": key,
    }),
  discardSmsDraft: (draftId: number, key: string) =>
    deleteJson(`/admin/outreach/drafts/${draftId}`, { headers: { "x-admin-key": key } }),
  engageLead: (leadId: number, key: string) =>
    postJsonResult<{ ok: true }>(`/admin/outreach/engage-lead/${leadId}`, {}, {
      "x-admin-key": key,
    }),

  addJobAlbum: (
    payload: { jobId: number; label: string; url: string; sortOrder?: number },
    key: string,
  ) => postJsonResult<{ row: JobAlbum }>("/admin/job-albums", payload, { "x-admin-key": key }),
  updateJobAlbum: (
    id: number,
    payload: Partial<Pick<JobAlbum, "label" | "url" | "sortOrder">>,
    key: string,
  ) => patchJsonResult<{ row: JobAlbum }>(`/admin/job-albums/${id}`, payload, { "x-admin-key": key }),
  deleteJobAlbum: (id: number, key: string) =>
    deleteJson(`/admin/job-albums/${id}`, { headers: { "x-admin-key": key } }),
};
