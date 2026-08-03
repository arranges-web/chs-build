import { pgTable, serial, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

/**
 * One row per phone number we text with. A contact may be linked to a
 * lead and/or a customer. `optedOut` flips on an inbound STOP and
 * blocks all further outbound sends (TCPA). `aiEnabled` lets the team
 * pause the AI agent on a single conversation while keeping manual
 * sending available.
 */
export const smsContactsTable = pgTable("sms_contacts", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  phone: text("phone").notNull().unique(), // normalized E.164, e.g. +12395551234
  name: text("name"),
  leadId: integer("lead_id"),
  customerId: integer("customer_id"),
  consentSource: text("consent_source"), // web-form | roofr | customer | manual
  optedOut: boolean("opted_out").notNull().default(false),
  aiEnabled: boolean("ai_enabled").notNull().default(true),
  lastMessageAt: timestamp("last_message_at", { withTimezone: true }),
});

export const insertSmsContactSchema = createInsertSchema(smsContactsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertSmsContact = z.infer<typeof insertSmsContactSchema>;
export type SmsContact = typeof smsContactsTable.$inferSelect;

/**
 * Every SMS in or out, one row each. Outbound drafts awaiting human
 * approval sit at status "draft" until an admin approves (or the
 * agent is in auto-send mode). "simulated" means Twilio credentials
 * weren't configured — the message was logged but not transmitted.
 */
export const smsMessagesTable = pgTable("sms_messages", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  contactId: integer("contact_id").notNull(),
  direction: text("direction").notNull(), // inbound | outbound
  body: text("body").notNull(),
  status: text("status").notNull().default("sent"), // draft | sent | failed | simulated | received
  authorName: text("author_name"), // "AI Agent" | admin name | null for inbound
  twilioSid: text("twilio_sid"),
  errorMessage: text("error_message"),
  readByTeam: boolean("read_by_team").notNull().default(false),
});

export const insertSmsMessageSchema = createInsertSchema(smsMessagesTable).omit({
  id: true,
  createdAt: true,
});
export type InsertSmsMessage = z.infer<typeof insertSmsMessageSchema>;
export type SmsMessage = typeof smsMessagesTable.$inferSelect;

/**
 * Single-row config for the SMS outreach agent (row id 1). The admin
 * "SMS Outreach" tab edits this.
 */
export const outreachSettingsTable = pgTable("outreach_settings", {
  id: serial("id").primaryKey(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  agentName: text("agent_name").notNull().default("Riley"),
  // Extra persona/behavior instructions appended to the agent prompt.
  instructions: text("instructions"),
  // Text new website/Roofr leads automatically (the "outreach" half).
  autoEngageLeads: boolean("auto_engage_leads").notNull().default(false),
  // Reply to inbound texts automatically; when false the agent only
  // drafts and a human approves each send.
  autoReply: boolean("auto_reply").notNull().default(false),
  // Local quiet hours (24h). No automatic sends outside this window.
  sendWindowStart: integer("send_window_start").notNull().default(8), // 8am
  sendWindowEnd: integer("send_window_end").notNull().default(20), // 8pm
  timezone: text("timezone").notNull().default("America/New_York"),
});

export type OutreachSettings = typeof outreachSettingsTable.$inferSelect;
