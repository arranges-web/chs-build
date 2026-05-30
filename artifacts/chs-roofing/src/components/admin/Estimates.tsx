import { Calculator } from "lucide-react";

type AnyRow = Record<string, unknown>;

function fmtDate(value: unknown): string {
  if (typeof value !== "string") return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function safeStr(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  return String(v);
}

const fmtUSD = (raw: unknown) => {
  const n = Number(raw);
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
};

type Props = {
  rows: AnyRow[] | null;
  loading?: boolean;
};

export default function Estimates({ rows, loading }: Props) {
  if (loading && (rows ?? []).length === 0) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }
  if (!rows || rows.length === 0) {
    return (
      <div className="bg-card border border-border/60 rounded-2xl p-10 text-center">
        <Calculator className="w-8 h-8 mx-auto text-muted-foreground/60 mb-3" />
        <p className="font-semibold text-foreground">No estimates yet.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Estimator-tool submissions show up here as soon as customers run a quote.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-auto bg-card border border-border/60 rounded-2xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/40 text-foreground/70 text-[11px] uppercase tracking-wider">
            <th className="text-left font-semibold px-4 py-3">Date</th>
            <th className="text-left font-semibold px-4 py-3">Contact</th>
            <th className="text-left font-semibold px-4 py-3">Material</th>
            <th className="text-left font-semibold px-4 py-3">Pitch</th>
            <th className="text-right font-semibold px-4 py-3">Sq ft</th>
            <th className="text-right font-semibold px-4 py-3">Range</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {rows.map((r, i) => (
            <tr key={(r.id as number | undefined) ?? i} className="hover:bg-muted/20">
              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                {fmtDate(r.createdAt)}
              </td>
              <td className="px-4 py-3">
                <p className="font-semibold text-foreground">{safeStr(r.name) || "—"}</p>
                <p className="text-xs text-muted-foreground">
                  {safeStr(r.phone)}
                  {r.phone && r.email ? " · " : ""}
                  {safeStr(r.email)}
                </p>
                {safeStr(r.address) && (
                  <p className="text-xs text-muted-foreground">{safeStr(r.address)}</p>
                )}
              </td>
              <td className="px-4 py-3 capitalize">{safeStr(r.material).replace(/-/g, " ")}</td>
              <td className="px-4 py-3 capitalize">{safeStr(r.pitch).replace(/-/g, " ")}</td>
              <td className="px-4 py-3 text-right text-muted-foreground">{safeStr(r.footprintSf)}</td>
              <td className="px-4 py-3 text-right font-semibold text-foreground whitespace-nowrap">
                {fmtUSD(r.lowEstimate)} – {fmtUSD(r.highEstimate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
