import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Bot,
  BotOff,
  Check,
  Copy,
  Loader2,
  MessageSquareText,
  Phone,
  Plus,
  RefreshCw,
  Save,
  Send,
  Settings2,
  Sparkles,
  Trash2,
  UserX,
  X,
} from "lucide-react";
import {
  api,
  type OutreachStatus,
  type OutreachSettings,
  type SmsContact,
  type SmsContactRow,
  type SmsMessage,
} from "@/lib/api";

const POLL_MS = 20_000;

const fmtWhen = (s?: string | null) => {
  if (!s) return "";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  return d.toDateString() === now.toDateString()
    ? d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const fmtFull = (s?: string | null) => {
  if (!s) return "";
  const d = new Date(s);
  return Number.isNaN(d.getTime())
    ? String(s)
    : d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
};

const hourLabel = (h: number) => {
  const x = ((h % 24) + 24) % 24;
  const ampm = x < 12 ? "AM" : "PM";
  const disp = x % 12 === 0 ? 12 : x % 12;
  return `${disp} ${ampm}`;
};

type Props = { adminKey: string };

export default function Outreach({ adminKey }: Props) {
  const [tab, setTab] = useState<"inbox" | "settings">("inbox");
  const [status, setStatus] = useState<OutreachStatus | null>(null);
  const [contacts, setContacts] = useState<SmsContactRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectedRef = useRef<number | null>(null);
  selectedRef.current = selectedId;

  // Thread state
  const [thread, setThread] = useState<{ contact: SmsContact; messages: SmsMessage[] } | null>(null);
  const [threadLoading, setThreadLoading] = useState(false);
  const [threadError, setThreadError] = useState<string | null>(null);

  // New conversation form
  const [showNew, setShowNew] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const loadStatus = async () => {
    const res = await api.outreachStatus(adminKey);
    if ("data" in res) setStatus(res.data);
  };

  const loadContacts = async (silent = false) => {
    if (!silent) setLoading(true);
    const res = await api.listSmsContacts(adminKey);
    if ("data" in res) {
      setContacts(res.data.rows);
      setError(null);
    } else if (!silent) {
      setError(res.error);
    }
    if (!silent) setLoading(false);
  };

  const loadThread = async (contactId: number, silent = false) => {
    if (!silent) {
      setThreadLoading(true);
      setThreadError(null);
    }
    const res = await api.getSmsThread(contactId, adminKey);
    // A poll may resolve after the user switched threads — ignore it.
    if (selectedRef.current !== contactId) return;
    if ("data" in res) {
      setThread(res.data);
      if (!silent) setThreadError(null);
    } else if (!silent) {
      setThreadError(res.error);
    }
    if (!silent) setThreadLoading(false);
  };

  useEffect(() => {
    void loadStatus();
    void loadContacts();
    const t = setInterval(() => {
      void loadContacts(true);
      const id = selectedRef.current;
      if (id != null) void loadThread(id, true);
    }, POLL_MS);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const select = (id: number) => {
    setSelectedId(id);
    setThread(null);
    void loadThread(id);
  };

  const createContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhone.trim()) {
      setCreateError("A phone number is required.");
      return;
    }
    setCreating(true);
    setCreateError(null);
    const res = await api.createSmsContact(
      { phone: newPhone.trim(), name: newName.trim() || undefined },
      adminKey,
    );
    setCreating(false);
    if ("error" in res) {
      setCreateError(res.error);
      return;
    }
    setNewPhone("");
    setNewName("");
    setShowNew(false);
    await loadContacts(true);
    select(res.data.row.id);
  };

  const refreshAll = () => {
    void loadStatus();
    void loadContacts();
    if (selectedId != null) void loadThread(selectedId, true);
  };

  const selectedRow = useMemo(
    () => contacts?.find((c) => c.id === selectedId) ?? null,
    [contacts, selectedId],
  );

  return (
    <div>
      {/* Config banners */}
      {status && !status.twilioConfigured && (
        <div className="mb-3 p-3.5 rounded-xl border border-amber-300/60 bg-amber-50 text-amber-900 text-[13px] flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <p>
            <span className="font-semibold">SMS test mode.</span> Add the{" "}
            <code className="font-mono text-[12px]">TWILIO_ACCOUNT_SID</code>,{" "}
            <code className="font-mono text-[12px]">TWILIO_AUTH_TOKEN</code>, and{" "}
            <code className="font-mono text-[12px]">TWILIO_FROM_NUMBER</code> secrets to send real
            texts. Until then, outgoing messages are simulated so you can try the workflow safely.
          </p>
        </div>
      )}
      {status && !status.aiConfigured && (
        <div className="mb-3 p-3.5 rounded-xl border border-amber-300/60 bg-amber-50 text-amber-900 text-[13px] flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <p>
            <span className="font-semibold">AI drafting is off.</span> Add the{" "}
            <code className="font-mono text-[12px]">ANTHROPIC_API_KEY</code> secret to let the agent
            write drafts and replies.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-4 flex items-center gap-2">
        {(
          [
            { id: "inbox", label: "Inbox", icon: MessageSquareText },
            { id: "settings", label: "Agent settings", icon: Settings2 },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-colors ${
              tab === t.id
                ? "bg-primary text-white shadow-sm shadow-primary/30"
                : "bg-card border border-border/60 text-foreground hover:border-primary/40"
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
        <button
          type="button"
          onClick={refreshAll}
          className="ml-auto inline-flex items-center gap-1.5 px-3 h-9 rounded-full text-xs font-semibold text-foreground bg-card border border-border/60 hover:border-primary/40"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-xl border border-destructive/40 bg-destructive/5 text-destructive text-sm whitespace-pre-line">
          {error}
        </div>
      )}

      {tab === "settings" ? (
        <SettingsPanel
          adminKey={adminKey}
          status={status}
          onSaved={(s) => setStatus((prev) => (prev ? { ...prev, settings: s } : prev))}
        />
      ) : (
        <div className="grid lg:grid-cols-[320px_1fr] gap-4 items-start">
          {/* Conversation list — hidden on mobile while a thread is open */}
          <section
            className={`bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden ${
              selectedId != null ? "hidden lg:block" : ""
            }`}
          >
            <div className="p-3 border-b border-border/60 flex items-center justify-between gap-2">
              <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground">
                Conversations
              </p>
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
              >
                {showNew ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                {showNew ? "Cancel" : "New conversation"}
              </button>
            </div>

            {showNew && (
              <form onSubmit={createContact} className="p-3 border-b border-border/60 space-y-2 bg-background/60">
                <input
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="Phone (e.g. 305-555-0123)"
                  className="w-full h-9 px-3 rounded-lg border border-border/60 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Name (optional)"
                  className="w-full h-9 px-3 rounded-lg border border-border/60 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                {createError && <p className="text-[11px] text-destructive">{createError}</p>}
                <button
                  type="submit"
                  disabled={creating}
                  className="w-full h-9 rounded-lg bg-primary text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 disabled:opacity-60"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {creating ? "Creating…" : "Start conversation"}
                </button>
              </form>
            )}

            {!contacts ? (
              <p className="p-4 text-sm text-muted-foreground">Loading…</p>
            ) : contacts.length === 0 ? (
              <div className="p-6 text-center">
                <MessageSquareText className="w-7 h-7 mx-auto text-muted-foreground/60 mb-2" />
                <p className="text-sm font-semibold text-foreground">No conversations yet.</p>
                <p className="text-[12px] text-muted-foreground mt-1">
                  Start one above, or hit "Text with AI" on a lead.
                </p>
              </div>
            ) : (
              <ul className="max-h-[65vh] overflow-y-auto divide-y divide-border/60">
                {contacts.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => select(c.id)}
                      className={`w-full text-left p-3 transition-colors ${
                        selectedId === c.id ? "bg-primary/5" : "hover:bg-foreground/[0.03]"
                      } ${c.optedOut ? "opacity-60" : ""}`}
                    >
                      <div className="flex items-center gap-2">
                        <p className={`font-semibold text-sm truncate ${c.optedOut ? "text-muted-foreground" : "text-foreground"}`}>
                          {c.name || c.phone}
                        </p>
                        {c.optedOut && (
                          <span className="text-[9px] uppercase tracking-[0.14em] font-semibold text-muted-foreground bg-foreground/[0.06] px-1.5 py-0.5 rounded-full shrink-0">
                            Opted out
                          </span>
                        )}
                        <span className="ml-auto text-[10px] text-muted-foreground shrink-0">
                          {fmtWhen(c.lastMessageAt)}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2">
                        <p className="text-[12px] text-muted-foreground truncate flex-1">
                          {c.lastBody || c.phone}
                        </p>
                        {c.hasDraft && (
                          <span className="text-[9px] uppercase tracking-[0.12em] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full shrink-0">
                            Draft ready
                          </span>
                        )}
                        {c.unread > 0 && (
                          <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                            {c.unread}
                          </span>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Thread */}
          <section className={selectedId == null ? "hidden lg:block" : ""}>
            {selectedId == null ? (
              <div className="bg-card border border-border/60 rounded-2xl p-10 text-center">
                <MessageSquareText className="w-8 h-8 mx-auto text-muted-foreground/60 mb-3" />
                <p className="font-semibold text-foreground">Pick a conversation.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Messages, AI drafts, and replies show up here.
                </p>
              </div>
            ) : (
              <ThreadView
                adminKey={adminKey}
                contactId={selectedId}
                row={selectedRow}
                thread={thread}
                loading={threadLoading}
                error={threadError}
                twilioConfigured={status?.twilioConfigured ?? true}
                aiConfigured={status?.aiConfigured ?? true}
                onBack={() => {
                  setSelectedId(null);
                  setThread(null);
                }}
                onChanged={() => {
                  void loadContacts(true);
                  void loadThread(selectedId, true);
                }}
              />
            )}
          </section>
        </div>
      )}
    </div>
  );
}

// ─── Thread ──────────────────────────────────────────────────────

function ThreadView({
  adminKey,
  contactId,
  row,
  thread,
  loading,
  error,
  twilioConfigured,
  aiConfigured,
  onBack,
  onChanged,
}: {
  adminKey: string;
  contactId: number;
  row: SmsContactRow | null;
  thread: { contact: SmsContact; messages: SmsMessage[] } | null;
  loading: boolean;
  error: string | null;
  twilioConfigured: boolean;
  aiConfigured: boolean;
  onBack: () => void;
  onChanged: () => void;
}) {
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [draftEdits, setDraftEdits] = useState<Record<number, string>>({});
  const [draftBusy, setDraftBusy] = useState<number | null>(null);
  const [toggleBusy, setToggleBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const contact = thread?.contact ?? row;
  const messages = thread?.messages ?? [];

  // Reset composer state when switching threads.
  useEffect(() => {
    setBody("");
    setActionError(null);
    setDraftEdits({});
  }, [contactId]);

  // Keep the newest message in view.
  const lastId = messages.length > 0 ? messages[messages.length - 1].id : null;
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lastId, contactId]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setSending(true);
    setActionError(null);
    const res = await api.sendSmsMessage({ contactId, body: body.trim() }, adminKey);
    setSending(false);
    if ("error" in res) {
      setActionError(res.error);
      return;
    }
    setBody("");
    onChanged();
  };

  const aiDraft = async () => {
    setDrafting(true);
    setActionError(null);
    const res = await api.draftSmsReply(contactId, adminKey);
    setDrafting(false);
    if ("error" in res) {
      setActionError(res.error);
      return;
    }
    setBody(res.data.draft);
  };

  const approveDraft = async (m: SmsMessage) => {
    setDraftBusy(m.id);
    setActionError(null);
    const edited = draftEdits[m.id];
    const res = await api.approveSmsDraft(
      m.id,
      adminKey,
      edited !== undefined && edited.trim() !== m.body ? edited.trim() : undefined,
    );
    setDraftBusy(null);
    if ("error" in res) {
      setActionError(res.error);
      return;
    }
    setDraftEdits((prev) => {
      const next = { ...prev };
      delete next[m.id];
      return next;
    });
    onChanged();
  };

  const discardDraft = async (m: SmsMessage) => {
    setDraftBusy(m.id);
    setActionError(null);
    const ok = await api.discardSmsDraft(m.id, adminKey);
    setDraftBusy(null);
    if (!ok) {
      setActionError("Couldn't discard the draft. Try again.");
      return;
    }
    onChanged();
  };

  const toggle = async (patch: { aiEnabled?: boolean; optedOut?: boolean }) => {
    if (!contact) return;
    setToggleBusy(true);
    setActionError(null);
    const res = await api.updateSmsContact(contact.id, patch, adminKey);
    setToggleBusy(false);
    if ("error" in res) {
      setActionError(res.error);
      return;
    }
    onChanged();
  };

  const optedOut = contact?.optedOut ?? false;
  const aiEnabled = contact?.aiEnabled ?? true;

  return (
    <div className="bg-card border border-border/60 rounded-2xl shadow-sm flex flex-col min-h-[420px]">
      {/* Header */}
      <div className="p-3.5 border-b border-border/60 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="lg:hidden text-xs font-semibold text-muted-foreground hover:text-foreground pr-1"
        >
          ← Back
        </button>
        <div className="min-w-0">
          <p className="font-display font-bold text-foreground text-sm leading-tight truncate">
            {contact?.name || contact?.phone || "…"}
          </p>
          {contact?.name && contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary"
            >
              <Phone className="w-3 h-3" />
              {contact.phone}
            </a>
          )}
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            disabled={toggleBusy}
            onClick={() => void toggle({ aiEnabled: !aiEnabled })}
            title={aiEnabled ? "AI agent is on for this contact — click to turn off" : "AI agent is off for this contact — click to turn on"}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-semibold transition-colors disabled:opacity-60 ${
              aiEnabled
                ? "bg-primary/10 text-primary"
                : "bg-foreground/[0.05] text-muted-foreground"
            }`}
          >
            {aiEnabled ? <Bot className="w-3.5 h-3.5" /> : <BotOff className="w-3.5 h-3.5" />}
            AI {aiEnabled ? "on" : "off"}
          </button>
          <button
            type="button"
            disabled={toggleBusy}
            onClick={() => void toggle({ optedOut: !optedOut })}
            title={optedOut ? "Contact is opted out — click to opt back in" : "Opt this contact out of texting"}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-semibold transition-colors disabled:opacity-60 ${
              optedOut
                ? "bg-destructive/10 text-destructive"
                : "bg-foreground/[0.05] text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserX className="w-3.5 h-3.5" />
            {optedOut ? "Opted out" : "Opt out"}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[55vh]">
        {error && (
          <div className="p-3 rounded-xl border border-destructive/40 bg-destructive/5 text-destructive text-sm">
            {error}
          </div>
        )}
        {loading && messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">Loading messages…</p>
        ) : messages.length === 0 && !error ? (
          <p className="text-sm text-muted-foreground">
            No messages yet — say hello below, or let the agent draft the opener.
          </p>
        ) : (
          messages.map((m) => {
            if (m.status === "draft") {
              return (
                <div
                  key={m.id}
                  className="ml-auto max-w-[85%] sm:max-w-[75%] rounded-2xl border-2 border-dashed border-amber-400/70 bg-amber-50 p-3"
                >
                  <p className="text-[10px] uppercase tracking-[0.16em] font-bold text-amber-700 mb-1.5 inline-flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI draft — review before sending
                  </p>
                  <textarea
                    value={draftEdits[m.id] ?? m.body}
                    onChange={(e) =>
                      setDraftEdits((prev) => ({ ...prev, [m.id]: e.target.value }))
                    }
                    rows={3}
                    className="w-full text-sm text-foreground bg-white/70 border border-amber-300/60 rounded-lg p-2 leading-relaxed resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      disabled={draftBusy === m.id}
                      onClick={() => void approveDraft(m)}
                      className="inline-flex items-center gap-1.5 bg-primary text-white text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-sm shadow-primary/30 hover:bg-primary/90 disabled:opacity-60"
                    >
                      {draftBusy === m.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Check className="w-3 h-3" />
                      )}
                      Approve &amp; Send
                    </button>
                    <button
                      type="button"
                      disabled={draftBusy === m.id}
                      onClick={() => void discardDraft(m)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground hover:text-destructive px-2 py-1.5 disabled:opacity-60"
                    >
                      <Trash2 className="w-3 h-3" />
                      Discard
                    </button>
                    <span className="ml-auto text-[10px] text-muted-foreground">
                      {fmtFull(m.createdAt)}
                    </span>
                  </div>
                </div>
              );
            }

            const inbound = m.direction === "inbound";
            const failed = m.status === "failed";
            return (
              <div
                key={m.id}
                className={`max-w-[85%] sm:max-w-[75%] ${inbound ? "mr-auto" : "ml-auto"}`}
              >
                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                    inbound
                      ? "bg-muted text-foreground rounded-bl-sm"
                      : failed
                        ? "bg-destructive/10 text-destructive border border-destructive/40 rounded-br-sm"
                        : "bg-primary text-white rounded-br-sm shadow-sm shadow-primary/20"
                  }`}
                >
                  {m.body}
                </div>
                {failed && m.errorMessage && (
                  <p className="mt-1 text-[11px] text-destructive text-right">
                    Failed: {m.errorMessage}
                  </p>
                )}
                <div
                  className={`mt-1 flex items-center gap-1.5 text-[10px] text-muted-foreground ${
                    inbound ? "" : "justify-end"
                  }`}
                >
                  {m.status === "simulated" && (
                    <span className="bg-foreground/[0.06] text-foreground/60 px-1.5 py-0.5 rounded-full font-semibold">
                      test mode — Twilio not connected
                    </span>
                  )}
                  <span>
                    {m.authorName ? `${m.authorName} · ` : ""}
                    {fmtFull(m.createdAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Composer */}
      <div className="p-3 border-t border-border/60">
        {actionError && (
          <p className="mb-2 text-[11px] text-destructive whitespace-pre-line">{actionError}</p>
        )}
        {optedOut ? (
          <p className="text-[12px] text-muted-foreground text-center py-1.5">
            This contact opted out of texting. Opt them back in above to resume.
          </p>
        ) : (
          <form onSubmit={send} className="flex items-end gap-2">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={`Text ${contact?.name || contact?.phone || "…"}…`}
              rows={2}
              className="flex-1 px-3 py-2 rounded-xl border border-border/60 bg-background text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              type="button"
              onClick={() => void aiDraft()}
              disabled={drafting || !aiConfigured}
              title={aiConfigured ? "Let the agent draft a reply" : "Add ANTHROPIC_API_KEY to enable AI drafting"}
              className="h-10 px-3 rounded-xl bg-card border border-border/60 text-foreground text-xs font-semibold inline-flex items-center gap-1.5 hover:border-primary/40 hover:text-primary disabled:opacity-50 transition-colors shrink-0"
            >
              {drafting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              AI draft
            </button>
            <button
              type="submit"
              disabled={sending || !body.trim()}
              className="h-10 px-4 rounded-xl bg-primary text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm shadow-primary/30 disabled:opacity-60 shrink-0"
            >
              {sending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              Send
            </button>
          </form>
        )}
        {!twilioConfigured && !optedOut && (
          <p className="mt-1.5 text-[10px] text-muted-foreground">
            Test mode: messages are simulated, nothing is actually texted.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Settings ────────────────────────────────────────────────────

function SettingsPanel({
  adminKey,
  status,
  onSaved,
}: {
  adminKey: string;
  status: OutreachStatus | null;
  onSaved: (s: OutreachSettings) => void;
}) {
  const [agentName, setAgentName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [autoEngageLeads, setAutoEngageLeads] = useState(false);
  const [autoReply, setAutoReply] = useState(false);
  const [sendWindowStart, setSendWindowStart] = useState(9);
  const [sendWindowEnd, setSendWindowEnd] = useState(19);
  const [timezone, setTimezone] = useState("America/New_York");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const settings = status?.settings;
  useEffect(() => {
    if (!settings) return;
    setAgentName(settings.agentName);
    setInstructions(settings.instructions ?? "");
    setAutoEngageLeads(settings.autoEngageLeads);
    setAutoReply(settings.autoReply);
    setSendWindowStart(settings.sendWindowStart);
    setSendWindowEnd(settings.sendWindowEnd);
    setTimezone(settings.timezone);
  }, [settings]);

  const webhookUrl = `${window.location.origin}/api/integrations/roofr`;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await api.updateOutreachSettings(
      {
        agentName: agentName.trim() || "CHS Assistant",
        instructions: instructions.trim() || null,
        autoEngageLeads,
        autoReply,
        sendWindowStart,
        sendWindowEnd,
        timezone: timezone.trim() || "America/New_York",
      },
      adminKey,
    );
    setSaving(false);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    setSavedAt(Date.now());
    onSaved(res.data.settings);
  };

  const copyWebhook = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore — the URL is visible for manual copy
    }
  };

  if (!status) {
    return <p className="text-sm text-muted-foreground">Loading settings…</p>;
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4 items-start">
      <form onSubmit={save} className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <h3 className="font-display font-bold text-foreground text-base">Texting agent</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            How the AI introduces itself and behaves in conversations.
          </p>
        </div>

        <label className="block">
          <span className="block text-xs font-semibold text-foreground mb-1">Agent name</span>
          <input
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            placeholder="CHS Assistant"
            className="w-full h-10 px-3 rounded-lg border border-border/60 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>

        <label className="block">
          <span className="block text-xs font-semibold text-foreground mb-1">Instructions</span>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={5}
            placeholder="Tone, offers to mention, questions to ask, things to never promise…"
            className="w-full px-3 py-2 rounded-lg border border-border/60 bg-background text-sm leading-relaxed resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>

        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={autoEngageLeads}
            onChange={(e) => setAutoEngageLeads(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-primary"
          />
          <span>
            <span className="block text-sm font-semibold text-foreground">
              Automatically text new leads
            </span>
            <span className="block text-[11px] text-muted-foreground">
              When a lead with a phone number comes in, the agent starts the conversation.
            </span>
          </span>
        </label>

        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={autoReply}
            onChange={(e) => setAutoReply(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-primary"
          />
          <span>
            <span className="block text-sm font-semibold text-foreground">
              Agent replies automatically
            </span>
            <span className="block text-[11px] text-muted-foreground">
              When off, the agent only writes drafts and waits for your approval before anything
              is sent.
            </span>
          </span>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="block text-xs font-semibold text-foreground mb-1">Send window start</span>
            <select
              value={sendWindowStart}
              onChange={(e) => setSendWindowStart(Number(e.target.value))}
              className="w-full h-10 px-2.5 rounded-lg border border-border/60 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {Array.from({ length: 24 }, (_, h) => (
                <option key={h} value={h}>
                  {hourLabel(h)}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-foreground mb-1">Send window end</span>
            <select
              value={sendWindowEnd}
              onChange={(e) => setSendWindowEnd(Number(e.target.value))}
              className="w-full h-10 px-2.5 rounded-lg border border-border/60 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {Array.from({ length: 24 }, (_, h) => (
                <option key={h} value={h}>
                  {hourLabel(h)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="block text-xs font-semibold text-foreground mb-1">Timezone</span>
          <input
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            placeholder="America/New_York"
            className="w-full h-10 px-3 rounded-lg border border-border/60 bg-background text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <span className="block text-[11px] text-muted-foreground mt-1">
            The agent never texts outside the send window in this timezone.
          </span>
        </label>

        {error && <p className="text-[11px] text-destructive whitespace-pre-line">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full inline-flex items-center justify-center gap-1.5 bg-primary disabled:opacity-60 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-primary/30 transition-all"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving…" : savedAt ? "Saved — save again" : "Save settings"}
        </button>
      </form>

      <div className="space-y-4">
        <section className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
          <h3 className="font-display font-bold text-foreground text-base mb-1">
            Roofr / Zapier webhook
          </h3>
          <p className="text-[12px] text-muted-foreground leading-relaxed mb-3">
            Paste this URL into your Zapier webhook step (or Roofr automation) so new Roofr leads
            flow straight into the texting agent.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-[12px] font-mono bg-background border border-border/60 rounded-lg px-3 py-2.5 break-all">
              {webhookUrl}
            </code>
            <button
              type="button"
              onClick={() => void copyWebhook()}
              className="h-10 px-3 rounded-lg bg-card border border-border/60 text-xs font-semibold inline-flex items-center gap-1.5 hover:border-primary/40 hover:text-primary transition-colors shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground leading-relaxed">
            {status.roofrSecretConfigured ? (
              <>
                Requests are verified with your{" "}
                <code className="font-mono">ROOFR_WEBHOOK_SECRET</code> — include it in the webhook
                payload or headers as configured in Zapier.
              </>
            ) : (
              <>
                Tip: set a <code className="font-mono">ROOFR_WEBHOOK_SECRET</code> secret and
                include it in the Zapier request so only your Zap can push leads in.
              </>
            )}
          </p>
        </section>

        <section className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
          <h3 className="font-display font-bold text-foreground text-base mb-2">Connections</h3>
          <ul className="space-y-2 text-[13px]">
            <li className="flex items-center gap-2">
              <StatusDot ok={status.twilioConfigured} />
              <span className="text-foreground">Twilio SMS</span>
              <span className="ml-auto text-[11px] text-muted-foreground">
                {status.twilioConfigured ? "Connected" : "Test mode"}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <StatusDot ok={status.aiConfigured} />
              <span className="text-foreground">AI drafting (Anthropic)</span>
              <span className="ml-auto text-[11px] text-muted-foreground">
                {status.aiConfigured ? "Connected" : "Not configured"}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <StatusDot ok={status.roofrSecretConfigured} />
              <span className="text-foreground">Roofr webhook secret</span>
              <span className="ml-auto text-[11px] text-muted-foreground">
                {status.roofrSecretConfigured ? "Set" : "Not set"}
              </span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span
      className={`w-2 h-2 rounded-full shrink-0 ${ok ? "bg-emerald-500" : "bg-amber-400"}`}
      aria-hidden="true"
    />
  );
}
