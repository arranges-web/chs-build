import type { RequestHandler } from "express";
import { logger } from "../lib/logger";
import { envKeyMatches, extractSessionToken, resolveAdminSession } from "../lib/adminSession";

/**
 * Admin gate. Accepts, in order:
 *
 *   1. `Authorization: Bearer <token>` — a session token issued by
 *      /admin/auth/login or /admin/auth/register. PRIMARY path.
 *   2. `chs_admin_session` cookie carrying the same token.
 *   3. `x-admin-key` header matching the ADMIN_KEY env var — the
 *      bootstrap / recovery path so the first owner can get in before
 *      any account exists.
 *
 * On success `res.locals.admin` is the resolved admin (or null when
 * the request came in via the env key). A DB failure while resolving
 * the session is LOGGED and surfaced as a 500 with the real reason —
 * the previous version swallowed it and answered "Unauthorized", which
 * hid a broken admin_sessions table behind a misleading message.
 */
export const adminAuth: RequestHandler = async (req, res, next) => {
  const token = extractSessionToken(req);

  if (token) {
    try {
      const admin = await resolveAdminSession(token);
      if (admin) {
        res.locals.admin = admin;
        next();
        return;
      }
      // Token present but unknown/expired — fall through to the env
      // key in case the caller also sent it, then 401.
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.error({ err: msg }, "[adminAuth] session lookup failed");
      res.status(500).json({
        error: `Couldn't verify your session (database error: ${msg}). Reload the page; if it persists, sign out and back in.`,
      });
      return;
    }
  }

  if (envKeyMatches(req)) {
    res.locals.admin = null;
    next();
    return;
  }

  const expected = process.env["ADMIN_KEY"];
  if (!expected && !token) {
    res.status(503).json({
      error: "Admin API is not configured yet. Set ADMIN_KEY in Replit Secrets or register an admin account via an invite link.",
    });
    return;
  }

  res.status(401).json({
    error: token
      ? "Your session has expired. Sign out and sign back in."
      : "Not signed in. Sign in to continue.",
  });
};
