import { sql, type SQL } from "drizzle-orm";
import { db } from "@workspace/db";
import { logger } from "./logger";

/**
 * Self-healing: create any tables + columns this build expects but
 * that aren't yet in the live database. Runs once at server boot.
 *
 * Each statement is wrapped in its own try/catch so a single failure
 * (permissions, transient lock, unrelated column already exists with
 * a different definition) doesn't abandon the rest — the previous
 * version bailed on the first error and left later ALTERs unrun,
 * which is exactly what caused "column X does not exist" on the
 * admin dashboard even though the ALTER was in this file.
 *
 * CREATE TABLE IF NOT EXISTS and ALTER TABLE ADD COLUMN IF NOT
 * EXISTS are both Postgres-native no-ops when the target already
 * exists, so this is safe to run on every boot.
 */
export async function ensureTables(): Promise<void> {
  const results: { ok: number; failed: number } = { ok: 0, failed: 0 };

  const step = async (name: string, statement: SQL) => {
    try {
      await db.execute(statement);
      results.ok++;
    } catch (err) {
      results.failed++;
      logger.warn(
        { err: err instanceof Error ? err.message : err, step: name },
        "[ensureTables] step failed — continuing with next statement",
      );
    }
  };

  // ─── Core tables (originally created by drizzle-kit push, but
  // we re-declare them here as CREATE-IF-NOT-EXISTS so a fresh
  // deploy against an empty database can still come up). ─────
  await step(
    "leads",
    sql`
      CREATE TABLE IF NOT EXISTS "leads" (
        "id" serial PRIMARY KEY,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "service_type" text,
        "plan" text,
        "address" text,
        "zip" text,
        "roof_age" text,
        "urgency" text,
        "name" text,
        "phone" text,
        "email" text,
        "message" text,
        "source" text,
        "referrer" text,
        "user_agent" text,
        "ip" text
      );
    `,
  );
  // Defensive ADDs for leads — every column that appears in queries
  // gets its own idempotent ALTER so any historical schema drift
  // heals on boot.
  for (const col of [
    ["service_type", "text"],
    ["plan", "text"],
    ["address", "text"],
    ["zip", "text"],
    ["roof_age", "text"],
    ["urgency", "text"],
    ["name", "text"],
    ["phone", "text"],
    ["email", "text"],
    ["message", "text"],
    ["source", "text"],
    ["referrer", "text"],
    ["user_agent", "text"],
    ["ip", "text"],
  ]) {
    await step(
      `leads.${col[0]}`,
      sql.raw(`ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "${col[0]}" ${col[1]};`),
    );
  }

  await step(
    "estimates",
    sql`
      CREATE TABLE IF NOT EXISTS "estimates" (
        "id" serial PRIMARY KEY,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "name" text,
        "phone" text,
        "email" text,
        "address" text,
        "material" text,
        "color_option" text,
        "pitch" text,
        "complexity" text,
        "footprint_sf" text,
        "squares" text,
        "low_estimate" text,
        "high_estimate" text,
        "mid_estimate" text,
        "extra" jsonb,
        "source" text,
        "referrer" text,
        "user_agent" text,
        "ip" text
      );
    `,
  );
  for (const col of [
    ["name", "text"],
    ["phone", "text"],
    ["email", "text"],
    ["address", "text"],
    ["material", "text"],
    ["color_option", "text"],
    ["pitch", "text"],
    ["complexity", "text"],
    ["footprint_sf", "text"],
    ["squares", "text"],
    ["low_estimate", "text"],
    ["high_estimate", "text"],
    ["mid_estimate", "text"],
    ["extra", "jsonb"],
    ["source", "text"],
    ["referrer", "text"],
    ["user_agent", "text"],
    ["ip", "text"],
  ]) {
    await step(
      `estimates.${col[0]}`,
      sql.raw(`ALTER TABLE "estimates" ADD COLUMN IF NOT EXISTS "${col[0]}" ${col[1]};`),
    );
  }

  await step(
    "customers",
    sql`
      CREATE TABLE IF NOT EXISTS "customers" (
        "id" serial PRIMARY KEY,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "account_number" text NOT NULL UNIQUE,
        "name" text NOT NULL,
        "email" text,
        "phone" text,
        "address" text,
        "notes" text
      );
    `,
  );
  for (const col of [
    ["email", "text"],
    ["phone", "text"],
    ["address", "text"],
    ["notes", "text"],
  ]) {
    await step(
      `customers.${col[0]}`,
      sql.raw(`ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "${col[0]}" ${col[1]};`),
    );
  }

  await step(
    "jobs",
    sql`
      CREATE TABLE IF NOT EXISTS "jobs" (
        "id" serial PRIMARY KEY,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "customer_id" integer NOT NULL REFERENCES "customers"("id") ON DELETE CASCADE,
        "title" text NOT NULL,
        "service_type" text,
        "status" text NOT NULL DEFAULT 'scheduled',
        "progress" integer NOT NULL DEFAULT 0,
        "start_date" text,
        "estimated_completion" text,
        "photo_album_url" text,
        "project_manager" text,
        "project_manager_phone" text,
        "roof_system" text,
        "warranty_manufacturer" text,
        "warranty_workmanship" text,
        "warranty_start_date" text
      );
    `,
  );
  // Belt-and-braces for jobs (columns added over time).
  for (const col of [
    ["service_type", "text"],
    ["start_date", "text"],
    ["estimated_completion", "text"],
    ["photo_album_url", "text"],
    ["project_manager", "text"],
    ["project_manager_phone", "text"],
    ["roof_system", "text"],
    ["warranty_manufacturer", "text"],
    ["warranty_workmanship", "text"],
    ["warranty_start_date", "text"],
  ]) {
    await step(
      `jobs.${col[0]}`,
      sql.raw(`ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "${col[0]}" ${col[1]};`),
    );
  }

  await step(
    "job_updates",
    sql`
      CREATE TABLE IF NOT EXISTS "job_updates" (
        "id" serial PRIMARY KEY,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "job_id" integer NOT NULL REFERENCES "jobs"("id") ON DELETE CASCADE,
        "body" text NOT NULL,
        "author_name" text
      );
    `,
  );

  await step(
    "job_photos",
    sql`
      CREATE TABLE IF NOT EXISTS "job_photos" (
        "id" serial PRIMARY KEY,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "job_id" integer NOT NULL REFERENCES "jobs"("id") ON DELETE CASCADE,
        "url" text NOT NULL,
        "caption" text,
        "category" text
      );
    `,
  );
  await step(
    "job_photos.category",
    sql`ALTER TABLE "job_photos" ADD COLUMN IF NOT EXISTS "category" text;`,
  );

  // ─── Analytics ────────────────────────────────────────────
  await step(
    "page_views",
    sql`
      CREATE TABLE IF NOT EXISTS "page_views" (
        "id" serial PRIMARY KEY,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "path" text NOT NULL,
        "referrer" text,
        "user_agent" text,
        "session_id" text,
        "country" text
      );
    `,
  );
  await step("page_views_created_at_idx", sql`CREATE INDEX IF NOT EXISTS "page_views_created_at_idx" ON "page_views" ("created_at");`);
  await step("page_views_path_idx", sql`CREATE INDEX IF NOT EXISTS "page_views_path_idx" ON "page_views" ("path");`);
  await step("page_views_session_idx", sql`CREATE INDEX IF NOT EXISTS "page_views_session_idx" ON "page_views" ("session_id");`);

  // ─── Admin auth ───────────────────────────────────────────
  await step(
    "admins",
    sql`
      CREATE TABLE IF NOT EXISTS "admins" (
        "id" serial PRIMARY KEY,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "email" text NOT NULL UNIQUE,
        "name" text NOT NULL,
        "password_hash" text NOT NULL,
        "role" text NOT NULL DEFAULT 'admin',
        "last_login_at" timestamp with time zone
      );
    `,
  );
  await step("admins_email_idx", sql`CREATE INDEX IF NOT EXISTS "admins_email_idx" ON "admins" ("email");`);
  await step(
    "admin_invites",
    sql`
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
    `,
  );
  await step("admin_invites_token_idx", sql`CREATE INDEX IF NOT EXISTS "admin_invites_token_idx" ON "admin_invites" ("token");`);
  await step(
    "admin_sessions",
    sql`
      CREATE TABLE IF NOT EXISTS "admin_sessions" (
        "id" serial PRIMARY KEY,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "expires_at" timestamp with time zone NOT NULL,
        "token" text NOT NULL UNIQUE,
        "admin_id" integer NOT NULL,
        "user_agent" text
      );
    `,
  );
  await step("admin_sessions_token_idx", sql`CREATE INDEX IF NOT EXISTS "admin_sessions_token_idx" ON "admin_sessions" ("token");`);

  // ─── Portal v2 ────────────────────────────────────────────
  await step(
    "job_albums",
    sql`
      CREATE TABLE IF NOT EXISTS "job_albums" (
        "id" serial PRIMARY KEY,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "job_id" integer NOT NULL REFERENCES "jobs"("id") ON DELETE CASCADE,
        "label" text NOT NULL,
        "url" text NOT NULL,
        "sort_order" integer NOT NULL DEFAULT 0
      );
    `,
  );
  await step("job_albums_job_idx", sql`CREATE INDEX IF NOT EXISTS "job_albums_job_idx" ON "job_albums" ("job_id");`);
  await step(
    "job_milestones",
    sql`
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
    `,
  );
  await step("job_milestones_job_idx", sql`CREATE INDEX IF NOT EXISTS "job_milestones_job_idx" ON "job_milestones" ("job_id");`);
  await step(
    "job_documents",
    sql`
      CREATE TABLE IF NOT EXISTS "job_documents" (
        "id" serial PRIMARY KEY,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "job_id" integer NOT NULL REFERENCES "jobs"("id") ON DELETE CASCADE,
        "label" text NOT NULL,
        "category" text,
        "url" text NOT NULL
      );
    `,
  );
  await step("job_documents_job_idx", sql`CREATE INDEX IF NOT EXISTS "job_documents_job_idx" ON "job_documents" ("job_id");`);
  await step(
    "job_inspections",
    sql`
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
    `,
  );
  await step("job_inspections_job_idx", sql`CREATE INDEX IF NOT EXISTS "job_inspections_job_idx" ON "job_inspections" ("job_id");`);
  await step(
    "service_requests",
    sql`
      CREATE TABLE IF NOT EXISTS "service_requests" (
        "id" serial PRIMARY KEY,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "customer_id" integer NOT NULL REFERENCES "customers"("id") ON DELETE CASCADE,
        "job_id" integer,
        "request_type" text NOT NULL,
        "message" text,
        "status" text NOT NULL DEFAULT 'new'
      );
    `,
  );
  await step("service_requests_customer_idx", sql`CREATE INDEX IF NOT EXISTS "service_requests_customer_idx" ON "service_requests" ("customer_id");`);
  await step(
    "customer_messages",
    sql`
      CREATE TABLE IF NOT EXISTS "customer_messages" (
        "id" serial PRIMARY KEY,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "customer_id" integer NOT NULL REFERENCES "customers"("id") ON DELETE CASCADE,
        "sender" text NOT NULL,
        "author_name" text,
        "body" text NOT NULL,
        "read_by_team" boolean NOT NULL DEFAULT false
      );
    `,
  );
  await step("customer_messages_customer_idx", sql`CREATE INDEX IF NOT EXISTS "customer_messages_customer_idx" ON "customer_messages" ("customer_id");`);

  // ─── SMS outreach ─────────────────────────────────────────
  await step(
    "sms_contacts",
    sql`
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
    `,
  );
  await step(
    "sms_messages",
    sql`
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
    `,
  );
  await step("sms_messages_contact_idx", sql`CREATE INDEX IF NOT EXISTS "sms_messages_contact_idx" ON "sms_messages" ("contact_id");`);
  await step(
    "outreach_settings",
    sql`
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
    `,
  );

  logger.info(
    { ok: results.ok, failed: results.failed },
    "[ensureTables] done",
  );
}
