import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, estimatesTable, insertEstimateSchema } from "@workspace/db";
import { adminAuth } from "../middlewares/adminAuth";

const router: IRouter = Router();

/** POST /api/estimates — public estimator snapshot. */
router.post("/estimates", async (req, res) => {
  const parsed = insertEstimateSchema.safeParse({
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
  const [row] = await db.insert(estimatesTable).values(parsed.data).returning();
  res.status(201).json({ ok: true, id: row.id });
});

/** GET /api/admin/estimates — newest first. */
router.get("/admin/estimates", adminAuth, async (_req, res) => {
  const rows = await db
    .select()
    .from(estimatesTable)
    .orderBy(desc(estimatesTable.createdAt));
  res.json({ rows });
});

export default router;
