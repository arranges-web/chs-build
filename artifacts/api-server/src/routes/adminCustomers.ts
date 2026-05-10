import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import {
  db,
  customersTable,
  jobsTable,
  jobUpdatesTable,
  jobPhotosTable,
  insertCustomerSchema,
  insertJobSchema,
  insertJobUpdateSchema,
  insertJobPhotoSchema,
} from "@workspace/db";
import { adminAuth } from "../middlewares/adminAuth";
import { generateAccountNumber } from "../lib/accountNumber";

const router: IRouter = Router();

router.use("/admin", adminAuth);

// ─── Customers ──────────────────────────────────────────────────

/** GET /api/admin/customers — list all customers, newest first. */
router.get("/admin/customers", async (_req, res) => {
  const rows = await db.select().from(customersTable).orderBy(desc(customersTable.createdAt));
  res.json({ rows });
});

/** GET /api/admin/customers/:id — full detail with jobs/updates/photos. */
router.get("/admin/customers/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [customer] = await db.select().from(customersTable).where(eq(customersTable.id, id));
  if (!customer) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const jobs = await db
    .select()
    .from(jobsTable)
    .where(eq(jobsTable.customerId, id))
    .orderBy(desc(jobsTable.createdAt));
  const jobIds = jobs.map((j) => j.id);
  const updates = jobIds.length
    ? await db
        .select()
        .from(jobUpdatesTable)
        .where(eq(jobUpdatesTable.jobId, jobIds[0]))
        // when multiple jobs we'll fetch per-job in the future
        .orderBy(desc(jobUpdatesTable.createdAt))
    : [];
  const photos = jobIds.length
    ? await db
        .select()
        .from(jobPhotosTable)
        .where(eq(jobPhotosTable.jobId, jobIds[0]))
        .orderBy(desc(jobPhotosTable.createdAt))
    : [];
  res.json({
    customer,
    jobs: jobs.map((j) => ({
      ...j,
      updates: updates.filter((u) => u.jobId === j.id),
      photos: photos.filter((p) => p.jobId === j.id),
    })),
  });
});

/** POST /api/admin/customers — create. Auto-generates accountNumber. */
router.post("/admin/customers", async (req, res) => {
  const parsed = insertCustomerSchema
    .omit({ accountNumber: true })
    .extend(insertCustomerSchema.shape)
    .safeParse({
      ...req.body,
      accountNumber: req.body?.accountNumber || generateAccountNumber(),
    });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid payload", issues: parsed.error.issues });
    return;
  }
  const [row] = await db.insert(customersTable).values(parsed.data).returning();
  res.status(201).json({ row });
});

/** PATCH /api/admin/customers/:id — update. */
router.patch("/admin/customers/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const update: Record<string, unknown> = {};
  for (const k of ["name", "email", "phone", "address", "notes"] as const) {
    if (k in req.body) update[k] = req.body[k] ?? null;
  }
  const [row] = await db
    .update(customersTable)
    .set(update)
    .where(eq(customersTable.id, id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ row });
});

// ─── Jobs ───────────────────────────────────────────────────────

/** POST /api/admin/jobs — create. */
router.post("/admin/jobs", async (req, res) => {
  const parsed = insertJobSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid payload", issues: parsed.error.issues });
    return;
  }
  const [row] = await db.insert(jobsTable).values(parsed.data).returning();
  res.status(201).json({ row });
});

/** PATCH /api/admin/jobs/:id — update title/status/progress. */
router.patch("/admin/jobs/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const update: Record<string, unknown> = {};
  for (const k of [
    "title",
    "serviceType",
    "status",
    "progress",
    "startDate",
    "estimatedCompletion",
  ] as const) {
    if (k in req.body) update[k] = req.body[k] ?? null;
  }
  if ("progress" in update) {
    const n = Number(update.progress);
    update.progress = Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : 0;
  }
  const [row] = await db.update(jobsTable).set(update).where(eq(jobsTable.id, id)).returning();
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ row });
});

/** DELETE /api/admin/jobs/:id */
router.delete("/admin/jobs/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(jobsTable).where(eq(jobsTable.id, id));
  res.json({ ok: true });
});

// ─── Updates ────────────────────────────────────────────────────

router.post("/admin/job-updates", async (req, res) => {
  const parsed = insertJobUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid payload", issues: parsed.error.issues });
    return;
  }
  const [row] = await db.insert(jobUpdatesTable).values(parsed.data).returning();
  res.status(201).json({ row });
});

router.delete("/admin/job-updates/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(jobUpdatesTable).where(eq(jobUpdatesTable.id, id));
  res.json({ ok: true });
});

// ─── Photos ─────────────────────────────────────────────────────

router.post("/admin/job-photos", async (req, res) => {
  const parsed = insertJobPhotoSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid payload", issues: parsed.error.issues });
    return;
  }
  const [row] = await db.insert(jobPhotosTable).values(parsed.data).returning();
  res.status(201).json({ row });
});

router.delete("/admin/job-photos/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(jobPhotosTable).where(eq(jobPhotosTable.id, id));
  res.json({ ok: true });
});

export default router;
