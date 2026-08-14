import { pgTable, serial, integer, text, timestamp, index } from "drizzle-orm/pg-core";

/**
 * People who can sign into /admin. Each one has a password they
 * picked through the invite link (no shared password). The legacy
 * ADMIN_KEY env var still works as a recovery / bootstrap key.
 */
export const adminsTable = pgTable(
  "admins",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    email: text("email").notNull().unique(),
    name: text("name").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: text("role").default("admin").notNull(),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  },
  (t) => ({
    emailIdx: index("admins_email_idx").on(t.email),
  }),
);

export type Admin = typeof adminsTable.$inferSelect;
export type InsertAdmin = typeof adminsTable.$inferInsert;

/**
 * One-time invite tokens. You generate one from the admin UI; the
 * URL is /admin/join?invite=<token>. Once used (or expired), it's
 * dead. If `email` is set on creation, the invite is locked to that
 * address; otherwise the recipient chooses one at registration.
 */
export const adminInvitesTable = pgTable(
  "admin_invites",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    token: text("token").notNull().unique(),
    email: text("email"),
    name: text("name"),
    role: text("role").default("admin").notNull(),
    createdByLabel: text("created_by_label"),
  },
  (t) => ({
    tokenIdx: index("admin_invites_token_idx").on(t.token),
  }),
);

export type AdminInvite = typeof adminInvitesTable.$inferSelect;
export type InsertAdminInvite = typeof adminInvitesTable.$inferInsert;

/**
 * Opaque session tokens. Set as an HTTP-only cookie at login; we
 * look them up on every authenticated request. Old sessions get
 * cleared by the expires_at filter — there's a small daily cleanup
 * we can add later if it becomes a problem.
 */
export const adminSessionsTable = pgTable(
  "admin_sessions",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    // NB: integer, NOT serial — we STORE the referenced admin's id
    // here, we don't want Postgres to auto-generate one. The
    // previous `serial("admin_id")` was a bug that was masked in
    // production only because ensureTables happened to create the
    // live column as `integer NOT NULL`. Anyone running a fresh
    // `drizzle-kit push` from the schema would have got an
    // auto-incrementing column that ignored the admin id passed
    // in — every session row would attach to the wrong admin.
    adminId: integer("admin_id").notNull(),
    userAgent: text("user_agent"),
  },
  (t) => ({
    tokenIdx: index("admin_sessions_token_idx").on(t.token),
  }),
);

export type AdminSession = typeof adminSessionsTable.$inferSelect;
