import { useTranslation } from "react-i18next";
import PageHero from "@/components/PageHero";
import CtaSection from "@/components/CtaSection";
import Seo, { breadcrumbSchema } from "@/components/Seo";
import { FOUNDER_PHOTOS, SITE } from "@/lib/site-config";

const ROOFR_URL =
  "https://app.roofr.com/instant-estimator/eed34857-8661-4957-8982-b772ca753660/CordovaHomeServicesLLC";

export default function EstimatorPage() {
  const { t } = useTranslation();

  return (
    <>
      <Seo
        title="Free Roof Estimator | Instant Roofing Quote — Cape Coral, Fort Myers, Naples FL"
        description="Get an instant roofing estimate for your Southwest Florida home. Shingle, metal, tile, and TPO flat roof pricing — no email required. Free on-site inspection on request."
        path="/estimator"
        jsonLd={breadcrumbSchema([{ name: "Estimator", path: "/estimator" }])}
      />
      <PageHero
        eyebrow={t("estimator.eyebrow")}
        title={
          <>
            {t("estimator.titleStart")} <span className="text-primary">{t("estimator.titleAccent")}</span>
          </>
        }
        subtitle={t("estimator.subtitle")}
        image={FOUNDER_PHOTOS.flat[3]}
        imageAlt={t("estimator.imageAlt")}
        crumbs={[{ label: t("header.nav.estimator") }]}
      />

      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="w-full overflow-hidden rounded-3xl border border-border/60 shadow-sm bg-card">
            <iframe
              src={ROOFR_URL}
              title={`Instant roof estimator — ${SITE.legalName}`}
              className="block w-full"
              style={{ minHeight: "640px", border: 0 }}
              loading="lazy"
              allow="geolocation"
            />
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Powered by{" "}
            <a
              href="https://roofr.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Roofr
            </a>
            {" "}· Satellite-powered instant estimate · Final pricing always requires an on-site inspection.
          </p>
        </div>
      </section>

      <CtaSection
        title={
          <>
            {t("estimator.ctaTitle")} <span className="text-primary">{t("estimator.ctaTitleAccent")}</span>
          </>
        }
        subtitle={t("estimator.ctaSubtitle")}
      />
    </>
  );
}
