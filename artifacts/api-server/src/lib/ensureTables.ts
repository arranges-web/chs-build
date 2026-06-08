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

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "admins" (
        "id" serial PRIMARY KEY,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "email" text NOT NULL UNIQUE,
        "name" text NOT NULL,
        "password_hash" text NOT NULL,
        "role" text NOT NULL DEFAULT 'admin',
        "last_login_at" timestamp with time zone
      );
    `);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "admins_email_idx" ON "admins" ("email");`);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "admin_invites" (
        "id" serial PRIMARY KEY,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "expires_at" timestamp with time zone NOT NULL,
        "used_at" timestamp with time zone,
        "token" text NOT NULL UNIQUE,
        "email" text,
        "name" text,
        "role" text NOT NULL DEFAULT 'admin',
        "created_by_label" text
      );
    `);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "admin_invites_token_idx" ON "admin_invites" ("token");`);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "admin_sessions" (
        "id" serial PRIMARY KEY,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "expires_at" timestamp with time zone NOT NULL,
        "token" text NOT NULL UNIQUE,
        "admin_id" integer NOT NULL,
        "user_agent" text
      );
    `);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "admin_sessions_token_idx" ON "admin_sessions" ("token");`);

    // Newer schemas — single column additions go here. ADD COLUMN IF
    // NOT EXISTS is Postgres-native and idempotent so it's safe to run
    // on every boot.
    await db.execute(sql`ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "photo_album_url" text;`);

    logger.info("[ensureTables] page_views + admins + jobs.photo_album_url ready");
  } catch (err) {
    logger.warn(
      { err: err instanceof Error ? err.message : err },
      "[ensureTables] failed — analytics endpoints will degrade until pnpm db push is run",
    );
  }
}
