import { pgTable, serial, text, timestamp, index } from "drizzle-orm/pg-core";

/**
 * One row per pageview. Stays anonymous — we capture path, referrer,
 * user agent, and a session id stored in the browser, but no IP and
 * no personally identifying data. Good enough to chart traffic in
 * the admin dashboard without needing Google Analytics.
 */
export const pageViewsTable = pgTable(
  "page_views",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    path: text("path").notNull(),
    referrer: text("referrer"),
    userAgent: text("user_agent"),
    sessionId: text("session_id"),
    country: text("country"),
  },
  (t) => ({
    createdAtIdx: index("page_views_created_at_idx").on(t.createdAt),
    pathIdx: index("page_views_path_idx").on(t.path),
    sessionIdIdx: index("page_views_session_idx").on(t.sessionId),
  }),
);

export type PageView = typeof pageViewsTable.$inferSelect;
export type InsertPageView = typeof pageViewsTable.$inferInsert;
