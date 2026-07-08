import LocationPageTemplate from "./LocationPageTemplate";
import { PHOTOS } from "@/lib/site-config";

export default function BonitaSprings() {
  return (
    <LocationPageTemplate
      city="Bonita Springs"
      path="/roofing-bonita-springs"
      heroImage={PHOTOS.silverMetalPoolCage}
      heroImageAlt="Silver metal roof with screened pool cage on a Bonita Springs, FL home"
      seoTitle="Bonita Springs, FL Roof Repair & Installation | CHS Roofing"
      seoDescription="Bonita Springs roofing contractor (CCC1333902): new roofs, repairs, and storm restoration for canal, golf-course, and gated communities. Free estimate."
      neighborhoods={[
        "Bonita Bay",
        "Spring Creek",
        "Bonita Beach",
        "Pelican Landing",
        "Village Walk",
        "Old 41 Corridor",
        "East Bonita Springs",
      ]}
      nearbyCities={[
        { name: "Naples", href: "/roofing-naples" },
        { name: "Fort Myers", href: "/roofing-fort-myers" },
        { name: "Cape Coral", href: "/" },
      ]}
      localPoints={[
        {
          title: "Gated & golf-community coordination",
          desc: "Bonita Bay, Pelican Landing, and other gated communities require gate access scheduling and often have contractor conduct rules. We coordinate directly with community management so your project runs smoothly.",
        },
        {
          title: "Canal and waterfront wind exposure",
          desc: "Homes along Bonita's canals and Spring Creek face direct wind-driven rain during tropical systems. We pay close attention to flashing details at chimneys, valleys, and roof-to-wall transitions in these areas.",
        },
        {
          title: "Screened enclosures & pool cages",
          desc: "Many Bonita Springs homes have roof lines that tie into lanai and pool-cage structures. We coordinate flashing and drainage so water is directed away from these transitions, not into them.",
        },
      ]}
      faqs={[
        {
          q: "Can you work inside gated communities like Bonita Bay?",
          a: "Yes — we regularly coordinate gate access, parking, and any community-specific work-hour rules with HOA or property management in advance of your project start date.",
        },
        {
          q: "Do you repair roof leaks near pool cages and lanais in Bonita Springs?",
          a: "Yes, this is one of our most common repair calls in Bonita Springs. Leaks often originate at the transition between the main roof and the screened enclosure attachment, which we inspect closely.",
        },
        {
          q: "How fast can you respond after a storm in Bonita Springs?",
          a: "Our crews are based nearby and typically respond within 24 hours for emergency tarping after a named storm, prioritizing active leaks first.",
        },
        {
          q: "What warranty do Bonita Springs installations include?",
          a: "Every new roof includes a 10-year workmanship warranty in writing, plus the manufacturer's material warranty — typically 25–50 years depending on the product.",
        },
      ]}
      intro={
        <>
          <p>
            CHS Roofing serves Bonita Springs homeowners from Bonita Bay and
            Pelican Landing to Spring Creek and the Old 41 corridor. We're
            familiar with the access and approval processes for the area's
            gated and golf-course communities, and we schedule around them so
            your project isn't delayed.
          </p>
          <p>
            Whether it's a full replacement, a repair near a pool cage
            transition, or emergency storm response along the canals, our
            local crews show up with a written, itemized quote — not a
            ballpark guess.
          </p>
        </>
      }
    />
  );
}
