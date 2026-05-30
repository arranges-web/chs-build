import type { RequestHandler } from "express";
import { eq } from "drizzle-orm";
import { db, adminSessionsTable, adminsTable } from "@workspace/db";

/**
 * Admin gate. Accepts either:
 *
 *   1. The legacy `x-admin-key` header matching the ADMIN_KEY env
 *      var (used for bootstrap and recovery).
 *   2. A valid `chs_admin_session` cookie tied to a non-expired
 *      session row in the DB (used by every signed-in admin user).
 *
 * On success we set `res.locals.admin` to the resolved admin record
 * (or null when the request came via the env-key fallback), so route
 * handlers can attribute changes.
 */
const COOKIE_NAME = "chs_admin_session";

// `res.locals` is loosely typed as `Record<string, any>` upstream; we
// just write to it here and route handlers can read it back as
// `(res.locals.admin as AdminContext | null)` if they need to.

export const adminAuth: RequestHandler = async (req, res, next) => {
  // 1. Session cookie path
  const token = (req.cookies?.[COOKIE_NAME] as string | undefined) ?? null;
  if (token) {
    try {
      const [session] = await db
        .select()
        .from(adminSessionsTable)
        .where(eq(adminSessionsTable.token, token))
        .limit(1);
      if (session && new Date(session.expiresAt).getTime() > Date.now()) {
        const [admin] = await db
          .select()
          .from(adminsTable)
          .where(eq(adminsTable.id, session.adminId))
          .limit(1);
        if (admin) {
          res.locals.admin = {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
          };
          next();
          return;
        }
      }
    } catch {
      // Fall through to the env-key check rather than 500.
    }
  }

  // 2. Legacy env key — kept so the bootstrap flow keeps working
  // before any admin accounts exist.
  const expected = process.env["ADMIN_KEY"];
  const provided = req.header("x-admin-key");
  if (expected && provided && provided === expected) {
    res.locals.admin = null;
    next();
    return;
  }

  // No valid auth — distinguish between "not configured" and "not signed in".
  if (!expected && !token) {
    res.status(503).json({
      error: "Admin API is not configured yet. Set ADMIN_KEY or register an admin account.",
    });
    return;
  }
  res.status(401).json({ error: "Unauthorized" });
};
