import LocationPageTemplate from "./LocationPageTemplate";
import { PHOTOS } from "@/lib/site-config";

export default function FortMyers() {
  return (
    <LocationPageTemplate
      city="Fort Myers"
      path="/roofing-fort-myers"
      heroImage={PHOTOS.darkMetalAerial}
      heroImageAlt="Aerial view of a dark metal roof installed by CHS Roofing near Fort Myers, FL"
      seoTitle="Roofing Company in Fort Myers, FL | Repair & Installation — CHS Roofing"
      seoDescription="Licensed Fort Myers roofing contractor (CCC1333902). New roof installation, repair, and storm damage restoration. Free inspection, written estimate in 24–48 hrs."
      neighborhoods={[
        "Downtown Fort Myers",
        "College Parkway",
        "Iona",
        "McGregor",
        "South Fort Myers",
        "Gateway",
        "Fort Myers Shores",
      ]}
      nearbyCities={[
        { name: "Cape Coral", href: "/" },
        { name: "Naples", href: "/roofing-naples" },
        { name: "Bonita Springs", href: "/roofing-bonita-springs" },
      ]}
      localPoints={[
        {
          title: "Wind-load code compliance",
          desc: "Fort Myers homes fall under Lee County's high-velocity wind zone requirements. Every install we complete meets or exceeds current Florida Building Code wind-uplift standards.",
        },
        {
          title: "Older neighborhoods, older roofs",
          desc: "Many Fort Myers homes near McGregor and downtown were built decades ago. We regularly find hidden deck damage on tear-offs and always show you photos before covering it back up.",
        },
        {
          title: "Fast storm response",
          desc: "Our crews are based minutes from Fort Myers, so after a named storm we can typically get a tarp on your roof same-day or next-day — before secondary water damage sets in.",
        },
      ]}
      faqs={[
        {
          q: "How quickly can CHS Roofing come out for a free inspection in Fort Myers?",
          a: "Most Fort Myers inspections are scheduled within 24–48 hours of your request. Emergency leak or storm-damage calls are prioritized same-day when possible.",
        },
        {
          q: "Do you handle insurance claims for wind and hail damage in Fort Myers?",
          a: "Yes. We meet your adjuster on-site, document damage with photos, and provide a line-itemed scope that matches standard insurance estimating software.",
        },
        {
          q: "What roofing material is most common in Fort Myers?",
          a: "Architectural asphalt shingles are the most common for value, while standing-seam metal is increasingly popular for its hurricane resistance and 50+ year lifespan. We'll help you weigh cost against long-term durability for your specific home.",
        },
        {
          q: "Are you licensed to work in Lee County?",
          a: "Yes — CHS Roofing holds Florida State Certified Roofing Contractor License #CCC1333902, which covers all of Lee County including Fort Myers, Cape Coral, and surrounding areas.",
        },
      ]}
      intro={
        <>
          <p>
            CHS Roofing has installed and repaired roofs across Fort Myers for
            homeowners in College Parkway, Iona, McGregor, and neighborhoods
            near the Caloosahatchee River. Whether you need a full
            replacement after storm damage or a targeted repair on a leaking
            valley, our crews are local, licensed, and available for a free
            on-site inspection.
          </p>
          <p>
            We know Fort Myers roofs face a specific mix of challenges — salt
            air near the river, intense summer UV, and the wind-uplift
            demands of hurricane season. Every estimate we write accounts for
            those conditions, not a generic statewide average.
          </p>
        </>
      }
    />
  );
}
