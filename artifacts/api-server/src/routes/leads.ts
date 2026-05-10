import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, leadsTable, insertLeadSchema } from "@workspace/db";
import { adminAuth } from "../middlewares/adminAuth";
import { handleError } from "../lib/handleError";

const router: IRouter = Router();

router.post("/leads", async (req, res) => {
  try {
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
  } catch (err) {
    handleError(res, err);
  }
});

router.get("/admin/leads", adminAuth, async (_req, res) => {
  try {
    const rows = await db.select().from(leadsTable).orderBy(desc(leadsTable.createdAt));
    res.json({ rows });
  } catch (err) {
    handleError(res, err);
  }
});

export default router;
