import chsLogo from "@assets/chs_logo_1776908189982.png";
import teamFamily from "@assets/image_1776908317416.png";
import teamSaul from "@assets/image_1776908337861.png";
import teamGustavo from "@assets/image_1776908399820.png";
import teamDaniel from "@assets/image_1776908406154.png";
import teamRoberto from "@assets/image_1776908417253.png";

import photoBeachfrontMetal from "@assets/image_1777343219176.png";
import photoCanalMetalInstall from "@assets/image_1777343230206.png";
import photoFlatTpoCrew from "@assets/image_1777343244574.png";
import photoTearOff from "@assets/image_1777343264667.png";
import photoGreyMetalHip from "@assets/image_1777343276383.png";
import photoTerracottaWaterfront from "@assets/image_1777343288382.png";
import photoRedMetalAccent from "@assets/image_1777343301107.png";
import photoShingleInstallTopdown from "@assets/image_1777343324198.png";
import photoLightGreyMetalLanai from "@assets/image_1777343334258.png";
import photoFlatPrepRedLine from "@assets/image_1777343343141.png";
import photoWhiteStandingSeam from "@assets/image_1777343356321.png";
import photoDarkMetalAerial from "@assets/image_1777343365657.png";
import photoSilverMetalPoolCage from "@assets/image_1777343378799.png";
import photoTanShingleAerial from "@assets/image_1777343395382.png";
import photoSilverMetalPorch from "@assets/image_1777343406516.png";
import photoMultiToneTile from "@assets/image_1777343422133.png";
import photoSalmonBarrelTile from "@assets/image_1777343434210.png";
import photoDarkMetalEstate from "@assets/image_1777343458019.png";
import photoTanShingleAerial2 from "@assets/image_1777343468789.png";
import photoFinishedGreyShingle from "@assets/image_1777343477966.png";

export const PHOTOS = {
  beachfrontMetal: photoBeachfrontMetal,
  canalMetalInstall: photoCanalMetalInstall,
  flatTpoCrew: photoFlatTpoCrew,
  tearOff: photoTearOff,
  greyMetalHip: photoGreyMetalHip,
  terracottaWaterfront: photoTerracottaWaterfront,
  redMetalAccent: photoRedMetalAccent,
  shingleInstallTopdown: photoShingleInstallTopdown,
  lightGreyMetalLanai: photoLightGreyMetalLanai,
  flatPrepRedLine: photoFlatPrepRedLine,
  whiteStandingSeam: photoWhiteStandingSeam,
  darkMetalAerial: photoDarkMetalAerial,
  silverMetalPoolCage: photoSilverMetalPoolCage,
  tanShingleAerial: photoTanShingleAerial,
  silverMetalPorch: photoSilverMetalPorch,
  multiToneTile: photoMultiToneTile,
  salmonBarrelTile: photoSalmonBarrelTile,
  darkMetalEstate: photoDarkMetalEstate,
  tanShingleAerial2: photoTanShingleAerial2,
  finishedGreyShingle: photoFinishedGreyShingle,
} as const;

export const SITE = {
  brand: "CHS Roofing",
  legalName: "Cordova Home Services LLC",
  tagline: "Cordova Home Services",
  city: "Cape Coral, FL",
  region: "Southwest Florida",
  license: "#CCC1333902",
  phoneDisplay: "(239) XXX-XXXX",
  phoneTel: "+12390000000",
  email: "info@chs-roofing.com",
  hours: "Mon – Fri: 8am – 5pm · Weekend emergency service",
  established: "2010",
  logo: chsLogo,
};

export const TEAM = [
  {
    name: "Owner Family",
    role: "The Cordova Family",
    bio: "Family-owned and family-run. We treat every home we work on the way we'd want our own treated — with care, honesty, and craftsmanship.",
    image: teamFamily,
  },
  {
    name: "Saul",
    role: "Field Lead",
    bio: "On-site every day making sure each install meets the CHS standard. Bilingual and customer-focused.",
    image: teamSaul,
  },
  {
    name: "Gustavo",
    role: "Owner & Master Roofer",
    bio: "Founder of CHS Roofing with 15+ years of hands-on roofing experience across Southwest Florida. Personally walks every project.",
    image: teamGustavo,
  },
  {
    name: "Daniel",
    role: "Roofing Specialist",
    bio: "Detail-driven installer trained on shingle, metal, and tile systems. Quality clean-up and finish work are his trademark.",
    image: teamDaniel,
  },
  {
    name: "Roberto",
    role: "Crew Foreman",
    bio: "Leads our installation crews with safety, speed, and quality top of mind. Every job he runs gets done right.",
    image: teamRoberto,
  },
] as const;

export const SERVICES = [
  {
    slug: "installation",
    title: "New Roof Installation",
    short: "Full residential and commercial roof installations built for SWFL.",
    href: "/services/installation",
  },
  {
    slug: "repair",
    title: "Roof Repair",
    short: "Fast, honest repair work — leaks, flashing, missing shingles, and more.",
    href: "/services/repair",
  },
  {
    slug: "maintenance",
    title: "Roof Maintenance",
    short: "Annual inspections and preventative care to extend your roof's life.",
    href: "/services/maintenance",
  },
  {
    slug: "storm-damage",
    title: "Storm Damage Restoration",
    short: "Emergency tarping, inspections, and full hurricane-damage restoration.",
    href: "/services/storm-damage",
  },
  {
    slug: "specialty-roofing",
    title: "Specialty Roofing",
    short: "Skylights, custom flashing, chimney caps, and unique architectural roofs.",
    href: "/services/specialty-roofing",
  },
  {
    slug: "gutters",
    title: "Gutters",
    short: "Seamless aluminum gutters, downspouts, and gutter guards installed to spec.",
    href: "/services/gutters",
  },
  {
    slug: "roof-coating",
    title: "Roof Coating & Restoration",
    short: "Reflective coating systems that extend roof life and lower energy bills.",
    href: "/services/roof-coating",
  },
] as const;

export const MAINTENANCE_PLANS = [
  {
    slug: "basic",
    name: "Basic Plan",
    tagline: "Annual Protection",
    desc: "Annual inspection and maintenance to catch early issues and extend the life of the roof.",
    image: photoGreyMetalHip,
    highlights: [
      "1 full roof inspection per year",
      "Photo report with recommendations",
      "Sealant and flashing check",
      "Priority repair scheduling",
    ],
  },
  {
    slug: "pro",
    name: "Pro Plan",
    tagline: "Seasonal Protection",
    desc: "Multiple inspections per year with preventative maintenance to keep the roof performing year-round.",
    image: photoLightGreyMetalLanai,
    highlights: [
      "Pre- and post-hurricane-season inspections",
      "Preventative sealant & boot service",
      "Debris and gutter-line clearing",
      "Photo report after each visit",
    ],
  },
  {
    slug: "premium",
    name: "Premium Plan",
    tagline: "Full Protection",
    desc: "Complete maintenance coverage including priority service, detailed inspections, and ongoing protection.",
    image: photoBeachfrontMetal,
    highlights: [
      "Quarterly detailed roof inspections",
      "Priority emergency response",
      "Proactive boot, flashing & sealant replacement",
      "Annual condition report and lifespan forecast",
    ],
  },
] as const;

export const MAINTENANCE_STEPS = [
  "Full roof inspection",
  "Leak and damage inspection",
  "Preventative maintenance",
  "Photo report with recommendations",
  "Ongoing protection plan",
] as const;

export const MATERIALS = [
  {
    slug: "asphalt-shingles",
    title: "Asphalt Shingles",
    short: "Affordable, durable, available in dozens of colors and styles.",
    href: "/materials/asphalt-shingles",
    image: photoFinishedGreyShingle,
    lifespan: "25–30 years",
    manufacturers: ["GAF", "TAMKO"],
  },
  {
    slug: "metal",
    title: "Metal Roofing",
    short: "Standing-seam metal — the gold standard for hurricane resistance.",
    href: "/materials/metal",
    image: photoWhiteStandingSeam,
    lifespan: "50+ years",
    manufacturers: ["Metal Alliance", "ABC Supply"],
  },
  {
    slug: "tile",
    title: "Tile Roofing",
    short: "Concrete and clay tile — Southwest Florida's classic look.",
    href: "/materials/tile",
    image: photoMultiToneTile,
    lifespan: "50+ years",
    manufacturers: ["Westlake Royal Roofing"],
  },
  {
    slug: "flat",
    title: "Flat & TPO Roofing",
    short: "Energy-efficient flat systems for commercial and modern homes.",
    href: "/materials/flat",
    image: photoFlatTpoCrew,
    lifespan: "20–30 years",
    manufacturers: ["Carlisle", "GAF"],
  },
] as const;

export const PARTNERS = [
  { name: "Carlisle", url: "https://www.carlislesyntec.com/" },
  { name: "GAF", url: "https://www.gaf.com/en-us/residential" },
  { name: "Metal Alliance", url: "https://www.metalalliance.com/" },
  { name: "ABC Supply", url: "https://www.abcsupply.com/" },
  { name: "TAMKO", url: "https://www.tamko.com/" },
  { name: "TRI Alliance Tile Roofing", url: "https://trialliance.com/" },
  { name: "Westlake Royal Roofing", url: "https://westlakeroyalroofing.com/" },
] as const;

export const TESTIMONIALS = [
  { name: "Melissa L.", date: "Apr 2025", text: "I hired Cordova to replace my roof. I dealt directly with Gustavo, he was great. He really worked with me and went out of his way to help me & answer all my questions. His crew did an awesome job!" },
  { name: "Angela", date: "Jan 2025", text: "Definitely a 5 star! Excellent contractor for all your roof needs. Fast, efficient, excellent customer service, quality materials, responds to calls and questions in a timely manner, always on top of things, and no problems with clean up." },
  { name: "Karen", date: "Apr 2025", text: "Just had my roof done by Cordova after hurricane damage. They were so easy to work with. The job was completed so quickly and done well. The site was left clean. I couldn't have asked for better." },
  { name: "Brian", date: "Apr 2025", text: "Cordova was the only one who showed up on time as promised and delivered an actual quote on their first visit. They've been excellent. Resolved issues without complaint or undue expense. I would recommend them to anyone." },
  { name: "Christine", date: "Apr 2025", text: "Needed my roof repaired after the hurricane and CHS was the only one that came out quickly. Punctual, professional and experienced with metal roofs which is hard to find. Highly recommended." },
  { name: "Jennifer", date: "Apr 2025", text: "Highly recommend to anyone needing home services! Very professional, quick, and you can tell they have a lot of experience! Very pleased with the work." },
] as const;

export const GALLERY_RESIDENTIAL = [
  { src: photoBeachfrontMetal, alt: "Standing-seam metal roof on a beachfront home", label: "Sanibel" },
  { src: photoWhiteStandingSeam, alt: "White standing-seam metal roof on a waterfront residence", label: "Cape Coral" },
  { src: photoGreyMetalHip, alt: "Clean grey metal hip roof on a single-family home", label: "Fort Myers" },
  { src: photoLightGreyMetalLanai, alt: "Modern light-grey metal roof with screened lanai", label: "Cape Coral" },
  { src: photoSilverMetalPoolCage, alt: "Silver metal roof with pool cage on a canal home", label: "Punta Gorda" },
  { src: photoTerracottaWaterfront, alt: "Terracotta tile roof on a waterfront residence", label: "Naples" },
  { src: photoMultiToneTile, alt: "Multi-tone concrete tile roof aerial view", label: "Bonita Springs" },
  { src: photoSalmonBarrelTile, alt: "Salmon barrel-tile roof installation", label: "Estero" },
  { src: photoTanShingleAerial, alt: "Tan asphalt shingle roof aerial view", label: "Lehigh Acres" },
  { src: photoTanShingleAerial2, alt: "Tan and brown asphalt shingle roof aerial", label: "Cape Coral" },
  { src: photoRedMetalAccent, alt: "Bold red metal accent roof — specialty install", label: "Fort Myers" },
  { src: photoSilverMetalPorch, alt: "Silver metal roof upgrade with covered porch", label: "North Port" },
  { src: photoDarkMetalEstate, alt: "Dark metal roof on an estate surrounded by mature oaks", label: "Sarasota" },
] as const;

export const GALLERY_COMMERCIAL = [
  { src: photoFlatTpoCrew, alt: "CHS crew installing TPO membrane on a commercial flat roof", label: "Cape Coral" },
  { src: photoFlatPrepRedLine, alt: "Large commercial flat-roof prep with marked boundary line", label: "Fort Myers" },
  { src: photoCanalMetalInstall, alt: "Modern dark metal roof mid-install on a canal-front commercial property", label: "Naples" },
] as const;

// TODO: Replace placeholder images with real multifamily project photos when available.
export const GALLERY_MULTIFAMILY = [
  { src: photoFlatTpoCrew, alt: "Multifamily flat roof system on a Cape Coral condo complex", label: "Cape Coral · Condos" },
  { src: photoTanShingleAerial, alt: "Aerial of a re-roofed apartment community in Fort Myers", label: "Fort Myers · Apartments" },
  { src: photoTanShingleAerial2, alt: "Two-tone shingle re-roof across a multi-building condo", label: "Naples · Condos" },
  { src: photoCanalMetalInstall, alt: "Standing-seam metal roof on a multifamily waterfront property", label: "Bonita Springs · Apartments" },
  { src: photoFlatPrepRedLine, alt: "Commercial flat-roof prep on a multifamily building", label: "Estero · Condos" },
  { src: photoDarkMetalEstate, alt: "Estate-scale roofing project across multiple buildings", label: "Sarasota · Apartments" },
] as const;
