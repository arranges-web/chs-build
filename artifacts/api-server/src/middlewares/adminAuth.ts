import type { RequestHandler } from "express";

/**
 * Shared-secret admin gate. Set ADMIN_KEY in the server environment;
 * any admin endpoint requires the same value in the `x-admin-key`
 * header. Not as strong as full auth — but appropriate for a small
 * business with one or two trusted admins, and we never log the
 * key.
 */
export const adminAuth: RequestHandler = (req, res, next) => {
  const expected = process.env.ADMIN_KEY;
  if (!expected) {
    res.status(503).json({
      error: "Admin API is not configured. Set ADMIN_KEY in the server environment.",
    });
    return;
  }
  const provided = req.header("x-admin-key");
  if (!provided || provided !== expected) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
};
