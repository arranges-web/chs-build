import LocationPageTemplate from "./LocationPageTemplate";
import { PHOTOS } from "@/lib/site-config";

export default function Naples() {
  return (
    <LocationPageTemplate
      city="Naples"
      path="/roofing-naples"
      heroImage={PHOTOS.terracottaWaterfront}
      heroImageAlt="Terracotta tile roof on a Naples, FL waterfront home installed by CHS Roofing"
      seoTitle="Naples, FL Roofing Contractor | Tile, Metal & Shingle Roofs — CHS Roofing"
      seoDescription="Licensed Naples roofing company (CCC1333902) specializing in tile, metal, and shingle roofs for coastal homes. Free inspection, HOA-compliant installs."
      neighborhoods={[
        "Old Naples",
        "Park Shore",
        "Pelican Bay",
        "North Naples",
        "Golden Gate",
        "Lely",
        "East Naples",
      ]}
      nearbyCities={[
        { name: "Bonita Springs", href: "/roofing-bonita-springs" },
        { name: "Fort Myers", href: "/roofing-fort-myers" },
        { name: "Cape Coral", href: "/" },
      ]}
      localPoints={[
        {
          title: "HOA & architectural review ready",
          desc: "Many Naples communities — Pelican Bay, Park Shore, and others — require HOA sign-off on roofing material and color before permitting. We prepare submittal packages and samples so approval doesn't stall your project.",
        },
        {
          title: "Tile and barrel roof expertise",
          desc: "Naples has one of the highest concentrations of concrete and clay tile roofs in Southwest Florida. Our crews are trained specifically in tile underlayment replacement, matching, and hip/ridge detailing.",
        },
        {
          title: "Coastal salt-air corrosion",
          desc: "Homes near Naples' Gulf-front streets see accelerated corrosion on fasteners and flashing. We spec marine-grade or coated fasteners on any roof within a few miles of the water.",
        },
      ]}
      faqs={[
        {
          q: "Can you match existing tile on a partial roof repair in Naples?",
          a: "In most cases, yes. We maintain relationships with tile suppliers who carry legacy profiles, and when an exact match isn't available we'll walk you through blending options so repairs aren't visually obvious from the street.",
        },
        {
          q: "Do you work with Naples HOAs on approval paperwork?",
          a: "Yes — we regularly prepare architectural review submittals including material specs, color samples, and manufacturer documentation for Naples-area HOAs and condo associations.",
        },
        {
          q: "What's the average cost difference between tile and metal in Naples?",
          a: "Tile installation typically costs more upfront than architectural shingle but less than premium standing-seam metal. We provide itemized, side-by-side quotes so you can compare lifetime cost, not just sticker price.",
        },
        {
          q: "Are you licensed to pull permits in Collier County?",
          a: "Yes — CHS Roofing holds Florida State Certified Roofing Contractor License #CCC1333902 and regularly pulls permits in both Collier and Lee counties.",
        },
      ]}
      intro={
        <>
          <p>
            From Old Naples to Pelican Bay and North Naples, CHS Roofing
            installs and repairs the tile, metal, and shingle roofs that
            define this stretch of the Gulf Coast. We understand the
            HOA approval processes many Naples communities require, and we
            prepare the documentation up front so your project isn't delayed
            waiting on architectural review.
          </p>
          <p>
            Naples' waterfront exposure means salt air and UV take a
            faster toll on fasteners, flashing, and underlayment than
            further inland. Our estimates spec materials rated for that
            environment — not a one-size-fits-all statewide package.
          </p>
        </>
      }
    />
  );
}
