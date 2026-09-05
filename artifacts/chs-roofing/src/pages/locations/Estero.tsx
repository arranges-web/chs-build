import LocationPageTemplate from "./LocationPageTemplate";
import { PHOTOS } from "@/lib/site-config";

export default function Estero() {
  return (
    <LocationPageTemplate
      city="Estero"
      path="/roofing-estero"
      geo={{ latitude: 26.4381, longitude: -81.8068 }}
      zips={["33928", "33929", "34135"]}
      heroImage={PHOTOS.multiToneTile}
      heroImageAlt="Multi-tone tile roof on an Estero, FL community home"
      seoTitle="Estero, FL Roofing Contractor | Tile & Metal | CHS Roofing"
      seoDescription="Estero roofing contractor (CCC1333902) for tile, metal, and shingle roofs. Experienced with Estero's gated and golf communities and HOA approval. Free estimate."
      neighborhoods={[
        "Grandezza",
        "West Bay Club",
        "Estero Place",
        "Rookery Pointe",
        "Corkscrew Shores",
        "The Brooks",
        "Coconut Point area",
      ]}
      nearbyCities={[
        { name: "Bonita Springs", href: "/roofing-bonita-springs" },
        { name: "Fort Myers", href: "/roofing-fort-myers" },
        { name: "Naples", href: "/roofing-naples" },
      ]}
      localPoints={[
        {
          title: "Tile roofs and tile-specific repairs",
          desc: "Estero has a high concentration of concrete and clay tile roofs. Most tile 'roof leaks' aren't the tile at all — they're the underlayment beneath it. We diagnose which you actually have before quoting.",
        },
        {
          title: "HOA and architectural review",
          desc: "Grandezza, West Bay Club, The Brooks and similar communities require color and profile approval before work starts. We prepare the product data and samples your architectural committee needs.",
        },
        {
          title: "Tile-to-metal conversions",
          desc: "Some Estero homeowners convert from tile to standing-seam metal for weight and longevity. Where the HOA allows it, we handle the full conversion including the structural and drainage detail changes.",
        },
      ]}
      faqs={[
        {
          q: "Can my Estero tile roof be repaired instead of replaced?",
          a: "Often, yes. If the tiles are sound and the problem is localized underlayment or flashing, a targeted repair is usually the right call. We inspect first and tell you honestly which situation you're in.",
        },
        {
          q: "Do you handle HOA approval for Estero communities?",
          a: "We prepare everything the architectural committee asks for — product data sheets, color samples, and profile details. You submit it as the homeowner, and we schedule around the approval timeline so material isn't ordered too early.",
        },
        {
          q: "How long does a tile underlayment replacement take?",
          a: "For a typical Estero home, expect roughly one to two weeks depending on size and complexity. Tile is carefully removed, the underlayment is replaced, and sound tile is reset — which is slower than a shingle re-roof but far cheaper than all-new tile.",
        },
        {
          q: "Can I switch from tile to metal in Estero?",
          a: "Where your HOA permits it, yes — and it's a common upgrade. Metal weighs less and lasts longer in this climate. Check your community's approved-materials list first; we'll help you put the submission together.",
        },
      ]}
      intro={
        <>
          <p>
            Estero's housing stock skews toward tile roofs in planned and gated
            communities — Grandezza, West Bay Club, The Brooks, Corkscrew
            Shores — and that changes what good roofing work looks like here.
            Most tile roofs that leak don't need new tile; they need new
            underlayment beneath tile that's still perfectly good.
          </p>
          <p>
            We diagnose that difference before quoting, and we handle the
            architectural-review paperwork these communities require so your
            project isn't held up waiting on an approval nobody prepared for.
          </p>
        </>
      }
    />
  );
}
