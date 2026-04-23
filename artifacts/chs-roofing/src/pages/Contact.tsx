import { Phone, Mail, MapPin, Clock, ShieldCheck } from "lucide-react";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import ServiceArea from "@/components/ServiceArea";
import { SITE } from "@/lib/site-config";

export default function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Get In Touch"
        title={<>Get a <span className="text-primary">free quote</span></>}
        subtitle="Tell us about your project and we'll get back to you within 24 hours with a transparent, line-itemed estimate. No pressure, no hidden costs."
        image="/images/metal-roof.png"
        crumbs={[{ label: "Contact" }]}
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3">
              <ContactForm />
            </div>

            <div className="lg:col-span-2 space-y-5">
              <a
                href={`tel:${SITE.phoneTel}`}
                className="block bg-card border border-border/60 rounded-2xl p-6 shadow-sm hover:shadow-md lift-on-hover group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Phone className="w-5 h-5 text-primary group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-semibold">Call us 24/7</p>
                    <p className="font-display text-2xl font-bold text-foreground tracking-tight mt-1">{SITE.phoneDisplay}</p>
                    <p className="text-sm text-muted-foreground mt-1">Emergency line answered around the clock</p>
                  </div>
                </div>
              </a>

              <a
                href={`mailto:${SITE.email}`}
                className="block bg-card border border-border/60 rounded-2xl p-6 shadow-sm hover:shadow-md lift-on-hover group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-semibold">Email</p>
                    <p className="font-bold text-foreground tracking-tight mt-1 break-all">{SITE.email}</p>
                  </div>
                </div>
              </a>

              <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-semibold">Headquarters</p>
                    <p className="font-bold text-foreground tracking-tight mt-1">{SITE.city}</p>
                    <p className="text-sm text-muted-foreground mt-1">Crews dispatched across all of SWFL</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-semibold">Hours</p>
                    <p className="font-bold text-foreground tracking-tight mt-1">{SITE.hours}</p>
                  </div>
                </div>
              </div>

              <div className="bg-secondary text-white rounded-2xl p-6 shadow-md">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.15em] text-gray-300 font-semibold">Licensed & Insured</p>
                    <p className="font-bold tracking-tight mt-1">FL License {SITE.license}</p>
                    <p className="text-sm text-gray-300 mt-1">Verify at MyFloridaLicense.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServiceArea />
    </>
  );
}
