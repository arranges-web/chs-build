import type { Response } from "express";

/**
 * Translate a thrown error into a useful JSON response. We try hard
 * to surface common operational errors (missing table, missing DB,
 * unique-constraint conflicts) so the admin UI can show a real
 * message instead of "save failed".
 */
export function handleError(res: Response, err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);

  // Postgres "relation does not exist" — schema hasn't been pushed
  if (/relation\s+".*"\s+does not exist/i.test(msg)) {
    res.status(500).json({
      error:
        "Database tables are not set up yet. In the Replit shell run:\n\n  pnpm --filter @workspace/db run push\n\nThen reload this page.",
    });
    return;
  }

  // Unique conflict (email or account number collision)
  if (/duplicate key value|unique constraint/i.test(msg)) {
    res.status(409).json({
      error: "That email or account number is already in use.",
    });
    return;
  }

  // Foreign-key issues (referring to a deleted parent etc.)
  if (/foreign key constraint/i.test(msg)) {
    res.status(409).json({
      error: "Referenced record no longer exists. Refresh and try again.",
    });
    return;
  }

  // DB not configured at all
  if (/DATABASE_URL/i.test(msg)) {
    res.status(503).json({
      error:
        "Database is not configured on the server. Set DATABASE_URL in the Replit environment.",
    });
    return;
  }

  res.status(500).json({ error: msg || "Server error" });
}
