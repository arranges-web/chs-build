import LocationPageTemplate from "./LocationPageTemplate";
import { PHOTOS } from "@/lib/site-config";

export default function PortCharlotte() {
  return (
    <LocationPageTemplate
      city="Port Charlotte"
      path="/roofing-port-charlotte"
      geo={{ latitude: 26.9762, longitude: -82.0906 }}
      zips={["33948", "33952", "33953", "33954", "33980", "33981"]}
      heroImage={PHOTOS.finishedGreyShingle}
      heroImageAlt="Finished grey shingle roof on a Port Charlotte, FL home"
      seoTitle="Port Charlotte Roofing Contractor | Repair & Replace | CHS Roofing"
      seoDescription="Port Charlotte roof repair and replacement from a licensed Florida roofing contractor (CCC1333902). Hurricane restoration and insurance documentation. Free estimate."
      neighborhoods={[
        "Port Charlotte Village",
        "Gulf Cove",
        "El Jobean",
        "Charlotte Harbor",
        "Murdock",
        "South Gulf Cove",
      ]}
      nearbyCities={[
        { name: "Punta Gorda", href: "/roofing-punta-gorda" },
        { name: "North Port", href: "/roofing-north-port" },
        { name: "Cape Coral", href: "/roofing-cape-coral" },
      ]}
      localPoints={[
        {
          title: "Heavy post-Ian rebuild activity",
          desc: "Port Charlotte took severe roof damage in Ian, and a lot of work here was done fast. If your roof was replaced during that rush, a free inspection is worth it — we regularly find flashing and fastener work that won't hold.",
        },
        {
          title: "Charlotte County wind code",
          desc: "Replacements permit through Charlotte County and must meet current wind-load requirements. We pull the permit, meet the inspection schedule, and hand over the closed-permit paperwork.",
        },
        {
          title: "Shingle-dominant housing stock",
          desc: "Most Port Charlotte homes are shingle, which means repairs are often genuinely viable rather than an automatic replacement. We'll tell you when a repair is the honest answer.",
        },
      ]}
      faqs={[
        {
          q: "My roof was replaced right after Ian — should I have it checked?",
          a: "It's worth a free inspection. An enormous amount of roofing work happened here in a short window, and we regularly find flashing, fastener, and pipe-boot details that were rushed. Better to know now than during the next named storm.",
        },
        {
          q: "Do you serve Port Charlotte regularly or just occasionally?",
          a: "Regularly — Port Charlotte and Punta Gorda are an established part of our service area from our Cape Coral base, roughly 45 minutes south of you.",
        },
        {
          q: "Can my Port Charlotte shingle roof be repaired?",
          a: "Often yes. Most homes here are shingle, and localized damage — missing shingles, a failed pipe boot, flashing at a valley — is genuinely repairable. Repairs start at $250. We inspect first and recommend replacement only when the roof actually warrants it.",
        },
        {
          q: "Do you handle Charlotte County permits?",
          a: "Yes. Port Charlotte is unincorporated Charlotte County. We pull the permit, schedule inspections, and provide documentation at completion.",
        },
      ]}
      intro={
        <>
          <p>
            CHS Roofing serves Port Charlotte from Gulf Cove and South Gulf Cove
            through Murdock, El Jobean, and Charlotte Harbor. This area took
            severe roof damage during Ian, and an enormous amount of roofing
            work happened here in a very short window.
          </p>
          <p>
            If yours was one of those roofs, a free inspection is worth your
            time — we regularly find rushed flashing and fastener details that
            won't survive the next storm. And where a repair is genuinely the
            right answer, we'll tell you that instead of quoting a replacement.
          </p>
        </>
      }
    />
  );
}
