import { Router, type IRouter } from "express";
import { eq, sql, desc, asc, inArray } from "drizzle-orm";
import {
  db,
  customersTable,
  jobsTable,
  jobUpdatesTable,
  jobPhotosTable,
  jobAlbumsTable,
  jobMilestonesTable,
  jobDocumentsTable,
  jobInspectionsTable,
  serviceRequestsTable,
  customerMessagesTable,
  type Customer,
} from "@workspace/db";
import { isEmail, normalizeAccount } from "../lib/accountNumber";
import { handleError } from "../lib/handleError";
import { logger } from "../lib/logger";
import { sendSms, twilioConfigured, normalizePhone } from "../lib/sms";

const router: IRouter = Router();

/**
 * Resolve a customer from the portal identifier (email or account
 * number). Shared by lookup and the customer-initiated POST routes.
 */
async function findCustomer(identifier: string): Promise<Customer | null> {
  const id = identifier.trim();
  if (!id) return null;
  // Fetch up to TWO rows so we can detect an ambiguous email. If two
  // customers share an email we must NOT hand back whichever row
  // Postgres found first — that would show one household another's
  // jobs, documents, and message thread. Account numbers are unique
  // by constraint, so ambiguity is only possible on the email path.
  const rows = await db
    .select()
    .from(customersTable)
    .where(
      isEmail(id)
        ? sql`lower(${customersTable.email}) = ${id.toLowerCase()}`
        : eq(customersTable.accountNumber, normalizeAccount(id)),
    )
    .limit(2);
  if (rows.length !== 1) return null;
  return rows[0];
}

/** Text the office when a customer submits a request or message. */
function notifyOffice(text: string): void {
  const office = normalizePhone(process.env.OFFICE_NOTIFY_PHONE);
  if (!office || !twilioConfigured()) return;
  void sendSms(office, text).catch((err) =>
    logger.warn({ err: err instanceof Error ? err.message : err }, "[portal] office notify failed"),
  );
}

router.post("/portal/lookup", async (req, res) => {
  try {
    const id = String(req.body?.identifier ?? "").trim();
    if (!id) {
      res.status(400).json({ error: "Please enter your email or account number." });
      return;
    }

    const customer = await findCustomer(id);
    if (!customer) {
      res
        .status(404)
        .json({ error: "We couldn't find an account with that email or account number." });
      return;
    }

    const jobs = await db
      .select()
      .from(jobsTable)
      .where(eq(jobsTable.customerId, customer.id))
      .orderBy(desc(jobsTable.createdAt));

    const jobIds = jobs.map((j) => j.id);

    const [updates, photos, albums, milestones, documents, inspections] = jobIds.length
      ? await Promise.all([
          db
            .select()
            .from(jobUpdatesTable)
            .where(inArray(jobUpdatesTable.jobId, jobIds))
            .orderBy(desc(jobUpdatesTable.createdAt)),
          // Only external photo URLs (http/https). Legacy rows stored
          // base64 data URLs which choked the portal — excluded here.
          db
            .select()
            .from(jobPhotosTable)
            .where(inArray(jobPhotosTable.jobId, jobIds))
            .orderBy(desc(jobPhotosTable.createdAt))
            .then((rows) =>
              rows.filter((p) => typeof p.url === "string" && /^https?:\/\//i.test(p.url)),
            ),
          db
            .select()
            .from(jobAlbumsTable)
            .where(inArray(jobAlbumsTable.jobId, jobIds))
            .orderBy(asc(jobAlbumsTable.sortOrder), asc(jobAlbumsTable.createdAt)),
          db
            .select()
            .from(jobMilestonesTable)
            .where(inArray(jobMilestonesTable.jobId, jobIds))
            .orderBy(asc(jobMilestonesTable.sortOrder), asc(jobMilestonesTable.createdAt)),
          db
            .select()
            .from(jobDocumentsTable)
            .where(inArray(jobDocumentsTable.jobId, jobIds))
            .orderBy(asc(jobDocumentsTable.createdAt)),
          db
            .select()
            .from(jobInspectionsTable)
            .where(inArray(jobInspectionsTable.jobId, jobIds))
            .orderBy(asc(jobInspectionsTable.createdAt)),
        ])
      : [[], [], [], [], [], []];

    const [messages, requests] = await Promise.all([
      db
        .select()
        .from(customerMessagesTable)
        .where(eq(customerMessagesTable.customerId, customer.id))
        .orderBy(asc(customerMessagesTable.createdAt)),
      db
        .select()
        .from(serviceRequestsTable)
        .where(eq(serviceRequestsTable.customerId, customer.id))
        .orderBy(desc(serviceRequestsTable.createdAt)),
    ]);

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
        albums: albums.filter((a) => a.jobId === j.id),
        milestones: milestones.filter((m) => m.jobId === j.id),
        documents: documents.filter((d) => d.jobId === j.id),
        inspections: inspections.filter((i) => i.jobId === j.id),
      })),
      messages,
      requests,
    });
  } catch (err) {
    handleError(res, err);
  }
});

/**
 * Customer submits a service request from the portal (leak inspection,
 * warranty service, annual inspection, storm damage, maintenance,
 * cleaning, general). Notifies the office by SMS when configured.
 */
router.post("/portal/requests", async (req, res) => {
  try {
    const identifier = String(req.body?.identifier ?? "");
    const requestType = String(req.body?.requestType ?? "").trim();
    const message = req.body?.message ? String(req.body.message).trim() : null;
    const allowed = ["leak", "warranty", "annual", "storm", "maintenance", "cleaning", "general"];
    if (!allowed.includes(requestType)) {
      res.status(400).json({ error: "Invalid request type." });
      return;
    }
    const customer = await findCustomer(identifier);
    if (!customer) {
      res.status(404).json({ error: "Account not found." });
      return;
    }
    // Only attach a job the customer actually owns. A stray or
    // non-numeric id becomes null rather than a NaN insert (500) or a
    // request filed under someone else's job.
    let jobId: number | null = null;
    const rawJobId = Number(req.body?.jobId);
    if (Number.isInteger(rawJobId) && rawJobId > 0) {
      const [owned] = await db
        .select({ id: jobsTable.id })
        .from(jobsTable)
        .where(sql`${jobsTable.id} = ${rawJobId} AND ${jobsTable.customerId} = ${customer.id}`)
        .limit(1);
      if (owned) jobId = owned.id;
    }
    const [row] = await db
      .insert(serviceRequestsTable)
      .values({
        customerId: customer.id,
        jobId,
        requestType,
        message,
      })
      .returning();
    notifyOffice(
      `CHS Portal: ${customer.name} (${customer.accountNumber}) submitted a ${requestType} request.${message ? ` "${message.slice(0, 120)}"` : ""}`,
    );
    res.status(201).json({ row });
  } catch (err) {
    handleError(res, err);
  }
});

/** Customer sends a message to their project manager / the office. */
router.post("/portal/messages", async (req, res) => {
  try {
    const identifier = String(req.body?.identifier ?? "");
    const body = String(req.body?.body ?? "").trim();
    if (!body) {
      res.status(400).json({ error: "Message can't be empty." });
      return;
    }
    if (body.length > 2000) {
      res.status(400).json({ error: "Message is too long (2000 characters max)." });
      return;
    }
    const customer = await findCustomer(identifier);
    if (!customer) {
      res.status(404).json({ error: "Account not found." });
      return;
    }
    const [row] = await db
      .insert(customerMessagesTable)
      .values({
        customerId: customer.id,
        sender: "customer",
        authorName: customer.name,
        body,
      })
      .returning();
    notifyOffice(
      `CHS Portal: new message from ${customer.name} (${customer.accountNumber}): "${body.slice(0, 140)}"`,
    );
    res.status(201).json({ row });
  } catch (err) {
    handleError(res, err);
  }
});

export default router;
