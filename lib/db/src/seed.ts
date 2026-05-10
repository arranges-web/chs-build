/* eslint-disable no-console */
/**
 * Idempotent demo seed. Run with:
 *
 *   pnpm --filter @workspace/db run seed
 *
 * Creates (or no-ops if they already exist) two demo customers so
 * the founder can immediately see how the portal looks, with a
 * realistic in-progress job and a freshly-scheduled job.
 */
import { eq } from "drizzle-orm";
import { db, pool } from "./index";
import {
  customersTable,
  jobsTable,
  jobUpdatesTable,
  jobPhotosTable,
} from "./schema/customers";

type DemoCustomer = {
  accountNumber: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  jobs: Array<{
    title: string;
    serviceType: string;
    status: string;
    progress: number;
    startDate?: string;
    estimatedCompletion?: string;
    updates: Array<{ body: string; authorName: string }>;
    photos: Array<{ url: string; caption: string }>;
  }>;
};

const DEMO: DemoCustomer[] = [
  {
    accountNumber: "CHS-DEMO01",
    name: "Maria Sample",
    email: "demo@cordovahomeservices.com",
    phone: "(239) 555-0101",
    address: "1234 Sunset Dr, Cape Coral, FL 33904",
    jobs: [
      {
        title: "Full shingle re-roof — Cape Coral",
        serviceType: "installation",
        status: "in_progress",
        progress: 60,
        startDate: "2026-05-05",
        estimatedCompletion: "2026-05-14",
        updates: [
          {
            body:
              "Tear-off complete. Decking is in great shape — only two sheets needed replacement. Dry-in goes on this afternoon.",
            authorName: "Saul",
          },
          {
            body:
              "Permit issued by the city. Materials staged on-site. Crew arrives at 7am Monday — please move vehicles off the driveway by then.",
            authorName: "Maria",
          },
          {
            body:
              "Inspection passed ✅ Final color (Weathered Wood) confirmed for the architectural shingles.",
            authorName: "Gustavo",
          },
        ],
        photos: [
          {
            url: "https://picsum.photos/seed/chs-demo-roof-1/900/700",
            caption: "Old shingles tear-off complete",
          },
          {
            url: "https://picsum.photos/seed/chs-demo-roof-2/900/700",
            caption: "Underlayment installed",
          },
          {
            url: "https://picsum.photos/seed/chs-demo-roof-3/900/700",
            caption: "Material delivery — pallets staged",
          },
          {
            url: "https://picsum.photos/seed/chs-demo-roof-4/900/700",
            caption: "Permit posted on the front window",
          },
        ],
      },
    ],
  },
  {
    accountNumber: "CHS-DEMO02",
    name: "John Demo",
    email: "john.demo@example.com",
    phone: "(239) 555-0102",
    address: "5678 Bayshore Blvd, Naples, FL 34103",
    jobs: [
      {
        title: "Standing-seam metal roof — Naples",
        serviceType: "installation",
        status: "scheduled",
        progress: 10,
        startDate: "2026-05-20",
        estimatedCompletion: "2026-06-03",
        updates: [
          {
            body:
              "Project scheduled for May 20. We'll confirm color selection (Galvalume) and final scope on Friday.",
            authorName: "Maria",
          },
          {
            body:
              "Quote signed and deposit received. Thank you! Materials ordered — 2-week lead time.",
            authorName: "Gustavo",
          },
        ],
        photos: [
          {
            url: "https://picsum.photos/seed/chs-demo-metal-1/900/700",
            caption: "Initial site visit — current roof condition",
          },
        ],
      },
      {
        title: "Gutter replacement — Naples",
        serviceType: "gutters",
        status: "complete",
        progress: 100,
        startDate: "2026-04-12",
        estimatedCompletion: "2026-04-13",
        updates: [
          {
            body:
              "Job complete. All seamless aluminum gutters and downspouts installed and tested. Final walkthrough passed.",
            authorName: "Saul",
          },
        ],
        photos: [
          {
            url: "https://picsum.photos/seed/chs-demo-gutter-1/900/700",
            caption: "Finished gutter run on south side",
          },
          {
            url: "https://picsum.photos/seed/chs-demo-gutter-2/900/700",
            caption: "Color-matched downspout to fascia",
          },
        ],
      },
    ],
  },
];

async function upsertCustomer(c: DemoCustomer) {
  // Idempotency: skip the whole customer if their account number is
  // already in the DB. Re-running the seed is safe.
  const existing = await db
    .select()
    .from(customersTable)
    .where(eq(customersTable.accountNumber, c.accountNumber))
    .limit(1);
  if (existing.length > 0) {
    console.log(`  ↪ skip ${c.accountNumber} (already exists)`);
    return;
  }

  const [customer] = await db
    .insert(customersTable)
    .values({
      accountNumber: c.accountNumber,
      name: c.name,
      email: c.email,
      phone: c.phone,
      address: c.address,
    })
    .returning();

  console.log(`  + ${customer.accountNumber} — ${customer.name}`);

  for (const j of c.jobs) {
    const [job] = await db
      .insert(jobsTable)
      .values({
        customerId: customer.id,
        title: j.title,
        serviceType: j.serviceType,
        status: j.status,
        progress: j.progress,
        startDate: j.startDate ?? null,
        estimatedCompletion: j.estimatedCompletion ?? null,
      })
      .returning();

    for (const u of j.updates) {
      await db.insert(jobUpdatesTable).values({
        jobId: job.id,
        body: u.body,
        authorName: u.authorName,
      });
    }

    for (const p of j.photos) {
      await db.insert(jobPhotosTable).values({
        jobId: job.id,
        url: p.url,
        caption: p.caption,
      });
    }

    console.log(
      `      job: "${job.title}" — ${j.updates.length} updates, ${j.photos.length} photos`,
    );
  }
}

async function main() {
  console.log("Seeding demo customers…");
  for (const c of DEMO) {
    await upsertCustomer(c);
  }
  console.log("\nDone.\n");
  console.log("Try the portal:");
  for (const c of DEMO) {
    console.log(`  → /portal  with  ${c.email}  or  ${c.accountNumber}`);
  }
  await pool.end();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  void pool.end().catch(() => {});
  process.exit(1);
});
