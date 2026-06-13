import ServicePageTemplate from "@/components/ServicePageTemplate";
import StepsTimeline from "@/components/StepsTimeline";
import { PHOTOS } from "@/lib/site-config";
import gutterStep1 from "@assets/ChatGPT_Image_May_29,_2026,_01_47_00_PM_1781361827731.png";
import gutterStep2 from "@assets/ChatGPT_Image_May_29,_2026,_01_47_04_PM_1781361827731.png";
import gutterStep3 from "@assets/ChatGPT_Image_May_29,_2026,_01_47_08_PM_1781361827731.png";
import gutterStep4 from "@assets/ChatGPT_Image_May_29,_2026,_01_47_13_PM_1781361827731.png";
import gutterStep5 from "@assets/ChatGPT_Image_May_29,_2026,_01_56_58_PM_1781361827732.png";

const GUTTER_STEPS = [
  {
    title: "Free Inspection",
    desc: "We inspect the existing gutters, fascia, soffit, drainage areas, and problem spots to recommend the best solution for the property.",
    image: gutterStep1,
    imageAlt: "Inspector evaluating existing gutters and fascia on a residential home",
  },
  {
    title: "Site Preparation",
    desc: "Before work begins, we prepare the work area, protect the property, and make sure everything is ready for a clean installation.",
    image: gutterStep2,
    imageAlt: "Rainwater flowing through gutters — the drainage problem we solve",
  },
  {
    title: "Remove Old Gutters, Fascia & Soffit",
    desc: "When needed, we remove damaged gutters, rotten fascia, or old soffit so the new system can be installed correctly.",
    image: gutterStep3,
    imageAlt: "Clean downspout and gutter run on a grey-sided home",
  },
  {
    title: "Cut Gutters & Bend Fascia Metal On Site",
    desc: "We fabricate seamless aluminum gutters on site and bend fascia metal as needed for a clean, custom fit.",
    image: gutterStep4,
    imageAlt: "Freshly installed white seamless gutters and downspout on a craftsman home",
  },
  {
    title: "Install New Aluminum Gutters, Soffit & Fascia",
    desc: "We install the new gutter, soffit, and fascia system properly and to Florida Building Code requirements.",
    image: gutterStep5,
    imageAlt: "New seamless white gutters installed on a craftsman home",
  },
  {
    title: "Final Walkthrough",
    desc: "Once completed, we walk the project, check the details, and make sure the customer is satisfied with the finished work.",
    image: gutterStep5,
    imageAlt: "Completed gutter installation — final walkthrough",
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
      seo={{
        title: "Seamless Gutters, Soffit & Fascia — Cape Coral, Fort Myers, Naples | CHS",
        description: "On-site fabricated seamless aluminum gutters, fascia metal, soffit, and gutter guards. Florida Building Code compliant install with workmanship warranty.",
        path: "/services/gutters",
        serviceName: "Gutter Installation",
      }}
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
