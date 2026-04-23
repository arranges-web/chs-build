import { Link } from "wouter";
import { ArrowRight, Phone, CheckCircle } from "lucide-react";
import { SITE } from "@/lib/site-config";

type Props = {
  title?: React.ReactNode;
  subtitle?: string;
};

export default function CtaSection({
  title = <>Ready For A <span className="text-primary">Better Roof?</span></>,
  subtitle = "Get a free, honest assessment of your roof. No high-pressure sales tactics, just straight talk from local experts.",
}: Props) {
  return (
    <section className="py-24 bg-secondary text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-primary/15" />
      <div className="container mx-auto max-w-4xl px-4 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-5 leading-[1.05]">
          {title}
        </h2>
        <p className="text-lg md:text-xl text-gray-300/90 mb-10 leading-relaxed max-w-2xl mx-auto">
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link
            href="/contact"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-7 py-4 rounded-full font-semibold text-base tracking-tight transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
          >
            Get Your Free Quote <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={`tel:${SITE.phoneTel}`}
            className="bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/25 text-white px-7 py-4 rounded-full font-semibold text-base tracking-tight transition-all duration-300 inline-flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            Call {SITE.phoneDisplay}
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-300">
          <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-primary" /> Free estimates</span>
          <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-primary" /> Licensed {SITE.license}</span>
          <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-primary" /> Family-owned since {SITE.established}</span>
        </div>
      </div>
    </section>
  );
}
