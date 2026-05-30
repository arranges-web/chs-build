import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  Hammer,
  Pause,
  Plus,
  Trash2,
  CheckCircle2,
  Check as CheckIcon,
  Image as ImageIcon,
  MessageSquare,
  Save,
  RefreshCw,
  Copy,
  KeyRound,
  Mail as MailIcon,
} from "lucide-react";
import {
  api,
  type Customer,
  type Job,
  type JobUpdate,
  type JobPhoto,
} from "@/lib/api";
import type { CustomerPrefill } from "./AdminShell";

type Detail = { customer: Customer; jobs: Job[] };

const STATUS_OPTS = [
  { value: "scheduled", label: "Scheduled", icon: Clock },
  { value: "in_progress", label: "In progress", icon: Hammer },
  { value: "complete", label: "Complete", icon: CheckCircle2 },
  { value: "on_hold", label: "On hold", icon: Pause },
];

export default function Clients({
  adminKey,
  initialPrefill,
  onConsumePrefill,
  onOpenJob,
}: {
  adminKey: string;
  initialPrefill?: CustomerPrefill | null;
  onConsumePrefill?: () => void;
  onOpenJob?: (jobId: number, customerId: number) => void;
}) {
  const [list, setList] = useState<Customer[] | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [prefill, setPrefill] = useState<CustomerPrefill | null>(null);

  // When a Convert-to-client action lands a prefill payload, pop the
  // new-customer form open with the lead's name/email/phone/address
  // already filled in.
  useEffect(() => {
    if (initialPrefill) {
      setPrefill(initialPrefill);
      setCreating(true);
      setActiveId(null);
      onConsumePrefill?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrefill]);

  const loadList = async () => {
    setLoading(true);
    const res = await api.listCustomers(adminKey);
    if (res) setList(res.rows);
    setLoading(false);
  };

  const loadDetail = async (id: number) => {
    setLoading(true);
    const res = await api.getCustomer(id, adminKey);
    if ("data" in res) setDetail(res.data);
    setLoading(false);
  };

  useEffect(() => {
    void loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeId) void loadDetail(activeId);
    else setDetail(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  // ─── Detail view ───────────────────────────────────────────────
  if (activeId && detail) {
    return (
      <CustomerDetail
        adminKey={adminKey}
        detail={detail}
        onBack={() => {
          setActiveId(null);
          void loadList();
        }}
        onChanged={() => activeId && void loadDetail(activeId)}
        onOpenJob={onOpenJob}
      />
    );
  }

  // ─── List view ────────────────────────────────────────────────
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {list ? `${list.length} customer${list.length === 1 ? "" : "s"}` : ""}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void loadList()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold text-foreground bg-card border border-border/60 hover:border-primary/40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white bg-primary hover:bg-primary/90 shadow-md shadow-primary/30"
          >
            <Plus className="w-4 h-4" />
            New customer
          </button>
        </div>
      </div>

      {creating && (
        <NewCustomerForm
          adminKey={adminKey}
          prefill={prefill}
          onCancel={() => {
            setCreating(false);
            setPrefill(null);
          }}
          onCreated={(c) => {
            setCreating(false);
            setPrefill(null);
            void loadList().then(() => setActiveId(c.id));
          }}
        />
      )}

      {list && list.length === 0 && !creating ? (
        <div className="bg-card border border-border/60 rounded-2xl p-10 text-center">
          <p className="font-semibold text-foreground">No customers yet.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add your first customer — they'll get an account number they can
            use to sign in to the customer portal.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 text-foreground/70 text-[11px] uppercase tracking-wider">
                <th className="text-left font-semibold px-4 py-3">Name</th>
                <th className="text-left font-semibold px-4 py-3">Account #</th>
                <th className="text-left font-semibold px-4 py-3">Email</th>
                <th className="text-left font-semibold px-4 py-3">Phone</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {(list ?? []).map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className="hover:bg-muted/20 cursor-pointer"
                >
                  <td className="px-4 py-3 font-semibold text-foreground">{c.name}</td>
                  <td className="px-4 py-3 font-mono text-foreground/80">{c.accountNumber}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.email ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    <ChevronRight className="w-4 h-4 inline" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function NewCustomerForm({
  adminKey,
  prefill,
  onCancel,
  onCreated,
}: {
  adminKey: string;
  prefill?: CustomerPrefill | null;
  onCancel: () => void;
  onCreated: (c: Customer) => void;
}) {
  const [name, setName] = useState(prefill?.name ?? "");
  const [email, setEmail] = useState(prefill?.email ?? "");
  const [phone, setPhone] = useState(prefill?.phone ?? "");
  const [address, setAddress] = useState(prefill?.address ?? "");
  // First project — fully optional. If "Add first project" is toggled
  // on, we create the customer AND a starter job in the same submit so
  // there's only one workflow for the team.
  const [addProject, setAddProject] = useState(false);
  const [pTitle, setPTitle] = useState("");
  const [pServiceType, setPServiceType] = useState("");
  const [pStatus, setPStatus] = useState("scheduled");
  const [pProgress, setPProgress] = useState("0");
  const [pStartDate, setPStartDate] = useState("");
  const [pEstCompletion, setPEstCompletion] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSubmit = name.trim().length > 1 && emailValid;

  return (
    <form
      className="bg-card border border-border/60 rounded-2xl p-5 mb-6 shadow-sm"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!canSubmit) return;
        setSaving(true);
        setError(null);
        const res = await api.createCustomer(
          {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim() || undefined,
            address: address.trim() || undefined,
          },
          adminKey,
        );
        if (!("data" in res)) {
          setSaving(false);
          setError(res.error);
          return;
        }
        const customer = res.data.row;
        // Optionally create a starter job so the customer's portal
        // has something to show on first login.
        if (addProject && pTitle.trim()) {
          const jobRes = await api.createJob(
            {
              customerId: customer.id,
              title: pTitle.trim(),
              serviceType: pServiceType || undefined,
              status: pStatus,
              progress: Number(pProgress) || 0,
              startDate: pStartDate || undefined,
              estimatedCompletion: pEstCompletion || undefined,
            },
            adminKey,
          );
          if (!("data" in jobRes)) {
            // Customer was created — surface the job error but don't
            // roll back. They can add the job from the detail view.
            setError(
              `Customer created, but the project couldn't be added: ${jobRes.error}`,
            );
          }
        }
        setSaving(false);
        onCreated(customer);
      }}
    >
      <h3 className="font-display font-bold text-foreground text-lg mb-1">New customer</h3>
      <p className="text-[12px] text-muted-foreground mb-4">
        Email is required — that's how the customer signs into their portal at{" "}
        <code className="text-foreground">/portal</code>.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Name" value={name} onChange={setName} required />
        <Field label="Email (login)" value={email} onChange={setEmail} type="email" required />
        <Field label="Phone" value={phone} onChange={setPhone} type="tel" />
        <Field label="Address" value={address} onChange={setAddress} />
      </div>

      {/* First project toggle */}
      <div className="mt-5 pt-4 border-t border-border/60">
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground cursor-pointer select-none">
          <input
            type="checkbox"
            checked={addProject}
            onChange={(e) => setAddProject(e.target.checked)}
            className="w-4 h-4 accent-primary"
          />
          Assign a first project now
        </label>
        <p className="text-[11px] text-muted-foreground mt-1">
          Optional — gives the customer something to see in their portal on first login. You can
          also add projects later from their detail page.
        </p>

        {addProject && (
          <div className="mt-3 grid sm:grid-cols-2 gap-3 p-3 rounded-xl bg-muted/30 border border-border/60">
            <Field
              label="Project title"
              value={pTitle}
              onChange={setPTitle}
              placeholder="e.g. Shingle re-roof — main house"
              required
            />
            <Field
              label="Service type"
              value={pServiceType}
              onChange={setPServiceType}
              placeholder="installation, repair…"
            />
            <SelectField
              label="Status"
              value={pStatus}
              onChange={setPStatus}
              options={STATUS_OPTS.map((o) => ({ value: o.value, label: o.label }))}
            />
            <Field label="Progress (0–100)" value={pProgress} onChange={setPProgress} type="number" />
            <Field label="Start date" value={pStartDate} onChange={setPStartDate} type="date" />
            <Field
              label="Est. completion"
              value={pEstCompletion}
              onChange={setPEstCompletion}
              type="date"
            />
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 p-3 rounded-lg border border-destructive/40 bg-destructive/5 text-xs text-destructive whitespace-pre-line">
          {error}
        </div>
      )}
      <div className="mt-4 flex items-center gap-2">
        <button
          type="submit"
          disabled={saving || !canSubmit || (addProject && !pTitle.trim())}
          className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md shadow-primary/30"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving…" : addProject ? "Create customer & project" : "Create customer"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-semibold text-muted-foreground hover:text-foreground px-2 py-1"
        >
          Cancel
        </button>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">
        An account number (e.g. <code>CHS-A2K9P3</code>) is generated automatically as a backup
        sign-in. Share <strong>either</strong> the email <strong>or</strong> the account number for
        portal access.
      </p>
    </form>
  );
}

function CustomerDetail({
  adminKey,
  detail,
  onBack,
  onChanged,
  onOpenJob,
}: {
  adminKey: string;
  detail: Detail;
  onBack: () => void;
  onChanged: () => void;
  onOpenJob?: (jobId: number, customerId: number) => void;
}) {
  const c = detail.customer;
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(c.name);
  const [email, setEmail] = useState(c.email ?? "");
  const [phone, setPhone] = useState(c.phone ?? "");
  const [address, setAddress] = useState(c.address ?? "");

  const [addingJob, setAddingJob] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const save = async () => {
    setSaveError(null);
    const res = await api.updateCustomer(
      c.id,
      { name, email: email || null, phone: phone || null, address: address || null },
      adminKey,
    );
    if ("error" in res) {
      setSaveError(res.error);
      return;
    }
    setEditing(false);
    onChanged();
  };

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        All customers
      </button>

      <div className="bg-card border border-border/60 rounded-3xl p-6 mb-8 shadow-sm">
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary">Customer</p>
            <h2 className="font-display font-bold text-2xl text-foreground tracking-tight">
              {c.name}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Account <span className="font-mono font-semibold text-foreground">{c.accountNumber}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            className="text-sm font-semibold text-primary hover:underline"
          >
            {editing ? "Cancel edit" : "Edit"}
          </button>
        </div>
        {editing ? (
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Name" value={name} onChange={setName} />
            <Field label="Email" value={email} onChange={setEmail} type="email" />
            <Field label="Phone" value={phone} onChange={setPhone} type="tel" />
            <Field label="Address" value={address} onChange={setAddress} />
            <div className="sm:col-span-2">
              {saveError && (
                <div className="mb-2 p-3 rounded-lg border border-destructive/40 bg-destructive/5 text-xs text-destructive whitespace-pre-line">
                  {saveError}
                </div>
              )}
              <button
                type="button"
                onClick={save}
                className="inline-flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold"
              >
                <Save className="w-4 h-4" />
                Save changes
              </button>
            </div>
          </div>
        ) : (
          <dl className="grid sm:grid-cols-2 gap-2 text-sm text-foreground/80">
            <Row label="Email" value={c.email ?? "—"} />
            <Row label="Phone" value={c.phone ?? "—"} />
            <Row label="Address" value={c.address ?? "—"} />
          </dl>
        )}

        {/* Portal access — how this customer logs in + send-invite action */}
        {!editing && (
          <PortalAccessCard customer={c} />
        )}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-xl text-foreground tracking-tight">
          Jobs
        </h3>
        <button
          type="button"
          onClick={() => setAddingJob(true)}
          className="inline-flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md shadow-primary/30"
        >
          <Plus className="w-4 h-4" />
          New job
        </button>
      </div>

      {addingJob && (
        <NewJobForm
          adminKey={adminKey}
          customerId={c.id}
          onCancel={() => setAddingJob(false)}
          onCreated={() => {
            setAddingJob(false);
            onChanged();
          }}
        />
      )}

      {detail.jobs.length === 0 && !addingJob ? (
        <div className="bg-card border border-border/60 rounded-2xl p-8 text-center text-sm text-muted-foreground">
          No jobs yet. Click "New job" to add one — it'll show up in the customer portal.
        </div>
      ) : (
        <div className="space-y-6">
          {detail.jobs.map((j) => (
            <JobAdminCard
              key={j.id}
              adminKey={adminKey}
              job={j}
              onChanged={onChanged}
              onOpenJob={onOpenJob ? () => onOpenJob(j.id, detail.customer.id) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NewJobForm({
  adminKey,
  customerId,
  onCancel,
  onCreated,
}: {
  adminKey: string;
  customerId: number;
  onCancel: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [status, setStatus] = useState("scheduled");
  const [progress, setProgress] = useState("0");
  const [startDate, setStartDate] = useState("");
  const [estimatedCompletion, setEstimatedCompletion] = useState("");
  const [saving, setSaving] = useState(false);

  return (
    <form
      className="bg-card border border-border/60 rounded-2xl p-5 mb-5 shadow-sm"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        setSaving(true);
        await api.createJob(
          {
            customerId,
            title: title.trim(),
            serviceType: serviceType || undefined,
            status,
            progress: Number(progress) || 0,
            startDate: startDate || undefined,
            estimatedCompletion: estimatedCompletion || undefined,
          },
          adminKey,
        );
        setSaving(false);
        onCreated();
      }}
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Title" value={title} onChange={setTitle} required />
        <Field label="Service type" value={serviceType} onChange={setServiceType} placeholder="installation, repair…" />
        <SelectField
          label="Status"
          value={status}
          onChange={setStatus}
          options={STATUS_OPTS.map((o) => ({ value: o.value, label: o.label }))}
        />
        <Field label="Progress (0–100)" value={progress} onChange={setProgress} type="number" />
        <Field label="Start date" value={startDate} onChange={setStartDate} type="date" />
        <Field
          label="Est. completion"
          value={estimatedCompletion}
          onChange={setEstimatedCompletion}
          type="date"
        />
      </div>
      <div className="mt-4 flex items-center gap-2">
        <button
          type="submit"
          disabled={saving || !title.trim()}
          className="inline-flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving…" : "Create job"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-semibold text-muted-foreground hover:text-foreground px-2 py-1"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function JobAdminCard({
  adminKey,
  job,
  onChanged,
  onOpenJob,
}: {
  adminKey: string;
  job: Job;
  onChanged: () => void;
  onOpenJob?: () => void;
}) {
  const [status, setStatus] = useState(job.status);
  const [progress, setProgress] = useState(String(job.progress));
  const [savingMeta, setSavingMeta] = useState(false);

  const [updateBody, setUpdateBody] = useState("");
  const [updateAuthor, setUpdateAuthor] = useState("CHS Team");

  const [photoUrl, setPhotoUrl] = useState("");
  const [photoCaption, setPhotoCaption] = useState("");

  const saveMeta = async () => {
    setSavingMeta(true);
    await api.updateJob(
      job.id,
      { status, progress: Number(progress) || 0 },
      adminKey,
    );
    setSavingMeta(false);
    onChanged();
  };

  const updates = useMemo(() => job.updates, [job.updates]);
  const photos = useMemo(() => job.photos, [job.photos]);

  return (
    <article className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden">
      <header className="p-5 border-b border-border/60 flex flex-wrap items-baseline gap-3 justify-between">
        <div>
          <h4 className="font-display font-bold text-foreground text-lg">{job.title}</h4>
          {job.serviceType && (
            <p className="text-xs text-muted-foreground mt-0.5 capitalize">
              {job.serviceType.replace(/-/g, " ")}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onOpenJob && (
            <button
              type="button"
              onClick={onOpenJob}
              className="inline-flex items-center gap-1 bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm shadow-primary/30 hover:bg-primary/90"
            >
              Open project
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={async () => {
              if (!confirm("Delete this job? This will also delete its updates and photos.")) return;
              await api.deleteJob(job.id, adminKey);
              onChanged();
            }}
            className="text-xs font-semibold text-destructive hover:underline inline-flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete job
          </button>
        </div>
      </header>

      <div className="p-5 grid sm:grid-cols-3 gap-3 items-end border-b border-border/60">
        <SelectField
          label="Status"
          value={status}
          onChange={setStatus}
          options={STATUS_OPTS.map((o) => ({ value: o.value, label: o.label }))}
        />
        <Field label="Progress (0–100)" value={progress} onChange={setProgress} type="number" />
        <button
          type="button"
          onClick={saveMeta}
          disabled={savingMeta}
          className="h-10 inline-flex items-center justify-center gap-1.5 bg-primary text-white rounded-xl text-sm font-semibold disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {savingMeta ? "Saving…" : "Save"}
        </button>
      </div>

      <div className="p-5 border-b border-border/60">
        <h5 className="font-display font-bold text-sm text-foreground tracking-tight mb-3 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          Updates
        </h5>
        <form
          className="grid sm:grid-cols-[1fr_180px_auto] gap-2 mb-3"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!updateBody.trim()) return;
            await api.addJobUpdate(
              { jobId: job.id, body: updateBody.trim(), authorName: updateAuthor || undefined },
              adminKey,
            );
            setUpdateBody("");
            onChanged();
          }}
        >
          <input
            value={updateBody}
            onChange={(e) => setUpdateBody(e.target.value)}
            placeholder="Post an update for the customer…"
            className="h-10 px-3 rounded-lg border border-border/60 bg-background text-sm"
          />
          <input
            value={updateAuthor}
            onChange={(e) => setUpdateAuthor(e.target.value)}
            placeholder="Author"
            className="h-10 px-3 rounded-lg border border-border/60 bg-background text-sm"
          />
          <button
            type="submit"
            className="h-10 px-3 rounded-lg bg-primary text-white text-sm font-semibold inline-flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </form>
        {updates.length === 0 ? (
          <p className="text-xs text-muted-foreground">No updates yet.</p>
        ) : (
          <ol className="space-y-2.5">
            {updates.map((u: JobUpdate) => (
              <li
                key={u.id}
                className="flex items-start gap-3 bg-muted/30 border border-border/60 rounded-lg p-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground/85 whitespace-pre-line leading-relaxed">{u.body}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {u.authorName ? `${u.authorName} · ` : ""}
                    {new Date(u.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await api.deleteJobUpdate(u.id, adminKey);
                    onChanged();
                  }}
                  className="text-xs text-muted-foreground hover:text-destructive"
                  aria-label="Delete update"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="p-5">
        <h5 className="font-display font-bold text-sm text-foreground tracking-tight mb-3 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-primary" />
          Photos
        </h5>
        <form
          className="grid sm:grid-cols-[1fr_1fr_auto] gap-2 mb-3"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!photoUrl.trim()) return;
            await api.addJobPhoto(
              { jobId: job.id, url: photoUrl.trim(), caption: photoCaption || undefined },
              adminKey,
            );
            setPhotoUrl("");
            setPhotoCaption("");
            onChanged();
          }}
        >
          <input
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="Image URL (Drive share link, etc.)"
            className="h-10 px-3 rounded-lg border border-border/60 bg-background text-sm"
          />
          <input
            value={photoCaption}
            onChange={(e) => setPhotoCaption(e.target.value)}
            placeholder="Caption (optional)"
            className="h-10 px-3 rounded-lg border border-border/60 bg-background text-sm"
          />
          <button
            type="submit"
            className="h-10 px-3 rounded-lg bg-primary text-white text-sm font-semibold inline-flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </form>
        {photos.length === 0 ? (
          <p className="text-xs text-muted-foreground">No photos yet.</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {photos.map((p: JobPhoto) => (
              <div
                key={p.id}
                className="aspect-square rounded-lg overflow-hidden border border-border/60 bg-muted/30 relative group"
              >
                <img src={p.url} alt={p.caption ?? ""} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={async () => {
                    await api.deleteJobPhoto(p.id, adminKey);
                    onChanged();
                  }}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Delete photo"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

// ─── Tiny form helpers ─────────────────────────────────────────
function PortalAccessCard({ customer }: { customer: Customer }) {
  const [copied, setCopied] = useState<"email" | "account" | null>(null);
  const portalUrl = `https://chs-roofing.com/portal`;

  const copy = async (key: "email" | "account", text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied((k) => (k === key ? null : k)), 1500);
    } catch {
      // ignore
    }
  };

  const subject = "Your CHS Roofing portal access";
  const body = customer.email
    ? `Hi ${customer.name.split(" ")[0]},

You can now see your roof project status, photos, and team updates in your CHS Roofing customer portal.

How to sign in:
  1. Go to ${portalUrl}
  2. Enter this email: ${customer.email}
  3. (Or use your account number as a backup: ${customer.accountNumber})

We'll post updates and photos here as your project moves forward. If you ever need anything, just reply to this email or call us.

— CHS Roofing`
    : `Hi ${customer.name.split(" ")[0]},

You can see your roof project status, photos, and team updates in your CHS Roofing customer portal.

How to sign in:
  1. Go to ${portalUrl}
  2. Enter your account number: ${customer.accountNumber}

— CHS Roofing`;

  const mailto = customer.email
    ? `mailto:${customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    : `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div className="mt-5 pt-5 border-t border-border/60">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <KeyRound className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-primary">
            Portal sign-in
          </p>
          <p className="text-sm text-foreground/85 mt-0.5 leading-relaxed">
            This customer signs in at{" "}
            <a
              href="/portal"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-foreground hover:text-primary"
            >
              chs-roofing.com/portal
            </a>{" "}
            with the email <span className="font-semibold text-foreground">below</span> — or their account number as a backup.
          </p>
          <div className="mt-3 grid sm:grid-cols-2 gap-2">
            {customer.email ? (
              <CopyChip
                label="Email login"
                value={customer.email}
                copied={copied === "email"}
                onCopy={() => customer.email && copy("email", customer.email)}
              />
            ) : (
              <div className="rounded-lg border border-amber-300/60 bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
                No email on file — add one above so the customer can sign in with email.
              </div>
            )}
            <CopyChip
              label="Account #"
              value={customer.accountNumber}
              mono
              copied={copied === "account"}
              onCopy={() => copy("account", customer.accountNumber)}
            />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <a
              href={mailto}
              className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-semibold px-3 py-2 rounded-full shadow-sm shadow-primary/30 transition-all"
            >
              <MailIcon className="w-3.5 h-3.5" />
              Send portal invite email
            </a>
            {customer.phone && (
              <a
                href={`sms:${customer.phone}?&body=${encodeURIComponent(
                  `Hi ${customer.name.split(" ")[0]} — track your CHS Roofing project at ${portalUrl}. Sign in with ${customer.email ?? customer.accountNumber}.`,
                )}`}
                className="inline-flex items-center gap-1.5 bg-card border border-border/60 text-foreground text-xs font-semibold px-3 py-2 rounded-full hover:border-primary/40 hover:text-primary transition-colors"
              >
                Text invite
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CopyChip({
  label,
  value,
  copied,
  onCopy,
  mono,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
  mono?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onCopy}
      title="Copy to clipboard"
      className={`group flex items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors ${
        copied
          ? "border-emerald-300 bg-emerald-50"
          : "border-border/60 bg-background hover:border-primary/40"
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground">
          {label}
        </p>
        <p
          className={`text-sm font-semibold text-foreground truncate ${mono ? "font-mono" : ""}`}
        >
          {value}
        </p>
      </div>
      {copied ? (
        <CheckIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary shrink-0" />
      )}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  type,
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold text-foreground mb-1">{label}</span>
      <input
        type={type ?? "text"}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3 rounded-lg border border-border/60 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold text-foreground mb-1">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3 rounded-lg border border-border/60 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 bg-muted/30 border border-border/60 rounded-lg px-3 py-2">
      <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-semibold text-foreground truncate">{value}</span>
    </div>
  );
}
