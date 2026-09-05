import LocationPageTemplate from "./LocationPageTemplate";
import { PHOTOS } from "@/lib/site-config";

/**
 * Sarasota — the northern anchor of the service area. Different county,
 * different permitting, and a very different roof profile from Lee:
 * barrier-island salt exposure, tile and standing-seam on the keys,
 * plus historic districts with architectural review.
 */
export default function Sarasota() {
  return (
    <LocationPageTemplate
      city="Sarasota"
      path="/roofing-sarasota"
      geo={{ latitude: 27.3364, longitude: -82.5307 }}
      radiusMeters={30000}
      zips={[
        "34231",
        "34232",
        "34233",
        "34234",
        "34236",
        "34238",
        "34239",
        "34240",
        "34241",
        "34242",
      ]}
      heroImage={PHOTOS.beachfrontMetal}
      heroImageAlt="Standing-seam metal roof on a beachfront home near Sarasota, FL"
      seoTitle="Sarasota Roofing Contractor | Tile, Metal & Flat | CHS Roofing"
      seoDescription="Sarasota roofing contractor (CCC1333902) for tile, standing-seam metal, and flat roofs. Barrier-island salt exposure, Sarasota County permitting, historic-district work."
      neighborhoods={[
        "Siesta Key",
        "Lido Key",
        "Bird Key",
        "Downtown Sarasota",
        "Laurel Park",
        "Gulf Gate",
        "Palmer Ranch",
        "Osprey",
      ]}
      nearbyCities={[
        { name: "North Port", href: "/roofing-north-port" },
        { name: "Port Charlotte", href: "/roofing-port-charlotte" },
        { name: "Punta Gorda", href: "/roofing-punta-gorda" },
      ]}
      localPoints={[
        {
          title: "Barrier-island salt exposure",
          desc: "Siesta, Lido, and Bird Key homes sit in the harshest corrosion environment in our whole service area. Fastener and flashing metal selection matters more here than the roof covering itself — stainless where it counts, never plain galvanized.",
        },
        {
          title: "Sarasota County & city permitting",
          desc: "Depending on your address you permit through Sarasota County or the City of Sarasota — two different processes. We identify the right jurisdiction before quoting so the schedule we give you is real.",
        },
        {
          title: "Historic districts & architectural review",
          desc: "Laurel Park, Burns Court, and parts of downtown have historic review requirements that restrict roof profile and colour. We prepare the product documentation those boards ask for rather than discovering the requirement mid-project.",
        },
        {
          title: "Tile, metal, and low-slope mid-century",
          desc: "Sarasota has a lot of mid-century flat and low-slope roofs alongside the tile and metal on the keys. Those need a coating or membrane approach, not a shingle mindset — we do all four systems.",
        },
      ]}
      faqs={[
        {
          q: "Sarasota is a fair distance from Cape Coral — do you really cover it?",
          a: "Yes, Sarasota is the northern anchor of our service area, though we'll be straight with you: it's about 90 minutes from our base. We schedule Sarasota work in blocks, so a non-emergency inspection may be a few days out rather than same day. For a genuine emergency we'll tell you honestly when we can be there instead of over-promising.",
        },
        {
          q: "Do you work on Siesta Key and Lido Key?",
          a: "Yes. Barrier-island work is some of the most demanding roofing in Southwest Florida — constant salt, the strictest wind zones, and often tight site access. The detail that matters most is fastener and flashing metallurgy, which is where cheaper island installations fail within a few years.",
        },
        {
          q: "Which jurisdiction permits my Sarasota roof?",
          a: "It depends on the address — City of Sarasota and unincorporated Sarasota County are separate permitting processes with different inspection schedules. We confirm which applies to you before quoting so the timeline we give you holds.",
        },
        {
          q: "Can you handle historic-district requirements in Laurel Park?",
          a: "Yes. Historic review can restrict roof profile, material, and colour. We put together the product data and colour documentation the board expects up front — the delays here come from discovering the requirement after material is already ordered.",
        },
        {
          q: "Do you do flat and low-slope roofs in Sarasota?",
          a: "Yes — Sarasota's mid-century housing stock has a lot of low-slope roofing. Depending on condition we'll recommend a silicone or acrylic restoration coating (often 40–60% less than replacement when the substrate is sound) or a full membrane replacement.",
        },
      ]}
      intro={
        <>
          <p>
            Sarasota is the northern anchor of our Southwest Florida service
            area, and it's a genuinely different roofing market from Lee County.
            The barrier islands — Siesta, Lido, Bird Key — sit in the harshest
            salt environment we work in, while downtown and Laurel Park bring
            historic review requirements and a lot of mid-century low-slope roofing.
          </p>
          <p>
            We work all four systems here: tile, standing-seam metal, shingle,
            and flat. And we'll be straight about distance — Sarasota is roughly
            90 minutes from our Cape Coral base, so we schedule it in blocks. If
            we can't get to you as fast as you need, we'd rather say so than
            take the job and leave you waiting.
          </p>
        </>
      }
    />
  );
}
