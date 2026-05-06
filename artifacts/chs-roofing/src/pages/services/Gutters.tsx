import ServicePageTemplate from "@/components/ServicePageTemplate";
import { PHOTOS } from "@/lib/site-config";

export default function Gutters() {
  return (
    <ServicePageTemplate
      eyebrow="Service · Gutters"
      title={<>Gutter <span className="text-primary">Installation</span> & Replacement</>}
      subtitle="Seamless aluminum gutters, downspouts, and gutter guards engineered for Florida's tropical rainfall and salt air."
      image={PHOTOS.silverMetalPorch}
      imageAlt="Silver metal roof with covered porch and seamless gutters"
      crumbs={[{ label: "Services" }, { label: "Gutters" }]}
      intro={
        <>
          <p>
            A great roof needs a great gutter system. Without one, rainwater dumps off your eaves, eroding landscaping, soaking foundations, rotting fascia, and shortening the life of the roof itself. In Southwest Florida — where a single afternoon storm can drop two inches of rain — gutters aren't optional.
          </p>
          <p>
            CHS Roofing installs seamless aluminum gutter systems custom-cut on-site, sized for your roof's drainage load, and color-matched to your fascia or trim. We also install screens and gutter guards that keep palm fronds, leaves, and tile debris out for good.
          </p>
        </>
      }
      included={[
        { title: "Seamless aluminum gutters", desc: "5\" and 6\" K-style profiles cut on-site to the exact length of your run — no joints, fewer leaks." },
        { title: "Downspouts & extensions", desc: "Properly sized and routed to discharge water well away from your foundation." },
        { title: "Gutter guards & screens", desc: "Optional micro-mesh and screen systems that block leaves, palm fronds, and tile debris." },
        { title: "Color matching", desc: "Dozens of factory-baked colors to match your fascia, trim, or roof." },
        { title: "Hidden hangers", desc: "Heavy-gauge hidden hangers spaced for hurricane-rated wind loads." },
        { title: "Fascia & soffit prep", desc: "Rotten fascia identified and replaced before installation — never covered up." },
        { title: "Tear-out & haul-away", desc: "Old gutters removed and recycled. We leave the site cleaner than we found it." },
        { title: "Workmanship warranty", desc: "Written warranty on labor and materials for lasting peace of mind." },
      ]}
      testimonialIndices={[1, 3, 5]}
    />
  );
}
