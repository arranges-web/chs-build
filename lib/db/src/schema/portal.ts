import { pgTable, serial, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { jobsTable, customersTable } from "./customers";

/**
 * Project timeline milestones shown in the customer portal
 * ("Contract Signed" → "Project Complete"). The admin creates these
 * per job (a default template is offered in the UI) and checks them
 * off as the project progresses.
 */
export const jobMilestonesTable = pgTable("job_milestones", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  jobId: integer("job_id")
    .notNull()
    .references(() => jobsTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  status: text("status").notNull().default("pending"), // pending | in_progress | complete
  sortOrder: integer("sort_order").notNull().default(0),
  completedDate: text("completed_date"), // freeform, e.g. "July 14"
  notes: text("notes"),
});

export const insertJobMilestoneSchema = createInsertSchema(jobMilestonesTable).omit({
  id: true,
  createdAt: true,
});
export type InsertJobMilestone = z.infer<typeof insertJobMilestoneSchema>;
export type JobMilestone = typeof jobMilestonesTable.$inferSelect;

/**
 * Documents Center — external links (Drive/Dropbox/etc.) to signed
 * contracts, permits, NOAs, warranties, invoices… Customers get a
 * download button per document.
 */
export const jobDocumentsTable = pgTable("job_documents", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  jobId: integer("job_id")
    .notNull()
    .references(() => jobsTable.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  category: text("category"), // contract | permit | insurance | noa | specs | color | change-order | warranty | invoice | receipt | other
  url: text("url").notNull(),
});

export const insertJobDocumentSchema = createInsertSchema(jobDocumentsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertJobDocument = z.infer<typeof insertJobDocumentSchema>;
export type JobDocument = typeof jobDocumentsTable.$inferSelect;

/**
 * Inspection Center — permit + inspection tracking, styled like
 * package tracking in the portal.
 */
export const jobInspectionsTable = pgTable("job_inspections", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  jobId: integer("job_id")
    .notNull()
    .references(() => jobsTable.id, { onDelete: "cascade" }),
  inspectionType: text("inspection_type").notNull(), // e.g. "Dry-In Inspection", "Final Inspection"
  status: text("status").notNull().default("upcoming"), // upcoming | passed | failed | reinspection
  date: text("date"),
  timeWindow: text("time_window"),
  county: text("county"),
  inspectorNotes: text("inspector_notes"),
});

export const insertJobInspectionSchema = createInsertSchema(jobInspectionsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertJobInspection = z.infer<typeof insertJobInspectionSchema>;
export type JobInspection = typeof jobInspectionsTable.$inferSelect;

/**
 * Customer-submitted requests from the portal (leak inspection,
 * warranty service, annual inspection, storm damage, maintenance,
 * general). These notify the office and show in the admin inbox.
 */
export const serviceRequestsTable = pgTable("service_requests", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  customerId: integer("customer_id")
    .notNull()
    .references(() => customersTable.id, { onDelete: "cascade" }),
  jobId: integer("job_id"),
  requestType: text("request_type").notNull(), // leak | warranty | annual | storm | maintenance | cleaning | general
  message: text("message"),
  status: text("status").notNull().default("new"), // new | in_progress | closed
});

export const insertServiceRequestSchema = createInsertSchema(serviceRequestsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertServiceRequest = z.infer<typeof insertServiceRequestSchema>;
export type ServiceRequest = typeof serviceRequestsTable.$inferSelect;

/**
 * Two-way customer ↔ team messaging. Customers post from the portal;
 * staff reply from the admin dashboard.
 */
export const customerMessagesTable = pgTable("customer_messages", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  customerId: integer("customer_id")
    .notNull()
    .references(() => customersTable.id, { onDelete: "cascade" }),
  sender: text("sender").notNull(), // customer | team
  authorName: text("author_name"),
  body: text("body").notNull(),
  readByTeam: boolean("read_by_team").notNull().default(false),
});

export const insertCustomerMessageSchema = createInsertSchema(customerMessagesTable).omit({
  id: true,
  createdAt: true,
});
export type InsertCustomerMessage = z.infer<typeof insertCustomerMessageSchema>;
export type CustomerMessage = typeof customerMessagesTable.$inferSelect;
