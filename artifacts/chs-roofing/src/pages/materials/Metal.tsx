import MaterialPageTemplate from "@/components/MaterialPageTemplate";
import { PHOTOS } from "@/lib/site-config";

export default function Metal() {
  return (
    <MaterialPageTemplate
      slug="metal"
      intro={
        <>
          <p>
            Standing-seam metal is the gold standard for hurricane resistance in Southwest Florida. Concealed fasteners, mechanical or snap-lock seams, and engineered Florida wind-rated panels mean a properly installed metal roof can outlast the home it's protecting.
          </p>
          <p>
            We install architectural metal in a wide range of finishes — from classic galvalume to premium PVDF Kynar paint systems with 35-year color warranties. Lifetime materials, lifetime peace of mind.
          </p>
        </>
      }
      pros={[
        "50+ year service life",
        "Highest wind resistance of any roof type",
        "Energy efficient — reflects up to 70% of solar heat",
        "Fully recyclable, 100% sustainable",
        "Lowest maintenance of any roof material",
        "Insurance discounts on most policies",
        "Premium curb appeal and resale value",
      ]}
      cons={[
        "Higher up-front cost than shingles",
        "Requires experienced installer (we are that installer)",
        "Can be louder during heavy rain without proper underlayment",
        "Finish color matching for additions can be difficult years later",
      ]}
      bestFor={[
        "Coastal homes facing salt air and hurricane wind",
        "Owners planning to stay 20+ years",
        "Homes seeking the highest insurance discounts",
        "Modern, ranch, or coastal-contemporary architecture",
        "Solar-ready homes",
      ]}
      manufacturers={["Metal Alliance", "ABC Supply"]}
      galleryImages={[
        { src: PHOTOS.whiteStandingSeam, alt: "White standing-seam metal roof on a Cape Coral waterfront home" },
        { src: PHOTOS.beachfrontMetal, alt: "Standing-seam metal roof on a Sanibel beachfront residence" },
        { src: PHOTOS.darkMetalAerial, alt: "Finished dark metal roof aerial view, Southwest Florida" },
        { src: PHOTOS.silverMetalPoolCage, alt: "Silver metal roof with pool cage, Punta Gorda" },
      ]}
    />
  );
}
