import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, leadsTable, insertLeadSchema } from "@workspace/db";
import { adminAuth } from "../middlewares/adminAuth";

const router: IRouter = Router();

/** POST /api/leads — public quote-request intake. */
router.post("/leads", async (req, res) => {
  const parsed = insertLeadSchema.safeParse({
    ...req.body,
    referrer: req.body?.referrer ?? req.header("referer") ?? null,
    userAgent: req.header("user-agent") ?? null,
    ip:
      (req.header("x-forwarded-for") || "").split(",")[0].trim() ||
      req.socket.remoteAddress ||
      null,
  });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid payload", issues: parsed.error.issues });
    return;
  }
  const [row] = await db.insert(leadsTable).values(parsed.data).returning();
  res.status(201).json({ ok: true, id: row.id });
});

/** GET /api/admin/leads — newest first. */
router.get("/admin/leads", adminAuth, async (_req, res) => {
  const rows = await db.select().from(leadsTable).orderBy(desc(leadsTable.createdAt));
  res.json({ rows });
});

export default router;
