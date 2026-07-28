import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import QRCode from "qrcode";
import {
  BookOpen,
  Building2,
  Download,
  FileText,
  HardHat,
  Images,
  Phone,
  Shield,
  Smartphone,
  Star,
  Users,
} from "lucide-react";
import { Link } from "wouter";
import Seo from "@/components/Seo";
import { SITE } from "@/lib/site-config";
import BrochureDocument from "@/components/BrochureDocument";

const GUIDE_CONTENTS = [
  { icon: BookOpen, title: "Company Story", desc: "How CHS Roofing was founded and what we stand for" },
  { icon: HardHat, title: "All 7 Services", desc: "Installation, repair, maintenance, storm damage, specialty, gutters, and coating" },
  { icon: Shield, title: "4 Roofing Materials", desc: "Shingles, metal, tile, and flat — with lifespan and best-fit guidance" },
  { icon: Images, title: "Project Gallery", desc: "Real completed projects across Southwest Florida" },
  { icon: Users, title: "Meet the Team", desc: "Every person who may work on your home, with their role and background" },
  { icon: Smartphone, title: "Customer Portal Guide", desc: "How to track your project status, photos, and team updates online" },
  { icon: Phone, title: "Contact & Quote", desc: "How to reach us, our service area, and a direct link to get your free estimate" },
  { icon: Building2, title: "Credentials", desc: "License #CCC1333902, insurance, and manufacturer certifications" },
];

export default function BrochurePage() {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [qrReady, setQrReady] = useState(false);

  useEffect(() => {
    QRCode.toDataURL("https://cordovahomeservices.com/free-quote", {
      width: 256,
      margin: 2,
      color: { dark: "#162033", light: "#FFFFFF" },
      errorCorrectionLevel: "M",
    })
      .then((dataUrl) => {
        setQrCodeDataUrl(dataUrl);
        setQrReady(true);
      })
      .catch(() => {
        setQrReady(true); // still allow download, QR just won't show
      });
  }, []);

  return (
    <>
      <Seo
        title="Company Guide (PDF) | CHS Roofing"
        description="Download the CHS Roofing company guide — everything about our services, materials, team, and customer portal in one clean PDF."
        path="/brochure"
      />

      {/* ── Hero ── */}
      <section className="relative bg-secondary text-secondary-foreground overflow-hidden">
        {/* Background texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px",
          }}
        />
        {/* Monogram watermark */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-8 -right-6 font-display font-bold text-white/[0.035] leading-none select-none"
          style={{ fontSize: "clamp(180px, 22vw, 360px)" }}
        >
          CHS
        </div>

        <div className="container mx-auto max-w-6xl px-4 py-20 md:py-28 relative">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.22em] uppercase text-primary mb-5">
              <FileText className="w-3.5 h-3.5" />
              Free Company Guide
            </span>
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-white leading-[1.05] mb-6">
              Everything You Need{" "}
              <span className="text-primary">to Know</span>{" "}
              About CHS Roofing.
            </h1>
            <p className="text-lg text-secondary-foreground/80 leading-relaxed mb-8 max-w-xl">
              A professionally designed, 8-page company guide covering our
              services, materials, team, customer portal, and contact info —
              ready to save, print, or share.
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              {qrReady ? (
                <PDFDownloadLink
                  document={<BrochureDocument qrCodeDataUrl={qrCodeDataUrl} />}
                  fileName="CHS-Roofing-Company-Guide.pdf"
                  className="inline-flex items-center gap-2.5 bg-primary hover:bg-primary/90 text-white px-7 py-3.5 rounded-full font-semibold text-base shadow-lg shadow-primary/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
                >
                  {({ loading, error }) =>
                    error ? (
                      <>
                        <Phone className="w-5 h-5" />
                        Call (239) 737-1758
                      </>
                    ) : loading ? (
                      <>
                        <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Preparing PDF…
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                        Download Free PDF
                      </>
                    )
                  }
                </PDFDownloadLink>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center gap-2.5 bg-primary/60 text-white px-7 py-3.5 rounded-full font-semibold text-base cursor-wait"
                >
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Preparing…
                </button>
              )}

              <span className="text-sm text-secondary-foreground/60">
                PDF · 8 pages · Free
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── What's Inside ── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="max-w-xl mb-12">
            <span className="inline-block text-xs font-semibold tracking-[0.22em] uppercase text-primary mb-3">
              What's Inside
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground mb-3">
              8 Pages. Everything You Need.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The guide is designed to answer every question a homeowner has
              before choosing a roofing contractor — no fluff, no sales pressure.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {GUIDE_CONTENTS.map((item, i) => (
              <div
                key={item.title}
                className="bg-card border border-border/60 rounded-2xl p-5 hover:border-primary/30 hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase mb-1.5">
                  Page {i + 1 <= 2 ? i + 1 : i + 1}
                </div>
                <h3 className="font-display font-bold text-base text-foreground mb-1.5">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Download ── */}
      <section className="py-16 bg-muted/40">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="bg-card border border-border/60 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-500" />
                </div>
                <span className="font-semibold text-foreground">Trusted by Southwest Florida homeowners</span>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-5">
                Share this guide with your spouse, your HOA, or your insurance adjuster.
                It's designed to give anyone the full picture of who CHS Roofing is
                and what working with us looks like — before you ever make a call.
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                {[
                  "Lic. #CCC1333902",
                  "5.0 ★ Google",
                  "Family-owned since 2022",
                  "Bilingual team",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full text-foreground/80 font-medium text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 md:min-w-[200px]">
              {qrReady ? (
                <PDFDownloadLink
                  document={<BrochureDocument qrCodeDataUrl={qrCodeDataUrl} />}
                  fileName="CHS-Roofing-Company-Guide.pdf"
                  className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-semibold text-sm shadow-md shadow-primary/20 transition-all"
                >
                  {({ loading }) =>
                    loading ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Generating…
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Download PDF
                      </>
                    )
                  }
                </PDFDownloadLink>
              ) : (
                <button disabled className="inline-flex items-center justify-center gap-2 bg-primary/60 text-white px-6 py-3 rounded-full font-semibold text-sm cursor-wait">
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Preparing…
                </button>
              )}
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-secondary text-white hover:bg-secondary/90 px-6 py-3 rounded-full font-semibold text-sm transition-colors"
              >
                <Phone className="w-4 h-4" />
                Get a Free Quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
