import { Link } from "wouter";
import { Scale } from "lucide-react";
import { SITE } from "@/lib/site-config";

export default function TermsPage() {
  const updated = "May 6, 2026";
  return (
    <main className="bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Scale className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-primary">
              Legal
            </p>
            <h1 className="font-display font-bold tracking-tight text-3xl md:text-4xl text-foreground">
              Terms of Service
            </h1>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-10">Last updated: {updated}</p>

        <div className="space-y-6 text-foreground text-[15px] leading-relaxed">
          <section>
            <h2 className="font-display font-bold text-xl tracking-tight mb-2">
              1. Use of this website
            </h2>
            <p>
              By using the {SITE.brand} website, you agree to these Terms. If you do not agree, please do not use the Site. {SITE.legalName} reserves the right to update these Terms at any time.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl tracking-tight mb-2">
              2. Estimates and quotes
            </h2>
            <p>
              Any estimate provided through the online Estimator, chat, or contact form is a <strong>rough budget figure only</strong> based on the information you supply. It is not a binding quote. Final pricing requires an on-site inspection by a {SITE.brand} representative and may differ materially based on roof geometry, decking condition, code upgrades, material availability, and other site-specific factors.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl tracking-tight mb-2">
              3. Marketing claims
            </h2>
            <p>
              We try to keep all claims on this Site accurate as of the date posted. Customer reviews are real and unedited. Representative project photos may include past completed work. Any badges or certifications shown are issued by their respective organizations and remain their property.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl tracking-tight mb-2">
              4. Intellectual property
            </h2>
            <p>
              All content on the Site — text, photos, graphics, the {SITE.brand} mark, and the {SITE.legalName} brand — is owned by {SITE.legalName} or used with permission. You may not reproduce or distribute it without our written consent.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl tracking-tight mb-2">
              5. Third-party links
            </h2>
            <p>
              The Site links to third-party resources (manufacturers, the BBB, mapping providers). We are not responsible for the content or practices of those sites.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl tracking-tight mb-2">
              6. No warranties on the Site
            </h2>
            <p>
              The Site is provided "as is." We make no warranties about availability, accuracy, or suitability of the Site itself. Roofing-system warranties are covered by the separate written contract you sign for any project we perform.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl tracking-tight mb-2">
              7. Limitation of liability
            </h2>
            <p>
              To the fullest extent permitted by law, {SITE.legalName} is not liable for any indirect, incidental, or consequential damages arising from your use of the Site. Our total liability for the Site is limited to $100.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl tracking-tight mb-2">
              8. Communications consent
            </h2>
            <p>
              By submitting your contact information you agree to be contacted by {SITE.brand} about your inquiry by phone, text, or email. You can opt out at any time. See our <Link href="/privacy" className="text-primary underline">Privacy Policy</Link> for details.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl tracking-tight mb-2">
              9. Governing law
            </h2>
            <p>
              These Terms are governed by the laws of the State of Florida. Disputes will be resolved in the state or federal courts located in Lee County, Florida.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl tracking-tight mb-2">
              10. Contact
            </h2>
            <p>
              {SITE.legalName}<br />
              {SITE.city}<br />
              <a className="text-primary underline" href={`mailto:${SITE.email}`}>{SITE.email}</a> · <a className="text-primary underline" href={`tel:${SITE.phoneTel}`}>{SITE.phoneDisplay}</a><br />
              License {SITE.license}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
