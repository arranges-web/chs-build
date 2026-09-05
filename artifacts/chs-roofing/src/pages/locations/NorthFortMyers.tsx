import LocationPageTemplate from "./LocationPageTemplate";
import { PHOTOS } from "@/lib/site-config";

export default function NorthFortMyers() {
  return (
    <LocationPageTemplate
      city="North Fort Myers"
      path="/roofing-north-fort-myers"
      geo={{ latitude: 26.6842, longitude: -81.8981 }}
      zips={["33903", "33917", "33918"]}
      heroImage={PHOTOS.tanShingleAerial}
      heroImageAlt="Aerial view of a completed shingle roof on a North Fort Myers home"
      seoTitle="North Fort Myers Roofing Contractor | CHS Roofing"
      seoDescription="North Fort Myers roof repair and replacement from a licensed local contractor (CCC1333902). Shingle, metal, and manufactured-home roofing. Free written estimate."
      neighborhoods={[
        "Bayshore",
        "Suncoast Estates",
        "Del Prado North",
        "Moody River",
        "Old Bayshore",
        "Pine Manor",
      ]}
      nearbyCities={[
        { name: "Cape Coral", href: "/roofing-cape-coral" },
        { name: "Fort Myers", href: "/roofing-fort-myers" },
        { name: "Punta Gorda", href: "/roofing-punta-gorda" },
      ]}
      localPoints={[
        {
          title: "Minutes from our Cape Coral base",
          desc: "North Fort Myers is just across the river from us, so emergency response here is among the fastest in our service area — usually same day for an active leak.",
        },
        {
          title: "Older roofs, real decking questions",
          desc: "A lot of North Fort Myers housing stock predates current code. We check decking condition before quoting, so you get a real number rather than a low bid that grows once the old roof comes off.",
        },
        {
          title: "Manufactured & mobile home roofing",
          desc: "Several North Fort Myers communities are manufactured-home parks with roof-over and metal systems. We work on these and will tell you honestly when a roof-over is the better value than a full tear-off.",
        },
      ]}
      faqs={[
        {
          q: "Do you cover manufactured and mobile homes in North Fort Myers?",
          a: "Yes. We work on metal roof-over systems and standard roofs in the manufactured-home communities throughout North Fort Myers, and we'll give you an honest read on whether a roof-over or a full replacement makes more sense for your situation.",
        },
        {
          q: "My roof is from the 1980s — will you find bad decking?",
          a: "Possibly, and we'd rather tell you up front. We inspect what's visible and note the risk in the estimate, so if we do find rotten decking after tear-off you already know the per-sheet replacement cost. No surprise change orders.",
        },
        {
          q: "How quickly can you reach North Fort Myers?",
          a: "We're based in Cape Coral, minutes away. Same-day emergency inspections are common here, and we prioritize homes with water actively entering.",
        },
        {
          q: "Is a permit required for a North Fort Myers roof replacement?",
          a: "Yes — North Fort Myers is unincorporated Lee County, so replacements permit through Lee County rather than a city. We handle the permit and the inspections either way.",
        },
      ]}
      intro={
        <>
          <p>
            North Fort Myers sits minutes from our Cape Coral base, which makes
            it one of the fastest areas for us to reach when a roof starts
            leaking. We work throughout Bayshore, Suncoast Estates, Moody River,
            and the manufactured-home communities along Del Prado and Pine
            Island Road.
          </p>
          <p>
            Much of the housing here is older than current wind code, so our
            estimates account for what we might find under the old roof rather
            than quoting a best case and revising later.
          </p>
        </>
      }
    />
  );
}
