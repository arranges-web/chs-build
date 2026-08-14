import { Router, type IRouter } from "express";
import { eq, desc, inArray, sql } from "drizzle-orm";
import {
  db,
  customersTable,
  jobsTable,
  jobUpdatesTable,
  jobPhotosTable,
  jobAlbumsTable,
  insertCustomerSchema,
  insertJobSchema,
  insertJobUpdateSchema,
  insertJobPhotoSchema,
  insertJobAlbumSchema,
  jobMilestonesTable,
  jobDocumentsTable,
  jobInspectionsTable,
} from "@workspace/db";
import { asc } from "drizzle-orm";
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
          .where(inArray(jobUpdatesTable.jobId, jobIds))
          .orderBy(desc(jobUpdatesTable.createdAt))
      : [];
    // Strip legacy base64 data URLs from the admin response too — the
    // raw bytes would blow up the JSON payload and stall the admin UI.
    // The "Clear all photos" button removes the actual rows.
    const photos = jobIds.length
      ? (
          await db
            .select()
            .from(jobPhotosTable)
            .where(inArray(jobPhotosTable.jobId, jobIds))
            .orderBy(desc(jobPhotosTable.createdAt))
        ).filter((p) => typeof p.url === "string" && /^https?:\/\//i.test(p.url))
      : [];
    const albums = jobIds.length
      ? await db
          .select()
          .from(jobAlbumsTable)
          .where(inArray(jobAlbumsTable.jobId, jobIds))
          .orderBy(asc(jobAlbumsTable.sortOrder), asc(jobAlbumsTable.createdAt))
      : [];
    const milestones = jobIds.length
      ? await db
          .select()
          .from(jobMilestonesTable)
          .where(inArray(jobMilestonesTable.jobId, jobIds))
          .orderBy(asc(jobMilestonesTable.sortOrder), asc(jobMilestonesTable.createdAt))
      : [];
    const documents = jobIds.length
      ? await db
          .select()
          .from(jobDocumentsTable)
          .where(inArray(jobDocumentsTable.jobId, jobIds))
          .orderBy(asc(jobDocumentsTable.createdAt))
      : [];
    const inspections = jobIds.length
      ? await db
          .select()
          .from(jobInspectionsTable)
          .where(inArray(jobInspectionsTable.jobId, jobIds))
          .orderBy(asc(jobInspectionsTable.createdAt))
      : [];

    res.json({
      customer,
      jobs: jobs.map((j) => ({
        ...j,
        updates: updates.filter((u) => u.jobId === j.id),
        photos: photos.filter((p) => p.jobId === j.id),
        albums: albums.filter((a) => a.jobId === j.id),
        milestones: milestones.filter((m) => m.jobId === j.id),
        documents: documents.filter((d) => d.jobId === j.id),
        inspections: inspections.filter((i) => i.jobId === j.id),
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

// NOTE: this is the ONLY registration of GET /admin/jobs. A
// duplicate copy used to live in adminAnalytics.ts too, and because
// adminCustomersRouter mounts first, THIS handler always won —
// silently dropping any fields the other one added (like
// photo_album_url). Keep this the single source of truth.
router.get("/admin/jobs", async (_req, res) => {
  try {
    const rows = await db
      .select({
        id: jobsTable.id,
        customerId: jobsTable.customerId,
        title: jobsTable.title,
        serviceType: jobsTable.serviceType,
        status: jobsTable.status,
        progress: jobsTable.progress,
        startDate: jobsTable.startDate,
        estimatedCompletion: jobsTable.estimatedCompletion,
        photoAlbumUrl: jobsTable.photoAlbumUrl,
        createdAt: jobsTable.createdAt,
        customerName: customersTable.name,
        customerEmail: customersTable.email,
        customerPhone: customersTable.phone,
        accountNumber: customersTable.accountNumber,
      })
      .from(jobsTable)
      .leftJoin(customersTable, eq(jobsTable.customerId, customersTable.id))
      .orderBy(desc(jobsTable.createdAt));
    res.json({ rows });
  } catch (err) {
    handleError(res, err);
  }
});

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
      "photoAlbumUrl",
      "projectManager",
      "projectManagerPhone",
      "roofSystem",
      "warrantyManufacturer",
      "warrantyWorkmanship",
      "warrantyStartDate",
    ] as const) {
      if (k in req.body) update[k] = req.body[k] ?? null;
    }
    if (typeof update.photoAlbumUrl === "string") {
      const trimmed = (update.photoAlbumUrl as string).trim();
      update.photoAlbumUrl = trimmed.length === 0 ? null : trimmed;
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

/**
 * Bulk wipe every photo row for one job. Used by the admin "Clear all
 * uploaded photos" button so we can purge the legacy base64 blobs that
 * were dragging down the portal. By default we only purge data: URLs —
 * pass `?all=1` to nuke external URLs too.
 */
router.delete("/admin/jobs/:jobId/photos", async (req, res) => {
  try {
    const jobId = Number(req.params.jobId);
    if (!Number.isFinite(jobId)) {
      res.status(400).json({ error: "Invalid job id" });
      return;
    }
    const purgeAll = req.query.all === "1" || req.query.all === "true";
    if (purgeAll) {
      await db.delete(jobPhotosTable).where(eq(jobPhotosTable.jobId, jobId));
    } else {
      // Only legacy base64 rows. Postgres LIKE comparison on the text
      // column — safer than client-side filtering for huge rows.
      await db
        .delete(jobPhotosTable)
        .where(sql`${jobPhotosTable.jobId} = ${jobId} AND ${jobPhotosTable.url} LIKE 'data:%'`);
    }
    res.json({ ok: true });
  } catch (err) {
    handleError(res, err);
  }
});

// ─── Job albums (multiple labeled photo-gallery URLs per job) ──

router.post("/admin/job-albums", async (req, res) => {
  try {
    const payload = {
      jobId: Number(req.body?.jobId),
      label: String(req.body?.label ?? "").trim(),
      url: String(req.body?.url ?? "").trim(),
      sortOrder: Number(req.body?.sortOrder ?? 0),
    };
    if (!payload.label) {
      res.status(400).json({ error: "Album needs a label (e.g. \"Part 1 done\")." });
      return;
    }
    if (!payload.url || !/^https?:\/\//i.test(payload.url)) {
      res.status(400).json({ error: "Album URL must start with http:// or https://." });
      return;
    }
    const parsed = insertJobAlbumSchema.safeParse(payload);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid album payload.", issues: parsed.error.issues });
      return;
    }
    const [row] = await db.insert(jobAlbumsTable).values(parsed.data).returning();
    res.status(201).json({ row });
  } catch (err) {
    handleError(res, err);
  }
});

router.patch("/admin/job-albums/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const update: Record<string, unknown> = {};
    if ("label" in req.body) {
      const label = String(req.body.label ?? "").trim();
      if (!label) {
        res.status(400).json({ error: "Label can't be empty." });
        return;
      }
      update.label = label;
    }
    if ("url" in req.body) {
      const url = String(req.body.url ?? "").trim();
      if (!/^https?:\/\//i.test(url)) {
        res.status(400).json({ error: "URL must start with http:// or https://." });
        return;
      }
      update.url = url;
    }
    if ("sortOrder" in req.body) {
      const n = Number(req.body.sortOrder);
      update.sortOrder = Number.isFinite(n) ? Math.round(n) : 0;
    }
    const [row] = await db
      .update(jobAlbumsTable)
      .set(update)
      .where(eq(jobAlbumsTable.id, id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Album not found." });
      return;
    }
    res.json({ row });
  } catch (err) {
    handleError(res, err);
  }
});

router.delete("/admin/job-albums/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    await db.delete(jobAlbumsTable).where(eq(jobAlbumsTable.id, id));
    res.json({ ok: true });
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

// ─── Demo seed ─────────────────────────────────────────────────
//
// One-click "load the demo customer" for the admin. Calls into the
// shared seedDemo() so the shell command and the button do exactly
// the same thing. Query param `?reset=1` wipes and re-inserts —
// useful for going back to a clean state after clicking around.
router.post("/admin/demo", async (req, res) => {
  try {
    const { seedDemo } = await import("@workspace/db");
    const reset = req.query.reset === "1" || req.query.reset === "true";
    const result = await seedDemo({ reset });
    res.json({ ok: true, reset, ...result });
  } catch (err) {
    handleError(res, err);
  }
});

export default router;
