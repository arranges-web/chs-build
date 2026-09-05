import LocationPageTemplate from "./LocationPageTemplate";
import { PHOTOS } from "@/lib/site-config";

/**
 * Lehigh Acres — one of the largest planned communities in the country
 * by land area, and a major Lee County market for CHS. Shingle-dominant,
 * cost-sensitive, heavy investor/rental ownership, and a lot of roofs
 * that need insurance certification rather than replacement.
 */
export default function LehighAcres() {
  return (
    <LocationPageTemplate
      city="Lehigh Acres"
      path="/roofing-lehigh-acres"
      geo={{ latitude: 26.6120, longitude: -81.6248 }}
      radiusMeters={26000}
      zips={["33936", "33971", "33972", "33973", "33974", "33976"]}
      heroImage={PHOTOS.shingleInstallTopdown}
      heroImageAlt="Top-down view of a new shingle roof installation in Lehigh Acres, FL"
      seoTitle="Lehigh Acres Roofing Contractor | Repair & Replace | CHS Roofing"
      seoDescription="Lehigh Acres roof repair and replacement from a licensed Lee County contractor (CCC1333902). Shingle specialists, insurance roof certifications, repairs from $250."
      neighborhoods={[
        "Lehigh Acres Central",
        "Mirror Lakes",
        "Westminster",
        "Bell Boulevard corridor",
        "Sunshine Boulevard",
        "Harns Marsh",
        "Buckingham",
        "Alva",
      ]}
      nearbyCities={[
        { name: "Fort Myers", href: "/roofing-fort-myers" },
        { name: "Cape Coral", href: "/roofing-cape-coral" },
        { name: "North Fort Myers", href: "/roofing-north-fort-myers" },
      ]}
      localPoints={[
        {
          title: "Shingle roofs, real repair options",
          desc: "Lehigh is overwhelmingly shingle, which means damage is genuinely repairable far more often than a salesman will admit. Missing shingles, a failed pipe boot, valley flashing — those are repairs starting at $250, not a reason to sell you a whole roof.",
        },
        {
          title: "Insurance roof certifications",
          desc: "Carriers increasingly demand a roof certification or refuse to renew on older roofs. We inspect, document condition with photos, and give you the written report your insurer is asking for — including remaining service life.",
        },
        {
          title: "Landlords and investor-owned homes",
          desc: "A large share of Lehigh housing is rental or investor-owned. We can coordinate with tenants directly for access, work from photos for out-of-state owners, and invoice the owner rather than the occupant.",
        },
        {
          title: "Lee County permitting",
          desc: "Lehigh Acres is unincorporated Lee County, so replacements permit through the county rather than a city. We pull it, meet the inspection schedule, and hand you the closed-permit documentation.",
        },
      ]}
      faqs={[
        {
          q: "My insurance wants a roof certification in Lehigh Acres — can you do that?",
          a: "Yes. We inspect the roof, photograph its condition, and provide a written report with an estimated remaining service life — which is what most Florida carriers are asking for on older roofs. We'll tell you honestly what the roof supports; we don't write a certification a roof doesn't earn.",
        },
        {
          q: "Do I actually need a new roof, or can mine be repaired?",
          a: "In Lehigh, quite often it can be repaired. Most homes here are shingle, and localized damage is genuinely fixable — repairs start at $250. We inspect first and recommend a full replacement only when the roof's overall condition warrants it, not by default.",
        },
        {
          q: "I own a rental in Lehigh but live out of state — can you still work with me?",
          a: "Yes, we do this regularly. We coordinate access with your tenant, document everything with photos so you can see exactly what we found and what we did, and bill you directly. You don't need to fly in.",
        },
        {
          q: "How much does a roof replacement cost in Lehigh Acres?",
          a: "It depends on size, pitch, and what we find under the old shingles. What we can promise is a written, line-itemed estimate before any work starts, with the per-sheet decking replacement cost stated up front — so if we find rot after tear-off there's no surprise change order.",
        },
        {
          q: "How fast can you get out to Lehigh Acres?",
          a: "We're based in Cape Coral, about 35 minutes west. For active leaks we typically reach Lehigh same day or next day.",
        },
      ]}
      intro={
        <>
          <p>
            Lehigh Acres is one of the largest communities we serve by land
            area — from Mirror Lakes and Westminster out along Sunshine and Bell
            Boulevard toward Harns Marsh, Buckingham, and Alva. It's also
            overwhelmingly shingle, which changes the honest answer to most
            roofing questions here.
          </p>
          <p>
            A lot of Lehigh roofs being sold as replacements are genuinely
            repairable, and a lot of Lehigh homeowners are really trying to
            solve an <strong>insurance</strong> problem rather than a leak. We
            do both: repairs starting at $250, and written roof certifications
            with photo documentation for carriers demanding one before renewal.
          </p>
        </>
      }
    />
  );
}
