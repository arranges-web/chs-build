import MaterialPageTemplate from "@/components/MaterialPageTemplate";

export default function Tile() {
  return (
    <MaterialPageTemplate
      slug="tile"
      intro={
        <>
          <p>
            Concrete and clay tile define Southwest Florida's classic Mediterranean and Spanish-revival look. They're heavy, beautiful, and last 50+ years when properly installed and maintained — but installation has to be done right by an experienced crew.
          </p>
          <p>
            CHS Roofing installs both concrete and clay tile from Westlake Royal Roofing and other premium manufacturers, with full underlayment systems engineered for Florida's UV and rainfall extremes.
          </p>
        </>
      }
      pros={[
        "50+ year service life",
        "Iconic SWFL aesthetic — boosts resale value",
        "Naturally fire-resistant (Class A)",
        "Excellent thermal performance — keeps homes cooler",
        "Withstands extreme UV and salt air",
        "HOA-friendly in most planned communities",
      ]}
      cons={[
        "Heavy — may require structural review on older homes",
        "Higher up-front cost than shingles",
        "Individual tiles can crack from foot traffic",
        "Underlayment typically replaced before the tile itself",
      ]}
      bestFor={[
        "Mediterranean, Spanish-revival, and Tuscan home styles",
        "Established SWFL communities with tile aesthetic standards",
        "Owners wanting maximum lifespan and curb appeal",
        "Homes built to handle the weight (typical post-2000 builds)",
      ]}
      manufacturers={["Westlake Royal Roofing", "Eagle", "Boral"]}
      galleryImages={[
        { src: "/images/tile-roof.png", alt: "Tile roof showcase" },
        { src: "/images/hero-roof.png", alt: "Residential roofing" },
        { src: "/images/after-shingle.png", alt: "Roof project completion" },
        { src: "/images/metal-roof.png", alt: "SWFL roofing examples" },
      ]}
    />
  );
}
