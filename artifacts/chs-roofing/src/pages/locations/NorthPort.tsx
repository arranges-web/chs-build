import LocationPageTemplate from "./LocationPageTemplate";
import { PHOTOS } from "@/lib/site-config";

export default function NorthPort() {
  return (
    <LocationPageTemplate
      city="North Port"
      path="/roofing-north-port"
      geo={{ latitude: 27.0442, longitude: -82.2359 }}
      zips={["34286", "34287", "34288", "34289", "34291"]}
      heroImage={PHOTOS.greyMetalHip}
      heroImageAlt="Grey metal hip roof on a North Port, FL home"
      seoTitle="North Port, FL Roofing Contractor | CHS Roofing (CCC1333902)"
      seoDescription="North Port roof replacement and repair from a licensed Florida contractor (CCC1333902). Sarasota County permitting, storm restoration, and free written estimates."
      neighborhoods={[
        "North Port Estates",
        "Talon Bay",
        "Bobcat Trail",
        "Heron Creek",
        "Warm Mineral Springs",
        "Sumter Boulevard corridor",
      ]}
      nearbyCities={[
        { name: "Port Charlotte", href: "/roofing-port-charlotte" },
        { name: "Punta Gorda", href: "/roofing-punta-gorda" },
        { name: "Cape Coral", href: "/roofing-cape-coral" },
      ]}
      localPoints={[
        {
          title: "Sarasota County permitting",
          desc: "North Port permits through Sarasota County — a different jurisdiction and inspection schedule than Lee or Charlotte. We handle it directly so your project isn't delayed by a filing sent to the wrong county.",
        },
        {
          title: "Newer construction, warranty-sensitive",
          desc: "Much of North Port is newer construction still inside its original roof warranty window. We'll tell you when a manufacturer or builder warranty may cover the issue before you pay us for anything.",
        },
        {
          title: "Fast-growing, inconsistent quality",
          desc: "North Port has grown quickly, and roofing quality varies widely between builders. A free inspection tells you what you actually have — especially useful before the warranty on a newer home runs out.",
        },
      ]}
      faqs={[
        {
          q: "Do you actually cover North Port, or is it too far?",
          a: "We cover it. North Port is the northern edge of our service area from Cape Coral — about an hour north. We schedule work there in blocks, so a non-emergency inspection may be a day or two out rather than same day.",
        },
        {
          q: "My home is newer — is the roof still under warranty?",
          a: "Quite possibly, and it's the first thing we check. Much of North Port is newer construction, and if a manufacturer or builder warranty covers your issue we'll point you there rather than sell you a repair you shouldn't be paying for.",
        },
        {
          q: "Which county permits a North Port roof replacement?",
          a: "Sarasota County — not Charlotte, despite the proximity. We file with the correct jurisdiction and manage the inspection schedule.",
        },
        {
          q: "Do you offer emergency service in North Port?",
          a: "Yes, including tarping. Because it's at the edge of our range, call (239) 737-1758 as early as you can and we'll tell you honestly when we can be there rather than over-promising.",
        },
      ]}
      intro={
        <>
          <p>
            North Port is the northern edge of our Southwest Florida service
            area — Heron Creek, Bobcat Trail, Talon Bay, North Port Estates, and
            out toward Warm Mineral Springs. It permits through Sarasota County
            rather than Charlotte, which trips up contractors who don't work
            here regularly.
          </p>
          <p>
            A lot of North Port is newer construction, so the first thing we
            check is whether a builder or manufacturer warranty already covers
            your problem. If it does, we'll say so — that's a call we'd rather
            you make with good information than a repair you didn't need to buy.
          </p>
        </>
      }
    />
  );
}
