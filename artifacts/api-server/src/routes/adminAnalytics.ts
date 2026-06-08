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
 * GET /api/admin/jobs — every job + customer info joined. Powers
 * the new admin "Projects" view.
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
        photoAlbumUrl: jobsTable.photoAlbumUrl,
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

async function pageViewsExist(): Promise<boolean> {
  try {
    const check = await db.execute<{ exists: boolean }>(sql`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'page_views'
      ) AS exists
    `);
    const row = check.rows[0] as { exists?: boolean } | undefined;
    return Boolean(row?.exists);
  } catch {
    return false;
  }
}

/**
 * GET /api/admin/analytics?days=30 — aggregates for the dashboard
 * + Analytics screen. Gracefully degrades to zeros if page_views
 * isn't migrated yet so the dashboard never breaks.
 */
router.get("/admin/analytics", async (req, res) => {
  try {
    const daysRaw = Number(req.query.days ?? 30);
    const days = Math.max(1, Math.min(180, Number.isFinite(daysRaw) ? daysRaw : 30));

    const hasPageViews = await pageViewsExist();

    // Pageview-derived aggregates run only when the table exists.
    let pageviewsByDay: Array<{ day: string; views: number; sessions: number }> = [];
    let topPaths: Array<{ path: string; views: number }> = [];
    let topReferrers: Array<{ referrer: string; views: number }> = [];
    let totalViews = 0;
    let totalSessions = 0;

    if (hasPageViews) {
      const [byDay, byPath, byRef] = await Promise.all([
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
      ]);
      pageviewsByDay = (byDay.rows ?? []).map((r) => ({
        day: String(r.day),
        views: Number(r.views) || 0,
        sessions: Number(r.sessions) || 0,
      }));
      topPaths = (byPath.rows ?? []).map((r) => ({
        path: String(r.path),
        views: Number(r.views) || 0,
      }));
      topReferrers = (byRef.rows ?? []).map((r) => ({
        referrer: String(r.referrer),
        views: Number(r.views) || 0,
      }));
      totalViews = pageviewsByDay.reduce((s, d) => s + d.views, 0);
      // Distinct-session count across the whole range
      const sessionsRow = await db.execute<{ s: number }>(sql`
        SELECT COUNT(DISTINCT session_id)::int AS s
        FROM page_views
        WHERE created_at >= now() - (${days} || ' days')::interval
      `);
      totalSessions = Number((sessionsRow.rows[0] as { s?: number } | undefined)?.s ?? 0);
    }

    // CRM totals always work — those tables exist from day one.
    const crm = await db.execute<{
      new_leads: number;
      new_estimates: number;
      new_customers: number;
      active_jobs: number;
    }>(sql`
      SELECT
        (SELECT COUNT(*) FROM leads WHERE created_at >= now() - (${days} || ' days')::interval)::int AS new_leads,
        (SELECT COUNT(*) FROM estimates WHERE created_at >= now() - (${days} || ' days')::interval)::int AS new_estimates,
        (SELECT COUNT(*) FROM customers WHERE created_at >= now() - (${days} || ' days')::interval)::int AS new_customers,
        (SELECT COUNT(*) FROM jobs WHERE status IN ('scheduled','in_progress'))::int AS active_jobs
    `);
    const crmRow = (crm.rows[0] as
      | {
          new_leads?: number;
          new_estimates?: number;
          new_customers?: number;
          active_jobs?: number;
        }
      | undefined) ?? {};

    res.json({
      days,
      pageviewsTable: hasPageViews,
      totals: {
        views: totalViews,
        sessions: totalSessions,
        leads: Number(crmRow.new_leads) || 0,
        estimates: Number(crmRow.new_estimates) || 0,
        customers: Number(crmRow.new_customers) || 0,
        activeJobs: Number(crmRow.active_jobs) || 0,
      },
      pageviewsByDay,
      topPaths,
      topReferrers,
    });
  } catch (err) {
    handleError(res, err);
  }
});

// Keep the import explicit; the table is referenced inside raw SQL.
void leadsTable;
void estimatesTable;
void pageViewsTable;

export default router;
