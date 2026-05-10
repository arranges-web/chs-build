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
  Image as ImageIcon,
  MessageSquare,
  Save,
  RefreshCw,
} from "lucide-react";
import {
  api,
  type Customer,
  type Job,
  type JobUpdate,
  type JobPhoto,
} from "@/lib/api";

type Detail = { customer: Customer; jobs: Job[] };

const STATUS_OPTS = [
  { value: "scheduled", label: "Scheduled", icon: Clock },
  { value: "in_progress", label: "In progress", icon: Hammer },
  { value: "complete", label: "Complete", icon: CheckCircle2 },
  { value: "on_hold", label: "On hold", icon: Pause },
];

export default function Clients({ adminKey }: { adminKey: string }) {
  const [list, setList] = useState<Customer[] | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const loadList = async () => {
    setLoading(true);
    const res = await api.listCustomers(adminKey);
    if (res) setList(res.rows);
    setLoading(false);
  };

  const loadDetail = async (id: number) => {
    setLoading(true);
    const res = await api.getCustomer(id, adminKey);
    if (res) setDetail(res);
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
          onCancel={() => setCreating(false)}
          onCreated={(c) => {
            setCreating(false);
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
  onCancel,
  onCreated,
}: {
  adminKey: string;
  onCancel: () => void;
  onCreated: (c: Customer) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);

  return (
    <form
      className="bg-card border border-border/60 rounded-2xl p-5 mb-6 shadow-sm"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        setSaving(true);
        const res = await api.createCustomer(
          {
            name: name.trim(),
            email: email.trim() || undefined,
            phone: phone.trim() || undefined,
            address: address.trim() || undefined,
          },
          adminKey,
        );
        setSaving(false);
        if (res) onCreated(res.row);
      }}
    >
      <h3 className="font-display font-bold text-foreground text-lg mb-3">New customer</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Name" value={name} onChange={setName} required />
        <Field label="Email" value={email} onChange={setEmail} type="email" />
        <Field label="Phone" value={phone} onChange={setPhone} type="tel" />
        <Field label="Address" value={address} onChange={setAddress} />
      </div>
      <div className="mt-4 flex items-center gap-2">
        <button
          type="submit"
          disabled={saving || !name.trim()}
          className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md shadow-primary/30"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving…" : "Create customer"}
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
        An account number is generated automatically (e.g. <code>CHS-A2K9P3</code>).
        Share that number — or the email — so the customer can sign into the portal.
      </p>
    </form>
  );
}

function CustomerDetail({
  adminKey,
  detail,
  onBack,
  onChanged,
}: {
  adminKey: string;
  detail: Detail;
  onBack: () => void;
  onChanged: () => void;
}) {
  const c = detail.customer;
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(c.name);
  const [email, setEmail] = useState(c.email ?? "");
  const [phone, setPhone] = useState(c.phone ?? "");
  const [address, setAddress] = useState(c.address ?? "");

  const [addingJob, setAddingJob] = useState(false);

  const save = async () => {
    await api.updateCustomer(
      c.id,
      { name, email: email || null, phone: phone || null, address: address || null },
      adminKey,
    );
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
            <JobAdminCard key={j.id} adminKey={adminKey} job={j} onChanged={onChanged} />
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
}: {
  adminKey: string;
  job: Job;
  onChanged: () => void;
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
