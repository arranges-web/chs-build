import { randomBytes } from "crypto";

// Excludes confusing characters: 0 / O / 1 / I / L
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/**
 * Friendly customer-facing account ID, e.g. "CHS-A2K9P3".
 * 6 chars from the unambiguous alphabet — ≈ 31^6 ≈ 887 million
 * combinations, enough for collision-free use without retries for
 * any realistic CHS volume.
 */
export function generateAccountNumber(): string {
  const bytes = randomBytes(6);
  let s = "CHS-";
  for (let i = 0; i < 6; i++) {
    s += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return s;
}

/** True if the input looks like an email (contains @). */
export function isEmail(s: string): boolean {
  return s.includes("@");
}

/** Normalize an account number — uppercase + trimmed. */
export function normalizeAccount(s: string): string {
  return s.trim().toUpperCase();
}
