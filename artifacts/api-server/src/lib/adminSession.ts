import type { Request } from "express";
import { eq } from "drizzle-orm";
import { db, adminSessionsTable, adminsTable } from "@workspace/db";
import { generateToken } from "./passwords";
import { logger } from "./logger";

/**
 * Single source of truth for admin sessions. Used by the adminAuth
 * middleware, the /admin/auth/* routes, and anything else that needs
 * to know "who is this request from?".
 *
 * Auth token transport, in priority order:
 *   1. `Authorization: Bearer <token>` header — the PRIMARY path. The
 *      SPA stores the token in localStorage and sends it explicitly on
 *      every admin request. This works through any proxy, across any
 *      origin, regardless of SameSite / Secure cookie rules — which is
 *      exactly what was breaking the cookie-only approach on Replit
 *      ("Leads: Unauthorized" everywhere while the UI looked signed in).
 *   2. `chs_admin_session` cookie — kept as a convenience for same-
 *      origin browsers; never relied on.
 *   3. `x-admin-key` — the env ADMIN_KEY bootstrap/recovery path,
 *      handled by the middleware (not here).
 */

export const COOKIE_NAME = "chs_admin_session";
export const SESSION_DAYS = 30;

export type AdminContext = {
  id: number;
  email: string;
  name: string;
  role: string;
};

/** Pull the session token off the request — bearer first, cookie second. */
export function extractSessionToken(req: Request): string | null {
  const auth = req.header("authorization") ?? "";
  if (/^bearer\s+/i.test(auth)) {
    const t = auth.replace(/^bearer\s+/i, "").trim();
    if (t) return t;
  }
  const cookie = (req.cookies?.[COOKIE_NAME] as string | undefined) ?? "";
  return cookie ? cookie : null;
}

/**
 * Resolve a token to an admin. Returns null when the token is unknown
 * or expired. Throws on a genuine DB failure — callers decide whether
 * to surface that (the middleware logs it so "Unauthorized" never
 * silently hides a broken table again).
 */
export async function resolveAdminSession(token: string): Promise<AdminContext | null> {
  const [session] = await db
    .select()
    .from(adminSessionsTable)
    .where(eq(adminSessionsTable.token, token))
    .limit(1);
  if (!session) return null;
  if (new Date(session.expiresAt).getTime() <= Date.now()) return null;

  const [admin] = await db
    .select()
    .from(adminsTable)
    .where(eq(adminsTable.id, session.adminId))
    .limit(1);
  if (!admin) return null;

  return { id: admin.id, email: admin.email, name: admin.name, role: admin.role };
}

/** Create a session row for an admin and return the opaque token. */
export async function createAdminSession(adminId: number, userAgent: string | undefined): Promise<{
  token: string;
  expiresAt: Date;
}> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.insert(adminSessionsTable).values({
    token,
    adminId,
    expiresAt,
    userAgent: (userAgent ?? "").slice(0, 512),
  });
  return { token, expiresAt };
}

/** Delete a session row. No-op if it doesn't exist. */
export async function destroyAdminSession(token: string): Promise<void> {
  try {
    await db.delete(adminSessionsTable).where(eq(adminSessionsTable.token, token));
  } catch (err) {
    logger.warn({ err: err instanceof Error ? err.message : err }, "[adminSession] destroy failed");
  }
}

/** Does the env-key bootstrap path match this request? */
export function envKeyMatches(req: Request): boolean {
  const expected = process.env["ADMIN_KEY"];
  const provided = req.header("x-admin-key");
  return Boolean(expected && provided && provided === expected);
}
