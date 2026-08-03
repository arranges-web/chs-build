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

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "job_albums" (
        "id" serial PRIMARY KEY,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "job_id" integer NOT NULL REFERENCES "jobs"("id") ON DELETE CASCADE,
        "label" text NOT NULL,
        "url" text NOT NULL,
        "sort_order" integer NOT NULL DEFAULT 0
      );
    `);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "job_albums_job_idx" ON "job_albums" ("job_id");`);

    // Portal v2 — job fields for the dashboard + warranty center, and
    // photo categories for the gallery.
    await db.execute(sql`ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "project_manager" text;`);
    await db.execute(sql`ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "project_manager_phone" text;`);
    await db.execute(sql`ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "roof_system" text;`);
    await db.execute(sql`ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "warranty_manufacturer" text;`);
    await db.execute(sql`ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "warranty_workmanship" text;`);
    await db.execute(sql`ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "warranty_start_date" text;`);
    await db.execute(sql`ALTER TABLE "job_photos" ADD COLUMN IF NOT EXISTS "category" text;`);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "job_milestones" (
        "id" serial PRIMARY KEY,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "job_id" integer NOT NULL REFERENCES "jobs"("id") ON DELETE CASCADE,
        "title" text NOT NULL,
        "status" text NOT NULL DEFAULT 'pending',
        "sort_order" integer NOT NULL DEFAULT 0,
        "completed_date" text,
        "notes" text
      );
    `);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "job_milestones_job_idx" ON "job_milestones" ("job_id");`);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "job_documents" (
        "id" serial PRIMARY KEY,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "job_id" integer NOT NULL REFERENCES "jobs"("id") ON DELETE CASCADE,
        "label" text NOT NULL,
        "category" text,
        "url" text NOT NULL
      );
    `);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "job_documents_job_idx" ON "job_documents" ("job_id");`);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "job_inspections" (
        "id" serial PRIMARY KEY,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "job_id" integer NOT NULL REFERENCES "jobs"("id") ON DELETE CASCADE,
        "inspection_type" text NOT NULL,
        "status" text NOT NULL DEFAULT 'upcoming',
        "date" text,
        "time_window" text,
        "county" text,
        "inspector_notes" text
      );
    `);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "job_inspections_job_idx" ON "job_inspections" ("job_id");`);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "service_requests" (
        "id" serial PRIMARY KEY,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "customer_id" integer NOT NULL REFERENCES "customers"("id") ON DELETE CASCADE,
        "job_id" integer,
        "request_type" text NOT NULL,
        "message" text,
        "status" text NOT NULL DEFAULT 'new'
      );
    `);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "service_requests_customer_idx" ON "service_requests" ("customer_id");`);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "customer_messages" (
        "id" serial PRIMARY KEY,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "customer_id" integer NOT NULL REFERENCES "customers"("id") ON DELETE CASCADE,
        "sender" text NOT NULL,
        "author_name" text,
        "body" text NOT NULL,
        "read_by_team" boolean NOT NULL DEFAULT false
      );
    `);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "customer_messages_customer_idx" ON "customer_messages" ("customer_id");`);

    // SMS outreach — contacts, message log, and single-row agent settings.
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "sms_contacts" (
        "id" serial PRIMARY KEY,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "phone" text NOT NULL UNIQUE,
        "name" text,
        "lead_id" integer,
        "customer_id" integer,
        "consent_source" text,
        "opted_out" boolean NOT NULL DEFAULT false,
        "ai_enabled" boolean NOT NULL DEFAULT true,
        "last_message_at" timestamp with time zone
      );
    `);
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "sms_messages" (
        "id" serial PRIMARY KEY,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "contact_id" integer NOT NULL,
        "direction" text NOT NULL,
        "body" text NOT NULL,
        "status" text NOT NULL DEFAULT 'sent',
        "author_name" text,
        "twilio_sid" text,
        "error_message" text,
        "read_by_team" boolean NOT NULL DEFAULT false
      );
    `);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "sms_messages_contact_idx" ON "sms_messages" ("contact_id");`);
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "outreach_settings" (
        "id" serial PRIMARY KEY,
        "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
        "agent_name" text NOT NULL DEFAULT 'Riley',
        "instructions" text,
        "auto_engage_leads" boolean NOT NULL DEFAULT false,
        "auto_reply" boolean NOT NULL DEFAULT false,
        "send_window_start" integer NOT NULL DEFAULT 8,
        "send_window_end" integer NOT NULL DEFAULT 20,
        "timezone" text NOT NULL DEFAULT 'America/New_York'
      );
    `);

    logger.info("[ensureTables] core + portal v2 + sms outreach tables ready");
  } catch (err) {
    logger.warn(
      { err: err instanceof Error ? err.message : err },
      "[ensureTables] failed — analytics endpoints will degrade until pnpm db push is run",
    );
  }
}
