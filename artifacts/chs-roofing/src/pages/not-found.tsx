import { Link } from "wouter";
import { ArrowRight, Phone } from "lucide-react";
import Monogram from "@/components/Monogram";
import ShingleDivider from "@/components/ShingleDivider";
import { SITE } from "@/lib/site-config";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services/installation" },
  { label: "Gallery", href: "/gallery/residential" },
  { label: "Contact", href: "/contact" },
];

export default function NotFound() {
  return (
    <section
      className="min-h-[70vh] flex items-center justify-center bg-background bg-wash-warm py-24 px-4"
      data-testid="page-not-found"
    >
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8 flex items-center justify-center">
          <Monogram className="w-24 h-24 opacity-95 drop-shadow-lg" />
        </div>
        <p className="text-xs font-semibold tracking-[0.32em] uppercase text-primary mb-3">
          Error 404
        </p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-foreground mb-5 leading-[1.05]">
          Looks like this page <span className="text-primary">lost a shingle</span>.
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto">
          We can&rsquo;t find what you were looking for, but our crew can help you
          get back on solid ground. Try one of these instead:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto mb-10">
          {QUICK_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-4 py-3 rounded-2xl border border-border/60 bg-card text-sm font-semibold text-foreground hover:border-primary/40 hover:text-primary hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              data-testid={`404-link-${l.label.toLowerCase()}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <ShingleDivider variant="light" />

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
          <Link
            href="/contact"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-7 py-4 rounded-full font-semibold text-base tracking-tight inline-flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            data-testid="404-cta-quote"
          >
            Get a Free Estimate <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={`tel:${SITE.phoneTel}`}
            className="border border-border/60 bg-card text-foreground px-7 py-4 rounded-full font-semibold text-base tracking-tight inline-flex items-center justify-center gap-2 hover:border-primary/40 hover:text-primary transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            data-testid="404-cta-call"
          >
            <Phone className="w-4 h-4" /> {SITE.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
