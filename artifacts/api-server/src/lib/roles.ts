import type { Response, NextFunction, Request } from "express";
import { db, jobsTable } from "@workspace/db";
import { and, eq } from "drizzle-orm";
import type { AdminContext } from "./adminSession";

/**
 * Two kinds of account, one gate.
 *
 *  - owner / admin : the office. Full access to everything.
 *  - crew          : a field crew member. Sees ONLY the jobs assigned
 *                    to them and can post progress on those. No leads,
 *                    no estimates, no customer CRM, no money, no
 *                    backups, no team management.
 *
 * "owner" is just an admin that can't be deleted (see adminTeam.ts).
 * Anything unrecognised is treated as crew — failing closed matters
 * more here than being permissive to a typo'd role.
 */
export type Role = "owner" | "admin" | "crew";

export const FULL_ACCESS_ROLES: readonly string[] = ["owner", "admin"];

export function isFullAccess(role: string | null | undefined): boolean {
  return FULL_ACCESS_ROLES.includes((role ?? "").toLowerCase());
}

export function isCrew(role: string | null | undefined): boolean {
  return !isFullAccess(role);
}

export function normalizeRole(role: string | null | undefined): Role {
  const r = (role ?? "").toLowerCase();
  if (r === "owner") return "owner";
  if (r === "admin") return "admin";
  return "crew";
}

/**
 * The admin resolved by adminAuth, if any. adminAuth stores it on
 * `res.locals.admin`. Key-auth (ADMIN_KEY) leaves it null — that's the
 * owner's recovery credential, so it counts as full access.
 */
export function contextOf(res: Response): AdminContext | null {
  return (res.locals?.["admin"] as AdminContext | undefined) ?? null;
}

/**
 * Full-access gate. Mount on any router or route a crew member must
 * never reach. Key-auth callers (no `req.admin`) pass — adminAuth has
 * already verified the ADMIN_KEY by the time this runs.
 */
export function requireFullAccess(_req: Request, res: Response, next: NextFunction): void {
  const admin = contextOf(res);
  if (!admin) {
    next();
    return;
  }
  if (isFullAccess(admin.role)) {
    next();
    return;
  }
  res.status(403).json({
    error:
      "Your account is a crew login — it only has access to the jobs assigned to you. Ask the owner if you need full access.",
  });
}

/**
 * True when this request may touch `jobId`. Admins may touch any job;
 * crew only their own. Used by every write route that takes a job id
 * so a crew member can't post updates onto someone else's project by
 * guessing the number.
 */
export async function canAccessJob(res: Response, jobId: number): Promise<boolean> {
  const admin = contextOf(res);
  if (!admin || isFullAccess(admin.role)) return true;
  if (!Number.isFinite(jobId)) return false;
  const rows = await db
    .select({ id: jobsTable.id })
    .from(jobsTable)
    .where(and(eq(jobsTable.id, jobId), eq(jobsTable.assignedAdminId, admin.id)))
    .limit(1);
  return rows.length === 1;
}

/**
 * Guard for a job-scoped write. Returns true when the caller may
 * proceed; otherwise it has already sent the response.
 */
export async function guardJob(res: Response, jobId: number): Promise<boolean> {
  if (await canAccessJob(res, jobId)) return true;
  res.status(403).json({ error: "That job isn't assigned to your account." });
  return false;
}
