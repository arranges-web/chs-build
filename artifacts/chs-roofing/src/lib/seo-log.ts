/**
 * Genuine log of SEO work performed on the site. Every entry here
 * corresponds to a real change shipped to production — no fabricated
 * entries. Add a new entry whenever a real SEO-relevant change ships
 * (new indexable page, schema, meta/title work, sitemap update,
 * internal linking, or content refresh with keyword relevance).
 */
export type SeoChangeCategory =
  | "New Page"
  | "Structured Data"
  | "Meta & Titles"
  | "Sitemap"
  | "Internal Linking"
  | "Backlinks"
  | "Content";

export type SeoChange = {
  /** ISO date (YYYY-MM-DD) the change actually shipped. */
  date: string;
  category: SeoChangeCategory;
  title: string;
  description: string;
  pages?: string[];
  /** Optional count for quantifiable work (e.g. number of backlinks). */
  count?: number;
};

export const SEO_CHANGES: SeoChange[] = [
  {
    date: "2026-09-05",
    category: "Internal Linking",
    title: "Site-wide footer now links all 11 city pages",
    description:
      "The footer service-area block had gone stale \u2014 it listed only 4 cities and still pointed \"Cape Coral\" at the homepage rather than the new Cape Coral landing page. It now links every city page plus /service-area from the footer of every page on the site, which is the single biggest crawl-depth lever for the new location pages.",
    pages: ["/"],
  },
  {
    date: "2026-09-05",
    category: "New Page",
    title: "Published Lehigh Acres and Sarasota location pages",
    description:
      "Two markets the business cares about that had no landing page. /roofing-lehigh-acres targets the shingle-dominant, insurance-certification-driven Lee County market (Mirror Lakes, Westminster, Harns Marsh, Buckingham) across 6 ZIPs. /roofing-sarasota covers the northern anchor of the service area \u2014 barrier-island salt exposure on Siesta/Lido/Bird Key, historic-district review in Laurel Park, and mid-century low-slope roofs \u2014 across 10 ZIPs. Both carry unique local copy, 5 city-specific FAQs, per-city LocalBusiness + GeoCircle + Review schema, and the FL license credential.",
    pages: ["/roofing-lehigh-acres", "/roofing-sarasota"],
  },
  {
    date: "2026-09-05",
    category: "Internal Linking",
    title: "Cross-linked the two new cities into the service-area graph",
    description:
      "Lehigh Acres added to the nearby-cities blocks on Fort Myers and Cape Coral; Sarasota added to North Port and Port Charlotte. Both promoted from plain text chips into full cards on /service-area (now 11 cities), and the \"also serving\" list extended with Buckingham, Osprey, Venice, and Nokomis. Also updated llms.txt with both pages and corrected the permitting section \u2014 the City of Sarasota permits separately from Sarasota County.",
    pages: ["/service-area", "/roofing-fort-myers", "/roofing-cape-coral", "/roofing-north-port", "/roofing-port-charlotte"],
  },
  {
    date: "2026-09-05",
    category: "Sitemap",
    title: "Sitemap expanded to 37 URLs",
    description:
      "Added all 8 new location pages plus the /service-area hub at 0.85\u20130.9 priority so crawlers pick up the expanded local footprint quickly.",
  },
  {
    date: "2026-09-05",
    category: "New Page",
    title: "Local/GEO expansion \u2014 6 new city pages and a /service-area hub",
    description:
      "Published dedicated pages for Cape Coral (the home city, which had no page at all despite being the highest-intent local search), North Fort Myers, Estero, Punta Gorda, Port Charlotte, and North Port. Each has unique local copy, city-specific FAQs, neighborhood lists, and ZIP coverage. Added /service-area as a hub so no city page is more than one click from the nav \u2014 orphaned location pages get indexed slowly and rank poorly.",
    pages: [
      "/service-area",
      "/roofing-cape-coral",
      "/roofing-north-fort-myers",
      "/roofing-estero",
      "/roofing-punta-gorda",
      "/roofing-port-charlotte",
      "/roofing-north-port",
    ],
  },
  {
    date: "2026-09-05",
    category: "Structured Data",
    title: "Per-city LocalBusiness, GeoCircle, and Review schema on every location page",
    description:
      "Added localBusinessSchema() and reviewSchema() helpers. Every city page now emits a RoofingContractor/LocalBusiness node with its own @id, real lat/long coordinates, a GeoCircle areaServed sized to that market, the CCC1333902 license as an EducationalOccupationalCredential, consistent NAP, and parentOrganization linkage back to the main entity \u2014 plus individual Review nodes rather than an aggregate-only rating. This is what lets Google and AI answer engines associate the business with each specific city rather than one generic location.",
    pages: [
      "/roofing-cape-coral",
      "/roofing-fort-myers",
      "/roofing-naples",
      "/roofing-bonita-springs",
      "/roofing-north-fort-myers",
      "/roofing-estero",
      "/roofing-punta-gorda",
      "/roofing-port-charlotte",
      "/roofing-north-port",
      "/roofing-lehigh-acres",
      "/roofing-sarasota",
      "/service-area",
    ],
  },
  {
    date: "2026-08-12",
    category: "Structured Data",
    title: "AI/LLM discoverability layer — llms.txt, ai.txt, richer JSON-LD",
    description:
      "Published /llms.txt (LLM-friendly site index) and /ai.txt (AI usage policy). Updated robots.txt with explicit allowlist for GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, and every other current answer-engine crawler. Global RoofingContractor JSON-LD in index.html expanded with GeoCircle service area, hasCredential for the FL license, knowsAbout topic list (14 roofing specialties), makesOffer for the free inspection + $250 repair, richer per-service Offer entries with URLs, and hreflang for the en/es bilingual UI.",
    pages: ["/llms.txt", "/ai.txt", "/robots.txt", "/"],
  },
  {
    date: "2026-08-12",
    category: "Sitemap",
    title: "Refreshed sitemap lastmod dates across every URL",
    description:
      "Bumped lastmod on every entry so Google + Bing recrawl and pick up the recent schema and content changes on the next fetch.",
  },
  {
    date: "2026-08-06",
    category: "New Page",
    title: "Published /free-roof-inspection Meta Ads landing page",
    description:
      "New indexable landing page for the 21-point inspection Meta Ads campaign. Full FAQPage schema, TCPA-compliant footer, dedicated /inspection-request-received thank-you page (noindex) firing Meta Pixel Lead and GA4 conversion.",
    pages: ["/free-roof-inspection"],
  },
  {
    date: "2026-08-06",
    category: "New Page",
    title: "Published /roof-repair Meta Ads landing page ($250 starting)",
    description:
      "Repair-focused ad landing with RoofingContractor + LocalBusiness JSON-LD scoped to a repair offer catalog (Shingle Repair Offer priced at $250 \"starting at\"), 11-item FAQPage, before/after gallery, sticky mobile Call/Schedule CTAs, and dedicated /thank-you-repair page (noindex) firing Meta Pixel Lead + GA4 repair_form_submit.",
    pages: ["/roof-repair"],
  },
  {
    date: "2026-07-08",
    category: "New Page",
    title: "Published a Fort Myers roofing landing page",
    description:
      "New indexable page targeting \"roofing contractor Fort Myers\" and related local searches — unique intro copy, Lee County wind-code content, service cross-links, and neighborhood coverage (College Parkway, Iona, McGregor, Gateway).",
    pages: ["/roofing-fort-myers"],
  },
  {
    date: "2026-07-08",
    category: "New Page",
    title: "Published a Naples roofing landing page",
    description:
      "New indexable page targeting Naples-area searches — HOA/architectural-review guidance, tile-roof expertise, coastal salt-air content, and neighborhood coverage (Old Naples, Park Shore, Pelican Bay, North Naples).",
    pages: ["/roofing-naples"],
  },
  {
    date: "2026-07-08",
    category: "New Page",
    title: "Published a Bonita Springs roofing landing page",
    description:
      "New indexable page targeting Bonita Springs searches — gated/golf-community coordination, canal wind exposure, pool-cage flashing content, and neighborhood coverage (Bonita Bay, Spring Creek, Pelican Landing).",
    pages: ["/roofing-bonita-springs"],
  },
  {
    date: "2026-07-08",
    category: "Structured Data",
    title: "Added Service, Breadcrumb & FAQ schema to all 3 new city pages",
    description:
      "Each location page now emits schema.org Service, BreadcrumbList, and FAQPage JSON-LD so Google can render rich results and understand which city each page serves.",
    pages: ["/roofing-fort-myers", "/roofing-naples", "/roofing-bonita-springs"],
  },
  {
    date: "2026-07-08",
    category: "Sitemap",
    title: "Added the 3 new city pages to sitemap.xml",
    description:
      "Submitted with today's date and 0.9 priority so search engines prioritize crawling the new location pages quickly.",
  },
  {
    date: "2026-07-08",
    category: "Internal Linking",
    title: "Added a \"Service Areas\" block to the site-wide footer",
    description:
      "Every page on the site now links directly to all city landing pages plus the homepage, increasing crawl depth and passing internal link equity to the new pages immediately.",
  },
  {
    date: "2026-06-29",
    category: "Content",
    title: "Refreshed the /free-quote photo gallery with unique, descriptive alt text",
    description:
      "Replaced 8 images with higher-quality shots (metal, tile, shingle roofs) each carrying unique, keyword-relevant alt text instead of generic captions.",
    pages: ["/free-quote"],
  },
  {
    date: "2026-06-29",
    category: "New Page",
    title: "Published /storm-damage-quote landing page",
    description:
      "New indexable page added to the sitemap targeting hurricane and storm-damage roofing searches.",
    pages: ["/storm-damage-quote"],
  },
  {
    date: "2026-06-13",
    category: "New Page",
    title: "Published /roof-coating-quote landing page",
    description:
      "New indexable page added to the sitemap targeting roof coating and restoration searches.",
    pages: ["/roof-coating-quote"],
  },
  {
    date: "2026-06-13",
    category: "Content",
    title: "Refreshed gutter installation step photos",
    description:
      "Replaced outdated step-by-step images on the gutters service page with new captioned photos, improving on-page content freshness for that service.",
    pages: ["/services/gutters"],
  },
  {
    date: "2026-05-23",
    category: "Meta & Titles",
    title: "Site-wide SEO pass: per-page meta, JSON-LD, sitemap & robots",
    description:
      "Foundational SEO work — unique title/meta description per page, richer JSON-LD schema, robots.txt, and the original sitemap.xml. This is the base every later page (including the July city pages) builds on.",
  },
  {
    date: "2026-07-08",
    category: "Backlinks",
    title: "Manually submitted 23 backlinks/citations",
    description:
      "Team manually submitted the business to directories, citation sites, and partner listings pointing back to chs-roofing.com. Submitted outside of code (not verified by the codebase) — worth spot-checking that each listing is live and NAP details (name/address/phone) are consistent.",
    count: 23,
  },
];

/**
 * NOTE ON HONESTY: dates above are the real ship dates from git history.
 * Do not backdate/relabel old entries to make a slower month look busier —
 * this log is only useful if it can survive someone checking it against
 * the actual commit history. If a real 30-day window is thin, widen the
 * view (see `days` param below) instead of moving dates around.
 */

export function seoChangesInLastNDays(days: number, from: Date = new Date()): SeoChange[] {
  const cutoff = new Date(from);
  cutoff.setDate(cutoff.getDate() - days);
  return SEO_CHANGES.filter((c) => new Date(c.date) >= cutoff).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}
