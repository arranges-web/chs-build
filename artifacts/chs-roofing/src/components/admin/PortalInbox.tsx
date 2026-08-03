import { useEffect, useMemo, useState } from "react";
import {
  Inbox,
  Loader2,
  MessagesSquare,
  Phone,
  RefreshCw,
  Send,
  Wrench,
} from "lucide-react";
import {
  api,
  type AdminCustomerMessageRow,
  type AdminServiceRequestRow,
} from "@/lib/api";

const REQUEST_STATUS: { value: string; label: string }[] = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In progress" },
  { value: "closed", label: "Closed" },
];

const REQUEST_STATUS_BADGE: Record<string, string> = {
  new: "bg-primary/10 text-primary",
  in_progress: "bg-amber-100 text-amber-700",
  closed: "bg-emerald-100 text-emerald-700",
};

const prettify = (s: string) => s.replace(/[-_]/g, " ").replace(/^\w/, (c) => c.toUpperCase());

const fmtDateTime = (s?: string | null) => {
  if (!s) return "";
  const d = new Date(s);
  return Number.isNaN(d.getTime())
    ? String(s)
    : d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
};

type Props = { adminKey: string };

export default function PortalInbox({ adminKey }: Props) {
  const [tab, setTab] = useState<"requests" | "messages">("requests");
  const [requests, setRequests] = useState<AdminServiceRequestRow[] | null>(null);
  const [messages, setMessages] = useState<AdminCustomerMessageRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (silent = false) => {
    if (!silent) setLoading(true);
    const [reqRes, msgRes] = await Promise.all([
      api.listServiceRequests(adminKey),
      api.listCustomerMessages(adminKey),
    ]);
    if ("data" in reqRes) setRequests(reqRes.data.rows);
    if ("data" in msgRes) setMessages(msgRes.data.rows);
    if ("error" in reqRes) setError(reqRes.error);
    else if ("error" in msgRes) setError(msgRes.error);
    else setError(null);
    if (!silent) setLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const newRequests = useMemo(
    () => (requests ?? []).filter((r) => r.status === "new").length,
    [requests],
  );
  const unreadMessages = useMemo(
    () => (messages ?? []).filter((m) => m.sender === "customer" && !m.readByTeam).length,
    [messages],
  );

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        {(
          [
            { id: "requests", label: "Service Requests", icon: Wrench, count: newRequests },
            { id: "messages", label: "Messages", icon: MessagesSquare, count: unreadMessages },
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
            {t.count > 0 && (
              <span
                className={`min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${
                  tab === t.id ? "bg-white/20 text-white" : "bg-primary text-white"
                }`}
              >
                {t.count}
              </span>
            )}
          </button>
        ))}
        <button
          type="button"
          onClick={() => void load()}
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

      {tab === "requests" ? (
        <RequestsTab
          adminKey={adminKey}
          rows={requests}
          loading={loading}
          onUpdated={(row) =>
            setRequests((prev) =>
              prev ? prev.map((r) => (r.id === row.id ? { ...r, status: row.status } : r)) : prev,
            )
          }
        />
      ) : (
        <MessagesTab
          adminKey={adminKey}
          rows={messages}
          loading={loading}
          onChanged={() => void load(true)}
          onMarkedRead={(customerId) =>
            setMessages((prev) =>
              prev
                ? prev.map((m) => (m.customerId === customerId ? { ...m, readByTeam: true } : m))
                : prev,
            )
          }
        />
      )}
    </div>
  );
}

// ─── Service requests ────────────────────────────────────────────

function RequestsTab({
  adminKey,
  rows,
  loading,
  onUpdated,
}: {
  adminKey: string;
  rows: AdminServiceRequestRow[] | null;
  loading: boolean;
  onUpdated: (row: { id: number; status: string }) => void;
}) {
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setStatus = async (id: number, status: string) => {
    setBusyId(id);
    setError(null);
    const res = await api.updateServiceRequest(id, status, adminKey);
    setBusyId(null);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    onUpdated({ id, status: res.data.row.status });
  };

  if (loading && !rows) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }
  if (!rows || rows.length === 0) {
    return (
      <div className="bg-card border border-border/60 rounded-2xl p-10 text-center">
        <Wrench className="w-8 h-8 mx-auto text-muted-foreground/60 mb-3" />
        <p className="font-semibold text-foreground">No service requests yet.</p>
        <p className="text-sm text-muted-foreground mt-1">
          When a customer asks for a repair, inspection, or warranty visit from their portal, it
          lands here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-3 rounded-xl border border-destructive/40 bg-destructive/5 text-destructive text-sm">
          {error}
        </div>
      )}
      {rows.map((r) => (
        <article
          key={r.id}
          className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-2">
            <span
              className={`text-[10px] uppercase tracking-[0.16em] font-semibold px-2 py-0.5 rounded-full ${
                REQUEST_STATUS_BADGE[r.status] ?? "bg-foreground/[0.05] text-foreground/80"
              }`}
            >
              {REQUEST_STATUS.find((s) => s.value === r.status)?.label ?? prettify(r.status)}
            </span>
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-foreground/70 bg-foreground/[0.04] px-2 py-0.5 rounded-full">
              {prettify(r.requestType)}
            </span>
            <span className="ml-auto text-[11px] text-muted-foreground">
              {fmtDateTime(r.createdAt)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span className="font-semibold text-foreground">
              {r.customerName ?? "Unknown customer"}
            </span>
            {r.accountNumber && (
              <span className="font-mono text-[12px] text-muted-foreground">{r.accountNumber}</span>
            )}
            {r.customerPhone && (
              <a
                href={`tel:${r.customerPhone}`}
                className="inline-flex items-center gap-1 text-[13px] text-muted-foreground hover:text-primary"
              >
                <Phone className="w-3 h-3" />
                {r.customerPhone}
              </a>
            )}
          </div>

          {r.message && (
            <p className="mt-3 text-sm text-foreground/85 bg-muted/40 border border-border/60 rounded-lg p-3 leading-relaxed whitespace-pre-line">
              {r.message}
            </p>
          )}

          <div className="mt-3 pt-3 border-t border-border/60 flex items-center gap-2">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.14em]">
              Status
            </label>
            <select
              value={r.status}
              disabled={busyId === r.id}
              onChange={(e) => void setStatus(r.id, e.target.value)}
              className="h-9 px-2.5 rounded-lg border border-border/60 bg-background text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
            >
              {REQUEST_STATUS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            {busyId === r.id && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
          </div>
        </article>
      ))}
    </div>
  );
}

// ─── Customer messages ───────────────────────────────────────────

type MessageThread = {
  customerId: number;
  customerName: string | null;
  accountNumber: string | null;
  messages: AdminCustomerMessageRow[];
  unread: number;
  lastAt: string;
};

function MessagesTab({
  adminKey,
  rows,
  loading,
  onChanged,
  onMarkedRead,
}: {
  adminKey: string;
  rows: AdminCustomerMessageRow[] | null;
  loading: boolean;
  onChanged: () => void;
  onMarkedRead: (customerId: number) => void;
}) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const threads = useMemo<MessageThread[]>(() => {
    const byCustomer = new Map<number, MessageThread>();
    for (const m of rows ?? []) {
      let t = byCustomer.get(m.customerId);
      if (!t) {
        t = {
          customerId: m.customerId,
          customerName: m.customerName,
          accountNumber: m.accountNumber,
          messages: [],
          unread: 0,
          lastAt: m.createdAt,
        };
        byCustomer.set(m.customerId, t);
      }
      t.messages.push(m);
      if (m.sender === "customer" && !m.readByTeam) t.unread += 1;
      if (m.createdAt > t.lastAt) t.lastAt = m.createdAt;
    }
    const list = Array.from(byCustomer.values());
    for (const t of list) {
      t.messages.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    }
    list.sort((a, b) => b.lastAt.localeCompare(a.lastAt));
    return list;
  }, [rows]);

  const selected = threads.find((t) => t.customerId === selectedId) ?? null;

  const open = (t: MessageThread) => {
    setSelectedId(t.customerId);
    setReply("");
    setError(null);
    if (t.unread > 0) {
      onMarkedRead(t.customerId);
      void api.markCustomerMessagesRead(t.customerId, adminKey);
    }
  };

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !reply.trim()) return;
    setSending(true);
    setError(null);
    const res = await api.replyCustomerMessage(
      { customerId: selected.customerId, body: reply.trim() },
      adminKey,
    );
    setSending(false);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    setReply("");
    onChanged();
  };

  if (loading && !rows) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }
  if (threads.length === 0) {
    return (
      <div className="bg-card border border-border/60 rounded-2xl p-10 text-center">
        <MessagesSquare className="w-8 h-8 mx-auto text-muted-foreground/60 mb-3" />
        <p className="font-semibold text-foreground">No portal messages yet.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Conversations customers start from their portal show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[300px_1fr] gap-4 items-start">
      {/* Thread list */}
      <section
        className={`bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden ${
          selectedId != null ? "hidden lg:block" : ""
        }`}
      >
        <ul className="max-h-[65vh] overflow-y-auto divide-y divide-border/60">
          {threads.map((t) => {
            const last = t.messages[t.messages.length - 1];
            return (
              <li key={t.customerId}>
                <button
                  type="button"
                  onClick={() => open(t)}
                  className={`w-full text-left p-3 transition-colors ${
                    selectedId === t.customerId ? "bg-primary/5" : "hover:bg-foreground/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-foreground truncate">
                      {t.customerName ?? `Customer #${t.customerId}`}
                    </p>
                    {t.unread > 0 && (
                      <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {t.unread}
                      </span>
                    )}
                    <span className="ml-auto text-[10px] text-muted-foreground shrink-0">
                      {fmtDateTime(t.lastAt)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[12px] text-muted-foreground truncate">
                    {last ? `${last.sender === "team" ? "You: " : ""}${last.body}` : ""}
                  </p>
                  {t.accountNumber && (
                    <p className="text-[10px] font-mono text-muted-foreground/70 mt-0.5">
                      {t.accountNumber}
                    </p>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Thread */}
      <section className={selectedId == null ? "hidden lg:block" : ""}>
        {!selected ? (
          <div className="bg-card border border-border/60 rounded-2xl p-10 text-center">
            <Inbox className="w-8 h-8 mx-auto text-muted-foreground/60 mb-3" />
            <p className="font-semibold text-foreground">Pick a conversation.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Replies you send here appear instantly in the customer's portal.
            </p>
          </div>
        ) : (
          <div className="bg-card border border-border/60 rounded-2xl shadow-sm flex flex-col">
            <div className="p-3.5 border-b border-border/60 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="lg:hidden text-xs font-semibold text-muted-foreground hover:text-foreground pr-1"
              >
                ← Back
              </button>
              <div>
                <p className="font-display font-bold text-foreground text-sm leading-tight">
                  {selected.customerName ?? `Customer #${selected.customerId}`}
                </p>
                {selected.accountNumber && (
                  <p className="text-[11px] font-mono text-muted-foreground">
                    {selected.accountNumber}
                  </p>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[50vh]">
              {selected.messages.map((m) => {
                const fromTeam = m.sender === "team";
                return (
                  <div
                    key={m.id}
                    className={`max-w-[85%] sm:max-w-[75%] ${fromTeam ? "ml-auto" : "mr-auto"}`}
                  >
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                        fromTeam
                          ? "bg-primary text-white rounded-br-sm shadow-sm shadow-primary/20"
                          : "bg-muted text-foreground rounded-bl-sm"
                      }`}
                    >
                      {m.body}
                    </div>
                    <p
                      className={`mt-1 text-[10px] text-muted-foreground ${
                        fromTeam ? "text-right" : ""
                      }`}
                    >
                      {m.authorName ? `${m.authorName} · ` : ""}
                      {fmtDateTime(m.createdAt)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="p-3 border-t border-border/60">
              {error && (
                <p className="mb-2 text-[11px] text-destructive whitespace-pre-line">{error}</p>
              )}
              <form onSubmit={sendReply} className="flex items-end gap-2">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder={`Reply to ${selected.customerName ?? "customer"}…`}
                  rows={2}
                  className="flex-1 px-3 py-2 rounded-xl border border-border/60 bg-background text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <button
                  type="submit"
                  disabled={sending || !reply.trim()}
                  className="h-10 px-4 rounded-xl bg-primary text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm shadow-primary/30 disabled:opacity-60 shrink-0"
                >
                  {sending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  Reply
                </button>
              </form>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
