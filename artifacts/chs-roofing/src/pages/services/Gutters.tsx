import ServicePageTemplate from "@/components/ServicePageTemplate";
import StepsTimeline from "@/components/StepsTimeline";
import { FOUNDER_PHOTOS, PHOTOS } from "@/lib/site-config";

const GUTTER_STEPS = [
  {
    title: "Free Inspection",
    desc: "We inspect the existing gutters, fascia, soffit, drainage areas, and problem spots to recommend the best solution for the property.",
    image: FOUNDER_PHOTOS.gutter[0],
    imageAlt: "Inspector evaluating existing gutters and fascia",
  },
  {
    title: "Site Preparation",
    desc: "Before work begins, we prepare the work area, protect the property, and make sure everything is ready for a clean installation.",
    image: FOUNDER_PHOTOS.gutter[1],
    imageAlt: "Site preparation for gutter installation",
  },
  {
    title: "Remove Old Gutters, Fascia & Soffit",
    desc: "When needed, we remove damaged gutters, rotten fascia, or old soffit so the new system can be installed correctly.",
    image: FOUNDER_PHOTOS.gutter[2],
    imageAlt: "Removing old gutters and damaged fascia",
  },
  {
    title: "Cut Gutters & Bend Fascia Metal On Site",
    desc: "We fabricate seamless aluminum gutters on site and bend fascia metal as needed for a clean, custom fit.",
    image: FOUNDER_PHOTOS.gutter[3],
    imageAlt: "On-site fabrication of seamless aluminum gutters",
  },
  {
    title: "Install New Aluminum Gutters, Soffit & Fascia",
    desc: "We install the new gutter, soffit, and fascia system properly and to Florida Building Code requirements.",
    image: FOUNDER_PHOTOS.gutter[4],
    imageAlt: "New seamless aluminum gutters being installed",
  },
  {
    title: "Final Walkthrough",
    desc: "Once completed, we walk the project, check the details, and make sure the customer is satisfied with the finished work.",
    image: FOUNDER_PHOTOS.gutter[5],
    imageAlt: "Final walkthrough on a completed gutter installation",
  },
];

export default function Gutters() {
  return (
    <ServicePageTemplate
      eyebrow="Service · Gutters"
      title={<>Gutter <span className="text-primary">Installation</span> & Replacement</>}
      subtitle="Seamless aluminum gutters, soffit, fascia, and gutter guards engineered for Florida's tropical rainfall and salt air."
      image={PHOTOS.silverMetalPorch}
      imageAlt="Silver metal roof with covered porch and seamless gutters"
      crumbs={[{ label: "Services" }, { label: "Gutters" }]}
      intro={
        <>
          <p>
            A great roof needs a great gutter system. Without one, rainwater dumps off your eaves, eroding landscaping, soaking foundations, rotting fascia, and shortening the life of the roof itself. In Southwest Florida — where a single afternoon storm can drop two inches of rain — gutters aren't optional.
          </p>
          <p>
            CHS Roofing fabricates seamless aluminum gutters on site, custom-cut to your roof's drainage load and color-matched to your fascia or trim. We also install matching soffit and fascia, plus screens and gutter guards that keep palm fronds, leaves, and tile debris out for good.
          </p>
        </>
      }
      included={[
        { title: "Seamless aluminum gutters", desc: "5\" and 6\" K-style profiles cut on-site to the exact length of your run — no joints, fewer leaks." },
        { title: "Downspouts & extensions", desc: "Properly sized and routed to discharge water well away from your foundation." },
        { title: "Gutter guards & screens", desc: "Optional micro-mesh and screen systems that block leaves, palm fronds, and tile debris." },
        { title: "Color matching", desc: "Dozens of factory-baked colors to match your fascia, trim, or roof." },
        { title: "Hidden hangers", desc: "Heavy-gauge hidden hangers spaced for hurricane-rated wind loads." },
        { title: "Fascia & soffit replacement", desc: "Rotten fascia and damaged soffit replaced and bent on site to fit cleanly." },
        { title: "Tear-out & haul-away", desc: "Old gutters removed and recycled. We leave the site cleaner than we found it." },
        { title: "Workmanship warranty", desc: "Written warranty on labor and materials for lasting peace of mind." },
      ]}
      testimonialIndices={[1, 3, 5]}
      showProcess={false}
      extra={
        <StepsTimeline
          eyebrow="Our 6-Step Gutter Process"
          title="Custom-fit, Florida-code, clean install."
          subtitle="From inspection to final walkthrough — what to expect when CHS installs your gutter system."
          steps={GUTTER_STEPS}
          background="bg-background bg-wash-cool"
        />
      }
    />
  );
}
