import ServicePageTemplate from "@/components/ServicePageTemplate";

export default function Maintenance() {
  return (
    <ServicePageTemplate
      eyebrow="Service · Maintenance"
      title={<>Roof <span className="text-primary">Maintenance</span> & Inspections</>}
      subtitle="Annual maintenance is the cheapest insurance policy you can buy for your roof. Catch small problems before they become $20,000 ones."
      image="/images/tile-roof.png"
      crumbs={[{ label: "Services" }, { label: "Maintenance" }]}
      intro={
        <>
          <p>
            Florida is brutal on roofs. UV, salt air, sudden rainstorms, and hurricane season chip away at sealants, lift flashing, and crack rubber boots. A single missed pipe-boot failure can cause thousands in interior damage.
          </p>
          <p>
            Our annual maintenance program catches those issues early — usually for the cost of a single repair — and extends the useful life of your roof by years.
          </p>
        </>
      }
      included={[
        { title: "Full roof inspection", desc: "Walked, photographed, and reported. Drone documentation on steep or fragile roofs." },
        { title: "Sealant & caulk renewal", desc: "Every penetration sealed and re-caulked to current manufacturer spec." },
        { title: "Pipe boot inspection", desc: "Replaced proactively when cracking or UV-degraded — before they leak." },
        { title: "Debris & moss removal", desc: "Valleys cleared, leaves blown off, gutter outlets cleared at the roof line." },
        { title: "Flashing check", desc: "Step, valley, and ridge flashing inspected for lift or movement." },
        { title: "Granule loss assessment", desc: "We track shingle wear over time to forecast replacement years in advance." },
        { title: "Written report", desc: "Photo-documented PDF report emailed to you within 48 hours." },
        { title: "Priority scheduling", desc: "Maintenance customers get first slots after storm events." },
      ]}
      testimonialIndices={[1, 2, 7]}
    />
  );
}
