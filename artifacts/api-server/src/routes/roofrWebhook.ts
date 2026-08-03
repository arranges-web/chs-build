import { Router, type IRouter } from "express";
import { db, leadsTable } from "@workspace/db";
import { engageLead } from "../lib/outreachAgent";
import { handleError } from "../lib/handleError";
import { logger } from "../lib/logger";

const router: IRouter = Router();

/**
 * Inbound sync from the Roofr CRM. Roofr has no public developer API —
 * its API key is scoped to Zapier — so the supported wiring is:
 *
 *   Roofr → Zapier ("New Lead in Roofr" trigger)
 *         → Webhooks by Zapier → POST {site}/api/integrations/roofr
 *
 * Protect the endpoint with a shared secret: set ROOFR_WEBHOOK_SECRET
 * in the server env and send the same value from Zapier either as an
 * `x-webhook-secret` header or a `?secret=` query param.
 *
 * The payload is intentionally permissive — map whatever fields the
 * Zap has (name, phone, email, address, notes...). Each hit stores a
 * lead (source "roofr") and hands it to the SMS outreach agent.
 */
router.post("/integrations/roofr", async (req, res) => {
  try {
    const secret = process.env.ROOFR_WEBHOOK_SECRET;
    if (secret) {
      const provided = req.header("x-webhook-secret") ?? String(req.query.secret ?? "");
      if (provided !== secret) {
        res.status(403).json({ error: "Invalid webhook secret." });
        return;
      }
    }

    const b = (req.body ?? {}) as Record<string, unknown>;
    const pick = (...keys: string[]): string | null => {
      for (const k of keys) {
        const v = b[k];
        if (typeof v === "string" && v.trim()) return v.trim();
        if (typeof v === "number") return String(v);
      }
      return null;
    };

    const payload = {
      name: pick("name", "customer_name", "full_name", "contact_name"),
      phone: pick("phone", "phone_number", "customer_phone", "mobile"),
      email: pick("email", "customer_email"),
      address: pick("address", "full_address", "property_address", "street"),
      zip: pick("zip", "zip_code", "postal_code"),
      serviceType: pick("service_type", "job_type", "project_type"),
      message: pick("message", "notes", "description", "note"),
      source: "roofr",
    };

    if (!payload.name && !payload.phone && !payload.email) {
      res.status(400).json({ error: "Payload had no name, phone, or email." });
      return;
    }

    const [lead] = await db.insert(leadsTable).values(payload).returning();
    logger.info({ leadId: lead.id }, "[roofr] lead synced");
    res.status(201).json({ ok: true, id: lead.id });

    // Hand off to the SMS agent after responding.
    void engageLead(lead);
  } catch (err) {
    handleError(res, err);
  }
});

export default router;
