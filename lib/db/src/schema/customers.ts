import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

/**
 * Customers in the lightweight CRM. A customer can have many jobs.
 * Login on the public portal is by email OR accountNumber — we
 * generate a friendly account number on insert (e.g. CHS-A2B5K9).
 */
export const customersTable = pgTable("customers", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  accountNumber: text("account_number").notNull().unique(),
  name: text("name").notNull(),
  // Optional, but must be unique case-insensitively when present —
  // it's the portal login. The constraint is NOT declared here: it's
  // a partial expression index (lower(email) WHERE email IS NOT NULL)
  // that Drizzle can't express, created in the API server's
  // ensureTables.ts as "customers_email_lower_uq".
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  notes: text("notes"), // admin-only notes about the customer
});

export const insertCustomerSchema = createInsertSchema(customersTable).omit({
  id: true,
  createdAt: true,
});

export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customersTable.$inferSelect;

/**
 * One job per project (e.g. "Roof replacement — main house").
 * Status drives the badge; progress drives the progress bar.
 */
export const jobsTable = pgTable("jobs", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  customerId: integer("customer_id")
    .notNull()
    .references(() => customersTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  serviceType: text("service_type"), // installation, repair, etc.
  status: text("status").notNull().default("scheduled"), // scheduled | in_progress | complete | on_hold
  progress: integer("progress").notNull().default(0), // 0–100
  startDate: text("start_date"),
  estimatedCompletion: text("estimated_completion"),
  // External photo album URL (Google Photos shared album, Dropbox
  // folder, Drive folder, etc.). When set, the portal embeds/links to
  // it instead of relying on per-row uploads in job_photos. This
  // sidesteps the cost of stuffing base64 data URLs into Postgres and
  // lets the team manage their own gallery.
  photoAlbumUrl: text("photo_album_url"),
  // Portal dashboard fields
  projectManager: text("project_manager"),
  projectManagerPhone: text("project_manager_phone"),
  // The crew member this job belongs to. Nullable: unassigned jobs
  // are normal, and a job must survive the departure of the person
  // who ran it, so the FK is ON DELETE SET NULL rather than CASCADE.
  // Crew accounts can only see and update jobs where this is them.
  assignedAdminId: integer("assigned_admin_id"),
  // Warranty Center
  roofSystem: text("roof_system"), // e.g. "GAF Timberline HDZ Shingle System"
  warrantyManufacturer: text("warranty_manufacturer"),
  warrantyWorkmanship: text("warranty_workmanship"),
  warrantyStartDate: text("warranty_start_date"),
});

export const insertJobSchema = createInsertSchema(jobsTable).omit({
  id: true,
  createdAt: true,
});

export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobsTable.$inferSelect;

/**
 * Free-form text updates posted to the job timeline by the team.
 * The customer sees these in chronological order in their portal.
 */
export const jobUpdatesTable = pgTable("job_updates", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  jobId: integer("job_id")
    .notNull()
    .references(() => jobsTable.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  authorName: text("author_name"), // e.g. "Saul" / "Maria" / "CHS Team"
});

export const insertJobUpdateSchema = createInsertSchema(jobUpdatesTable).omit({
  id: true,
  createdAt: true,
});

export type InsertJobUpdate = z.infer<typeof insertJobUpdateSchema>;
export type JobUpdate = typeof jobUpdatesTable.$inferSelect;

/**
 * Photos attached to a job. We store URLs (Google Drive shareable
 * links, Dropbox, etc.) — no file upload yet to keep this simple.
 */
export const jobPhotosTable = pgTable("job_photos", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  jobId: integer("job_id")
    .notNull()
    .references(() => jobsTable.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  caption: text("caption"),
  // Gallery category: before | tear-off | deck-repairs | underlayment |
  // dry-in | installation | flashing | drone | final | warranty
  category: text("category"),
});

export const insertJobPhotoSchema = createInsertSchema(jobPhotosTable).omit({
  id: true,
  createdAt: true,
});

export type InsertJobPhoto = z.infer<typeof insertJobPhotoSchema>;
export type JobPhoto = typeof jobPhotosTable.$inferSelect;

/**
 * Per-job photo album links — many per job, each with a custom
 * label like "Part 1 done", "Final walkthrough", "Tear-off photos".
 * The portal embeds each album and the admin can reorder / rename
 * them at any time. This replaces the single `photoAlbumUrl`
 * column on `jobs` (which we keep around for backwards-compat).
 */
export const jobAlbumsTable = pgTable("job_albums", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  jobId: integer("job_id")
    .notNull()
    .references(() => jobsTable.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  url: text("url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertJobAlbumSchema = createInsertSchema(jobAlbumsTable).omit({
  id: true,
  createdAt: true,
});

export type InsertJobAlbum = z.infer<typeof insertJobAlbumSchema>;
export type JobAlbum = typeof jobAlbumsTable.$inferSelect;
