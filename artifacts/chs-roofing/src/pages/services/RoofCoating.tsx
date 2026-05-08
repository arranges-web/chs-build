import ServicePageTemplate from "@/components/ServicePageTemplate";
import StepsTimeline from "@/components/StepsTimeline";
import { FOUNDER_PHOTOS } from "@/lib/site-config";

const COATING_STEPS = [
  {
    title: "Free Inspection",
    desc: "We inspect the roof system, existing coating, seams, penetrations, drainage areas, and problem spots to determine if restoration is the right solution.",
    image: FOUNDER_PHOTOS.coating[0],
    imageAlt: "Free inspection of an existing flat roof for coating",
  },
  {
    title: "Site Preparation",
    desc: "We prepare the roof and work area by removing debris, protecting surrounding areas, and getting the surface ready for restoration.",
    image: FOUNDER_PHOTOS.coating[1],
    imageAlt: "Roof debris removal and site preparation",
  },
  {
    title: "Roof Preparation",
    desc: "We clean the roof, repair problem areas, seal seams, treat penetrations, and make sure the roof is ready for the coating system.",
    image: FOUNDER_PHOTOS.coating[2],
    imageAlt: "Roof cleaning, seam reinforcement, and surface prep",
  },
  {
    title: "Install Coating Layers",
    desc: "We apply the roof coating system in layers based on the roof condition and manufacturer recommendations for long-term protection.",
    image: FOUNDER_PHOTOS.coating[3],
    imageAlt: "Roof coating being applied in layers",
  },
  {
    title: "Final Walkthrough & Quality Control",
    desc: "After the coating is completed, we inspect the work, check details, and make sure the roof is properly restored.",
    image: FOUNDER_PHOTOS.coating[4],
    imageAlt: "Final walkthrough on a completed coated roof",
  },
];

export default function RoofCoating() {
  return (
    <ServicePageTemplate
      eyebrow="Service · Roof Coating"
      title={<>Roof <span className="text-primary">Coating</span> & Restoration</>}
      subtitle="Reflective, energy-efficient coating systems that extend roof life, stop leaks, and lower cooling bills — without the cost of a full replacement."
      image={FOUNDER_PHOTOS.coatingHero}
      imageAlt="Completed reflective roof coating job by CHS"
      crumbs={[{ label: "Services" }, { label: "Roof Coating & Restoration" }]}
      intro={
        <>
          <p>
            Coating is the most cost-effective way to add 10–15 years of life to a flat or low-slope roof. A properly prepped and applied silicone or acrylic system seals seams, reflects heat, waterproofs the membrane, and turns a tired roof into one that performs like new — for a fraction of replacement cost.
          </p>
          <p>
            CHS Roofing installs manufacturer-approved coating systems on TPO, modified bitumen, metal, and built-up roofs. Every project starts with a thorough inspection so we only coat roofs that are good candidates — and tell you honestly when replacement is the better call.
          </p>
        </>
      }
      included={[
        { title: "Roof condition assessment", desc: "Full inspection and core samples (when needed) to confirm the roof is a coating candidate." },
        { title: "Power wash & prep", desc: "Surface cleaned, biological growth removed, and primed for adhesion." },
        { title: "Seam reinforcement", desc: "All seams, penetrations, and flashings reinforced with embedded fabric." },
        { title: "Silicone & acrylic systems", desc: "Manufacturer-matched coatings for your specific roof type and exposure." },
        { title: "Reflective white finish", desc: "ENERGY STAR–rated coatings that reflect heat and reduce cooling loads." },
        { title: "Leak-free guarantee", desc: "Manufacturer-backed warranties up to 15 years on qualifying systems." },
        { title: "Minimal disruption", desc: "No tear-off, no debris, no business interruption — coating happens overhead." },
        { title: "Annual recoat program", desc: "Optional thin recoat at year 7–10 to push lifespan well past 20 years." },
      ]}
      testimonialIndices={[0, 2, 4]}
      showProcess={false}
      extra={
        <StepsTimeline
          eyebrow="Our Coating Process"
          title="Five steps from inspection to a fully restored roof."
          subtitle="A focused, code-compliant restoration sequence that's been refined across hundreds of SWFL coating jobs."
          steps={COATING_STEPS}
          background="bg-background bg-wash-cool"
        />
      }
    />
  );
}
