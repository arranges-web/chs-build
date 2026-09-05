import { Link } from "wouter";
import { ArrowRight, MapPin, Phone, ShieldCheck } from "lucide-react";
import PageHero from "@/components/PageHero";
import CtaSection from "@/components/CtaSection";
import Seo, { breadcrumbSchema, localBusinessSchema } from "@/components/Seo";
import { PHOTOS, SITE } from "@/lib/site-config";

/**
 * /service-area — the hub that links every city page.
 *
 * Two jobs: give a homeowner one page that answers "do you cover me?",
 * and give crawlers a single place where every location page is one
 * click from the nav (crawl depth matters — orphaned city pages get
 * indexed slowly and rank poorly).
 */

type Area = {
  city: string;
  href: string;
  county: string;
  zips: string[];
  blurb: string;
};

const AREAS: Area[] = [
  {
    city: "Cape Coral",
    href: "/roofing-cape-coral",
    county: "Lee County",
    zips: ["33904", "33909", "33914", "33990", "33991", "33993"],
    blurb: "Our home city. Fastest emergency response and city permitting handled in-house.",
  },
  {
    city: "Fort Myers",
    href: "/roofing-fort-myers",
    county: "Lee County",
    zips: ["33901", "33907", "33908", "33912", "33913", "33919", "33966"],
    blurb: "Full service across McGregor, Gateway, Iona, and the College Parkway corridor.",
  },
  {
    city: "North Fort Myers",
    href: "/roofing-north-fort-myers",
    county: "Lee County",
    zips: ["33903", "33917", "33918"],
    blurb: "Minutes from our base. Shingle, metal, and manufactured-home roofing.",
  },
  {
    city: "Estero",
    href: "/roofing-estero",
    county: "Lee County",
    zips: ["33928", "33929"],
    blurb: "Tile specialists for Grandezza, West Bay Club, and The Brooks. HOA approval support.",
  },
  {
    city: "Bonita Springs",
    href: "/roofing-bonita-springs",
    county: "Lee County",
    zips: ["34134", "34135"],
    blurb: "Gated and golf-community coordination, canal-front flashing detail.",
  },
  {
    city: "Naples",
    href: "/roofing-naples",
    county: "Collier County",
    zips: ["34102", "34103", "34105", "34108", "34109", "34110", "34119"],
    blurb: "Tile and metal for coastal homes, with architectural-review paperwork handled.",
  },
  {
    city: "Punta Gorda",
    href: "/roofing-punta-gorda",
    county: "Charlotte County",
    zips: ["33950", "33955", "33982", "33983"],
    blurb: "Charlotte County permitting, waterfront metal, and post-storm rebuilds.",
  },
  {
    city: "Port Charlotte",
    href: "/roofing-port-charlotte",
    county: "Charlotte County",
    zips: ["33948", "33952", "33953", "33954", "33980", "33981"],
    blurb: "Post-Ian inspections and honest repair-vs-replace recommendations.",
  },
  {
    city: "North Port",
    href: "/roofing-north-port",
    county: "Sarasota County",
    zips: ["34286", "34287", "34288", "34289", "34291"],
    blurb: "Sarasota County permitting. We check builder warranties before quoting.",
  },
];

/** Communities we serve that don't have a dedicated page yet. */
const ALSO_SERVED = [
  "Lehigh Acres",
  "Sanibel",
  "Captiva",
  "Marco Island",
  "Babcock Ranch",
  "Alva",
  "Matlacha",
  "Pine Island",
  "Fort Myers Beach",
  "Golden Gate",
  "Immokalee",
  "Englewood",
];

export default function ServiceArea() {
  return (
    <>
      <Seo
        title="Service Area | Roofing Across Southwest Florida — CHS Roofing"
        description="CHS Roofing serves Cape Coral, Fort Myers, Naples, Bonita Springs, Estero, Punta Gorda, Port Charlotte, North Port and surrounding Southwest Florida communities. Licensed CCC1333902."
        path="/service-area"
        jsonLd={[
          localBusinessSchema({
            city: "Southwest Florida",
            path: "/service-area",
            latitude: 26.5629,
            longitude: -81.9495,
            description:
              "Licensed Florida roofing contractor (CCC1333902) serving Cape Coral, Fort Myers, Naples, Bonita Springs, Estero, Punta Gorda, Port Charlotte, North Port and surrounding Southwest Florida communities.",
            radiusMeters: 80000,
          }),
          breadcrumbSchema([{ name: "Service Area", path: "/service-area" }]),
          // An ItemList of the location pages gives crawlers an explicit
          // map of the local footprint rather than making them infer it.
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "CHS Roofing service areas",
            itemListElement: AREAS.map((a, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: `Roofing in ${a.city}, FL`,
              url: `https://chs-roofing.com${a.href}`,
            })),
          },
        ]}
      />

      <PageHero
        eyebrow="Service Area"
        title={
          <>
            Roofing across <span className="text-primary">Southwest Florida</span>
          </>
        }
        subtitle={`Based in ${SITE.city} and working from Punta Gorda down to Marco Island. Licensed ${SITE.license}, fully insured, family-owned.`}
        image={PHOTOS.darkMetalAerial}
        imageAlt="Aerial view of Southwest Florida rooftops"
        crumbs={[{ label: "Service Area" }]}
      />

      {/* City grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h4 className="text-primary font-semibold tracking-[0.2em] uppercase mb-3 text-xs">
              Cities we serve
            </h4>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground leading-[1.05]">
              Find your city
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Each city page covers the local specifics — permitting jurisdiction,
              common roof types, HOA requirements, and the ZIP codes we cover.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {AREAS.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="group bg-card border border-border/60 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-display font-bold tracking-tight text-foreground text-lg group-hover:text-primary transition-colors">
                    {a.city}
                  </h3>
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-1" />
                </div>
                <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-muted-foreground mb-3">
                  {a.county}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                  {a.blurb}
                </p>
                <p className="font-mono text-[11px] text-foreground/60 mt-4">
                  {a.zips.slice(0, 5).join(" · ")}
                  {a.zips.length > 5 ? " …" : ""}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  Roofing in {a.city} <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Also served */}
      <section className="py-16 bg-muted/40">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <h4 className="text-primary font-semibold tracking-[0.2em] uppercase mb-3 text-xs">
            Also serving
          </h4>
          <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-foreground leading-tight mb-8">
            Surrounding communities
          </h2>
          <div className="flex flex-wrap justify-center gap-2.5">
            {ALSO_SERVED.map((n) => (
              <span
                key={n}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-card border border-border/60 text-sm font-medium text-foreground"
              >
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {n}
              </span>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-8 max-w-xl mx-auto leading-relaxed">
            Not sure whether you're in range? Call{" "}
            <a href={`tel:${SITE.phoneTel}`} className="text-primary font-semibold hover:underline">
              {SITE.phoneDisplay}
            </a>{" "}
            and we'll tell you straight — we'd rather say no than waste your time.
          </p>
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-14 bg-background">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="bg-card border border-border/60 rounded-2xl p-6 md:p-8 text-center">
            <ShieldCheck className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="font-display font-bold text-xl text-foreground tracking-tight">
              One licensed contractor, three counties
            </p>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl mx-auto leading-relaxed">
              We permit through Lee, Charlotte, Collier, and Sarasota counties
              depending on where you are, and every installation is built to
              current Florida wind code. Verify our license{" "}
              <strong className="text-foreground">{SITE.license}</strong> anytime at{" "}
              <a
                href="https://www.myfloridalicense.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold hover:underline"
              >
                MyFloridaLicense.com
              </a>
              .
            </p>
            <a
              href={`tel:${SITE.phoneTel}`}
              className="mt-5 inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-md shadow-primary/30 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
