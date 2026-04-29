import MaterialPageTemplate from "@/components/MaterialPageTemplate";
import { PHOTOS } from "@/lib/site-config";

export default function Shingles() {
  return (
    <MaterialPageTemplate
      slug="asphalt-shingles"
      intro={
        <>
          <p>
            Architectural asphalt shingles are the most popular roofing choice in Southwest Florida — and for good reason. They balance affordability, durability, and aesthetics, with dozens of color and profile options to match any home style.
          </p>
          <p>
            CHS Roofing installs premium architectural and luxury designer shingles from GAF, TAMKO, and Owens Corning, with wind ratings up to 130 MPH and lifetimes of 25–30+ years.
          </p>
        </>
      }
      pros={[
        "Most affordable up-front of any major material",
        "Wide color and style selection",
        "25–30+ year manufacturer warranties",
        "Wind ratings up to 130 MPH",
        "Easy to repair section by section",
        "Compatible with most HOA covenants",
      ]}
      cons={[
        "Shorter lifespan than tile or metal",
        "More vulnerable to UV degradation over time",
        "Heavy granule loss can mean replacement",
        "Less premium curb-appeal than designer materials",
      ]}
      bestFor={[
        "First-time buyers and budget-conscious replacements",
        "Insurance-funded post-storm replacements",
        "Tract-style homes and standard residential layouts",
        "Homeowners planning to sell within 10–15 years",
        "HOA neighborhoods that don't allow metal or tile",
      ]}
      manufacturers={["GAF", "TAMKO", "Owens Corning"]}
      galleryImages={[
        { src: PHOTOS.finishedGreyShingle, alt: "Finished grey architectural shingle roof aerial view" },
        { src: PHOTOS.tanShingleAerial, alt: "Tan asphalt shingle roof aerial, Lehigh Acres" },
        { src: PHOTOS.shingleInstallTopdown, alt: "Shingle re-roof in progress, top-down view" },
        { src: PHOTOS.tanShingleAerial2, alt: "Tan and brown asphalt shingle roof aerial, Cape Coral" },
      ]}
    />
  );
}
