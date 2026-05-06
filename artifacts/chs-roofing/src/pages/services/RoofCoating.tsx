import ServicePageTemplate from "@/components/ServicePageTemplate";
import { PHOTOS } from "@/lib/site-config";

export default function RoofCoating() {
  return (
    <ServicePageTemplate
      eyebrow="Service · Roof Coating"
      title={<>Roof <span className="text-primary">Coating</span> & Restoration</>}
      subtitle="Reflective, energy-efficient coating systems that extend roof life, stop leaks, and lower cooling bills — without the cost of a full replacement."
      image={PHOTOS.flatTpoCrew}
      imageAlt="Commercial flat roof being prepped for a reflective coating system"
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
    />
  );
}
