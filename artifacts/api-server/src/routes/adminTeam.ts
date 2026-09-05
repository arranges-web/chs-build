import { Router, type IRouter } from "express";
import { and, asc, count, eq, sql } from "drizzle-orm";
import { db, adminsTable, jobsTable, customersTable } from "@workspace/db";
import { adminAuth } from "../middlewares/adminAuth";
import { handleError } from "../lib/handleError";
import { contextOf, isFullAccess, normalizeRole, requireFullAccess } from "../lib/roles";

const router: IRouter = Router();

router.use("/admin", adminAuth);

/**
 * The crew member's whole world: the jobs assigned to them, with just
 * enough customer detail to actually show up and do the work (name,
 * address, phone). Deliberately NOT included: the customer's email
 * (that's their portal login), admin notes, and anything about money.
 *
 * Admins get the same endpoint so the "My jobs" view works for them
 * too — it just returns whatever is assigned to them personally.
 */
router.get("/admin/my-jobs", async (_req, res) => {
  try {
    const me = contextOf(res);
    if (!me) {
      // Key-auth (ADMIN_KEY) isn't a person, so it has no own jobs.
      res.json({ rows: [] });
      return;
    }
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
        customerPhone: customersTable.phone,
        customerAddress: customersTable.address,
        accountNumber: customersTable.accountNumber,
      })
      .from(jobsTable)
      .leftJoin(customersTable, eq(jobsTable.customerId, customersTable.id))
      .where(eq(jobsTable.assignedAdminId, me.id))
      .orderBy(asc(jobsTable.estimatedCompletion));
    res.json({ rows });
  } catch (err) {
    handleError(res, err);
  }
});

// ─── Everything below is office-only ────────────────────────────
router.use("/admin/team", requireFullAccess);

/**
 * The roster. One row per person who can sign in, with their role and
 * how many jobs are on their plate — the "clear way to see crew members
 * that have an account" the office asked for.
 */
router.get("/admin/team", async (_req, res) => {
  try {
    const members = await db
      .select({
        id: adminsTable.id,
        name: adminsTable.name,
        email: adminsTable.email,
        role: adminsTable.role,
        createdAt: adminsTable.createdAt,
        lastLoginAt: adminsTable.lastLoginAt,
      })
      .from(adminsTable)
      .orderBy(asc(adminsTable.name));

    // Assigned-job counts in one grouped query rather than N+1.
    const counts = await db
      .select({ adminId: jobsTable.assignedAdminId, n: count() })
      .from(jobsTable)
      .where(sql`${jobsTable.assignedAdminId} IS NOT NULL`)
      .groupBy(jobsTable.assignedAdminId);
    const byAdmin = new Map<number, number>();
    for (const c of counts) {
      if (typeof c.adminId === "number") byAdmin.set(c.adminId, Number(c.n));
    }

    const me = contextOf(res);
    res.json({
      rows: members.map((m) => ({
        ...m,
        role: normalizeRole(m.role),
        assignedJobs: byAdmin.get(m.id) ?? 0,
        isYou: me?.id === m.id,
      })),
      // The UI hides destructive controls on your own row and on the
      // owner; it still can't rely on that, so the server enforces it.
      meId: me?.id ?? null,
    });
  } catch (err) {
    handleError(res, err);
  }
});

/** Change someone's role (crew <-> admin). */
router.patch("/admin/team/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const role = normalizeRole(String(req.body?.role ?? ""));
    if (!["admin", "crew"].includes(role)) {
      res.status(400).json({ error: "Role must be either 'admin' or 'crew'." });
      return;
    }
    const [target] = await db.select().from(adminsTable).where(eq(adminsTable.id, id)).limit(1);
    if (!target) {
      res.status(404).json({ error: "That teammate no longer exists." });
      return;
    }
    if (normalizeRole(target.role) === "owner") {
      res.status(403).json({ error: "The owner account's role can't be changed." });
      return;
    }
    const me = contextOf(res);
    if (me?.id === id) {
      res.status(403).json({
        error: "You can't change your own role — ask another admin, or use the recovery key.",
      });
      return;
    }
    const [row] = await db
      .update(adminsTable)
      .set({ role })
      .where(eq(adminsTable.id, id))
      .returning({ id: adminsTable.id, name: adminsTable.name, role: adminsTable.role });
    res.json({ row });
  } catch (err) {
    handleError(res, err);
  }
});

/**
 * Remove a teammate's login. Their jobs are NOT deleted — the FK is
 * ON DELETE SET NULL, so the work stays and simply becomes unassigned.
 * The owner account can never be removed this way.
 */
router.delete("/admin/team/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const [target] = await db.select().from(adminsTable).where(eq(adminsTable.id, id)).limit(1);
    if (!target) {
      res.status(404).json({ error: "That teammate no longer exists." });
      return;
    }
    if (normalizeRole(target.role) === "owner") {
      res.status(403).json({ error: "The owner account can't be removed." });
      return;
    }
    const me = contextOf(res);
    if (me?.id === id) {
      res.status(403).json({ error: "You can't remove your own account while signed into it." });
      return;
    }
    const [{ n }] = await db
      .select({ n: count() })
      .from(jobsTable)
      .where(eq(jobsTable.assignedAdminId, id));
    await db.delete(adminsTable).where(eq(adminsTable.id, id));
    res.json({ ok: true, unassignedJobs: Number(n ?? 0) });
  } catch (err) {
    handleError(res, err);
  }
});

/** Assign (or clear) the crew member on a job. */
router.patch("/admin/jobs/:id/assignee", requireFullAccess, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const raw = req.body?.assignedAdminId;
    const assignedAdminId = raw === null || raw === "" || raw === undefined ? null : Number(raw);
    if (assignedAdminId !== null && !Number.isFinite(assignedAdminId)) {
      res.status(400).json({ error: "Invalid teammate id" });
      return;
    }
    if (assignedAdminId !== null) {
      const [exists] = await db
        .select({ id: adminsTable.id })
        .from(adminsTable)
        .where(eq(adminsTable.id, assignedAdminId))
        .limit(1);
      if (!exists) {
        res.status(404).json({ error: "That teammate no longer exists." });
        return;
      }
    }
    const [row] = await db
      .update(jobsTable)
      .set({ assignedAdminId })
      .where(eq(jobsTable.id, id))
      .returning({ id: jobsTable.id, assignedAdminId: jobsTable.assignedAdminId });
    if (!row) {
      res.status(404).json({ error: "Job not found." });
      return;
    }
    res.json({ row });
  } catch (err) {
    handleError(res, err);
  }
});

export default router;
