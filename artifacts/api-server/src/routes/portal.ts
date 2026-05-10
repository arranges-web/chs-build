import { Router, type IRouter } from "express";
import { eq, sql, desc, and } from "drizzle-orm";
import {
  db,
  customersTable,
  jobsTable,
  jobUpdatesTable,
  jobPhotosTable,
} from "@workspace/db";
import { isEmail, normalizeAccount } from "../lib/accountNumber";

const router: IRouter = Router();

/**
 * POST /api/portal/lookup
 * Body: { identifier: string }
 *
 * Looks up a customer by email OR account number. If found, returns
 * the full customer payload + their jobs + each job's updates + each
 * job's photos. If not found, returns 404.
 *
 * Note: there is no password — we trust knowledge of the email or
 * account number. The account number isn't shown anywhere public,
 * so it's effectively a shared secret. This is appropriate for a
 * roofing-job timeline (low-risk data) and matches the founder's
 * "super easy to access and use" requirement.
 */
router.post("/portal/lookup", async (req, res) => {
  const id = String(req.body?.identifier ?? "").trim();
  if (!id) {
    res.status(400).json({ error: "Missing identifier" });
    return;
  }

  const [customer] = await db
    .select()
    .from(customersTable)
    .where(
      isEmail(id)
        ? sql`lower(${customersTable.email}) = ${id.toLowerCase()}`
        : eq(customersTable.accountNumber, normalizeAccount(id)),
    )
    .limit(1);

  if (!customer) {
    res.status(404).json({ error: "We couldn't find an account with that email or account number." });
    return;
  }

  const jobs = await db
    .select()
    .from(jobsTable)
    .where(eq(jobsTable.customerId, customer.id))
    .orderBy(desc(jobsTable.createdAt));

  const jobIds = jobs.map((j) => j.id);

  const updates = jobIds.length
    ? await db
        .select()
        .from(jobUpdatesTable)
        .where(
          jobIds.length === 1
            ? eq(jobUpdatesTable.jobId, jobIds[0])
            : sql`${jobUpdatesTable.jobId} = ANY (${jobIds})`,
        )
        .orderBy(desc(jobUpdatesTable.createdAt))
    : [];

  const photos = jobIds.length
    ? await db
        .select()
        .from(jobPhotosTable)
        .where(
          jobIds.length === 1
            ? eq(jobPhotosTable.jobId, jobIds[0])
            : sql`${jobPhotosTable.jobId} = ANY (${jobIds})`,
        )
        .orderBy(desc(jobPhotosTable.createdAt))
    : [];

  res.json({
    customer: {
      id: customer.id,
      accountNumber: customer.accountNumber,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    },
    jobs: jobs.map((j) => ({
      ...j,
      updates: updates.filter((u) => u.jobId === j.id),
      photos: photos.filter((p) => p.jobId === j.id),
    })),
  });
});

// Suppress unused import warning for `and` (kept for future filters).
void and;

export default router;
