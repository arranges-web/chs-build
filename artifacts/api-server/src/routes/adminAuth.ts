import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, adminsTable, adminInvitesTable } from "@workspace/db";
import { adminAuth } from "../middlewares/adminAuth";
import { handleError } from "../lib/handleError";
import { generateToken, hashPassword, passwordTooWeak, verifyPassword } from "../lib/passwords";
import {
  COOKIE_NAME,
  SESSION_DAYS,
  createAdminSession,
  destroyAdminSession,
  envKeyMatches,
  extractSessionToken,
  resolveAdminSession,
} from "../lib/adminSession";

const router: IRouter = Router();

// Invite link lifetime — 7 days. Plenty of time for the recipient
// to set up an account; not so long that a stale link is a risk.
const INVITE_DAYS = 7;

/**
 * Cookie is a convenience only. The SPA stores the token returned in
 * the JSON body and sends it as `Authorization: Bearer` on every
 * request — that's what actually authenticates it. We still set the
 * cookie so same-origin browsers get it for free, but with
 * SameSite=None+Secure when we're behind HTTPS so it also survives
 * cross-site fetches where possible.
 */
function setSessionCookie(req: import("express").Request, res: import("express").Response, token: string) {
  const isHttps =
    req.secure ||
    (req.header("x-forwarded-proto") ?? "").split(",")[0].trim() === "https";
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isHttps,
    sameSite: isHttps ? "none" : "lax",
    maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

function clearSessionCookie(res: import("express").Response) {
  res.clearCookie(COOKIE_NAME, { path: "/" });
}

/**
 * POST /api/admin/auth/invites — bootstrap-protected.
 *
 * Generates a one-time invite link. The legacy ADMIN_KEY header
 * still works here so the first/root admin can create invites
 * before any account exists. After they accept their own invite,
 * the resulting account can be used to invite teammates.
 */
router.post("/admin/auth/invites", adminAuth, async (req, res) => {
  try {
    const email = req.body?.email ? String(req.body.email).trim().toLowerCase() : null;
    const name = req.body?.name ? String(req.body.name).trim() : null;
    const label = req.body?.label ? String(req.body.label).slice(0, 64) : "admin";
    const token = generateToken();
    const expires = new Date(Date.now() + INVITE_DAYS * 24 * 60 * 60 * 1000);

    const [row] = await db
      .insert(adminInvitesTable)
      .values({
        token,
        email,
        name,
        role: "admin",
        expiresAt: expires,
        createdByLabel: label,
      })
      .returning();

    res.json({
      ok: true,
      invite: {
        token: row.token,
        email: row.email,
        name: row.name,
        expiresAt: row.expiresAt,
      },
    });
  } catch (err) {
    handleError(res, err);
  }
});

/**
 * GET /api/admin/auth/invites/:token — public.
 *
 * Used by the /admin/join page to validate the URL and preload the
 * registration form. Returns 404 if the token is unknown, expired,
 * or already used.
 */
router.get("/admin/auth/invites/:token", async (req, res) => {
  try {
    const token = String(req.params.token);
    const [row] = await db
      .select()
      .from(adminInvitesTable)
      .where(eq(adminInvitesTable.token, token))
      .limit(1);
    if (!row) {
      res.status(404).json({ error: "This invite link is invalid or has been used." });
      return;
    }
    if (row.usedAt) {
      res.status(410).json({ error: "This invite link has already been used." });
      return;
    }
    if (row.expiresAt && new Date(row.expiresAt).getTime() < Date.now()) {
      res.status(410).json({ error: "This invite link has expired. Ask for a fresh one." });
      return;
    }
    res.json({
      invite: {
        email: row.email,
        name: row.name,
        role: row.role,
      },
    });
  } catch (err) {
    handleError(res, err);
  }
});

/**
 * POST /api/admin/auth/register — public.
 *
 * Exchanges an invite token + the user's chosen name/email/password
 * for an admin account. Creates a session and sets the cookie so the
 * user is logged in immediately.
 */
router.post("/admin/auth/register", async (req, res) => {
  try {
    const token = String(req.body?.token ?? "");
    const password = String(req.body?.password ?? "");
    let email = req.body?.email ? String(req.body.email).trim().toLowerCase() : "";
    const name = req.body?.name ? String(req.body.name).trim() : "";

    const tooWeak = passwordTooWeak(password);
    if (tooWeak) {
      res.status(400).json({ error: tooWeak });
      return;
    }
    if (!name) {
      res.status(400).json({ error: "Please tell us your name." });
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: "That email doesn't look right." });
      return;
    }

    const [invite] = await db
      .select()
      .from(adminInvitesTable)
      .where(eq(adminInvitesTable.token, token))
      .limit(1);
    if (!invite) {
      res.status(404).json({ error: "Invalid invite." });
      return;
    }
    if (invite.usedAt) {
      res.status(410).json({ error: "This invite has already been used." });
      return;
    }
    if (invite.expiresAt && new Date(invite.expiresAt).getTime() < Date.now()) {
      res.status(410).json({ error: "This invite has expired." });
      return;
    }
    // If the invite was locked to a specific email, enforce it.
    if (invite.email && invite.email.toLowerCase() !== email) {
      email = invite.email.toLowerCase();
    }

    // Reject duplicate emails (no point creating a second account).
    const [existing] = await db
      .select()
      .from(adminsTable)
      .where(eq(adminsTable.email, email))
      .limit(1);
    if (existing) {
      res.status(409).json({ error: "An admin account already exists for that email." });
      return;
    }

    const passwordHash = await hashPassword(password);
    const [admin] = await db
      .insert(adminsTable)
      .values({
        email,
        name,
        passwordHash,
        role: invite.role ?? "admin",
        lastLoginAt: new Date(),
      })
      .returning();

    // Burn the invite.
    await db
      .update(adminInvitesTable)
      .set({ usedAt: new Date() })
      .where(eq(adminInvitesTable.id, invite.id));

    const { token: sessionToken, expiresAt } = await createAdminSession(
      admin.id,
      req.header("user-agent"),
    );
    setSessionCookie(req, res, sessionToken);

    res.status(201).json({
      ok: true,
      // The SPA stores this and sends it as `Authorization: Bearer`.
      token: sessionToken,
      expiresAt,
      admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
    });
  } catch (err) {
    handleError(res, err);
  }
});

/**
 * POST /api/admin/auth/login — public.
 *
 * Email + password → session cookie. Constant-ish-time false response
 * on bad email so we don't leak whether the email is registered.
 */
router.post("/admin/auth/login", async (req, res) => {
  try {
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const password = String(req.body?.password ?? "");
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

    const [admin] = await db
      .select()
      .from(adminsTable)
      .where(eq(adminsTable.email, email))
      .limit(1);
    // Always run a bcrypt compare even on miss to keep timing stable.
    const ok =
      admin != null && (await verifyPassword(password, admin.passwordHash));
    if (!admin || !ok) {
      res.status(401).json({ error: "That email and password don't match." });
      return;
    }

    await db
      .update(adminsTable)
      .set({ lastLoginAt: new Date() })
      .where(eq(adminsTable.id, admin.id));

    const { token: sessionToken, expiresAt } = await createAdminSession(
      admin.id,
      req.header("user-agent"),
    );
    setSessionCookie(req, res, sessionToken);

    res.json({
      ok: true,
      // The SPA stores this and sends it as `Authorization: Bearer`.
      token: sessionToken,
      expiresAt,
      admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
    });
  } catch (err) {
    handleError(res, err);
  }
});

/**
 * POST /api/admin/auth/logout — public.
 *
 * Deletes the session row (from bearer OR cookie) and clears the
 * cookie. Safe to call even if there's no active session.
 */
router.post("/admin/auth/logout", async (req, res) => {
  try {
    const token = extractSessionToken(req);
    if (token) await destroyAdminSession(token);
    clearSessionCookie(res);
    res.json({ ok: true });
  } catch (err) {
    handleError(res, err);
  }
});

/**
 * GET /api/admin/auth/me — returns who is logged in. Used by the
 * admin SPA on boot to restore a session from the stored token.
 * Also accepts the ADMIN_KEY header for the bootstrap workflow.
 */
router.get("/admin/auth/me", async (req, res) => {
  try {
    const token = extractSessionToken(req);
    if (token) {
      const admin = await resolveAdminSession(token);
      if (admin) {
        res.json({ ok: true, via: "session", admin });
        return;
      }
    }
    if (envKeyMatches(req)) {
      res.json({ ok: true, via: "admin-key", admin: null });
      return;
    }
    res.status(401).json({ error: "Not signed in." });
  } catch (err) {
    handleError(res, err);
  }
});

export default router;
