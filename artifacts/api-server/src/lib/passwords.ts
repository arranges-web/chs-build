import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

// 10 rounds is the well-tested default — strong enough that a stolen
// hash can't be brute-forced practically, fast enough that we don't
// time out a login on a small Replit instance.
const BCRYPT_ROUNDS = 10;

/** One-way hash a plaintext password. */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

/** Constant-time compare a plaintext password to a stored hash. */
export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plain, hash);
  } catch {
    return false;
  }
}

/**
 * URL-safe random token. Used for invite tokens and session tokens.
 * 32 bytes encoded as base64url = 43 chars — well over 128 bits of
 * entropy, plenty for both purposes.
 */
export function generateToken(): string {
  return randomBytes(32).toString("base64url");
}

/** Light sanity check on a password — kept loose so it doesn't fight UX. */
export function passwordTooWeak(plain: string): string | null {
  if (typeof plain !== "string") return "Pick a password.";
  if (plain.length < 8) return "Use at least 8 characters.";
  return null;
}
