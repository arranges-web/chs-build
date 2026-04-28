import chsLogo from "@assets/chs_logo_1776908189982.png";
import teamFamily from "@assets/image_1776908317416.png";
import teamSaul from "@assets/image_1776908337861.png";
import teamGustavo from "@assets/image_1776908399820.png";
import teamDaniel from "@assets/image_1776908406154.png";
import teamRoberto from "@assets/image_1776908417253.png";

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
    short: "Skylights, custom flashing, copper details, and unique architectural roofs.",
    href: "/services/specialty-roofing",
  },
] as const;

export const MATERIALS = [
  {
    slug: "asphalt-shingles",
    title: "Asphalt Shingles",
    short: "Affordable, durable, available in dozens of colors and styles.",
    href: "/materials/asphalt-shingles",
    image: "/images/hero-roof.png",
    lifespan: "25–30 years",
    manufacturers: ["GAF", "TAMKO", "Owens Corning"],
  },
  {
    slug: "metal",
    title: "Metal Roofing",
    short: "Standing-seam metal — the gold standard for hurricane resistance.",
    href: "/materials/metal",
    image: "/images/metal-roof.png",
    lifespan: "50+ years",
    manufacturers: ["Metal Alliance", "ABC Supply"],
  },
  {
    slug: "tile",
    title: "Tile Roofing",
    short: "Concrete and clay tile — Southwest Florida's classic look.",
    href: "/materials/tile",
    image: "/images/tile-roof.png",
    lifespan: "50+ years",
    manufacturers: ["Westlake Royal Roofing"],
  },
  {
    slug: "flat",
    title: "Flat & TPO Roofing",
    short: "Energy-efficient flat systems for commercial and modern homes.",
    href: "/materials/flat",
    image: "/images/flat-roof.png",
    lifespan: "20–30 years",
    manufacturers: ["Carlisle", "GAF"],
  },
] as const;

export const PARTNERS = [
  { name: "Carlisle", url: "https://www.carlislesyntec.com/" },
  { name: "GAF", url: "https://www.gaf.com/en-us/residential" },
  { name: "Metal Alliance", url: "https://www.metalalliance.com/" },
  { name: "ABC Supply", url: "https://www.abcsupply.com/" },
  { name: "Owens Corning", url: "https://www.owenscorning.com/" },
  { name: "TAMKO", url: "https://www.tamko.com/" },
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
  { src: "/images/hero-roof.png", alt: "Architectural shingle roof, Cape Coral", label: "Cape Coral" },
  { src: "/images/metal-roof.png", alt: "Standing-seam metal roof, Fort Myers", label: "Fort Myers" },
  { src: "/images/tile-roof.png", alt: "Concrete tile roof, Naples", label: "Naples" },
  { src: "/images/after-shingle.png", alt: "Replacement shingle install", label: "Bonita Springs" },
  { src: "/images/after-storm.png", alt: "Hurricane restoration", label: "Lehigh Acres" },
  { src: "/images/after-metal.png", alt: "Metal upgrade install", label: "Estero" },
] as const;

export const GALLERY_COMMERCIAL = [
  { src: "/images/flat-roof.png", alt: "Commercial flat TPO install", label: "Cape Coral" },
  { src: "/images/before-flat.png", alt: "Commercial flat re-roof prep", label: "Fort Myers" },
  { src: "/images/after-metal.png", alt: "Commercial metal retrofit", label: "Naples" },
  { src: "/images/metal-roof.png", alt: "Industrial metal roof system", label: "Punta Gorda" },
] as const;
