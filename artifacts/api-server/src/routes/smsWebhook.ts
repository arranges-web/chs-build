import { Router, urlencoded, type IRouter } from "express";
import { validateTwilioSignature } from "../lib/sms";
import { handleInbound } from "../lib/outreachAgent";
import { logger } from "../lib/logger";

const router: IRouter = Router();

/**
 * Twilio posts inbound SMS here (configure the number's "A message
 * comes in" webhook to POST {site}/api/sms/webhook). Twilio sends
 * form-encoded bodies, so this route gets its own parser. We reply
 * with empty TwiML immediately and process the message async — the
 * AI reply (if any) goes out via the REST API, not TwiML, so slow
 * drafting can't time out the webhook.
 */
router.post("/sms/webhook", urlencoded({ extended: false }), (req, res) => {
  if (!validateTwilioSignature(req)) {
    res.status(403).send("Invalid signature");
    return;
  }
  const from = String(req.body?.From ?? "");
  const body = String(req.body?.Body ?? "");
  res.type("text/xml").send("<Response></Response>");
  if (!from || !body) return;
  void handleInbound(from, body).catch((err) =>
    logger.warn({ err: err instanceof Error ? err.message : err }, "[sms] inbound handling failed"),
  );
});

export default router;
