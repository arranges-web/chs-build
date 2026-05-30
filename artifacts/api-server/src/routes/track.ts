import { Router, type IRouter } from "express";
import { db, pageViewsTable } from "@workspace/db";
import { handleError } from "../lib/handleError";

const router: IRouter = Router();

/**
 * POST /api/track
 *
 * Public, anonymous pageview tracker. The front-end fires this on
 * every route change. We capture just enough to chart "traffic by
 * day / by page / by session" in the admin dashboard — no IPs and
 * no PII.
 */
router.post("/track", async (req, res) => {
  try {
    const path = String(req.body?.path ?? "").slice(0, 512);
    if (!path) {
      res.status(400).json({ error: "Missing path" });
      return;
    }
    const referrer = req.body?.referrer ? String(req.body.referrer).slice(0, 512) : null;
    const sessionId = req.body?.sessionId ? String(req.body.sessionId).slice(0, 64) : null;
    const userAgent = (req.header("user-agent") ?? "").slice(0, 512) || null;
    // Cloud providers commonly forward the country in a header — log
    // it if present. Never fail if it's missing.
    const country =
      (req.header("cf-ipcountry") ||
        req.header("x-vercel-ip-country") ||
        req.header("x-country") ||
        "") || null;

    await db.insert(pageViewsTable).values({
      path,
      referrer,
      sessionId,
      userAgent,
      country: country ? String(country).slice(0, 8) : null,
    });
    res.json({ ok: true });
  } catch (err) {
    // Tracking should never block UX — swallow DB errors as 204 so
    // the front-end keeps going. Log to the API console for debug.
    if (typeof console !== "undefined") {
      // eslint-disable-next-line no-console
      console.warn("[track] failed:", err instanceof Error ? err.message : err);
    }
    void handleError;
    res.status(204).end();
  }
});

export default router;
