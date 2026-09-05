/**
 * The seeded demo customer (see lib/db/src/seed.ts).
 *
 * Demo data is deliberately VISIBLE where you'd browse it — Clients,
 * Projects, the customer portal — so the team can explore what a real
 * customer sees. But it must never appear in "what needs your
 * attention": the demo seeds unread messages, pending inspections,
 * and a job whose ETA has passed, all of which would show up as real
 * work and train the owner to ignore the badges.
 *
 * Every row that feeds a notification carries `accountNumber`, so one
 * predicate covers all of them.
 */
export const DEMO_ACCOUNT_NUMBER = "CHS-DEMO01";

/** True when a row belongs to the seeded demo customer. */
export function isDemoAccount(accountNumber: string | null | undefined): boolean {
  return (accountNumber ?? "").toUpperCase() === DEMO_ACCOUNT_NUMBER;
}

/** Drop demo rows from anything that drives a count or an alert. */
export function withoutDemo<T extends { accountNumber?: string | null }>(rows: T[]): T[] {
  return rows.filter((r) => !isDemoAccount(r.accountNumber));
}
