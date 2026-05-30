import { Router, type IRouter } from "express";
import { sql, desc, eq } from "drizzle-orm";
import {
  db,
  customersTable,
  jobsTable,
  leadsTable,
  estimatesTable,
  pageViewsTable,
} from "@workspace/db";
import { adminAuth } from "../middlewares/adminAuth";
import { handleError } from "../lib/handleError";

const router: IRouter = Router();

router.use("/admin", adminAuth);

/**
 * GET /api/admin/jobs
 *
 * Returns every job across every customer, with the customer's
 * display name + email + phone joined in. Used by the new "Projects"
 * admin view so the team can see all active work in one place.
 */
router.get("/admin/jobs", async (_req, res) => {
  try {
    const rows = await db
      .select({
        id: jobsTable.id,
        createdAt: jobsTable.createdAt,
        customerId: jobsTable.customerId,
        title: jobsTable.title,
        serviceType: jobsTable.serviceType,
        status: jobsTable.status,
        progress: jobsTable.progress,
        startDate: jobsTable.startDate,
        estimatedCompletion: jobsTable.estimatedCompletion,
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

/**
 * GET /api/admin/analytics?days=30
 *
 * Aggregated view of recent pageview data + counts of leads,
 * estimates, customers and jobs. Drives the admin Dashboard and
 * Analytics screens.
 */
router.get("/admin/analytics", async (req, res) => {
  try {
    const daysRaw = Number(req.query.days ?? 30);
    const days = Math.max(1, Math.min(180, Number.isFinite(daysRaw) ? daysRaw : 30));

    // We use raw SQL for the time-bucket queries so we can group by
    // a day boundary on the server side rather than pulling every
    // row down.
    const [
      pageviewsByDayResult,
      pageviewsByPathResult,
      pageviewsByReferrerResult,
      totalsResult,
    ] = await Promise.all([
      db.execute<{ day: string; views: number; sessions: number }>(sql`
        SELECT
          to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS day,
          COUNT(*)::int AS views,
          COUNT(DISTINCT session_id)::int AS sessions
        FROM page_views
        WHERE created_at >= now() - (${days} || ' days')::interval
        GROUP BY day
        ORDER BY day ASC
      `),
      db.execute<{ path: string; views: number }>(sql`
        SELECT path, COUNT(*)::int AS views
        FROM page_views
        WHERE created_at >= now() - (${days} || ' days')::interval
        GROUP BY path
        ORDER BY views DESC
        LIMIT 10
      `),
      db.execute<{ referrer: string; views: number }>(sql`
        SELECT COALESCE(NULLIF(referrer, ''), '(direct)') AS referrer, COUNT(*)::int AS views
        FROM page_views
        WHERE created_at >= now() - (${days} || ' days')::interval
        GROUP BY referrer
        ORDER BY views DESC
        LIMIT 10
      `),
      db.execute<{
        total_views: number;
        total_sessions: number;
        new_leads: number;
        new_estimates: number;
        new_customers: number;
        active_jobs: number;
      }>(sql`
        SELECT
          (SELECT COUNT(*) FROM page_views WHERE created_at >= now() - (${days} || ' days')::interval)::int AS total_views,
          (SELECT COUNT(DISTINCT session_id) FROM page_views WHERE created_at >= now() - (${days} || ' days')::interval)::int AS total_sessions,
          (SELECT COUNT(*) FROM leads WHERE created_at >= now() - (${days} || ' days')::interval)::int AS new_leads,
          (SELECT COUNT(*) FROM estimates WHERE created_at >= now() - (${days} || ' days')::interval)::int AS new_estimates,
          (SELECT COUNT(*) FROM customers WHERE created_at >= now() - (${days} || ' days')::interval)::int AS new_customers,
          (SELECT COUNT(*) FROM jobs WHERE status IN ('scheduled','in_progress'))::int AS active_jobs
      `),
    ]);

    const pageviewsByDay = (pageviewsByDayResult.rows as Array<{
      day: string;
      views: number;
      sessions: number;
    }>) ?? [];
    const pageviewsByPath = (pageviewsByPathResult.rows as Array<{
      path: string;
      views: number;
    }>) ?? [];
    const pageviewsByReferrer = (pageviewsByReferrerResult.rows as Array<{
      referrer: string;
      views: number;
    }>) ?? [];
    const totals = (totalsResult.rows[0] as {
      total_views: number;
      total_sessions: number;
      new_leads: number;
      new_estimates: number;
      new_customers: number;
      active_jobs: number;
    }) ?? {
      total_views: 0,
      total_sessions: 0,
      new_leads: 0,
      new_estimates: 0,
      new_customers: 0,
      active_jobs: 0,
    };

    res.json({
      days,
      totals: {
        views: Number(totals.total_views) || 0,
        sessions: Number(totals.total_sessions) || 0,
        leads: Number(totals.new_leads) || 0,
        estimates: Number(totals.new_estimates) || 0,
        customers: Number(totals.new_customers) || 0,
        activeJobs: Number(totals.active_jobs) || 0,
      },
      pageviewsByDay: pageviewsByDay.map((r) => ({
        day: r.day,
        views: Number(r.views) || 0,
        sessions: Number(r.sessions) || 0,
      })),
      topPaths: pageviewsByPath.map((r) => ({ path: r.path, views: Number(r.views) || 0 })),
      topReferrers: pageviewsByReferrer.map((r) => ({
        referrer: r.referrer,
        views: Number(r.views) || 0,
      })),
    });
  } catch (err) {
    handleError(res, err);
  }
});

// Suppress unused import warning for tables consumed inside raw SQL.
void leadsTable;
void estimatesTable;
void pageViewsTable;

export default router;
