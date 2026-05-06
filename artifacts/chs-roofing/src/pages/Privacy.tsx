import { Link } from "wouter";
import { ShieldCheck } from "lucide-react";
import { SITE } from "@/lib/site-config";

export default function PrivacyPage() {
  const updated = "May 6, 2026";
  return (
    <main className="bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-primary">
              Legal
            </p>
            <h1 className="font-display font-bold tracking-tight text-3xl md:text-4xl text-foreground">
              Privacy Policy
            </h1>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-10">Last updated: {updated}</p>

        <div className="prose prose-neutral max-w-none text-foreground space-y-6 text-[15px] leading-relaxed">
          <section>
            <h2 className="font-display font-bold text-xl tracking-tight mb-2">
              Who we are
            </h2>
            <p>
              {SITE.legalName} (doing business as {SITE.brand}) operates this website at chs-roofing.com (the "Site"). We're a Florida-licensed roofing contractor (License {SITE.license}) headquartered in {SITE.city} and serving {SITE.region}. This Privacy Policy explains what information we collect, how we use it, and your choices.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl tracking-tight mb-2">
              Information we collect
            </h2>
            <p>We collect information you provide directly when you:</p>
            <ul className="list-disc pl-6 space-y-1.5 my-2">
              <li>Submit a quote request, contact form, or chat conversation (name, phone, email, address, ZIP code, roof age, service interest, optional message and photos)</li>
              <li>Call or email us</li>
              <li>Use our online estimator (the address you enter is used only to display a satellite preview in your browser and is not sent to our servers)</li>
            </ul>
            <p>
              We also automatically collect limited technical information your browser sends (IP address, browser type, pages visited, referring URL, timestamps). This is standard server-log data used to keep the Site running.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl tracking-tight mb-2">
              How we use your information
            </h2>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Respond to inquiries, schedule inspections, and provide estimates</li>
              <li>Communicate with you about your project (calls, texts, emails)</li>
              <li>Send service-related follow-ups (we do not sell your data)</li>
              <li>Improve our website, content, and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl tracking-tight mb-2">
              Sharing your information
            </h2>
            <p>
              We do not sell or rent your personal information. We may share it with:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 my-2">
              <li>Service providers we use to operate the Site (e.g., form delivery, email, hosting) — bound by confidentiality</li>
              <li>Subcontractors directly working on your project, only as needed</li>
              <li>Insurance carriers when assisting with a claim, with your permission</li>
              <li>Authorities when required by law or to protect our rights</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl tracking-tight mb-2">
              Cookies and analytics
            </h2>
            <p>
              The Site uses minimal browser storage (sessionStorage) to remember progress in our chat widget so you don't re-enter information. We may use standard analytics services (such as Google Analytics) to understand traffic patterns. These services may set first-party cookies. You can control cookies in your browser settings. We do not use cookies for cross-site behavioral advertising.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl tracking-tight mb-2">
              Advertising
            </h2>
            <p>
              We may run advertising on platforms such as Google Ads, Meta (Facebook), and others. These platforms may set cookies or pixels that help us measure ad performance. The information collected is governed by each platform's own privacy policy. We do not provide your personal contact information to these platforms.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl tracking-tight mb-2">
              SMS / call communications
            </h2>
            <p>
              By submitting your phone number, you consent to be contacted by {SITE.brand} about your inquiry by phone, text, or email. Standard message and data rates may apply. You can opt out of text messages at any time by replying STOP.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl tracking-tight mb-2">
              Data retention
            </h2>
            <p>
              We keep inquiry information for as long as needed to provide the service requested and to comply with legal, tax, and warranty requirements (typically up to 10 years for roofing-warranty purposes).
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl tracking-tight mb-2">
              Your choices
            </h2>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Access, correct, or request deletion of your information by emailing <a className="text-primary underline" href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
              <li>Opt out of marketing communications at any time</li>
              <li>Manage cookies through your browser</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl tracking-tight mb-2">
              Children's privacy
            </h2>
            <p>The Site is not directed to children under 13, and we do not knowingly collect personal information from children.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl tracking-tight mb-2">
              Service area activity notifications
            </h2>
            <p>
              The small notification badge that appears in the corner of the Site is illustrative — it shows general service-area activity by city and service type only, never anyone's personal information.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl tracking-tight mb-2">
              Changes to this policy
            </h2>
            <p>
              We may update this policy from time to time. The "Last updated" date at the top reflects the most recent changes.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl tracking-tight mb-2">
              Contact us
            </h2>
            <p>
              Questions? Reach us at <a className="text-primary underline" href={`mailto:${SITE.email}`}>{SITE.email}</a> or <a className="text-primary underline" href={`tel:${SITE.phoneTel}`}>{SITE.phoneDisplay}</a>.
            </p>
          </section>

          <section className="pt-6 border-t border-border/60">
            <p className="text-sm text-muted-foreground">
              See also our <Link href="/terms" className="text-primary underline">Terms of Service</Link>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
