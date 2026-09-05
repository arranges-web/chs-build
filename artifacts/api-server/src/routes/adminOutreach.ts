import { Router, type IRouter } from "express";
import { eq, desc, sql } from "drizzle-orm";
import {
  db,
  smsContactsTable,
  smsMessagesTable,
  outreachSettingsTable,
  leadsTable,
  customersTable,
} from "@workspace/db";
import { adminAuth } from "../middlewares/adminAuth";
import { handleError } from "../lib/handleError";
import { requireFullAccess } from "../lib/roles";
import { twilioConfigured } from "../lib/sms";
import {
  aiConfigured,
  getOutreachSettings,
  upsertContact,
  draftReply,
  draftLeadOutreach,
  sendToContact,
  engageLead,
} from "../lib/outreachAgent";

const router: IRouter = Router();

router.use("/admin", adminAuth);
// SMS outreach is office-only.
router.use("/admin", requireFullAccess);

// ─── Status + settings ──────────────────────────────────────────

router.get("/admin/outreach/status", async (_req, res) => {
  try {
    const settings = await getOutreachSettings();
    res.json({
      twilioConfigured: twilioConfigured(),
      aiConfigured: aiConfigured(),
      roofrSecretConfigured: Boolean(process.env.ROOFR_WEBHOOK_SECRET),
      settings,
    });
  } catch (err) {
    handleError(res, err);
  }
});

router.patch("/admin/outreach/settings", async (req, res) => {
  try {
    const current = await getOutreachSettings();
    const b = req.body ?? {};
    const update: Record<string, unknown> = { updatedAt: new Date() };
    if ("agentName" in b) update.agentName = String(b.agentName ?? "Riley").trim() || "Riley";
    if ("instructions" in b) update.instructions = b.instructions ? String(b.instructions) : null;
    if ("autoEngageLeads" in b) update.autoEngageLeads = Boolean(b.autoEngageLeads);
    if ("autoReply" in b) update.autoReply = Boolean(b.autoReply);
    if ("timezone" in b) update.timezone = String(b.timezone ?? "America/New_York");
    for (const k of ["sendWindowStart", "sendWindowEnd"] as const) {
      if (k in b) {
        const n = Number(b[k]);
        update[k] = Number.isFinite(n) ? Math.max(0, Math.min(24, Math.round(n))) : current[k];
      }
    }
    const [row] = await db
      .update(outreachSettingsTable)
      .set(update)
      .where(eq(outreachSettingsTable.id, current.id))
      .returning();
    res.json({ settings: row });
  } catch (err) {
    handleError(res, err);
  }
});

// ─── Conversations inbox ────────────────────────────────────────

router.get("/admin/outreach/contacts", async (_req, res) => {
  try {
    const rows = await db
      .select({
        id: smsContactsTable.id,
        phone: smsContactsTable.phone,
        name: smsContactsTable.name,
        leadId: smsContactsTable.leadId,
        customerId: smsContactsTable.customerId,
        consentSource: smsContactsTable.consentSource,
        optedOut: smsContactsTable.optedOut,
        aiEnabled: smsContactsTable.aiEnabled,
        lastMessageAt: smsContactsTable.lastMessageAt,
        createdAt: smsContactsTable.createdAt,
        unread: sql<number>`(
          SELECT count(*)::int FROM sms_messages m
          WHERE m.contact_id = ${smsContactsTable.id}
            AND m.read_by_team = false
        )`,
        lastBody: sql<string | null>`(
          SELECT m.body FROM sms_messages m
          WHERE m.contact_id = ${smsContactsTable.id}
          ORDER BY m.created_at DESC LIMIT 1
        )`,
        hasDraft: sql<boolean>`EXISTS (
          SELECT 1 FROM sms_messages m
          WHERE m.contact_id = ${smsContactsTable.id} AND m.status = 'draft'
        )`,
      })
      .from(smsContactsTable)
      .orderBy(desc(smsContactsTable.lastMessageAt), desc(smsContactsTable.createdAt));
    res.json({ rows });
  } catch (err) {
    handleError(res, err);
  }
});

router.get("/admin/outreach/contacts/:id/messages", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const [contact] = await db.select().from(smsContactsTable).where(eq(smsContactsTable.id, id));
    if (!contact) {
      res.status(404).json({ error: "Contact not found." });
      return;
    }
    const messages = await db
      .select()
      .from(smsMessagesTable)
      .where(eq(smsMessagesTable.contactId, id))
      .orderBy(smsMessagesTable.createdAt);
    // Opening the thread marks it read.
    await db
      .update(smsMessagesTable)
      .set({ readByTeam: true })
      .where(sql`${smsMessagesTable.contactId} = ${id} AND ${smsMessagesTable.readByTeam} = false AND ${smsMessagesTable.status} <> 'draft'`);
    res.json({ contact, messages });
  } catch (err) {
    handleError(res, err);
  }
});

router.patch("/admin/outreach/contacts/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const update: Record<string, unknown> = {};
    if ("name" in req.body) update.name = req.body.name ? String(req.body.name) : null;
    if ("aiEnabled" in req.body) update.aiEnabled = Boolean(req.body.aiEnabled);
    if ("optedOut" in req.body) update.optedOut = Boolean(req.body.optedOut);
    const [row] = await db
      .update(smsContactsTable)
      .set(update)
      .where(eq(smsContactsTable.id, id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Contact not found." });
      return;
    }
    res.json({ row });
  } catch (err) {
    handleError(res, err);
  }
});

/** Start a conversation manually (from a lead, a customer, or a raw number). */
router.post("/admin/outreach/contacts", async (req, res) => {
  try {
    const b = req.body ?? {};
    let phone = b.phone ? String(b.phone) : "";
    let name = b.name ? String(b.name) : null;
    let leadId: number | null = null;
    let customerId: number | null = null;

    if (b.leadId) {
      leadId = Number(b.leadId);
      const [lead] = await db.select().from(leadsTable).where(eq(leadsTable.id, leadId));
      if (lead) {
        phone = phone || (lead.phone ?? "");
        name = name ?? lead.name;
      }
    }
    if (b.customerId) {
      customerId = Number(b.customerId);
      const [customer] = await db
        .select()
        .from(customersTable)
        .where(eq(customersTable.id, customerId));
      if (customer) {
        phone = phone || (customer.phone ?? "");
        name = name ?? customer.name;
      }
    }

    const contact = await upsertContact({
      phone,
      name,
      leadId,
      customerId,
      consentSource: customerId ? "customer" : "manual",
    });
    if (!contact) {
      res.status(400).json({ error: "A valid US phone number is required." });
      return;
    }
    res.status(201).json({ row: contact });
  } catch (err) {
    handleError(res, err);
  }
});

// ─── Sending + drafting ─────────────────────────────────────────

/** Send a manual message (typed by staff) to a contact. */
router.post("/admin/outreach/messages", async (req, res) => {
  try {
    const contactId = Number(req.body?.contactId);
    const body = String(req.body?.body ?? "").trim();
    if (!Number.isFinite(contactId) || !body) {
      res.status(400).json({ error: "contactId and body are required." });
      return;
    }
    const [contact] = await db
      .select()
      .from(smsContactsTable)
      .where(eq(smsContactsTable.id, contactId));
    if (!contact) {
      res.status(404).json({ error: "Contact not found." });
      return;
    }
    const authorName = res.locals.admin?.name ?? "CHS Team";
    const row = await sendToContact(contact, body, authorName);
    res.status(201).json({ row });
  } catch (err) {
    handleError(res, err);
  }
});

/** Ask the agent for a fresh draft for this conversation (does not send). */
router.post("/admin/outreach/contacts/:id/draft", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [contact] = await db.select().from(smsContactsTable).where(eq(smsContactsTable.id, id));
    if (!contact) {
      res.status(404).json({ error: "Contact not found." });
      return;
    }
    if (!aiConfigured()) {
      res.status(503).json({ error: "AI drafting is off — add ANTHROPIC_API_KEY to enable it." });
      return;
    }
    const settings = await getOutreachSettings();
    let draft = await draftReply(contact, settings);
    if (!draft && contact.leadId) {
      const [lead] = await db.select().from(leadsTable).where(eq(leadsTable.id, contact.leadId));
      if (lead) draft = await draftLeadOutreach(lead, settings);
    }
    if (!draft) {
      res.status(422).json({ error: "The agent didn't produce a draft for this conversation." });
      return;
    }
    res.json({ draft });
  } catch (err) {
    handleError(res, err);
  }
});

/** Approve a pending draft: send it and mark the draft row sent. */
router.post("/admin/outreach/drafts/:id/approve", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [draft] = await db.select().from(smsMessagesTable).where(eq(smsMessagesTable.id, id));
    if (!draft || draft.status !== "draft") {
      res.status(404).json({ error: "Draft not found." });
      return;
    }
    const [contact] = await db
      .select()
      .from(smsContactsTable)
      .where(eq(smsContactsTable.id, draft.contactId));
    if (!contact) {
      res.status(404).json({ error: "Contact not found." });
      return;
    }
    const body = req.body?.body ? String(req.body.body).trim() : draft.body;
    // Send FIRST, then retire the draft. If sendToContact throws, the
    // approved text is still sitting in the draft row instead of being
    // gone forever. (A returned `failed` row still records the attempt,
    // so deleting the draft after that is safe.)
    const row = await sendToContact(contact, body, "AI Agent (approved)");
    await db.delete(smsMessagesTable).where(eq(smsMessagesTable.id, id));
    res.json({ row });
  } catch (err) {
    handleError(res, err);
  }
});

/** Discard a pending draft. */
router.delete("/admin/outreach/drafts/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db
      .delete(smsMessagesTable)
      .where(sql`${smsMessagesTable.id} = ${id} AND ${smsMessagesTable.status} = 'draft'`);
    res.json({ ok: true });
  } catch (err) {
    handleError(res, err);
  }
});

/** Kick the agent at an existing lead (creates contact + draft/send). */
router.post("/admin/outreach/engage-lead/:leadId", async (req, res) => {
  try {
    const leadId = Number(req.params.leadId);
    const [lead] = await db.select().from(leadsTable).where(eq(leadsTable.id, leadId));
    if (!lead) {
      res.status(404).json({ error: "Lead not found." });
      return;
    }
    if (!lead.phone) {
      res.status(400).json({ error: "This lead has no phone number." });
      return;
    }
    await engageLead(lead);
    res.json({ ok: true });
  } catch (err) {
    handleError(res, err);
  }
});

export default router;
