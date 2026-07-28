import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

// ─── Asset imports (PNG/JPG only — react-pdf does not support WebP) ──────────
import logoSrc from "@assets/chs_logo_1776908189982.png";
import coverImgSrc from "@assets/image_1777343365657.png";
import aboutImgSrc from "@assets/image_1776908317416.png";
import shingleImgSrc from "@assets/image_1777343477966.png";
import metalImgSrc from "@assets/image_1777343356321.png";
import tileImgSrc from "@assets/image_1777343422133.png";
import flatImgSrc from "@assets/DJI_0822_1778361272891.JPG";
import gallery1Src from "@assets/image_1777343219176.png";
import gallery2Src from "@assets/image_1777343276383.png";
import gallery3Src from "@assets/DJI_0425_1778361491435.JPG";
import gallery4Src from "@assets/image_1777343288382.png";
import gallery5Src from "@assets/image_1777343230206.png";
import gallery6Src from "@assets/image_1777343434210.png";
import teamGustavoSrc from "@assets/image_1776908399820.png";
import teamSaulSrc from "@assets/image_1776908337861.png";
import teamMariaSrc from "@assets/team_maria.png";
import teamDanielSrc from "@assets/image_1776908406154.png";
import teamRobertoSrc from "@assets/image_1776908417253.png";
import teamAmadoSrc from "@assets/team_amado.png";

// ─── Fonts ────────────────────────────────────────────────────────────────────
// Use built-in PDF fonts — no external fetch, no format compatibility issues.
// "Helvetica-Bold" → headings (replaces Oswald)
// "Helvetica"      → body copy (replaces Inter)

// ─── Design tokens ───────────────────────────────────────────────────────────
const RED = "#C5172A";
const NAVY = "#162033";
const NAVY_LIGHT = "#1E2D47";
const WHITE = "#FFFFFF";
const OFF_WHITE = "#F7F8FA";
const GRAY_100 = "#F0F2F5";
const GRAY_300 = "#D1D5DB";
const GRAY_500 = "#6B7280";
const GRAY_700 = "#374151";
const TEXT = "#1C2340";

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  // Page
  page: { backgroundColor: WHITE, fontFamily: "Helvetica", color: TEXT },
  pageDark: { backgroundColor: NAVY, fontFamily: "Helvetica", color: WHITE },

  // Common layout
  content: { flex: 1, paddingHorizontal: 40, paddingVertical: 32 },
  contentDark: { flex: 1, paddingHorizontal: 40, paddingVertical: 32 },
  row: { flexDirection: "row" },
  col: { flexDirection: "column" },

  // Page header/footer
  pageHeader: {
    paddingHorizontal: 40,
    paddingTop: 20,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: GRAY_300,
  },
  pageHeaderDark: {
    paddingHorizontal: 40,
    paddingTop: 20,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#2A3F5F",
  },
  pageHeaderLogo: { width: 32, height: 32, objectFit: "contain" },
  pageHeaderBrand: { fontFamily: "Helvetica-Bold", fontWeight: 700, fontSize: 12, letterSpacing: 1.5, color: GRAY_500 },
  pageHeaderBrandDark: { fontFamily: "Helvetica-Bold", fontWeight: 700, fontSize: 12, letterSpacing: 1.5, color: "#8899B4" },

  pageFooter: {
    paddingHorizontal: 40,
    paddingBottom: 18,
    paddingTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: GRAY_300,
  },
  pageFooterDark: {
    paddingHorizontal: 40,
    paddingBottom: 18,
    paddingTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#2A3F5F",
  },
  pageFooterText: { fontSize: 8, color: GRAY_500 },
  pageFooterTextDark: { fontSize: 8, color: "#6B7A99" },
  pageNum: { fontSize: 8, color: GRAY_500 },
  pageNumDark: { fontSize: 8, color: "#6B7A99" },

  // Section headings
  eyebrow: {
    fontFamily: "Helvetica-Bold",
    fontWeight: 400,
    fontSize: 9,
    letterSpacing: 2.5,
    color: RED,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  eyebrowDark: {
    fontFamily: "Helvetica-Bold",
    fontWeight: 400,
    fontSize: 9,
    letterSpacing: 2.5,
    color: "#E8768D",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontWeight: 700,
    fontSize: 28,
    color: TEXT,
    letterSpacing: 0.5,
    lineHeight: 1.15,
    marginBottom: 6,
  },
  sectionTitleDark: {
    fontFamily: "Helvetica-Bold",
    fontWeight: 700,
    fontSize: 28,
    color: WHITE,
    letterSpacing: 0.5,
    lineHeight: 1.15,
    marginBottom: 6,
  },
  sectionRule: {
    width: 40,
    height: 3,
    backgroundColor: RED,
    marginBottom: 18,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: GRAY_500,
    lineHeight: 1.6,
    marginBottom: 20,
  },

  // Body text
  bodyLg: { fontSize: 11, lineHeight: 1.7, color: GRAY_700 },
  bodyMd: { fontSize: 10, lineHeight: 1.65, color: GRAY_700 },
  bodySm: { fontSize: 9, lineHeight: 1.6, color: GRAY_500 },
  bodySmDark: { fontSize: 9, lineHeight: 1.6, color: "#8899B4" },
  bodyWhite: { fontSize: 10, lineHeight: 1.65, color: WHITE },
  caption: { fontSize: 8, color: GRAY_500, marginTop: 4 },
  captionDark: { fontSize: 8, color: "#6B7A99", marginTop: 4 },

  // Cards / boxes
  card: {
    backgroundColor: GRAY_100,
    borderRadius: 6,
    padding: 14,
  },
  cardDark: {
    backgroundColor: "#1E2D47",
    borderRadius: 6,
    padding: 14,
    borderWidth: 1,
    borderColor: "#2A3F5F",
  },
  redAccent: {
    width: 4,
    height: "100%",
    backgroundColor: RED,
    borderRadius: 2,
    marginRight: 10,
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: RED,
    marginTop: 3,
    marginRight: 8,
    flexShrink: 0,
  },
  badge: {
    backgroundColor: RED,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  badgeText: {
    fontFamily: "Helvetica-Bold",
    fontWeight: 700,
    fontSize: 8,
    letterSpacing: 1,
    color: WHITE,
    textTransform: "uppercase",
  },
  badgeGray: {
    backgroundColor: GRAY_300,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  badgeGrayText: {
    fontFamily: "Helvetica-Bold",
    fontWeight: 700,
    fontSize: 8,
    letterSpacing: 1,
    color: GRAY_700,
    textTransform: "uppercase",
  },
});

// ─── Reusable page chrome ─────────────────────────────────────────────────────
function PageHeader({ dark = false }: { dark?: boolean }) {
  return (
    <View style={dark ? s.pageHeaderDark : s.pageHeader}>
      <Image src={logoSrc} style={s.pageHeaderLogo} />
      <Text style={dark ? s.pageHeaderBrandDark : s.pageHeaderBrand}>
        CHS ROOFING · COMPANY GUIDE
      </Text>
    </View>
  );
}

function PageFooter({
  pageNum,
  dark = false,
}: {
  pageNum: number;
  dark?: boolean;
}) {
  return (
    <View style={dark ? s.pageFooterDark : s.pageFooter}>
      <Text style={dark ? s.pageFooterTextDark : s.pageFooterText}>
        Cordova Home Services LLC · Lic. #CCC1333902 · (239) 737-1758
      </Text>
      <Text style={dark ? s.pageNumDark : s.pageNum}>{pageNum} of 8</Text>
    </View>
  );
}

// ─── Page 1 — Cover ───────────────────────────────────────────────────────────
function CoverPage() {
  return (
    <Page size="LETTER" style={s.pageDark}>
      {/* Top logo strip */}
      <View
        style={{
          paddingHorizontal: 44,
          paddingTop: 32,
          paddingBottom: 24,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Image src={logoSrc} style={{ width: 52, height: 52, objectFit: "contain" }} />
        <View>
          <Text
            style={{
              fontFamily: "Helvetica-Bold",
              fontWeight: 700,
              fontSize: 22,
              color: WHITE,
              letterSpacing: 2,
            }}
          >
            CHS ROOFING
          </Text>
          <Text
            style={{
              fontSize: 9,
              color: "#8899B4",
              letterSpacing: 2,
              marginTop: 2,
            }}
          >
            CORDOVA HOME SERVICES
          </Text>
        </View>
      </View>

      {/* Hero image */}
      <Image
        src={coverImgSrc}
        style={{
          width: "100%",
          height: 310,
          objectFit: "cover",
          objectPositionY: "center",
        }}
      />

      {/* Red divider */}
      <View style={{ height: 5, backgroundColor: RED }} />

      {/* Text area */}
      <View
        style={{
          flex: 1,
          paddingHorizontal: 44,
          paddingTop: 28,
          paddingBottom: 36,
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text
            style={{
              fontFamily: "Helvetica-Bold",
              fontWeight: 400,
              fontSize: 10,
              letterSpacing: 3,
              color: "#E8768D",
              marginBottom: 8,
            }}
          >
            SOUTHWEST FLORIDA'S TRUSTED ROOFING CONTRACTOR
          </Text>
          <Text
            style={{
              fontFamily: "Helvetica-Bold",
              fontWeight: 700,
              fontSize: 38,
              color: WHITE,
              lineHeight: 1.1,
              letterSpacing: 0.5,
            }}
          >
            YOUR COMPLETE{"\n"}ROOFING GUIDE
          </Text>
          <View
            style={{
              width: 56,
              height: 4,
              backgroundColor: RED,
              marginTop: 14,
              marginBottom: 14,
            }}
          />
          <Text
            style={{
              fontSize: 11,
              color: "#A8B8CF",
              lineHeight: 1.6,
              maxWidth: 380,
            }}
          >
            Everything you need to know about CHS Roofing — our services,
            materials, team, and the customer portal that keeps you connected
            to your project every step of the way.
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 28 }}>
          {[
            { label: "ESTABLISHED", value: "2022" },
            { label: "LICENSE", value: "#CCC1333902" },
            { label: "PHONE", value: "(239) 737-1758" },
            { label: "LOCATION", value: "Cape Coral, FL" },
          ].map((item) => (
            <View key={item.label}>
              <Text
                style={{
                  fontSize: 7,
                  color: "#6B7A99",
                  letterSpacing: 1.5,
                  marginBottom: 3,
                }}
              >
                {item.label}
              </Text>
              <Text
                style={{
                  fontFamily: "Helvetica-Bold",
                  fontWeight: 700,
                  fontSize: 10,
                  color: WHITE,
                  letterSpacing: 0.5,
                }}
              >
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  );
}

// ─── Page 2 — About Us ────────────────────────────────────────────────────────
function AboutPage() {
  return (
    <Page size="LETTER" style={s.page}>
      <PageHeader />
      <View style={s.content}>
        <Text style={s.eyebrow}>About Us</Text>
        <Text style={s.sectionTitle}>Family-Owned.{"\n"}Rooted in Southwest Florida.</Text>
        <View style={s.sectionRule} />

        <View style={{ flexDirection: "row", gap: 24, flex: 1 }}>
          {/* Left: text */}
          <View style={{ flex: 1 }}>
            <Text style={[s.bodyLg, { marginBottom: 14 }]}>
              CHS Roofing — short for Cordova Home Services — was founded in
              2022 by Gustavo and Maria Cordova right here in Cape Coral,
              Florida. What started as a promise to do roofing the right way
              has grown into one of Southwest Florida's most trusted roofing
              crews.
            </Text>
            <Text style={[s.bodyLg, { marginBottom: 14 }]}>
              We're not a large corporation or a storm-chasing out-of-state
              crew. We live here, our kids go to school here, and we're
              invested in this community. That's why we treat every home the
              way we'd want our own treated — with honesty, craftsmanship, and
              the highest quality materials available.
            </Text>
            <Text style={[s.bodyLg, { marginBottom: 20 }]}>
              From a single shingle repair to a full commercial re-roof, every
              CHS job is held to the same standard: done right, on time, and
              cleaned up so you'd never know we were there.
            </Text>

            {/* Stats row */}
            <View
              style={{
                flexDirection: "row",
                gap: 12,
                marginTop: "auto",
              }}
            >
              {[
                { stat: "2022", label: "Founded" },
                { stat: "SWFL", label: "Service area" },
                { stat: "Licensed", label: "#CCC1333902" },
                { stat: "Bilingual", label: "EN / ES" },
              ].map((item) => (
                <View
                  key={item.stat}
                  style={{
                    flex: 1,
                    backgroundColor: GRAY_100,
                    borderRadius: 6,
                    padding: 10,
                    borderTopWidth: 3,
                    borderTopColor: RED,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Helvetica-Bold",
                      fontWeight: 700,
                      fontSize: 14,
                      color: TEXT,
                      marginBottom: 3,
                    }}
                  >
                    {item.stat}
                  </Text>
                  <Text style={{ fontSize: 8, color: GRAY_500 }}>
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Right: photo */}
          <View style={{ width: 190 }}>
            <Image
              src={aboutImgSrc}
              style={{
                width: 190,
                height: 240,
                objectFit: "cover",
                borderRadius: 6,
                marginBottom: 10,
              }}
            />
            <View
              style={{
                backgroundColor: NAVY,
                borderRadius: 6,
                padding: 12,
              }}
            >
              <Text
                style={{
                  fontFamily: "Helvetica-Bold",
                  fontWeight: 700,
                  fontSize: 13,
                  color: WHITE,
                  marginBottom: 4,
                }}
              >
                "We treat every home{"\n"}like it's our own."
              </Text>
              <Text style={{ fontSize: 8, color: "#8899B4" }}>
                — Gustavo & Maria Cordova,{"\n"}Founders, CHS Roofing
              </Text>
            </View>
          </View>
        </View>
      </View>
      <PageFooter pageNum={2} />
    </Page>
  );
}

// ─── Page 3 — Services ────────────────────────────────────────────────────────
const SERVICES_DATA = [
  {
    title: "New Roof Installation",
    desc: "Full residential and commercial roof installations built for Southwest Florida's hurricane season. We work with every major roofing system.",
    icon: "🏠",
  },
  {
    title: "Roof Repair",
    desc: "Fast, honest repair work — leaks, flashing failures, missing shingles, broken tiles, and more. We diagnose the real problem, not just the symptom.",
    icon: "🔧",
  },
  {
    title: "Roof Maintenance",
    desc: "Annual inspection and preventative care plans to extend your roof's life and catch small issues before they become expensive repairs.",
    icon: "🔍",
  },
  {
    title: "Storm Damage Restoration",
    desc: "Emergency tarping, insurance-ready inspections, and full hurricane-damage restoration. We know Southwest Florida storms — we've seen them all.",
    icon: "⛈",
  },
  {
    title: "Specialty Roofing",
    desc: "Skylights, custom flashing, chimney caps, turret roofs, and unusual architectural work that requires precision and experience.",
    icon: "⭐",
  },
  {
    title: "Gutters",
    desc: "Seamless aluminum gutters, downspouts, and gutter guards installed to the right spec for Florida's intense rainfall.",
    icon: "💧",
  },
  {
    title: "Roof Coating & Restoration",
    desc: "Reflective elastomeric coating systems that extend roof life by 10–15 years and significantly reduce cooling costs.",
    icon: "✨",
  },
];

function ServicesPage() {
  const left = SERVICES_DATA.slice(0, 4);
  const right = SERVICES_DATA.slice(4);

  return (
    <Page size="LETTER" style={s.page}>
      <PageHeader />
      <View style={s.content}>
        <Text style={s.eyebrow}>What We Do</Text>
        <Text style={s.sectionTitle}>Our Services</Text>
        <View style={s.sectionRule} />
        <Text style={[s.sectionSubtitle, { marginTop: -8 }]}>
          Every CHS service is backed by a licensed crew, quality materials, and a clean worksite guarantee.
        </Text>

        <View style={{ flexDirection: "row", gap: 16, flex: 1 }}>
          {/* Left column */}
          <View style={{ flex: 1, gap: 10 }}>
            {left.map((svc) => (
              <View
                key={svc.title}
                style={{
                  backgroundColor: GRAY_100,
                  borderRadius: 6,
                  padding: 12,
                  flexDirection: "row",
                  alignItems: "flex-start",
                }}
              >
                <View style={s.redDot} />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "Helvetica",
                      fontWeight: 700,
                      fontSize: 10,
                      color: TEXT,
                      marginBottom: 3,
                    }}
                  >
                    {svc.title}
                  </Text>
                  <Text style={s.bodySm}>{svc.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Right column */}
          <View style={{ flex: 1, gap: 10 }}>
            {right.map((svc) => (
              <View
                key={svc.title}
                style={{
                  backgroundColor: GRAY_100,
                  borderRadius: 6,
                  padding: 12,
                  flexDirection: "row",
                  alignItems: "flex-start",
                }}
              >
                <View style={s.redDot} />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "Helvetica",
                      fontWeight: 700,
                      fontSize: 10,
                      color: TEXT,
                      marginBottom: 3,
                    }}
                  >
                    {svc.title}
                  </Text>
                  <Text style={s.bodySm}>{svc.desc}</Text>
                </View>
              </View>
            ))}
            {/* CTA box */}
            <View
              style={{
                backgroundColor: NAVY,
                borderRadius: 6,
                padding: 14,
                marginTop: 4,
              }}
            >
              <Text
                style={{
                  fontFamily: "Helvetica-Bold",
                  fontWeight: 700,
                  fontSize: 13,
                  color: WHITE,
                  marginBottom: 4,
                }}
              >
                Free Estimates
              </Text>
              <Text style={{ fontSize: 9, color: "#8899B4", lineHeight: 1.5 }}>
                Every CHS quote is free, detailed, and delivered without pressure. Call us or visit{" "}
                <Text style={{ color: "#E8768D" }}>cordovahomeservices.com</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
      <PageFooter pageNum={3} />
    </Page>
  );
}

// ─── Page 4 — Materials ───────────────────────────────────────────────────────
const MATERIALS_DATA = [
  {
    title: "Asphalt Shingles",
    brand: "GAF · TAMKO",
    lifespan: "25–30 years",
    desc: "The most popular roofing system in Florida — affordable, durable, and available in dozens of colors and styles to complement any home.",
    img: shingleImgSrc,
    bestFor: "Residential · Budget-conscious · Quick installation",
  },
  {
    title: "Metal Roofing",
    brand: "Standing Seam & 5V",
    lifespan: "50+ years",
    desc: "The gold standard for hurricane resistance. Standing seam metal offers a modern aesthetic with unmatched wind-uplift performance.",
    img: metalImgSrc,
    bestFor: "Hurricane zones · Long-term investment · Modern homes",
  },
  {
    title: "Concrete & Clay Tile",
    brand: "Westlake Royal Roofing",
    lifespan: "50+ years",
    desc: "Southwest Florida's classic look — terracotta and concrete tile deliver timeless curb appeal with exceptional longevity.",
    img: tileImgSrc,
    bestFor: "Mediterranean homes · High-end residential · Coastal style",
  },
  {
    title: "Flat & TPO Roofing",
    brand: "Carlisle · GAF",
    lifespan: "20–30 years",
    desc: "Single-ply TPO membrane is the commercial standard and increasingly popular in modern residential builds for energy efficiency.",
    img: flatImgSrc,
    bestFor: "Commercial · Low-slope · Energy efficiency",
  },
];

function MaterialsPage() {
  return (
    <Page size="LETTER" style={s.page}>
      <PageHeader />
      <View style={s.content}>
        <Text style={s.eyebrow}>What We Install</Text>
        <Text style={s.sectionTitle}>Roofing Materials</Text>
        <View style={s.sectionRule} />

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          {MATERIALS_DATA.map((mat) => (
            <View
              key={mat.title}
              style={{
                width: "47.5%",
                backgroundColor: WHITE,
                borderRadius: 6,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: GRAY_300,
              }}
            >
              <Image
                src={mat.img}
                style={{ width: "100%", height: 100, objectFit: "cover" }}
              />
              <View style={{ padding: 10 }}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", marginBottom: 3, gap: 6 }}
                >
                  <Text
                    style={{
                      fontFamily: "Helvetica",
                      fontWeight: 700,
                      fontSize: 11,
                      color: TEXT,
                    }}
                  >
                    {mat.title}
                  </Text>
                </View>
                <Text style={{ fontSize: 8, color: RED, marginBottom: 4, fontWeight: 600 }}>
                  {mat.brand}
                </Text>
                <Text style={{ fontSize: 9, color: GRAY_700, lineHeight: 1.55, marginBottom: 8 }}>
                  {mat.desc}
                </Text>
                <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
                  <View
                    style={{
                      backgroundColor: NAVY,
                      borderRadius: 3,
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                    }}
                  >
                    <Text style={{ fontSize: 7, color: WHITE, fontWeight: 700 }}>
                      {mat.lifespan}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 7, color: GRAY_500 }}>{mat.bestFor}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
      <PageFooter pageNum={4} />
    </Page>
  );
}

// ─── Page 5 — Our Work ────────────────────────────────────────────────────────
const GALLERY_DATA = [
  { src: gallery1Src, label: "Beachfront standing-seam metal", loc: "Sanibel" },
  { src: gallery2Src, label: "Grey hip metal roof", loc: "Fort Myers" },
  { src: gallery3Src, label: "School campus re-roof (completed)", loc: "Fort Myers" },
  { src: gallery4Src, label: "Terracotta tile waterfront", loc: "Naples" },
  { src: gallery5Src, label: "Canal-side metal installation", loc: "Cape Coral" },
  { src: gallery6Src, label: "Salmon barrel tile", loc: "Estero" },
];

function GalleryPage() {
  return (
    <Page size="LETTER" style={s.page}>
      <PageHeader />
      <View style={s.content}>
        <Text style={s.eyebrow}>Project Portfolio</Text>
        <Text style={s.sectionTitle}>Our Work</Text>
        <View style={s.sectionRule} />
        <Text style={[s.sectionSubtitle, { marginTop: -8 }]}>
          A sample of residential and commercial projects across Southwest Florida.
        </Text>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
            flex: 1,
          }}
        >
          {GALLERY_DATA.map((photo) => (
            <View key={photo.label} style={{ width: "31%", borderRadius: 6, overflow: "hidden" }}>
              <Image
                src={photo.src}
                style={{ width: "100%", height: 118, objectFit: "cover" }}
              />
              <View
                style={{
                  backgroundColor: NAVY,
                  paddingHorizontal: 8,
                  paddingVertical: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 8,
                    color: WHITE,
                    fontWeight: 600,
                    lineHeight: 1.4,
                  }}
                >
                  {photo.label}
                </Text>
                <Text style={{ fontSize: 7, color: "#8899B4", marginTop: 1 }}>
                  {photo.loc}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View
          style={{
            marginTop: 12,
            padding: 10,
            backgroundColor: GRAY_100,
            borderRadius: 6,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          <View style={{ width: 3, height: 30, backgroundColor: RED, borderRadius: 2, flexShrink: 0 }} />
          <Text style={{ fontSize: 9, color: GRAY_700, lineHeight: 1.6 }}>
            View our full gallery at{" "}
            <Text style={{ color: RED, fontWeight: 700 }}>
              cordovahomeservices.com/gallery
            </Text>{" "}
            — hundreds of completed projects across metal, tile, shingle, flat, commercial, and multifamily roofing.
          </Text>
        </View>
      </View>
      <PageFooter pageNum={5} />
    </Page>
  );
}

// ─── Page 6 — Team ────────────────────────────────────────────────────────────
const TEAM_DATA = [
  { name: "Gustavo", role: "Owner & Master Roofer", bio: "15+ years of hands-on roofing experience. Personally walks every project.", img: teamGustavoSrc },
  { name: "Maria", role: "Owner & Operations", bio: "Co-founder leading client experience and project communication. Bilingual.", img: teamMariaSrc },
  { name: "Saul", role: "Field Lead", bio: "On-site every day ensuring installs meet the CHS standard.", img: teamSaulSrc },
  { name: "Daniel", role: "Roofing Specialist", bio: "Detail-driven installer trained on shingle, metal, and tile systems.", img: teamDanielSrc },
  { name: "Roberto", role: "Project Manager", bio: "Coordinates schedules, materials, and teams so jobs land on time.", img: teamRobertoSrc },
  { name: "Amado", role: "Crew Foreman", bio: "Leads installation crews with safety, speed, and quality top of mind.", img: teamAmadoSrc },
];

function TeamPage() {
  const topRow = TEAM_DATA.slice(0, 3);
  const bottomRow = TEAM_DATA.slice(3);

  return (
    <Page size="LETTER" style={s.page}>
      <PageHeader />
      <View style={s.content}>
        <Text style={s.eyebrow}>The People Behind the Work</Text>
        <Text style={s.sectionTitle}>Meet the Team</Text>
        <View style={s.sectionRule} />

        {[topRow, bottomRow].map((row, ri) => (
          <View
            key={ri}
            style={{
              flexDirection: "row",
              gap: 14,
              marginBottom: ri === 0 ? 14 : 0,
            }}
          >
            {row.map((member) => (
              <View
                key={member.name}
                style={{
                  flex: 1,
                  backgroundColor: GRAY_100,
                  borderRadius: 6,
                  overflow: "hidden",
                }}
              >
                <Image
                  src={member.img}
                  style={{ width: "100%", height: 120, objectFit: "cover", objectPositionY: "top" }}
                />
                <View style={{ padding: 10 }}>
                  <Text
                    style={{
                      fontFamily: "Helvetica-Bold",
                      fontWeight: 700,
                      fontSize: 13,
                      color: TEXT,
                      marginBottom: 2,
                    }}
                  >
                    {member.name}
                  </Text>
                  <Text style={{ fontSize: 8, color: RED, fontWeight: 700, marginBottom: 5 }}>
                    {member.role}
                  </Text>
                  <Text style={{ fontSize: 8.5, color: GRAY_700, lineHeight: 1.5 }}>
                    {member.bio}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}

        <View
          style={{
            marginTop: 14,
            padding: 12,
            backgroundColor: NAVY,
            borderRadius: 6,
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
          }}
        >
          <View style={{ width: 3, height: 40, backgroundColor: RED, borderRadius: 2, flexShrink: 0 }} />
          <Text style={{ fontSize: 9.5, color: "#A8B8CF", lineHeight: 1.6 }}>
            Every CHS project has a named contact on your team. You'll always know{" "}
            <Text style={{ color: WHITE, fontWeight: 700 }}>who is on your roof</Text> and how to reach them.
            Our bilingual team serves the entire Southwest Florida community in English and Spanish.
          </Text>
        </View>
      </View>
      <PageFooter pageNum={6} />
    </Page>
  );
}

// ─── Page 7 — Customer Portal ─────────────────────────────────────────────────
function PortalPage() {
  const features = [
    {
      title: "Live Project Status",
      desc: "See where your project stands — Scheduled, In Progress, or Complete — with a real-time progress bar.",
      color: "#3B82F6",
    },
    {
      title: "Project Timeline",
      desc: "A chronological feed of updates from your CHS rep, posted directly from the job site.",
      color: "#10B981",
    },
    {
      title: "Photo Albums",
      desc: "Before, during, and after photos embedded directly in your portal so you can follow along.",
      color: "#F59E0B",
    },
    {
      title: "Team Contact",
      desc: "Direct call and email links to your CHS project team — one tap from any device.",
      color: "#8B5CF6",
    },
  ];

  return (
    <Page size="LETTER" style={s.pageDark}>
      <PageHeader dark />
      <View style={s.contentDark}>
        <Text style={s.eyebrowDark}>Online Access</Text>
        <Text style={s.sectionTitleDark}>Your Customer Portal</Text>
        <View style={s.sectionRule} />

        <Text
          style={{
            fontSize: 11,
            color: "#A8B8CF",
            lineHeight: 1.7,
            marginBottom: 22,
            maxWidth: 440,
          }}
        >
          Every CHS customer gets access to a private project portal — a
          clean, mobile-friendly dashboard where you can track your roof in
          real time without making a single phone call.
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 22 }}>
          {features.map((f) => (
            <View
              key={f.title}
              style={{
                width: "47%",
                backgroundColor: "#1E2D47",
                borderRadius: 8,
                padding: 14,
                borderLeftWidth: 4,
                borderLeftColor: f.color,
              }}
            >
              <Text
                style={{
                  fontFamily: "Helvetica",
                  fontWeight: 700,
                  fontSize: 11,
                  color: WHITE,
                  marginBottom: 5,
                }}
              >
                {f.title}
              </Text>
              <Text style={{ fontSize: 9, color: "#8899B4", lineHeight: 1.55 }}>
                {f.desc}
              </Text>
            </View>
          ))}
        </View>

        {/* How to access */}
        <View
          style={{
            backgroundColor: RED,
            borderRadius: 8,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "Helvetica-Bold",
                fontWeight: 700,
                fontSize: 16,
                color: WHITE,
                marginBottom: 5,
              }}
            >
              How to Access Your Portal
            </Text>
            <Text style={{ fontSize: 9.5, color: "rgba(255,255,255,0.85)", lineHeight: 1.6 }}>
              Once your project is scheduled, your CHS rep will send you your
              account number via text. Visit{" "}
              <Text style={{ fontWeight: 700 }}>
                cordovahomeservices.com/portal
              </Text>{" "}
              and enter your email or account number to log in instantly — no
              app download required.
            </Text>
          </View>
          <View
            style={{
              width: 80,
              alignItems: "center",
              gap: 4,
            }}
          >
            {[
              { label: "Step 1", text: "Get your account #" },
              { label: "Step 2", text: "Visit /portal" },
              { label: "Step 3", text: "Enter email or #" },
            ].map((step) => (
              <View
                key={step.label}
                style={{
                  backgroundColor: "rgba(255,255,255,0.15)",
                  borderRadius: 5,
                  padding: 6,
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 6.5, color: "rgba(255,255,255,0.7)", marginBottom: 1 }}>
                  {step.label}
                </Text>
                <Text
                  style={{ fontSize: 7.5, color: WHITE, fontWeight: 700, textAlign: "center" }}
                >
                  {step.text}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      <PageFooter pageNum={7} dark />
    </Page>
  );
}

// ─── Page 8 — Contact & CTA ───────────────────────────────────────────────────
function ContactPage({ qrCodeDataUrl }: { qrCodeDataUrl: string | null }) {
  return (
    <Page size="LETTER" style={s.page}>
      <PageHeader />
      <View style={s.content}>
        <Text style={s.eyebrow}>Get Started</Text>
        <Text style={s.sectionTitle}>Contact CHS Roofing</Text>
        <View style={s.sectionRule} />

        <View style={{ flexDirection: "row", gap: 24, flex: 1 }}>
          {/* Left: contact details */}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 11,
                color: GRAY_700,
                lineHeight: 1.7,
                marginBottom: 20,
              }}
            >
              Ready to get started? We offer free, no-pressure estimates on all
              roofing work across Southwest Florida. Call, email, or scan the QR
              code to request your quote online.
            </Text>

            {[
              { label: "Phone", value: "(239) 737-1758", sub: "Mon–Fri 8am–5pm · Weekend emergency service" },
              { label: "Email", value: "info@cordovahomeservices.com", sub: "We respond same business day" },
              { label: "Location", value: "Cape Coral, FL", sub: "Serving all of Southwest Florida" },
              { label: "License", value: "#CCC1333902", sub: "Fully licensed & insured in Florida" },
            ].map((item) => (
              <View
                key={item.label}
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 10,
                  marginBottom: 14,
                  paddingBottom: 14,
                  borderBottomWidth: 1,
                  borderBottomColor: GRAY_300,
                }}
              >
                <View
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: NAVY,
                    borderRadius: 6,
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                />
                <View>
                  <Text style={{ fontSize: 8, color: GRAY_500, marginBottom: 2, letterSpacing: 0.5 }}>
                    {item.label.toUpperCase()}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Helvetica",
                      fontWeight: 700,
                      fontSize: 11,
                      color: TEXT,
                      marginBottom: 2,
                    }}
                  >
                    {item.value}
                  </Text>
                  <Text style={{ fontSize: 8.5, color: GRAY_500 }}>{item.sub}</Text>
                </View>
              </View>
            ))}

            {/* Service areas */}
            <View style={{ marginTop: 4 }}>
              <Text
                style={{
                  fontSize: 8,
                  color: GRAY_500,
                  letterSpacing: 1,
                  marginBottom: 8,
                }}
              >
                SERVICE AREAS
              </Text>
              <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.7 }}>
                Cape Coral · Fort Myers · Naples · Bonita Springs · Estero ·
                Sanibel · Punta Gorda · Sarasota · Lehigh Acres · North Port
              </Text>
            </View>
          </View>

          {/* Right: QR code + CTA */}
          <View style={{ width: 180, alignItems: "center", gap: 16 }}>
            {/* QR code card */}
            <View
              style={{
                backgroundColor: GRAY_100,
                borderRadius: 10,
                padding: 16,
                alignItems: "center",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontFamily: "Helvetica-Bold",
                  fontWeight: 700,
                  fontSize: 11,
                  color: TEXT,
                  marginBottom: 4,
                  textAlign: "center",
                }}
              >
                Request a Free Quote
              </Text>
              <Text
                style={{
                  fontSize: 8,
                  color: GRAY_500,
                  marginBottom: 12,
                  textAlign: "center",
                }}
              >
                Scan to get started in 60 seconds
              </Text>
              {qrCodeDataUrl ? (
                <Image
                  src={qrCodeDataUrl}
                  style={{ width: 110, height: 110 }}
                />
              ) : (
                <View
                  style={{
                    width: 110,
                    height: 110,
                    backgroundColor: GRAY_300,
                    borderRadius: 4,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 8, color: GRAY_500, textAlign: "center" }}>
                    cordovahomeservices.com/free-quote
                  </Text>
                </View>
              )}
              <Text
                style={{
                  fontSize: 7.5,
                  color: GRAY_500,
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                cordovahomeservices.com/free-quote
              </Text>
            </View>

            {/* Testimonial */}
            <View
              style={{
                backgroundColor: NAVY,
                borderRadius: 8,
                padding: 14,
                width: "100%",
              }}
            >
              <View style={{ width: 36, height: 3, backgroundColor: RED, marginBottom: 10 }} />
              <Text style={{ fontSize: 9.5, color: "#A8B8CF", lineHeight: 1.6 }}>
                "Professional, fast, and left everything clean. Highly recommend!"
              </Text>
              <Text
                style={{
                  fontSize: 7.5,
                  color: "#6B7A99",
                  marginTop: 8,
                }}
              >
                — Leanet García Díaz, Google Review
              </Text>
            </View>

            {/* Bottom stats */}
            <View
              style={{
                backgroundColor: RED,
                borderRadius: 8,
                padding: 12,
                width: "100%",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Helvetica-Bold",
                  fontWeight: 700,
                  fontSize: 16,
                  color: WHITE,
                  marginBottom: 3,
                }}
              >
                5.0 ★ Google Rating
              </Text>
              <Text style={{ fontSize: 8, color: "rgba(255,255,255,0.8)" }}>
                Verified Google Reviews
              </Text>
            </View>
          </View>
        </View>
      </View>
      <PageFooter pageNum={8} />
    </Page>
  );
}

// ─── Main document ────────────────────────────────────────────────────────────
export interface BrochureDocumentProps {
  qrCodeDataUrl: string | null;
}

export default function BrochureDocument({ qrCodeDataUrl }: BrochureDocumentProps) {
  return (
    <Document
      title="CHS Roofing — Company Guide"
      author="Cordova Home Services LLC"
      subject="Roofing services guide for Southwest Florida"
      keywords="roofing, Cape Coral, Fort Myers, Naples, Southwest Florida, CHS Roofing"
      creator="CHS Roofing · cordovahomeservices.com"
    >
      <CoverPage />
      <AboutPage />
      <ServicesPage />
      <MaterialsPage />
      <GalleryPage />
      <TeamPage />
      <PortalPage />
      <ContactPage qrCodeDataUrl={qrCodeDataUrl} />
    </Document>
  );
}
