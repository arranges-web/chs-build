import Anthropic from "@anthropic-ai/sdk";
import { eq, asc } from "drizzle-orm";
import {
  db,
  smsContactsTable,
  smsMessagesTable,
  outreachSettingsTable,
  type SmsContact,
  type SmsMessage,
  type OutreachSettings,
  type Lead,
} from "@workspace/db";
import { logger } from "./logger";
import { normalizePhone, sendSms } from "./sms";

/**
 * The SMS outreach agent. Claude drafts short, compliant texts for
 * leads and customers; depending on settings the drafts either send
 * automatically or wait in the admin inbox for one-click approval.
 * Without an ANTHROPIC_API_KEY the agent is disabled and everything
 * degrades to manual texting from the admin inbox.
 */

export function aiConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

// ─── Settings (single row, id 1) ─────────────────────────────────

export async function getOutreachSettings(): Promise<OutreachSettings> {
  const [row] = await db.select().from(outreachSettingsTable).limit(1);
  if (row) return row;
  const [created] = await db.insert(outreachSettingsTable).values({}).returning();
  return created;
}

export function withinSendWindow(settings: OutreachSettings): boolean {
  try {
    const hour = Number(
      new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        hour12: false,
        timeZone: settings.timezone,
      }).format(new Date()),
    );
    return hour >= settings.sendWindowStart && hour < settings.sendWindowEnd;
  } catch {
    return true;
  }
}

// ─── Contacts ────────────────────────────────────────────────────

export async function upsertContact(input: {
  phone: string;
  name?: string | null;
  leadId?: number | null;
  customerId?: number | null;
  consentSource?: string | null;
}): Promise<SmsContact | null> {
  const phone = normalizePhone(input.phone);
  if (!phone) return null;
  const [existing] = await db
    .select()
    .from(smsContactsTable)
    .where(eq(smsContactsTable.phone, phone));
  if (existing) {
    const patch: Partial<SmsContact> = {};
    if (input.name && !existing.name) patch.name = input.name;
    if (input.leadId && !existing.leadId) patch.leadId = input.leadId;
    if (input.customerId && !existing.customerId) patch.customerId = input.customerId;
    if (Object.keys(patch).length === 0) return existing;
    const [updated] = await db
      .update(smsContactsTable)
      .set(patch)
      .where(eq(smsContactsTable.id, existing.id))
      .returning();
    return updated;
  }
  const [created] = await db
    .insert(smsContactsTable)
    .values({
      phone,
      name: input.name ?? null,
      leadId: input.leadId ?? null,
      customerId: input.customerId ?? null,
      consentSource: input.consentSource ?? null,
    })
    .returning();
  return created;
}

async function conversationHistory(contactId: number): Promise<SmsMessage[]> {
  return db
    .select()
    .from(smsMessagesTable)
    .where(eq(smsMessagesTable.contactId, contactId))
    .orderBy(asc(smsMessagesTable.createdAt));
}

// ─── Claude drafting ─────────────────────────────────────────────

const BUSINESS_CONTEXT = `You write SMS messages on behalf of CHS Roofing (Cordova Home Services LLC), a licensed roofing company serving Southwest Florida — Fort Myers, Cape Coral, Naples and nearby. Services: roof installation & replacement, repair, maintenance, storm damage response, and specialty roofing (shingle, metal, tile, flat). Office phone: (239) 737-1758. Website: cordovahomeservices.com.`;

const SMS_RULES = `Rules for every message you write:
- You are texting as a human team member, using the agent name given below. Never claim to be a bot unless directly asked; if asked, be honest that you're an AI assistant for CHS Roofing and offer to have a team member follow up.
- Keep it under 300 characters when possible. One question at a time. No emojis unless the customer uses them first.
- Never invent prices, dates, appointment times, or availability. If asked for those, say the team will confirm, and offer a callback from (239) 737-1758.
- If the person seems upset, has a complaint, or asks something you can't answer, keep it brief and let them know a team member will follow up shortly.
- The FIRST message to a new lead must identify the sender ("this is {agent} with CHS Roofing"), reference what they asked about, ask one helpful qualifying question, and end with "Reply STOP to opt out."
- If they say STOP or ask not to be contacted, do not write a message — output exactly [NO_REPLY].
- If a reply is genuinely not needed (e.g. they just said "thanks, bye"), output exactly [NO_REPLY].
Output ONLY the SMS text (or [NO_REPLY]) — no quotes, no explanations.`;

function agentClient(): Anthropic | null {
  if (!aiConfigured()) return null;
  return new Anthropic();
}

/** Draft the first outreach text for a new lead. Returns null when AI is unavailable. */
export async function draftLeadOutreach(
  lead: Pick<Lead, "name" | "serviceType" | "address" | "zip" | "roofAge" | "urgency" | "message" | "source">,
  settings: OutreachSettings,
): Promise<string | null> {
  const client = agentClient();
  if (!client) return null;
  const facts = [
    lead.name ? `Name: ${lead.name}` : null,
    lead.serviceType ? `Interested in: ${lead.serviceType}` : null,
    lead.address ? `Address: ${lead.address}` : null,
    lead.zip ? `ZIP: ${lead.zip}` : null,
    lead.roofAge ? `Roof age: ${lead.roofAge}` : null,
    lead.urgency ? `Urgency: ${lead.urgency}` : null,
    lead.message ? `Their message: "${lead.message}"` : null,
    lead.source ? `Lead source: ${lead.source}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 300,
      thinking: { type: "adaptive" },
      output_config: { effort: "low" },
      system: `${BUSINESS_CONTEXT}\n\nAgent name: ${settings.agentName}\n${settings.instructions ? `Extra instructions from the team: ${settings.instructions}\n` : ""}\n${SMS_RULES}`,
      messages: [
        {
          role: "user",
          content: `A new lead just came in through our website/CRM. Write the first outreach text.\n\n${facts || "(no details captured — keep it generic but warm)"}`,
        },
      ],
    });
    return extractSms(response);
  } catch (err) {
    logger.warn({ err: err instanceof Error ? err.message : err }, "[outreach] draft failed");
    return null;
  }
}

/** Draft a reply to the latest inbound message in a conversation. */
export async function draftReply(
  contact: SmsContact,
  settings: OutreachSettings,
): Promise<string | null> {
  const client = agentClient();
  if (!client) return null;
  const history = await conversationHistory(contact.id);
  if (history.length === 0) return null;

  const turns: Anthropic.MessageParam[] = [];
  for (const m of history.slice(-30)) {
    const role = m.direction === "inbound" ? "user" : "assistant";
    const prev = turns[turns.length - 1];
    if (prev && prev.role === role) {
      prev.content = `${prev.content}\n${m.body}`;
    } else {
      turns.push({ role, content: m.body });
    }
  }
  // The API requires the first turn to be from the user. If we texted
  // first (outreach), fold leading assistant turns into a context note.
  while (turns.length && turns[0].role === "assistant") {
    const first = turns.shift()!;
    turns.unshift({
      role: "user",
      content: `[context: we previously texted them: "${first.content}"]`,
    });
    break;
  }
  if (!turns.length || turns[turns.length - 1].role !== "user") return null;

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 300,
      thinking: { type: "adaptive" },
      output_config: { effort: "low" },
      system: `${BUSINESS_CONTEXT}\n\nAgent name: ${settings.agentName}\nContact: ${contact.name ?? "unknown name"} (${contact.phone})\n${settings.instructions ? `Extra instructions from the team: ${settings.instructions}\n` : ""}\n${SMS_RULES}\n\nYou are mid-conversation — reply to their latest text.`,
      messages: turns,
    });
    return extractSms(response);
  } catch (err) {
    logger.warn({ err: err instanceof Error ? err.message : err }, "[outreach] reply draft failed");
    return null;
  }
}

function extractSms(response: Anthropic.Message): string | null {
  if (response.stop_reason === "refusal") return null;
  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
  if (!text || text.includes("[NO_REPLY]")) return null;
  return text;
}

// ─── Sending ─────────────────────────────────────────────────────

/** Record + transmit an outbound message for a contact. Respects opt-out. */
export async function sendToContact(
  contact: SmsContact,
  body: string,
  authorName: string,
): Promise<SmsMessage> {
  if (contact.optedOut) {
    const [row] = await db
      .insert(smsMessagesTable)
      .values({
        contactId: contact.id,
        direction: "outbound",
        body,
        status: "failed",
        authorName,
        errorMessage: "Contact has opted out (STOP).",
      })
      .returning();
    return row;
  }
  const result = await sendSms(contact.phone, body);
  const [row] = await db
    .insert(smsMessagesTable)
    .values({
      contactId: contact.id,
      direction: "outbound",
      body,
      status: result.status,
      authorName,
      twilioSid: result.status === "sent" ? result.sid : null,
      errorMessage: result.status === "failed" ? result.error : null,
      readByTeam: true,
    })
    .returning();
  await db
    .update(smsContactsTable)
    .set({ lastMessageAt: new Date() })
    .where(eq(smsContactsTable.id, contact.id));
  return row;
}

/** Save an AI draft that a human will approve from the admin inbox. */
export async function saveDraft(contactId: number, body: string): Promise<SmsMessage> {
  const [row] = await db
    .insert(smsMessagesTable)
    .values({
      contactId,
      direction: "outbound",
      body,
      status: "draft",
      authorName: "AI Agent",
      readByTeam: false,
    })
    .returning();
  return row;
}

// ─── High-level flows ────────────────────────────────────────────

/**
 * New lead came in (website form or Roofr webhook). Create/refresh the
 * SMS contact and let the agent draft the first text. Sends
 * immediately when autoEngageLeads is on and we're inside the send
 * window; otherwise leaves a draft for approval.
 * Fire-and-forget from the lead route — never throws.
 */
export async function engageLead(lead: Lead): Promise<void> {
  try {
    if (!lead.phone) return;
    const settings = await getOutreachSettings();
    const contact = await upsertContact({
      phone: lead.phone,
      name: lead.name,
      leadId: lead.id,
      consentSource: lead.source === "roofr" ? "roofr" : "web-form",
    });
    if (!contact || contact.optedOut) return;
    const draft = await draftLeadOutreach(lead, settings);
    if (!draft) return;
    if (settings.autoEngageLeads && withinSendWindow(settings) && contact.aiEnabled) {
      await sendToContact(contact, draft, "AI Agent");
    } else {
      await saveDraft(contact.id, draft);
    }
  } catch (err) {
    logger.warn({ err: err instanceof Error ? err.message : err }, "[outreach] engageLead failed");
  }
}

/**
 * Inbound SMS arrived. Handles STOP/START, records the message, and
 * either auto-replies or drafts a reply for approval.
 */
export async function handleInbound(fromPhone: string, body: string): Promise<void> {
  const contact = await upsertContact({ phone: fromPhone, consentSource: "inbound" });
  if (!contact) return;

  const trimmed = body.trim();
  const upper = trimmed.toUpperCase();
  const isStop = ["STOP", "STOPALL", "UNSUBSCRIBE", "CANCEL", "END", "QUIT"].includes(upper);
  const isStart = ["START", "UNSTOP", "YES"].includes(upper);

  await db.insert(smsMessagesTable).values({
    contactId: contact.id,
    direction: "inbound",
    body: trimmed,
    status: "received",
  });
  await db
    .update(smsContactsTable)
    .set({
      lastMessageAt: new Date(),
      ...(isStop ? { optedOut: true } : {}),
      ...(isStart ? { optedOut: false } : {}),
    })
    .where(eq(smsContactsTable.id, contact.id));
  if (isStop) return; // Twilio also blocks these carrier-side

  const settings = await getOutreachSettings();
  if (!contact.aiEnabled || contact.optedOut) return;
  const draft = await draftReply({ ...contact, optedOut: false }, settings);
  if (!draft) return;
  if (settings.autoReply && withinSendWindow(settings)) {
    await sendToContact(contact, draft, "AI Agent");
  } else {
    await saveDraft(contact.id, draft);
  }
}
