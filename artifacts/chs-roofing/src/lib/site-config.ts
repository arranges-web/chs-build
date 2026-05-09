import chsLogo from "@assets/chs_logo_1776908189982.png";
import teamFamily from "@assets/image_1776908317416.png";
import teamSaul from "@assets/image_1776908337861.png";
import teamGustavo from "@assets/image_1776908399820.png";
import teamDaniel from "@assets/image_1776908406154.png";
import teamRoberto from "@assets/image_1776908417253.png";
import teamMaria from "@assets/team_maria.png";
import teamAmado from "@assets/team_amado.png";

import tamkoLogo from "@assets/tamko_logo.jpg";
import triAllianceLogo from "@assets/tri_alliance_2024.webp";

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

// Real repair before/after photos
import repairCricketBefore from "@assets/cricket_before__1778360839718.jpg";
import repairCricketAfter from "@assets/cricket_after__1778360839718.jpg";
import repairDeadValleyBefore from "@assets/dead_valley_repair_shingles_before__1778360839719.jpg";
import repairDeadValleyAfter from "@assets/dead_valley_repair_shingles_after__1778360839718.jpg";
import repairFasciaAfter from "@assets/Fascia_repair_after__1778360839719.jpg";
import repairShingleBefore from "@assets/shingle_repair_before__1778360839719.png";
import repairShingleAfter from "@assets/shingle_repair_after__1778360839719.png";
import repairShingleValleyBefore from "@assets/Shingle_valley_repair_before__1778360839720.jpg";
import repairShingleValleyAfter from "@assets/Shingle_valley_repair_after__1778360839719.jpg";
import repairTileBefore from "@assets/Tile_repair_before__1778360839720.jpg";
import repairTileAfter from "@assets/tile_repair_after__1778360839720.jpg";
import gutter1 from "@assets/gutter_1.png";
import gutter2 from "@assets/gutter_2.png";
import gutter3 from "@assets/gutter_3.png";
import gutter4 from "@assets/gutter_4.png";
import gutter5 from "@assets/gutter_5.png";
import gutter6 from "@assets/gutter_6.png";
import coatingHero from "@assets/coating_hero.png";
import coating1 from "@assets/coating_1.png";
import coating2 from "@assets/coating_2.png";
import coating3 from "@assets/coating_3.png";
import coating4 from "@assets/coating_4.png";
import coating5 from "@assets/coating_5.png";
import metalStandingSeamPhoto from "@assets/metal_standing_seam.png";
import metal5VPhoto from "@assets/metal_5v.png";
import tileTreasureCayPhoto from "@assets/tile_treasurecay.png";
import flat1 from "@assets/DJI_0634_1778361272891.JPG";
import flat2 from "@assets/DJI_0635_1778361272891.JPG";
import flat3 from "@assets/DJI_0640_1778361272891.JPG";
import flat4 from "@assets/DJI_0821_1778361272891.JPG";
import commercialTpoDowntown1 from "@assets/DJI_0274_1778361272890.JPG";
import commercialTpoDowntown2 from "@assets/DJI_0280_1778361272890.JPG";
import commercialRetailTpo from "@assets/DJI_0367_1778361272890.JPG";
import commercialLuxuryFlat from "@assets/DJI_0822_1778361272891.JPG";
import multifamily1 from "@assets/DJI_0165_1778361118012.JPG";
import multifamily2 from "@assets/DJI_0168_1778361118012.JPG";
import multifamily3 from "@assets/DJI_0172_1778361118012.JPG";
import multifamily4 from "@assets/DJI_0203_1778361118013.JPG";
import multifamily5 from "@assets/harbor_walk_binder__Page_06_1778361125130.jpg";
import multifamily6 from "@assets/harbor_walk_binder__Page_12_1778361125130.jpg";
import baBefore1 from "@assets/ba_1_before.png";
import baAfter1 from "@assets/ba_1_after.png";
import baBefore2 from "@assets/ba_2_before.png";
import baAfter2 from "@assets/ba_2_after.png";
import baBefore3 from "@assets/ba_3_before.png";
import baAfter3 from "@assets/ba_3_after.png";

export const REPAIR_PAIRS = [
  { before: repairCricketBefore,      after: repairCricketAfter,      label: "Cricket repair" },
  { before: repairDeadValleyBefore,   after: repairDeadValleyAfter,   label: "Dead-valley shingle repair" },
  { before: null,                     after: repairFasciaAfter,       label: "Fascia repair" },
  { before: repairShingleBefore,      after: repairShingleAfter,      label: "Shingle replacement" },
  { before: repairShingleValleyBefore,after: repairShingleValleyAfter,label: "Shingle valley repair" },
  { before: repairTileBefore,         after: repairTileAfter,         label: "Tile repair" },
] as const;

export const FOUNDER_PHOTOS = {
  repair: [
    repairCricketAfter,
    repairDeadValleyAfter,
    repairFasciaAfter,
    repairShingleAfter,
    repairShingleValleyAfter,
    repairTileAfter,
  ] as const,
  gutter: [gutter1, gutter2, gutter3, gutter4, gutter5, gutter6] as const,
  coatingHero,
  coating: [coating1, coating2, coating3, coating4, coating5] as const,
  metalStandingSeam: metalStandingSeamPhoto,
  metal5V: metal5VPhoto,
  tileTreasureCay: tileTreasureCayPhoto,
  flat: [flat1, flat2, flat3, flat4] as const,
  multifamily: [multifamily1, multifamily2, multifamily3, multifamily4, multifamily5, multifamily6] as const,
  beforeAfter: [
    { before: baBefore1, after: baAfter1 },
    { before: baBefore2, after: baAfter2 },
    { before: baBefore3, after: baAfter3 },
  ] as const,
};

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
  phoneDisplay: "(239) 737-1758",
  phoneTel: "+12397371758",
  email: "info@chs-roofing.com",
  hours: "Mon – Fri: 8am – 5pm · Weekend emergency service",
  established: "2010",
  logo: chsLogo,
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61567718997385",
    instagram: "https://www.instagram.com/cordova_home_services/",
    google: "https://g.page/r/CYyChCOA5U9MEAE/review",
  },
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
    image: teamGustavo,
  },
  {
    name: "Gustavo",
    role: "Owner & Master Roofer",
    bio: "Founder of CHS Roofing with 15+ years of hands-on roofing experience across Southwest Florida. Personally walks every project.",
    image: teamSaul,
  },
  {
    name: "Maria",
    role: "Owner & Operations",
    bio: "Co-owner of CHS Roofing leading client experience, scheduling, and project communication. Bilingual and committed to making every CHS interaction effortless.",
    image: teamMaria,
  },
  {
    name: "Daniel",
    role: "Roofing Specialist",
    bio: "Detail-driven installer trained on shingle, metal, and tile systems. Quality clean-up and finish work are his trademark.",
    image: teamDaniel,
  },
  {
    name: "Roberto",
    role: "Project Manager",
    bio: "Coordinates schedules, materials, and on-site teams so every project lands on time, on budget, and to spec.",
    image: teamRoberto,
  },
  {
    name: "Amado",
    role: "Crew Foreman",
    bio: "Leads our installation crews with safety, speed, and quality top of mind. Every job he runs gets done right.",
    image: teamAmado,
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

// Pricing per "square" (100 sq ft of roof area). Source: CHS Roofing founder.
// Used by the Estimator page to produce a rough budget figure only.
export const ESTIMATOR_MATERIALS = [
  {
    slug: "shingle",
    label: "GAF Shingle Roof",
    pricePerSquare: 460,
    colorOptionAvailable: false,
    short: "Premium GAF asphalt shingle system.",
  },
  {
    slug: "metal-standing-seam",
    label: "Metal Standing Seam",
    pricePerSquare: 775,
    colorOptionAvailable: true,
    colorAdderPerSquare: 150,
    short: "Hurricane-rated standing seam metal roof.",
  },
  {
    slug: "metal-5v",
    label: "Metal 5V",
    pricePerSquare: 665,
    colorOptionAvailable: true,
    colorAdderPerSquare: 150,
    short: "Classic 5V exposed-fastener metal roof.",
  },
  {
    slug: "tile-on-tile",
    label: "Tile Off / Tile On",
    pricePerSquare: 1000,
    colorOptionAvailable: false,
    short: "Tear off existing tile and install new tile.",
  },
  {
    slug: "tile-to-standing-seam",
    label: "Tile Off / Standing Seam (with color)",
    pricePerSquare: 1100,
    colorOptionAvailable: false,
    short: "Tear off existing tile, install standing seam metal in your color.",
  },
] as const;

export const ESTIMATOR_PITCH_OPTIONS = [
  { slug: "low", label: "Low slope (≤4/12)", multiplier: 1.05 },
  { slug: "standard", label: "Standard (5/12 – 7/12)", multiplier: 1.12 },
  { slug: "steep", label: "Steep (8/12 – 12/12)", multiplier: 1.2 },
  { slug: "very-steep", label: "Very steep (>12/12)", multiplier: 1.3 },
] as const;

export const ESTIMATOR_COMPLEXITY_OPTIONS = [
  { slug: "simple", label: "Simple (single ridge, few penetrations)", multiplier: 1.0 },
  { slug: "moderate", label: "Moderate (multiple hips & valleys)", multiplier: 1.06 },
  { slug: "complex", label: "Complex (cut-up roof, dormers, skylights)", multiplier: 1.12 },
] as const;

export const ESTIMATOR_WASTE_OPTIONS = [
  { slug: "low", label: "10%", value: 0.1 },
  { slug: "standard", label: "15% (recommended)", value: 0.15 },
  { slug: "high", label: "20%", value: 0.2 },
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

export const PARTNERS: Array<{ name: string; url: string; logo?: string; logoAlt?: string }> = [
  { name: "Carlisle", url: "https://www.carlislesyntec.com/" },
  { name: "GAF", url: "https://www.gaf.com/en-us/residential" },
  { name: "Metal Alliance", url: "https://www.metalalliance.com/" },
  { name: "ABC Supply", url: "https://www.abcsupply.com/" },
  { name: "TAMKO", url: "https://www.tamko.com/", logo: tamkoLogo, logoAlt: "TAMKO Building Products LLC" },
  { name: "TRI Alliance Tile Roofing", url: "https://trialliance.com/", logo: triAllianceLogo, logoAlt: "Tile Roofing Industry Alliance — Main Manual Certification 2024" },
  { name: "Westlake Royal Roofing", url: "https://westlakeroyalroofing.com/" },
];

// Real Google reviews. Anonymous reviewers attributed as "Verified Google
// Review" — fictional names are never used (ad-policy and trust hygiene).
export const TESTIMONIALS = [
  {
    name: "Leanet García Díaz",
    date: "Nov 2025",
    text: "The CHS team did an amazing job replacing my roof. Great service and quality work! The team was professional, fast, and left everything clean. Highly recommend!",
  },
  {
    name: "Christine Castellano",
    date: "Apr 2025",
    text: "Needed my roof repaired after the hurricane and CHS was the only one that came out quickly. Got a quote for the work and they were working the next day. Punctual, professional and experienced with metal roofs which is hard to find. Highly recommended.",
  },
  {
    name: "Rudy Schoenbohm",
    date: "May 2025",
    text: "Melissa with Cordova Home Services is one of the best business people we ever met. Honest, reliable and competent. Gustavo is the highly engaged, skilled president of the company, super-nice guy who's doing everything to keep promises and provide the highest quality standards. We can only recommend CHS.",
  },
  {
    name: "Jude B.",
    date: "Dec 2025",
    text: "They did a great job on replacing my roof — and I was impressed on how they cleaned up afterwards.",
  },
  {
    name: "Verified Google Review",
    date: "2025",
    text: "Gustavo definitely helped us in a difficult situation to get our roof done after the company we were working with started the job and then left us hanging with just a partial dried in, but not enough to get an inspection. He knew what to do and helped us get a fair price to finish the job and all inspections done. Now we can go into hurricane season confident that our roof will keep us dry. Would definitely recommend them for anyone looking for a roofing contractor.",
  },
  {
    name: "Verified Google Review",
    date: "2025",
    text: "I had an excellent experience with Cordova Home Services LLC. Their team was professional, knowledgeable, and completed the roofing project on time with outstanding quality. They communicated clearly throughout the entire process and made sure every detail was perfect. It's rare to find a company that combines great craftsmanship with exceptional customer service — I highly recommend them to anyone needing roofing work!",
  },
  {
    name: "Verified Google Review",
    date: "2025",
    text: "Cordova replaced broken tiles and sealed stucco cracks on our house. The job was done well, they came as promised, and the price was reasonable.",
  },
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
  { src: commercialTpoDowntown2, alt: "CHS crew installing white TPO on multi-story downtown new construction", label: "Fort Myers · New Construction" },
  { src: commercialTpoDowntown1, alt: "Completed white TPO flat roof on downtown commercial building", label: "Fort Myers · Completed" },
  { src: commercialRetailTpo, alt: "CHS crew laying TPO membrane on a commercial retail building", label: "Naples · Retail" },
  { src: commercialLuxuryFlat, alt: "Angled aerial of white TPO flat roof on luxury residential new build", label: "Naples · Luxury Residential" },
  { src: flat1, alt: "CHS crew finishing TPO edge trim on commercial flat roof", label: "Cape Coral · TPO" },
  { src: flat2, alt: "Aerial of full TPO flat roof installation on commercial building", label: "Cape Coral · TPO" },
  { src: flat3, alt: "CHS crew installing Polyglass underlayment on commercial flat roof edge", label: "Cape Coral · TPO" },
  { src: flat4, alt: "Top-down aerial of completed white TPO flat roof on luxury new-build", label: "Naples · New Construction" },
  { src: baBefore1, alt: "Commercial flat roof before restoration", label: "Before · Restoration" },
  { src: baAfter1, alt: "Commercial flat roof after coating restoration", label: "After · Restoration" },
] as const;

export const GALLERY_MULTIFAMILY = [
  { src: multifamily1, alt: "Aerial of full condo community mid re-roof — Cape Coral", label: "Cape Coral · Condo Community" },
  { src: multifamily2, alt: "Red standing-seam metal panels staged during condo re-roof", label: "Cape Coral · In Progress" },
  { src: multifamily3, alt: "Completed red standing-seam metal roofs across condo complex", label: "Cape Coral · Completed" },
  { src: multifamily4, alt: "CHS crew installing sage-green metal roof on waterfront high-rise", label: "Fort Myers · Harbor Walk" },
  { src: multifamily5, alt: "Completed sage-green standing-seam metal roofs at Harbor Walk waterfront condos", label: "Fort Myers · Harbor Walk" },
  { src: multifamily6, alt: "Top-down aerial of finished green metal roof at Harbor Walk — river views", label: "Fort Myers · Harbor Walk" },
] as const;
