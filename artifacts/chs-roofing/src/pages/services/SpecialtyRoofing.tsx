import ServicePageTemplate from "@/components/ServicePageTemplate";

export default function SpecialtyRoofing() {
  return (
    <ServicePageTemplate
      eyebrow="Service · Specialty"
      title={<>Specialty <span className="text-primary">Roofing</span> Services</>}
      subtitle="Skylights, copper accents, custom flashing, and unique architectural roofs. The detail work other contractors won't touch."
      image="/images/metal-roof.png"
      crumbs={[{ label: "Services" }, { label: "Specialty Roofing" }]}
      intro={
        <>
          <p>
            Some roofs aren't standard — and they don't deserve standard work. Whether it's a complex multi-pitch architectural design, a copper bay-window roof, custom-bent flashing, or a skylight install that has to seal perfectly, we have the metal-shop and craftsmanship experience to do it right.
          </p>
          <p>
            We work with architects, custom-home builders, and homeowners on projects where details matter and craftsmanship is non-negotiable.
          </p>
        </>
      }
      included={[
        { title: "Skylight installation & replacement", desc: "Velux and equivalent — fully flashed, fully sealed, fully warrantied." },
        { title: "Custom copper accents", desc: "Bay windows, turrets, dormers, and decorative ridge work." },
        { title: "Custom-bent flashing", desc: "On-site brake work for non-standard valleys, roof-to-wall, and parapets." },
        { title: "Architectural standing seam", desc: "High-end snap-lock and mechanical-seam metal in dozens of finishes." },
        { title: "Cupolas & ridge ornaments", desc: "Decorative ridge caps and architectural cupolas installed and sealed." },
        { title: "Roof-to-wall transitions", desc: "Complex transitions on additions and second-story builds." },
        { title: "Solar-ready prep", desc: "Reinforced decking and pre-installed mounts for future solar arrays." },
        { title: "HOA-spec installations", desc: "Tile, paint, and profile matching for HOA-controlled communities." },
      ]}
      testimonialIndices={[0, 4, 6]}
      showFaq={false}
    />
  );
}
