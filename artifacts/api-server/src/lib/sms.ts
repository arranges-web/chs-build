import { createHmac, timingSafeEqual } from "node:crypto";
import type { Request } from "express";
import { logger } from "./logger";

/**
 * Thin Twilio REST wrapper. We call the API directly with fetch so we
 * don't need the (heavy) twilio SDK. When credentials are missing we
 * run in "simulation" mode: sends are logged to the DB with status
 * "simulated" so the whole outreach flow can be exercised before the
 * Twilio account is connected.
 *
 * Env vars:
 *   TWILIO_ACCOUNT_SID    ACxxxxxxxx
 *   TWILIO_AUTH_TOKEN     secret
 *   TWILIO_FROM_NUMBER    +1239XXXXXXX  (or use TWILIO_MESSAGING_SERVICE_SID)
 *   TWILIO_MESSAGING_SERVICE_SID  MGxxxxxxxx (optional, preferred for A2P)
 */

export function twilioConfigured(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      (process.env.TWILIO_FROM_NUMBER || process.env.TWILIO_MESSAGING_SERVICE_SID),
  );
}

/** Normalize a US phone number to E.164 (+1XXXXXXXXXX). Returns null when unparseable. */
export function normalizePhone(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const digits = String(raw).replace(/[^\d+]/g, "");
  if (/^\+\d{10,15}$/.test(digits)) return digits;
  const bare = digits.replace(/\D/g, "");
  if (bare.length === 10) return `+1${bare}`;
  if (bare.length === 11 && bare.startsWith("1")) return `+${bare}`;
  return null;
}

export type SendResult =
  | { status: "sent"; sid: string }
  | { status: "simulated" }
  | { status: "failed"; error: string };

export async function sendSms(to: string, body: string): Promise<SendResult> {
  if (!twilioConfigured()) {
    logger.info({ to }, "[sms] simulated send (Twilio not configured)");
    return { status: "simulated" };
  }
  const sid = process.env.TWILIO_ACCOUNT_SID!;
  const token = process.env.TWILIO_AUTH_TOKEN!;
  const params = new URLSearchParams({ To: to, Body: body });
  if (process.env.TWILIO_MESSAGING_SERVICE_SID) {
    params.set("MessagingServiceSid", process.env.TWILIO_MESSAGING_SERVICE_SID);
  } else {
    params.set("From", process.env.TWILIO_FROM_NUMBER!);
  }
  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      },
    );
    const data = (await res.json()) as { sid?: string; message?: string };
    if (!res.ok || !data.sid) {
      const error = data.message ?? `Twilio error (${res.status})`;
      logger.warn({ to, error }, "[sms] send failed");
      return { status: "failed", error };
    }
    return { status: "sent", sid: data.sid };
  } catch (err) {
    const error = err instanceof Error ? err.message : "Network error";
    logger.warn({ to, error }, "[sms] send failed");
    return { status: "failed", error };
  }
}

/**
 * Validate Twilio's X-Twilio-Signature on inbound webhooks:
 * base64(HMAC-SHA1(authToken, url + concat(sorted form params))).
 * When no auth token is configured we accept everything (simulation /
 * local dev — there's nothing secret to verify against anyway).
 */
export function validateTwilioSignature(req: Request): boolean {
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!token) return true;
  const signature = req.header("x-twilio-signature");
  if (!signature) return false;

  const proto = req.header("x-forwarded-proto") ?? req.protocol;
  const host = req.header("x-forwarded-host") ?? req.header("host");
  const url = `${proto}://${host}${req.originalUrl}`;

  const body = (req.body ?? {}) as Record<string, string>;
  const data =
    url +
    Object.keys(body)
      .sort()
      .map((k) => k + body[k])
      .join("");
  const expected = createHmac("sha1", token).update(Buffer.from(data, "utf-8")).digest("base64");
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}
