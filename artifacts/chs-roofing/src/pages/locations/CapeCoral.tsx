import LocationPageTemplate from "./LocationPageTemplate";
import { PHOTOS } from "@/lib/site-config";

/**
 * Cape Coral — CHS Roofing's home city. This is the highest-intent
 * local page on the site and was the one city without a page.
 */
export default function CapeCoral() {
  return (
    <LocationPageTemplate
      city="Cape Coral"
      path="/roofing-cape-coral"
      geo={{ latitude: 26.5629, longitude: -81.9495 }}
      radiusMeters={24000}
      zips={["33904", "33909", "33914", "33990", "33991", "33993"]}
      heroImage={PHOTOS.canalMetalInstall}
      heroImageAlt="Metal roof installation on a canal-front home in Cape Coral, FL"
      seoTitle="Cape Coral Roofing Contractor | CHS Roofing (CCC1333902)"
      seoDescription="Cape Coral roofing contractor based right here in the city. New roofs, leak repair, and storm restoration for canal and Gulf-access homes. Licensed CCC1333902. Free estimate."
      neighborhoods={[
        "Southwest Cape",
        "Southeast Cape",
        "Pelican",
        "Cape Harbour",
        "Tarpon Point",
        "Burnt Store",
        "Bimini Basin",
        "Sandoval",
      ]}
      nearbyCities={[
        { name: "Fort Myers", href: "/roofing-fort-myers" },
        { name: "North Fort Myers", href: "/roofing-north-fort-myers" },
        { name: "Punta Gorda", href: "/roofing-punta-gorda" },
      ]}
      localPoints={[
        {
          title: "We're based here",
          desc: "Cape Coral is our home city — not a service area we drive to. That means faster response on emergency leaks, and a crew that already knows the permitting process at Cape Coral City Hall rather than learning it on your job.",
        },
        {
          title: "400+ miles of saltwater canals",
          desc: "Gulf-access homes take constant salt-laden wind off the water. We spec fastener and flashing metals that hold up to that exposure, because standard galvanized simply doesn't last on a canal-front roof here.",
        },
        {
          title: "Lee County wind code & permitting",
          desc: "Every replacement is engineered to current Lee County wind-load requirements and permitted through the city. We pull the permit, schedule the inspections, and hand you the documentation — it matters at resale and for your insurer.",
        },
        {
          title: "Post-Ian insurance experience",
          desc: "We've documented hundreds of Cape Coral roofs for claims since Ian. We photograph every visible finding and write it up so your adjuster can act on it — though coverage decisions are always your carrier's, not ours.",
        },
      ]}
      faqs={[
        {
          q: "Are you actually based in Cape Coral?",
          a: "Yes. Cordova Home Services LLC (CHS Roofing) operates out of Cape Coral, FL 33904. We're not a franchise or a lead-buying operation routing your call somewhere else — the person who inspects your roof works for the company that does the work.",
        },
        {
          q: "How fast can you get to a leak in Cape Coral?",
          a: "Because we're local, same-day or next-day is typical for active leaks, and we prioritize water actively entering the home. Call (239) 737-1758 and ask for emergency scheduling.",
        },
        {
          q: "Do you pull the permit for Cape Coral roof replacements?",
          a: "Yes. We pull the permit through the City of Cape Coral, schedule the required inspections, and give you the closed-permit documentation at the end. Never accept a roof replacement here without a permit — it causes real problems at resale.",
        },
        {
          q: "What roof material holds up best on a Cape Coral canal home?",
          a: "For Gulf-access and canal-front homes we usually recommend either a standing-seam metal system or a high-wind-rated architectural shingle, depending on budget and HOA rules. The bigger factor is the fastener and flashing metals — that's what fails first in salt air, regardless of the roof covering.",
        },
        {
          q: "Do you work with Cape Coral HOAs on color and material approval?",
          a: "Yes. Many Cape Coral communities have approved color and profile lists. We'll provide the product data sheets and color samples your HOA's architectural review needs before we order material.",
        },
      ]}
      intro={
        <>
          <p>
            CHS Roofing is based in Cape Coral — this is our home city, not a
            service area we drive into. From the Gulf-access canals of
            Southwest Cape and Cape Harbour to Sandoval and the Burnt Store
            corridor, we've replaced, repaired, and storm-restored roofs across
            every part of the Cape.
          </p>
          <p>
            Being local matters most on the two things Cape Coral homeowners
            actually care about: how fast someone shows up when water is coming
            in, and whether the permit and inspection paperwork is handled
            correctly. We do both ourselves — licensed under Florida{" "}
            <strong>CCC1333902</strong>, permitted through the City of Cape
            Coral, and inspected to current Lee County wind code.
          </p>
        </>
      }
    />
  );
}
