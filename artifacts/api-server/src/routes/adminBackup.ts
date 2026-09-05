import { Router, type IRouter } from "express";
import {
  db,
  adminsTable,
  customersTable,
  customerMessagesTable,
  estimatesTable,
  jobAlbumsTable,
  jobDocumentsTable,
  jobInspectionsTable,
  jobMilestonesTable,
  jobPhotosTable,
  jobUpdatesTable,
  jobsTable,
  leadsTable,
  outreachSettingsTable,
  pageViewsTable,
  serviceRequestsTable,
  smsContactsTable,
  smsMessagesTable,
} from "@workspace/db";
import { adminAuth } from "../middlewares/adminAuth";
import { handleError } from "../lib/handleError";
import { requireFullAccess } from "../lib/roles";

const router: IRouter = Router();

/**
 * GET /api/admin/backup — full JSON export of every business table.
 *
 * "Store it forever" insurance: the owner can download a complete
 * snapshot of customers, jobs, leads, estimates, portal content,
 * messages, and SMS history at any time, independent of the hosting
 * provider. One file, dated, opens in any editor, importable later.
 *
 * Deliberately excluded:
 *   - admin password hashes (accounts are listed; re-invite on restore)
 *   - admin_sessions / admin_invites (ephemeral, regenerate on demand)
 *
 * Gated by adminAuth like every other /admin route.
 */
router.get("/admin/backup", adminAuth, requireFullAccess, async (_req, res) => {
  try {
    const [
      customers,
      jobs,
      jobUpdates,
      jobPhotos,
      jobAlbums,
      jobMilestones,
      jobDocuments,
      jobInspections,
      serviceRequests,
      customerMessages,
      leads,
      estimates,
      smsContacts,
      smsMessages,
      outreachSettings,
      pageViews,
      adminsRaw,
    ] = await Promise.all([
      db.select().from(customersTable),
      db.select().from(jobsTable),
      db.select().from(jobUpdatesTable),
      // Legacy base64 photo rows can be enormous; keep only external URLs.
      db.select().from(jobPhotosTable).then((rows) =>
        rows.filter((p) => typeof p.url === "string" && /^https?:\/\//i.test(p.url)),
      ),
      db.select().from(jobAlbumsTable),
      db.select().from(jobMilestonesTable),
      db.select().from(jobDocumentsTable),
      db.select().from(jobInspectionsTable),
      db.select().from(serviceRequestsTable),
      db.select().from(customerMessagesTable),
      db.select().from(leadsTable),
      db.select().from(estimatesTable),
      db.select().from(smsContactsTable),
      db.select().from(smsMessagesTable),
      db.select().from(outreachSettingsTable),
      db.select().from(pageViewsTable),
      db.select().from(adminsTable),
    ]);

    // Strip password hashes — a backup on someone's laptop shouldn't
    // carry credentials. Accounts are still listed so you know who to
    // re-invite after a restore.
    const admins = adminsRaw.map(({ passwordHash: _omit, ...rest }) => rest);

    const tables = {
      customers,
      jobs,
      job_updates: jobUpdates,
      job_photos: jobPhotos,
      job_albums: jobAlbums,
      job_milestones: jobMilestones,
      job_documents: jobDocuments,
      job_inspections: jobInspections,
      service_requests: serviceRequests,
      customer_messages: customerMessages,
      leads,
      estimates,
      sms_contacts: smsContacts,
      sms_messages: smsMessages,
      outreach_settings: outreachSettings,
      page_views: pageViews,
      admins,
    };

    const counts = Object.fromEntries(
      Object.entries(tables).map(([k, v]) => [k, (v as unknown[]).length]),
    );

    const exportedAt = new Date();
    const stamp = exportedAt.toISOString().slice(0, 19).replace(/[:T]/g, "-");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="chs-roofing-backup-${stamp}.json"`);
    res.setHeader("Cache-Control", "no-store");
    res.json({
      format: "chs-roofing-backup",
      version: 1,
      exportedAt: exportedAt.toISOString(),
      counts,
      tables,
    });
  } catch (err) {
    handleError(res, err);
  }
});

export default router;
