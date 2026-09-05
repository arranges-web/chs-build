import LocationPageTemplate from "./LocationPageTemplate";
import { PHOTOS } from "@/lib/site-config";

export default function PuntaGorda() {
  return (
    <LocationPageTemplate
      city="Punta Gorda"
      path="/roofing-punta-gorda"
      geo={{ latitude: 26.9298, longitude: -82.0454 }}
      zips={["33950", "33955", "33982", "33983"]}
      heroImage={PHOTOS.whiteStandingSeam}
      heroImageAlt="White standing-seam metal roof on a Punta Gorda waterfront home"
      seoTitle="Punta Gorda Roofing Contractor | Metal & Shingle | CHS Roofing"
      seoDescription="Punta Gorda roof repair, replacement, and hurricane restoration from a licensed Florida contractor (CCC1333902). Charlotte County permitting handled. Free estimate."
      neighborhoods={[
        "Punta Gorda Isles",
        "Burnt Store Isles",
        "Historic District",
        "Deep Creek",
        "Charlotte Harbor",
        "Babcock Ranch area",
      ]}
      nearbyCities={[
        { name: "Port Charlotte", href: "/roofing-port-charlotte" },
        { name: "North Fort Myers", href: "/roofing-north-fort-myers" },
        { name: "Cape Coral", href: "/roofing-cape-coral" },
      ]}
      localPoints={[
        {
          title: "Charlotte County permitting",
          desc: "Punta Gorda permits through Charlotte County rather than Lee. We handle that process and its inspection schedule directly, so nothing stalls because paperwork went to the wrong jurisdiction.",
        },
        {
          title: "Waterfront metal roofing",
          desc: "Punta Gorda Isles and Burnt Store Isles are sailboat-access canal communities. Standing-seam metal performs well here, but only with the right fastener and flashing metals for constant salt exposure.",
        },
        {
          title: "Storm-hardened rebuilds",
          desc: "This area has taken direct hits from Charley and Ian. Many roofs here are rebuilds — we work to current wind code and document everything for both your insurer and future resale.",
        },
      ]}
      faqs={[
        {
          q: "Do you pull Charlotte County permits for Punta Gorda?",
          a: "Yes. Punta Gorda falls under Charlotte County permitting rather than Lee County. We pull the permit, schedule the inspections, and provide the closed-permit documentation when the job is finished.",
        },
        {
          q: "How far is Punta Gorda from your crews?",
          a: "We're based in Cape Coral, about 40 minutes south. Punta Gorda is a regular part of our service area — for emergency leaks we typically reach you same day or next day.",
        },
        {
          q: "Is metal worth it on a Punta Gorda Isles canal home?",
          a: "For most waterfront homes here, yes — a properly specified standing-seam system handles the wind and salt better and lasts substantially longer than shingle. The critical detail is the fastener and flashing metals, which is where cheaper installations fail first.",
        },
        {
          q: "Can you document storm damage for my insurance claim?",
          a: "Yes. We photograph every visible finding and provide a written assessment your adjuster can work from. We don't determine coverage or guarantee approval — that's between you and your carrier — but a thorough report gives you the best footing.",
        },
      ]}
      intro={
        <>
          <p>
            CHS Roofing works throughout Punta Gorda — Punta Gorda Isles, Burnt
            Store Isles, the Historic District, and out toward Deep Creek and
            Babcock Ranch. Punta Gorda permits through Charlotte County rather
            than Lee, and we handle that process directly so your job isn't
            waiting on paperwork filed in the wrong place.
          </p>
          <p>
            This area has been through Charley and Ian, so a lot of these roofs
            are rebuilds. We build to current wind code and document the work
            properly — it matters to your insurer now and to a buyer later.
          </p>
        </>
      }
    />
  );
}
