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
