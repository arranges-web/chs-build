import { useMemo, useState } from "react";
import { Check, Copy, MessageSquare, Search } from "lucide-react";
import { SITE } from "@/lib/site-config";

type Response = {
  q: string;
  a: string;
  category: Category;
};

type Category =
  | "Pricing"
  | "Scheduling"
  | "Materials"
  | "Insurance"
  | "Warranty"
  | "Process"
  | "Service Area"
  | "Maintenance"
  | "General";

const CATEGORIES: Category[] = [
  "Pricing",
  "Scheduling",
  "Materials",
  "Insurance",
  "Warranty",
  "Process",
  "Maintenance",
  "Service Area",
  "General",
];

// Library of ready-to-send answers covering the most common
// customer questions. Phrasing is friendly, on-brand, and SMS-safe
// (no markdown, no links unless natural). Phone + email pulled
// from SITE so they stay in sync.
const RESPONSES: Response[] = [
  // Pricing
  {
    category: "Pricing",
    q: "How much does a roof cost?",
    a: `Great question! Roof pricing depends on the material, size, and complexity of the home. Our published starting prices are: GAF shingle $460/sq, 5V metal $665/sq, standing seam $732/sq, tile re-roof $1,000/sq. You can run a quick estimate at chs-roofing.com/estimator, or we'll give you a free on-site inspection — call ${SITE.phoneDisplay}.`,
  },
  {
    category: "Pricing",
    q: "Is the inspection really free?",
    a: `Yes — the inspection and the written quote are both 100% free, with no obligation to use us. You'll get a transparent, line-itemed estimate within 24–48 hours of the visit.`,
  },
  {
    category: "Pricing",
    q: "Do you offer financing?",
    a: `Yes, we offer financing options on most projects through our partners. We'll go over plans and rates during your inspection so you can see what fits your monthly budget.`,
  },
  {
    category: "Pricing",
    q: "Why is metal more expensive than shingle?",
    a: `Metal is a premium long-term system — it lasts 50+ years vs. 25–30 years for shingle, carries a higher hurricane wind rating, and reflects heat to lower cooling bills. Insurance carriers often discount homeowner premiums for it too, so the lifetime cost can actually come out lower.`,
  },

  // Scheduling
  {
    category: "Scheduling",
    q: "How fast can you start?",
    a: `Most full re-roofs are scheduled within 2–4 weeks of signing. Emergency repairs and active leaks are usually addressed the same week — sometimes same-day. Tell me the situation and I'll get you on the calendar.`,
  },
  {
    category: "Scheduling",
    q: "How long does a roof take to install?",
    a: `Most asphalt shingle re-roofs take 1–2 days. Metal and tile typically take 3–7 days depending on size and complexity. We'll give you an exact timeline in your quote.`,
  },
  {
    category: "Scheduling",
    q: "When can you come look at my roof?",
    a: `We can usually schedule a free inspection within 2–3 business days. Want me to grab some dates that work for you? Or you can request one at chs-roofing.com/contact.`,
  },

  // Materials
  {
    category: "Materials",
    q: "What kind of roof should I get?",
    a: `Best choice depends on your home, budget, and how long you plan to stay. Shingle is the most affordable; metal is the most durable; tile is the most classic look for Florida. Happy to walk through options on a free inspection.`,
  },
  {
    category: "Materials",
    q: "What's the difference between standing seam and 5V?",
    a: `Standing seam has concealed fasteners and a clean, modern look — it's our premium metal system. 5V is a classic exposed-fastener profile that costs less and installs faster, while still being highly durable. Both come with strong Florida hurricane wind ratings.`,
  },
  {
    category: "Materials",
    q: "What shingle brand do you use?",
    a: `We install GAF and TAMKO architectural shingles. We're a GAF Certified Contractor, which gives you access to extended manufacturer warranties not available through every roofer.`,
  },
  {
    category: "Materials",
    q: "Do you do tile roofs?",
    a: `Yes — concrete and clay tile, including tile re-roofs over existing structures. Tile is one of the best long-term systems for Southwest Florida and we have crews trained specifically on tile install standards.`,
  },

  // Insurance
  {
    category: "Insurance",
    q: "Do you work with insurance?",
    a: `Yes — we document storm and hurricane damage thoroughly, write Xactimate-aligned scopes, and meet your adjuster on-site if needed. We've helped a lot of SWFL homeowners get a fair claim payout after a storm.`,
  },
  {
    category: "Insurance",
    q: "Will my insurance cover this?",
    a: `For sudden, storm-related damage — often yes. For wear-and-tear or aging — usually not. We'll take photos and provide documentation either way so you can file a claim if you want to try.`,
  },
  {
    category: "Insurance",
    q: "Can a metal roof lower my insurance?",
    a: `Yes, many Florida carriers offer discounts for metal roofing because of its higher wind rating. We can give you the manufacturer documentation needed to submit for the discount.`,
  },

  // Warranty
  {
    category: "Warranty",
    q: "What kind of warranty do you offer?",
    a: `Every install comes with a 10-year workmanship warranty from us, plus the manufacturer's material warranty (often 25 years on shingle, 35+ on metal Kynar finishes). Repairs come with a 30-day workmanship warranty.`,
  },
  {
    category: "Warranty",
    q: "Is the warranty transferable?",
    a: `Most of our material warranties are transferable to the next homeowner once if you sell. We'll give you the paperwork at job completion so it's easy to hand off.`,
  },

  // Process
  {
    category: "Process",
    q: "What's the process?",
    a: `Easy: 1) we come out and do a free roof inspection, 2) we send you a transparent, line-itemed written quote within 24–48 hours, 3) once you sign, we pull permits and schedule, 4) install, 5) final walkthrough and warranty. No high-pressure sales tactics at any point.`,
  },
  {
    category: "Process",
    q: "Do you handle permits?",
    a: `Yes — we pull all permits, schedule the city/county inspections, and handle the paperwork. You don't have to chase anything.`,
  },
  {
    category: "Process",
    q: "Are you licensed and insured?",
    a: `Yes — Florida State Certified Roofing Contractor, license #${SITE.license.replace("#", "")}. Fully insured and BBB A+ accredited. You can verify the license at MyFloridaLicense.com.`,
  },

  // Maintenance
  {
    category: "Maintenance",
    q: "Do you offer a maintenance plan?",
    a: `Yes — three tiers: Basic (annual), Pro (twice-a-year), and Premium (quarterly with priority emergency response). All include a photo report and proactive sealant + boot replacement. See chs-roofing.com/services/maintenance.`,
  },
  {
    category: "Maintenance",
    q: "How often should I have my roof inspected?",
    a: `In Southwest Florida we recommend a full roof inspection at least once a year, plus a quick check after every major hurricane or named storm. Catching a failing pipe boot or cracked sealant early saves thousands.`,
  },

  // Service Area
  {
    category: "Service Area",
    q: "What areas do you serve?",
    a: `All of Southwest Florida — Cape Coral, Fort Myers, Naples, Bonita Springs, Estero, Sanibel, Punta Gorda, Lehigh Acres, North Port, and Sarasota.`,
  },
  {
    category: "Service Area",
    q: "Do you do commercial buildings?",
    a: `Yes — TPO, modified-bitumen, and built-up flat roofing systems for commercial properties, warehouses, retail, and multifamily.`,
  },

  // General
  {
    category: "General",
    q: "Are you family-owned?",
    a: `Yes — we're a family-owned business out of Cape Coral, and you deal directly with the owners, not a call center.`,
  },
  {
    category: "General",
    q: "What's your phone number?",
    a: `You can reach us at ${SITE.phoneDisplay}. We answer 7 days a week — and after hours for emergencies and active leaks.`,
  },
  {
    category: "General",
    q: "Can I see examples of your work?",
    a: `Of course — check chs-roofing.com/gallery/residential for recent residential projects, /gallery/commercial for TPO and metal commercial, and /gallery/multifamily for condos and apartment communities.`,
  },
  {
    category: "General",
    q: "Do you do estimates over the phone?",
    a: `We can give you a rough ballpark using our online estimator (chs-roofing.com/estimator), but for real numbers we need an on-site inspection. The inspection is free and there's no obligation.`,
  },
];

export default function ChatResponses() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<Category | "all">("all");
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RESPONSES.filter((r) => {
      if (activeCat !== "all" && r.category !== activeCat) return false;
      if (!q) return true;
      return r.q.toLowerCase().includes(q) || r.a.toLowerCase().includes(q);
    });
  }, [query, activeCat]);

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied((c) => (c === key ? null : c)), 1800);
    } catch {
      // ignore
    }
  };

  return (
    <div>
      {/* Search */}
      <div className="mb-4 relative">
        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search responses…"
          className="w-full h-11 pl-9 pr-3 rounded-xl border border-border/60 bg-card text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveCat("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            activeCat === "all"
              ? "bg-primary text-white"
              : "bg-card border border-border/60 text-foreground hover:border-primary/40"
          }`}
        >
          All ({RESPONSES.length})
        </button>
        {CATEGORIES.map((c) => {
          const count = RESPONSES.filter((r) => r.category === c).length;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setActiveCat(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCat === c
                  ? "bg-primary text-white"
                  : "bg-card border border-border/60 text-foreground hover:border-primary/40"
              }`}
            >
              {c} ({count})
            </button>
          );
        })}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-card border border-border/60 rounded-2xl p-10 text-center">
          <MessageSquare className="w-8 h-8 mx-auto text-muted-foreground/60 mb-3" />
          <p className="font-semibold text-foreground">No responses match.</p>
          <p className="text-sm text-muted-foreground mt-1">Try a shorter search or clear the category filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r, i) => {
            const key = `${r.category}-${i}`;
            return (
              <article
                key={key}
                className="bg-card border border-border/60 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-wrap items-baseline gap-2 mb-2">
                  <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {r.category}
                  </span>
                  <h3 className="font-display font-bold text-foreground text-base leading-snug">
                    {r.q}
                  </h3>
                </div>
                <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-line">{r.a}</p>
                <div className="mt-3 pt-3 border-t border-border/60 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copy(key, r.a)}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                      copied === key
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-primary text-white hover:bg-primary/90"
                    }`}
                  >
                    {copied === key ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy answer
                      </>
                    )}
                  </button>
                  <a
                    href={`sms:?&body=${encodeURIComponent(r.a)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-card border border-border/60 hover:border-primary/40 text-foreground hover:text-primary transition-colors"
                  >
                    Send as SMS
                  </a>
                  <a
                    href={`mailto:?subject=${encodeURIComponent(`Re: ${r.q}`)}&body=${encodeURIComponent(r.a)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-card border border-border/60 hover:border-primary/40 text-foreground hover:text-primary transition-colors"
                  >
                    Send as Email
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
