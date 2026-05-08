import MaterialPageTemplate from "@/components/MaterialPageTemplate";
import { FOUNDER_PHOTOS, PHOTOS } from "@/lib/site-config";

export default function Flat() {
  return (
    <MaterialPageTemplate
      slug="flat"
      intro={
        <>
          <p>
            Flat and low-slope roofing systems are the workhorse of commercial buildings and modern residential designs. Single-ply TPO, modified bitumen, and built-up systems can deliver 20–30 years of trouble-free service when installed by certified crews.
          </p>
          <p>
            We're certified installers of Carlisle and GAF flat-roof systems, with full warranty options up to 30 years on commercial installations. Energy-efficient, code-compliant, and engineered for SWFL ponding-water concerns.
          </p>
        </>
      }
      pros={[
        "Lowest cost per square foot for commercial",
        "Highly energy-efficient (white TPO reflects up to 90% of solar heat)",
        "Easy to walk on for maintenance and equipment access",
        "Compatible with HVAC and rooftop equipment",
        "Modern aesthetic for contemporary residential designs",
        "Manufacturer warranties up to 30 years",
      ]}
      cons={[
        "Shorter lifespan than metal or tile",
        "Ponding water can develop without proper slope",
        "Penetrations (HVAC curbs, drains) require regular sealant maintenance",
        "Less curb appeal on residential applications",
      ]}
      bestFor={[
        "Commercial buildings, warehouses, and retail spaces",
        "Modern flat-roof residential architecture",
        "Additions, dormers, and porches with low slopes",
        "Buildings with significant rooftop equipment",
      ]}
      manufacturers={["Carlisle", "GAF", "ABC Supply"]}
      galleryImages={[
        { src: PHOTOS.flatTpoCrew, alt: "CHS crew installing TPO membrane on a commercial flat roof" },
        { src: PHOTOS.flatPrepRedLine, alt: "Large commercial flat-roof prep with marked boundary line" },
        { src: FOUNDER_PHOTOS.flat[0], alt: "Completed TPO commercial roof, Southwest Florida" },
        { src: FOUNDER_PHOTOS.flat[1], alt: "TPO roof on a Cape Coral commercial property" },
        { src: FOUNDER_PHOTOS.flat[2], alt: "Mechanic shop TPO flat roof installation" },
        { src: FOUNDER_PHOTOS.flat[3], alt: "Completed TPO commercial flat roof with rooftop HVAC" },
      ]}
    />
  );
}
