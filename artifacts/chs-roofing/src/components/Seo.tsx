import { useEffect } from "react";

const SITE_URL = "https://chs-roofing.com";
const DEFAULT_IMAGE = `${SITE_URL}/opengraph.jpg`;

type Props = {
  /** Title tag. Should be ~50–60 chars, keyword-rich, location-specific. */
  title: string;
  /** Meta description. 140–160 chars. Includes primary keyword + benefit. */
  description: string;
  /** Canonical path, e.g. "/services/repair". Defaults to current location. */
  path?: string;
  /** Absolute URL for social cards. Defaults to /opengraph.jpg. */
  image?: string;
  /** Set true on thin / utility pages we don't want indexed. */
  noIndex?: boolean;
  /** og:type — "website" | "article". Defaults to "website". */
  type?: "website" | "article";
  /** Schema.org JSON-LD blob. Pass a single object or an array (we serialize either). */
  jsonLd?: object | object[];
  /** Optional locale label for og:locale. Defaults to "en_US". */
  locale?: string;
};

/**
 * Single source of truth for per-page <head> metadata. Wouter SPAs
 * mutate the document head on navigation; Google crawls the rendered
 * DOM so this works for indexing. Social platforms that don't run JS
 * (Slack, some chat apps) fall back to the meta in index.html.
 */
export default function Seo({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  noIndex = false,
  type = "website",
  jsonLd,
  locale = "en_US",
}: Props) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const canonical =
      (path && (path.startsWith("http") ? path : `${SITE_URL}${path}`)) ||
      (typeof window !== "undefined" ? window.location.href.split("?")[0].split("#")[0] : SITE_URL);

    document.title = title;
    setMeta("name", "description", description);
    setMeta("name", "robots", noIndex ? "noindex,nofollow" : "index,follow,max-image-preview:large,max-snippet:-1");
    setLink("canonical", canonical);

    // Open Graph
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", type);
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:image", image);
    setMeta("property", "og:site_name", "CHS Roofing");
    setMeta("property", "og:locale", locale);

    // Twitter
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);

    // JSON-LD
    cleanJsonLd();
    if (jsonLd) {
      const arr = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      for (const block of arr) injectJsonLd(block);
    }
  }, [title, description, path, image, noIndex, type, jsonLd, locale]);

  return null;
}

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

const SEO_JSONLD_ATTR = "data-seo-jsonld";

function cleanJsonLd() {
  document.head
    .querySelectorAll(`script[type="application/ld+json"][${SEO_JSONLD_ATTR}]`)
    .forEach((el) => el.remove());
}

function injectJsonLd(block: object) {
  const s = document.createElement("script");
  s.type = "application/ld+json";
  s.setAttribute(SEO_JSONLD_ATTR, "1");
  s.textContent = JSON.stringify(block);
  document.head.appendChild(s);
}

/**
 * Helper: build a BreadcrumbList schema for the current page.
 * Always include Home as item #1.
 */
export function breadcrumbSchema(
  crumbs: Array<{ name: string; path: string }>,
): object {
  const items = [{ name: "Home", path: "/" }, ...crumbs];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path}`,
    })),
  };
}

/**
 * Helper: build a Service schema for a service page.
 */
export function serviceSchema({
  name,
  description,
  path,
  serviceType,
}: {
  name: string;
  description: string;
  path: string;
  serviceType?: string;
}): object {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: serviceType ?? name,
    provider: {
      "@type": "RoofingContractor",
      name: "CHS Roofing",
      "@id": `${SITE_URL}/#organization`,
    },
    areaServed: [
      { "@type": "City", name: "Cape Coral" },
      { "@type": "City", name: "Fort Myers" },
      { "@type": "City", name: "Naples" },
      { "@type": "City", name: "Bonita Springs" },
      { "@type": "City", name: "Estero" },
      { "@type": "City", name: "Sanibel" },
      { "@type": "City", name: "Punta Gorda" },
      { "@type": "City", name: "Sarasota" },
    ],
    url: `${SITE_URL}${path}`,
  };
}

/**
 * Helper: build a FAQPage schema from a list of Q/A pairs.
 */
/**
 * Per-city LocalBusiness node. This is the piece that actually feeds
 * local-pack and "roofer near me" answers: a real lat/lng for the city
 * being served, a service radius around it, and the NAP (name /
 * address / phone) matching the Google Business Profile exactly.
 *
 * Each city page gets its own `@id` so the graph has one node per
 * location instead of every page redeclaring the same organization.
 */
export function localBusinessSchema({
  city,
  path,
  latitude,
  longitude,
  description,
  radiusMeters = 32000,
}: {
  city: string;
  path: string;
  latitude: number;
  longitude: number;
  description: string;
  radiusMeters?: number;
}): object {
  return {
    "@context": "https://schema.org",
    "@type": ["RoofingContractor", "LocalBusiness"],
    "@id": `${SITE_URL}${path}#localbusiness`,
    name: `CHS Roofing — ${city}, FL`,
    legalName: "Cordova Home Services LLC",
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
    url: `${SITE_URL}${path}`,
    description,
    telephone: "+1-239-737-1758",
    email: "info@cordovahomeservices.com",
    priceRange: "$$",
    image: `${SITE_URL}/opengraph.jpg`,
    logo: `${SITE_URL}/apple-touch-icon-180.png`,
    // NAP must match the Google Business Profile character-for-character.
    address: {
      "@type": "PostalAddress",
      addressLocality: "Cape Coral",
      addressRegion: "FL",
      postalCode: "33904",
      addressCountry: "US",
    },
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: { "@type": "GeoCoordinates", latitude, longitude },
      geoRadius: String(radiusMeters),
    },
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: { "@type": "GeoCoordinates", latitude, longitude },
      geoRadius: String(radiusMeters),
    },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "license",
      name: "Florida Certified Roofing Contractor",
      identifier: "CCC1333902",
      recognizedBy: {
        "@type": "GovernmentOrganization",
        name: "Florida Department of Business & Professional Regulation",
        url: "https://www.myfloridalicense.com/",
      },
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
    ],
    sameAs: [
      "https://www.facebook.com/profile.php?id=61567718997385",
      "https://www.instagram.com/cordova_home_services/",
      "https://g.page/r/CYyChCOA5U9MEAE",
      "https://www.bbb.org/us/fl/cape-coral/profile/roofing-contractors/cordova-home-services-llc-0653-90450754",
    ],
  };
}

/**
 * Individual Review nodes. `aggregateRating` alone tells a crawler the
 * average; actual Review objects with named authors and body text are
 * what AI answer engines quote when someone asks "is CHS Roofing any
 * good?". Only pass real, published reviews.
 */
export function reviewSchema(
  reviews: Array<{ name: string; date: string; text: string }>,
  itemId = `${SITE_URL}/#organization`,
): object[] {
  return reviews.map((r) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: { "@id": itemId },
    author: { "@type": "Person", name: r.name },
    reviewRating: {
      "@type": "Rating",
      ratingValue: "5",
      bestRating: "5",
      worstRating: "1",
    },
    reviewBody: r.text,
    publisher: { "@type": "Organization", name: "Google" },
  }));
}

export function faqSchema(items: Array<{ q: string; a: string }>): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}
