import type { Response } from "express";

/**
 * Walk an error's cause chain and concatenate all messages. Drizzle
 * wraps Postgres errors in a `DrizzleError` whose top-level message
 * is just "Failed query: <sql>" — the actual "column X does not
 * exist" text sits on `.cause`. Without this, the admin UI shows a
 * useless SQL blob instead of the real reason.
 */
function fullMessage(err: unknown): string {
  const parts: string[] = [];
  let current: unknown = err;
  const seen = new Set<unknown>();
  while (current && !seen.has(current)) {
    seen.add(current);
    if (current instanceof Error) {
      if (current.message) parts.push(current.message);
      current = (current as { cause?: unknown }).cause;
    } else {
      parts.push(String(current));
      current = null;
    }
  }
  return parts.join(" · ");
}

/**
 * Translate a thrown error into a useful JSON response. We try hard
 * to surface common operational errors (missing table, missing DB,
 * unique-constraint conflicts) so the admin UI can show a real
 * message instead of "save failed".
 */
export function handleError(res: Response, err: unknown) {
  const msg = fullMessage(err);

  // Postgres "relation does not exist" — schema hasn't been pushed
  if (/relation\s+".*"\s+does not exist/i.test(msg)) {
    const table = /relation\s+"([^"]+)"/i.exec(msg)?.[1];
    res.status(500).json({
      error:
        `Database table "${table ?? "unknown"}" doesn't exist yet.\n\n` +
        `Fix: in the Replit shell, run:\n  pnpm --filter @workspace/db run push\n\n` +
        `Then reload this page.`,
    });
    return;
  }

  // Postgres "column X does not exist" — schema drift, usually
  // means new deploy added a column but the DB hasn't been migrated.
  // Show the exact column so we know which ALTER to add to
  // ensureTables (or run drizzle-kit push once).
  if (/column\s+.+?\s+does not exist/i.test(msg)) {
    const column = /column\s+"?([^"]+?)"?\s+does not exist/i.exec(msg)?.[1];
    res.status(500).json({
      error:
        `Database is missing column "${column ?? "unknown"}".\n\n` +
        `Fix: in the Replit shell, run:\n  pnpm --filter @workspace/db run push\n\n` +
        `Then reload this page. (The server also self-heals common columns on next boot.)`,
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
