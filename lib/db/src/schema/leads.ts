import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

/**
 * Every quote-request that comes in through the public site is
 * persisted here so the admin can review them later. The schema is
 * intentionally permissive (most fields nullable) because we want
 * to capture whatever the customer gave us even if some fields are
 * blank.
 */
export const leadsTable = pgTable("leads", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),

  // What they want
  serviceType: text("service_type"),
  plan: text("plan"), // populated when coming from a maintenance-plan card

  // Property
  address: text("address"),
  zip: text("zip"),
  roofAge: text("roof_age"),
  urgency: text("urgency"),

  // Contact
  name: text("name"),
  phone: text("phone"),
  email: text("email"),
  message: text("message"),

  // Diagnostics
  source: text("source"), // "contact-form", "landing-page", "chat", etc.
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  ip: text("ip"),
});

export const insertLeadSchema = createInsertSchema(leadsTable).omit({
  id: true,
  createdAt: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leadsTable.$inferSelect;

/**
 * Snapshots from the public roof estimator. We store the raw inputs
 * and computed outputs so the admin can see exactly what the
 * customer saw.
 */
export const estimatesTable = pgTable("estimates", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),

  // Optional contact identity (estimator does not require it)
  name: text("name"),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),

  // Estimator inputs
  material: text("material"),
  colorOption: text("color_option"), // "yes" | "no"
  pitch: text("pitch"),
  complexity: text("complexity"),
  footprintSf: text("footprint_sf"),

  // Computed outputs (stored as text so we don't fight float precision)
  squares: text("squares"),
  lowEstimate: text("low_estimate"),
  highEstimate: text("high_estimate"),
  midEstimate: text("mid_estimate"),

  // Anything extra
  extra: jsonb("extra"),

  // Diagnostics
  source: text("source"),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  ip: text("ip"),
});

export const insertEstimateSchema = createInsertSchema(estimatesTable).omit({
  id: true,
  createdAt: true,
});

export type InsertEstimate = z.infer<typeof insertEstimateSchema>;
export type Estimate = typeof estimatesTable.$inferSelect;
