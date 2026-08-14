/* eslint-disable no-console */
/**
 * Idempotent demo seed. Run with:
 *
 *   pnpm --filter @workspace/db run seed
 *
 * OR from the admin dashboard: click "Load demo data" — this file's
 * `seedDemo()` is called by /admin/demo (see api-server).
 *
 * Creates one rich "Cordero" demo customer covering every portal
 * section: welcome dashboard, project timeline, updates feed,
 * multi-album photo center, documents, inspections, warranty,
 * maintenance, messages. Safe to re-run — skips if the demo
 * account already exists.
 */
import { eq } from "drizzle-orm";
import { db } from "./index";
import {
  customersTable,
  jobsTable,
  jobUpdatesTable,
  jobPhotosTable,
  jobAlbumsTable,
} from "./schema/customers";
import {
  jobMilestonesTable,
  jobDocumentsTable,
  jobInspectionsTable,
  customerMessagesTable,
} from "./schema/portal";

/**
 * Canonical 11-step CHS project timeline. Each entry has a status
 * (complete | in_progress | pending) and an optional date so the
 * timeline reads like a real in-flight project.
 */
type MilestoneSeed = {
  title: string;
  status: "complete" | "in_progress" | "pending";
  date?: string;
  notes?: string;
};

type AlbumSeed = { label: string; url: string };
type DocumentSeed = { label: string; category: string; url: string };
type InspectionSeed = {
  type: string;
  status: "upcoming" | "passed" | "failed" | "reinspection";
  date?: string;
  timeWindow?: string;
  county?: string;
  notes?: string;
};
// `sender` matches what the rest of the app writes:
//   "customer"  — from the customer via the portal
//   "team"      — from CHS staff (portal, admin dashboard, SMS webhook)
// The old "office" value was seed-only and made the admin PortalInbox
// unread-count skip demo replies. Aligned.
type MessageSeed = { sender: "customer" | "team"; body: string; author: string };
type UpdateSeed = { body: string; author: string; daysAgo: number };

const DEMO_ACCOUNT = "CHS-DEMO01";
const DEMO_EMAIL = "demo@cordovahomeservices.com";

const MILESTONES: MilestoneSeed[] = [
  { title: "Contract Signed", status: "complete", date: "June 21" },
  { title: "Permit Submitted", status: "complete", date: "June 26" },
  { title: "Permit Approved", status: "complete", date: "July 8" },
  {
    title: "Materials Ordered",
    status: "complete",
    date: "July 10",
    notes: "GAF Timberline HDZ shingles, Weathered Wood. Delivery scheduled July 13.",
  },
  { title: "Material Delivery", status: "in_progress", date: "July 13" },
  { title: "Tear-Off", status: "pending" },
  { title: "Dry-In", status: "pending" },
  { title: "County Inspection", status: "pending" },
  { title: "Roofing Installation", status: "pending" },
  { title: "Final Inspection", status: "pending" },
  { title: "Project Complete", status: "pending" },
];

const ALBUMS: AlbumSeed[] = [
  // Placeholder-safe URLs — they render an "Open the full album"
  // fallback in the portal even if the iframe is blocked.
  { label: "Before photos", url: "https://picsum.photos/seed/chs-demo-before/1200/800" },
  { label: "Materials delivered", url: "https://picsum.photos/seed/chs-demo-delivery/1200/800" },
  { label: "Final walkthrough", url: "https://picsum.photos/seed/chs-demo-final/1200/800" },
];

const DOCUMENTS: DocumentSeed[] = [
  { label: "Signed roofing contract", category: "contract", url: "https://picsum.photos/seed/chs-demo-contract/1000/1400" },
  { label: "Lee County building permit", category: "permit", url: "https://picsum.photos/seed/chs-demo-permit/1000/1400" },
  { label: "GAF Timberline HDZ NOA", category: "noa", url: "https://picsum.photos/seed/chs-demo-noa/1000/1400" },
  { label: "Color & material selection sheet", category: "color", url: "https://picsum.photos/seed/chs-demo-color/1000/1400" },
  { label: "Deposit invoice #4218", category: "invoice", url: "https://picsum.photos/seed/chs-demo-invoice/1000/1400" },
  { label: "Deposit receipt — $6,240", category: "receipt", url: "https://picsum.photos/seed/chs-demo-receipt/1000/1400" },
];

const INSPECTIONS: InspectionSeed[] = [
  { type: "Permit Approval", status: "passed", date: "July 8", county: "Lee County" },
  {
    type: "Dry-In Inspection",
    status: "upcoming",
    date: "July 22",
    timeWindow: "8 AM – 12 PM",
    county: "Lee County",
  },
  { type: "Final Inspection", status: "upcoming", county: "Lee County" },
];

const UPDATES: UpdateSeed[] = [
  { author: "Roberto", daysAgo: 0, body: "Materials arrived on site. Truck unloaded and staged in the driveway. Tear-off starts first thing tomorrow morning." },
  { author: "Amado", daysAgo: 1, body: "Permit was approved by Lee County. We'll get materials scheduled for delivery on Monday." },
  { author: "CHS Team", daysAgo: 5, body: "Signed contract and NOA uploaded to your Documents section — take a look whenever you get a chance." },
  { author: "Roberto", daysAgo: 12, body: "Great meeting today. We'll draft the contract and send it over by end of week. Color palette samples coming with it." },
];

const MESSAGES: MessageSeed[] = [
  { sender: "customer", author: "John Cordero", body: "Any chance we could pick a slightly darker shingle color? Sarah wants to see a Weathered Wood swatch." },
  { sender: "team", author: "Roberto", body: "No problem — I'll drop off two swatches tomorrow around 3 PM. If Weathered Wood works we can still get the change in before the material order goes out Friday." },
  { sender: "customer", author: "John Cordero", body: "Perfect, thank you Roberto." },
];

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

/**
 * Create (or refresh) the demo customer and everything hanging off
 * it. Reset mode wipes previous demo data first so you always get a
 * clean example — safe because the account number is locked to
 * DEMO_ACCOUNT.
 */
export async function seedDemo(opts: { reset?: boolean } = {}): Promise<{
  accountNumber: string;
  email: string;
  jobId: number;
}> {
  const [existing] = await db
    .select()
    .from(customersTable)
    .where(eq(customersTable.accountNumber, DEMO_ACCOUNT))
    .limit(1);

  if (existing && opts.reset) {
    // Cascade wipes jobs / updates / photos / albums / milestones /
    // documents / inspections via ON DELETE CASCADE. Messages hang
    // off customer_id so we clear those explicitly.
    await db.delete(customerMessagesTable).where(eq(customerMessagesTable.customerId, existing.id));
    await db.delete(customersTable).where(eq(customersTable.id, existing.id));
  } else if (existing) {
    // Already seeded — reuse the same demo customer, but make sure
    // it has all the current portal content (albums, milestones,
    // docs, inspections, messages). Idempotent per-item.
    return await ensureContentFor(existing.id);
  }

  // Fresh insert.
  const [customer] = await db
    .insert(customersTable)
    .values({
      accountNumber: DEMO_ACCOUNT,
      name: "John & Sarah Cordero",
      email: DEMO_EMAIL,
      phone: "(239) 555-4218",
      address: "1247 Palm Drive, Cape Coral, FL 33904",
      notes: "DEMO ACCOUNT — safe to reset from the admin dashboard.",
    })
    .returning();

  const [job] = await db
    .insert(jobsTable)
    .values({
      customerId: customer.id,
      title: "Roof Replacement — Main House",
      serviceType: "installation",
      status: "in_progress",
      progress: 45,
      startDate: "2026-07-14",
      estimatedCompletion: "2026-08-02",
      projectManager: "Roberto Martinez",
      projectManagerPhone: "(239) 737-1758",
      roofSystem: "GAF Timberline HDZ shingle · Weathered Wood",
      warrantyManufacturer: "GAF System Plus — 50 years",
      warrantyWorkmanship: "CHS Roofing — 10 years",
      warrantyStartDate: null,
    })
    .returning();

  await insertAllContent(customer.id, job.id);
  return { accountNumber: customer.accountNumber, email: customer.email!, jobId: job.id };
}

async function ensureContentFor(customerId: number): Promise<{
  accountNumber: string;
  email: string;
  jobId: number;
}> {
  const jobs = await db.select().from(jobsTable).where(eq(jobsTable.customerId, customerId));
  const job = jobs[0];
  if (!job) {
    // Shouldn't happen — but if the customer exists with no job,
    // create one from scratch.
    const [created] = await db
      .insert(jobsTable)
      .values({
        customerId,
        title: "Roof Replacement — Main House",
        serviceType: "installation",
        status: "in_progress",
        progress: 45,
        startDate: "2026-07-14",
        estimatedCompletion: "2026-08-02",
      })
      .returning();
    await insertAllContent(customerId, created.id);
    return { accountNumber: DEMO_ACCOUNT, email: DEMO_EMAIL, jobId: created.id };
  }
  // Backfill anything missing without wiping what's there.
  await backfillIfEmpty(customerId, job.id);
  return { accountNumber: DEMO_ACCOUNT, email: DEMO_EMAIL, jobId: job.id };
}

async function insertAllContent(customerId: number, jobId: number): Promise<void> {
  // Updates
  for (const u of UPDATES) {
    await db.insert(jobUpdatesTable).values({
      jobId,
      body: u.body,
      authorName: u.author,
      createdAt: daysAgo(u.daysAgo) as unknown as Date,
    } as Parameters<typeof db.insert>[0] extends never ? never : {
      jobId: number; body: string; authorName: string; createdAt: Date;
    });
  }
  // Milestones
  for (const [i, m] of MILESTONES.entries()) {
    await db.insert(jobMilestonesTable).values({
      jobId,
      title: m.title,
      status: m.status,
      sortOrder: i,
      completedDate: m.date ?? null,
      notes: m.notes ?? null,
    });
  }
  // Albums
  for (const [i, a] of ALBUMS.entries()) {
    await db.insert(jobAlbumsTable).values({
      jobId,
      label: a.label,
      url: a.url,
      sortOrder: i,
    });
  }
  // Documents
  for (const d of DOCUMENTS) {
    await db.insert(jobDocumentsTable).values({
      jobId,
      label: d.label,
      category: d.category,
      url: d.url,
    });
  }
  // Inspections
  for (const i of INSPECTIONS) {
    await db.insert(jobInspectionsTable).values({
      jobId,
      inspectionType: i.type,
      status: i.status,
      date: i.date ?? null,
      timeWindow: i.timeWindow ?? null,
      county: i.county ?? null,
      inspectorNotes: i.notes ?? null,
    });
  }
  // Messages
  for (const m of MESSAGES) {
    await db.insert(customerMessagesTable).values({
      customerId,
      sender: m.sender,
      authorName: m.author,
      body: m.body,
    });
  }
}

async function backfillIfEmpty(customerId: number, jobId: number): Promise<void> {
  const checks = await Promise.all([
    db.select().from(jobMilestonesTable).where(eq(jobMilestonesTable.jobId, jobId)).limit(1),
    db.select().from(jobAlbumsTable).where(eq(jobAlbumsTable.jobId, jobId)).limit(1),
    db.select().from(jobDocumentsTable).where(eq(jobDocumentsTable.jobId, jobId)).limit(1),
    db.select().from(jobInspectionsTable).where(eq(jobInspectionsTable.jobId, jobId)).limit(1),
    db.select().from(customerMessagesTable).where(eq(customerMessagesTable.customerId, customerId)).limit(1),
  ]);
  const [hasMilestones, hasAlbums, hasDocs, hasInsp, hasMsgs] = checks.map((r) => r.length > 0);

  if (!hasMilestones) {
    for (const [i, m] of MILESTONES.entries()) {
      await db.insert(jobMilestonesTable).values({
        jobId,
        title: m.title,
        status: m.status,
        sortOrder: i,
        completedDate: m.date ?? null,
        notes: m.notes ?? null,
      });
    }
  }
  if (!hasAlbums) {
    for (const [i, a] of ALBUMS.entries()) {
      await db.insert(jobAlbumsTable).values({ jobId, label: a.label, url: a.url, sortOrder: i });
    }
  }
  if (!hasDocs) {
    for (const d of DOCUMENTS) {
      await db.insert(jobDocumentsTable).values({ jobId, label: d.label, category: d.category, url: d.url });
    }
  }
  if (!hasInsp) {
    for (const i of INSPECTIONS) {
      await db.insert(jobInspectionsTable).values({
        jobId,
        inspectionType: i.type,
        status: i.status,
        date: i.date ?? null,
        timeWindow: i.timeWindow ?? null,
        county: i.county ?? null,
        inspectorNotes: i.notes ?? null,
      });
    }
  }
  if (!hasMsgs) {
    for (const m of MESSAGES) {
      await db.insert(customerMessagesTable).values({
        customerId,
        sender: m.sender,
        authorName: m.author,
        body: m.body,
      });
    }
  }
}

// IMPORTANT: this module deliberately does NOT run any CLI code at
// import time and NEVER calls pool.end(). The previous version had
// an `if (import.meta.url === file://${process.argv[1]}) main()`
// guard that was supposed to only fire on `tsx seed.ts`, but the
// check misfired under Replit's runtime — the api-server's dynamic
// `import("@workspace/db")` sometimes matched it, main() ran,
// pool.end() closed the pg pool, and every subsequent admin query
// died with "Cannot use a pool after calling end on the pool".
//
// The CLI now lives in `seed-cli.ts` (see package.json → `seed`
// script). That file is the only thing that closes the pool.
// Anything else that wants to seed just calls `seedDemo()` and
// leaves the pool alone.
