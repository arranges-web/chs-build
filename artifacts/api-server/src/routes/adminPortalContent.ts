import { Router, type IRouter } from "express";
import { eq, desc, asc, sql } from "drizzle-orm";
import {
  db,
  jobsTable,
  jobMilestonesTable,
  jobDocumentsTable,
  jobInspectionsTable,
  serviceRequestsTable,
  customerMessagesTable,
  customersTable,
  insertJobMilestoneSchema,
  insertJobDocumentSchema,
  insertJobInspectionSchema,
} from "@workspace/db";
import { adminAuth } from "../middlewares/adminAuth";
import { handleError } from "../lib/handleError";

const router: IRouter = Router();

router.use("/admin", adminAuth);

/** Default milestone template applied by "Add standard timeline". */
export const DEFAULT_MILESTONES = [
  "Contract Signed",
  "Permit Submitted",
  "Permit Approved",
  "Materials Ordered",
  "Material Delivery",
  "Tear-Off",
  "Dry-In",
  "County Inspection",
  "Roofing Installation",
  "Final Inspection",
  "Project Complete",
];

// ─── Milestones ─────────────────────────────────────────────────

router.post("/admin/job-milestones", async (req, res) => {
  try {
    const parsed = insertJobMilestoneSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid milestone payload.", issues: parsed.error.issues });
      return;
    }
    const [row] = await db.insert(jobMilestonesTable).values(parsed.data).returning();
    res.status(201).json({ row });
  } catch (err) {
    handleError(res, err);
  }
});

/** Seed the standard CHS timeline on a job in one click. */
router.post("/admin/jobs/:jobId/milestones/template", async (req, res) => {
  try {
    const jobId = Number(req.params.jobId);
    if (!Number.isFinite(jobId)) {
      res.status(400).json({ error: "Invalid job id" });
      return;
    }
    const existing = await db
      .select()
      .from(jobMilestonesTable)
      .where(eq(jobMilestonesTable.jobId, jobId));
    if (existing.length > 0) {
      res.status(409).json({ error: "This job already has milestones." });
      return;
    }
    const rows = await db
      .insert(jobMilestonesTable)
      .values(DEFAULT_MILESTONES.map((title, i) => ({ jobId, title, sortOrder: i })))
      .returning();
    res.status(201).json({ rows });
  } catch (err) {
    handleError(res, err);
  }
});

router.patch("/admin/job-milestones/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const update: Record<string, unknown> = {};
    for (const k of ["title", "status", "completedDate", "notes"] as const) {
      if (k in req.body) update[k] = req.body[k] ?? null;
    }
    if ("sortOrder" in req.body) {
      const n = Number(req.body.sortOrder);
      update.sortOrder = Number.isFinite(n) ? Math.round(n) : 0;
    }
    if (typeof update.status === "string" && !["pending", "in_progress", "complete"].includes(update.status)) {
      res.status(400).json({ error: "Invalid status." });
      return;
    }
    const [row] = await db
      .update(jobMilestonesTable)
      .set(update)
      .where(eq(jobMilestonesTable.id, id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Milestone not found." });
      return;
    }
    res.json({ row });
  } catch (err) {
    handleError(res, err);
  }
});

router.delete("/admin/job-milestones/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(jobMilestonesTable).where(eq(jobMilestonesTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    handleError(res, err);
  }
});

// ─── Documents ──────────────────────────────────────────────────

router.post("/admin/job-documents", async (req, res) => {
  try {
    const payload = {
      jobId: Number(req.body?.jobId),
      label: String(req.body?.label ?? "").trim(),
      category: req.body?.category ? String(req.body.category) : null,
      url: String(req.body?.url ?? "").trim(),
    };
    if (!payload.label) {
      res.status(400).json({ error: "Document needs a label." });
      return;
    }
    if (!/^https?:\/\//i.test(payload.url)) {
      res.status(400).json({ error: "Document URL must start with http:// or https://." });
      return;
    }
    const parsed = insertJobDocumentSchema.safeParse(payload);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid document payload.", issues: parsed.error.issues });
      return;
    }
    const [row] = await db.insert(jobDocumentsTable).values(parsed.data).returning();
    res.status(201).json({ row });
  } catch (err) {
    handleError(res, err);
  }
});

router.delete("/admin/job-documents/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(jobDocumentsTable).where(eq(jobDocumentsTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    handleError(res, err);
  }
});

// ─── Inspections ────────────────────────────────────────────────

router.post("/admin/job-inspections", async (req, res) => {
  try {
    const parsed = insertJobInspectionSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid inspection payload.", issues: parsed.error.issues });
      return;
    }
    const [row] = await db.insert(jobInspectionsTable).values(parsed.data).returning();
    res.status(201).json({ row });
  } catch (err) {
    handleError(res, err);
  }
});

router.patch("/admin/job-inspections/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const update: Record<string, unknown> = {};
    for (const k of ["inspectionType", "status", "date", "timeWindow", "county", "inspectorNotes"] as const) {
      if (k in req.body) update[k] = req.body[k] ?? null;
    }
    if (
      typeof update.status === "string" &&
      !["upcoming", "passed", "failed", "reinspection"].includes(update.status)
    ) {
      res.status(400).json({ error: "Invalid status." });
      return;
    }
    const [row] = await db
      .update(jobInspectionsTable)
      .set(update)
      .where(eq(jobInspectionsTable.id, id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Inspection not found." });
      return;
    }
    res.json({ row });
  } catch (err) {
    handleError(res, err);
  }
});

router.delete("/admin/job-inspections/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(jobInspectionsTable).where(eq(jobInspectionsTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    handleError(res, err);
  }
});

// ─── Service requests inbox ─────────────────────────────────────

/**
 * GET /admin/inspections/upcoming — every inspection that still needs
 * to happen, across all jobs, joined with the job title and customer
 * so the dashboard can show "what's coming up" without N round trips.
 * Dates are free text on this table, so we don't sort by date — most
 * recently added first is the useful order for the office.
 */
router.get("/admin/inspections/upcoming", async (_req, res) => {
  try {
    const rows = await db
      .select({
        id: jobInspectionsTable.id,
        jobId: jobInspectionsTable.jobId,
        inspectionType: jobInspectionsTable.inspectionType,
        status: jobInspectionsTable.status,
        date: jobInspectionsTable.date,
        timeWindow: jobInspectionsTable.timeWindow,
        county: jobInspectionsTable.county,
        createdAt: jobInspectionsTable.createdAt,
        jobTitle: jobsTable.title,
        customerId: jobsTable.customerId,
        customerName: customersTable.name,
        // Lets the dashboard exclude the seeded demo customer from
        // "needs attention" without a second lookup.
        accountNumber: customersTable.accountNumber,
      })
      .from(jobInspectionsTable)
      .leftJoin(jobsTable, eq(jobInspectionsTable.jobId, jobsTable.id))
      .leftJoin(customersTable, eq(jobsTable.customerId, customersTable.id))
      .where(sql`${jobInspectionsTable.status} IN ('upcoming', 'reinspection')`)
      .orderBy(desc(jobInspectionsTable.createdAt));
    res.json({ rows });
  } catch (err) {
    handleError(res, err);
  }
});

router.get("/admin/service-requests", async (_req, res) => {
  try {
    const rows = await db
      .select({
        id: serviceRequestsTable.id,
        createdAt: serviceRequestsTable.createdAt,
        customerId: serviceRequestsTable.customerId,
        jobId: serviceRequestsTable.jobId,
        requestType: serviceRequestsTable.requestType,
        message: serviceRequestsTable.message,
        status: serviceRequestsTable.status,
        customerName: customersTable.name,
        customerPhone: customersTable.phone,
        accountNumber: customersTable.accountNumber,
      })
      .from(serviceRequestsTable)
      .leftJoin(customersTable, eq(serviceRequestsTable.customerId, customersTable.id))
      .orderBy(desc(serviceRequestsTable.createdAt));
    res.json({ rows });
  } catch (err) {
    handleError(res, err);
  }
});

router.patch("/admin/service-requests/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const status = String(req.body?.status ?? "");
    if (!["new", "in_progress", "closed"].includes(status)) {
      res.status(400).json({ error: "Invalid status." });
      return;
    }
    const [row] = await db
      .update(serviceRequestsTable)
      .set({ status })
      .where(eq(serviceRequestsTable.id, id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Request not found." });
      return;
    }
    res.json({ row });
  } catch (err) {
    handleError(res, err);
  }
});

// ─── Customer messages ──────────────────────────────────────────

router.get("/admin/customer-messages", async (_req, res) => {
  try {
    const rows = await db
      .select({
        id: customerMessagesTable.id,
        createdAt: customerMessagesTable.createdAt,
        customerId: customerMessagesTable.customerId,
        sender: customerMessagesTable.sender,
        authorName: customerMessagesTable.authorName,
        body: customerMessagesTable.body,
        readByTeam: customerMessagesTable.readByTeam,
        customerName: customersTable.name,
        accountNumber: customersTable.accountNumber,
      })
      .from(customerMessagesTable)
      .leftJoin(customersTable, eq(customerMessagesTable.customerId, customersTable.id))
      .orderBy(asc(customerMessagesTable.createdAt));
    res.json({ rows });
  } catch (err) {
    handleError(res, err);
  }
});

/** Staff reply to a customer's portal thread. */
router.post("/admin/customer-messages", async (req, res) => {
  try {
    const customerId = Number(req.body?.customerId);
    const body = String(req.body?.body ?? "").trim();
    if (!Number.isFinite(customerId) || !body) {
      res.status(400).json({ error: "customerId and body are required." });
      return;
    }
    const authorName = res.locals.admin?.name
      ? String(res.locals.admin.name)
      : "CHS Team";
    const [row] = await db
      .insert(customerMessagesTable)
      .values({ customerId, sender: "team", authorName, body, readByTeam: true })
      .returning();
    res.status(201).json({ row });
  } catch (err) {
    handleError(res, err);
  }
});

/** Mark a customer's whole thread read. */
router.post("/admin/customer-messages/mark-read/:customerId", async (req, res) => {
  try {
    const customerId = Number(req.params.customerId);
    await db
      .update(customerMessagesTable)
      .set({ readByTeam: true })
      .where(eq(customerMessagesTable.customerId, customerId));
    res.json({ ok: true });
  } catch (err) {
    handleError(res, err);
  }
});

export default router;
