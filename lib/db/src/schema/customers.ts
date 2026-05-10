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
  email: text("email"), // optional but indexed via unique() below
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
});

export const insertJobPhotoSchema = createInsertSchema(jobPhotosTable).omit({
  id: true,
  createdAt: true,
});

export type InsertJobPhoto = z.infer<typeof insertJobPhotoSchema>;
export type JobPhoto = typeof jobPhotosTable.$inferSelect;
