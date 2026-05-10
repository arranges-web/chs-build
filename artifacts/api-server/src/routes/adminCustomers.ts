import { Router, type IRouter } from "express";
import { eq, desc, sql } from "drizzle-orm";
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
import { handleError } from "../lib/handleError";

const router: IRouter = Router();

router.use("/admin", adminAuth);

// ─── Customers ──────────────────────────────────────────────────

router.get("/admin/customers", async (_req, res) => {
  try {
    const rows = await db.select().from(customersTable).orderBy(desc(customersTable.createdAt));
    res.json({ rows });
  } catch (err) {
    handleError(res, err);
  }
});

router.get("/admin/customers/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const [customer] = await db.select().from(customersTable).where(eq(customersTable.id, id));
    if (!customer) {
      res.status(404).json({ error: "Customer not found." });
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
          .where(sql`${jobUpdatesTable.jobId} = ANY (${jobIds})`)
          .orderBy(desc(jobUpdatesTable.createdAt))
      : [];
    const photos = jobIds.length
      ? await db
          .select()
          .from(jobPhotosTable)
          .where(sql`${jobPhotosTable.jobId} = ANY (${jobIds})`)
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
  } catch (err) {
    handleError(res, err);
  }
});

router.post("/admin/customers", async (req, res) => {
  try {
    const body = req.body ?? {};
    const name = String(body.name ?? "").trim();
    if (!name) {
      res.status(400).json({ error: "Name is required." });
      return;
    }
    const payload = {
      name,
      email: body.email ? String(body.email).trim().toLowerCase() : null,
      phone: body.phone ? String(body.phone).trim() : null,
      address: body.address ? String(body.address).trim() : null,
      notes: body.notes ? String(body.notes) : null,
      accountNumber: body.accountNumber
        ? String(body.accountNumber).trim().toUpperCase()
        : generateAccountNumber(),
    };
    const parsed = insertCustomerSchema.safeParse(payload);
    if (!parsed.success) {
      res
        .status(400)
        .json({ error: "Invalid customer payload.", issues: parsed.error.issues });
      return;
    }
    const [row] = await db.insert(customersTable).values(parsed.data).returning();
    res.status(201).json({ row });
  } catch (err) {
    handleError(res, err);
  }
});

router.patch("/admin/customers/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const update: Record<string, unknown> = {};
    for (const k of ["name", "email", "phone", "address", "notes"] as const) {
      if (k in req.body) update[k] = req.body[k] ?? null;
    }
    if (typeof update.email === "string") update.email = (update.email as string).toLowerCase();
    const [row] = await db
      .update(customersTable)
      .set(update)
      .where(eq(customersTable.id, id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Customer not found." });
      return;
    }
    res.json({ row });
  } catch (err) {
    handleError(res, err);
  }
});

// ─── Jobs ───────────────────────────────────────────────────────

router.post("/admin/jobs", async (req, res) => {
  try {
    const parsed = insertJobSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({ error: "Invalid job payload.", issues: parsed.error.issues });
      return;
    }
    const [row] = await db.insert(jobsTable).values(parsed.data).returning();
    res.status(201).json({ row });
  } catch (err) {
    handleError(res, err);
  }
});

router.patch("/admin/jobs/:id", async (req, res) => {
  try {
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
      res.status(404).json({ error: "Job not found." });
      return;
    }
    res.json({ row });
  } catch (err) {
    handleError(res, err);
  }
});

router.delete("/admin/jobs/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    await db.delete(jobsTable).where(eq(jobsTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    handleError(res, err);
  }
});

// ─── Updates ────────────────────────────────────────────────────

router.post("/admin/job-updates", async (req, res) => {
  try {
    const parsed = insertJobUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({ error: "Invalid update payload.", issues: parsed.error.issues });
      return;
    }
    const [row] = await db.insert(jobUpdatesTable).values(parsed.data).returning();
    res.status(201).json({ row });
  } catch (err) {
    handleError(res, err);
  }
});

router.delete("/admin/job-updates/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    await db.delete(jobUpdatesTable).where(eq(jobUpdatesTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    handleError(res, err);
  }
});

// ─── Photos ─────────────────────────────────────────────────────

router.post("/admin/job-photos", async (req, res) => {
  try {
    const parsed = insertJobPhotoSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({ error: "Invalid photo payload.", issues: parsed.error.issues });
      return;
    }
    const [row] = await db.insert(jobPhotosTable).values(parsed.data).returning();
    res.status(201).json({ row });
  } catch (err) {
    handleError(res, err);
  }
});

router.delete("/admin/job-photos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    await db.delete(jobPhotosTable).where(eq(jobPhotosTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    handleError(res, err);
  }
});

export default router;
