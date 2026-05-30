import { sql } from "drizzle-orm";
import { db } from "@workspace/db";
import { logger } from "./logger";

/**
 * Self-healing: create any tables this build expects but that aren't
 * yet in the live database. Runs once at server boot. We deliberately
 * use CREATE TABLE IF NOT EXISTS so it's idempotent and never destroys
 * data — the drizzle-kit "push" workflow remains the canonical way to
 * apply schema changes; this just covers the gap between a deploy
 * shipping new tables and the next manual push being run.
 */
export async function ensureTables(): Promise<void> {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "page_views" (
        "id" serial PRIMARY KEY,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "path" text NOT NULL,
        "referrer" text,
        "user_agent" text,
        "session_id" text,
        "country" text
      );
    `);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "page_views_created_at_idx" ON "page_views" ("created_at");`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "page_views_path_idx" ON "page_views" ("path");`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "page_views_session_idx" ON "page_views" ("session_id");`);
    logger.info("[ensureTables] page_views ready");
  } catch (err) {
    logger.warn(
      { err: err instanceof Error ? err.message : err },
      "[ensureTables] failed — analytics endpoints will degrade until pnpm db push is run",
    );
  }
}
