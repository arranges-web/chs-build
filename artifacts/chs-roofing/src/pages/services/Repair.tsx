import { Link } from "wouter";
import { AlertCircle } from "lucide-react";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export default function Repair() {
  return (
    <ServicePageTemplate
      eyebrow="Service · Repair"
      title={<>Roof <span className="text-primary">Repair</span> Done Right</>}
      subtitle="Fast, honest repair work — leaks, missing shingles, flashing failures, and post-storm damage. We come out, diagnose accurately, and fix it the first time."
      image="/images/after-shingle.png"
      crumbs={[{ label: "Services" }, { label: "Repair" }]}
      intro={
        <>
          <p>
            Most roof failures are local — a few lifted shingles, failing pipe-boot flashing, or a small leak around a skylight. You don't need a full replacement. You need an honest contractor who'll fix the actual problem instead of upselling you a $30K project.
          </p>
          <p>
            Our team specializes in surgical, lasting repairs across shingle, metal, tile, and flat roofs. If a repair isn't the right call, we'll tell you that too — and explain exactly why.
          </p>
        </>
      }
      included={[
        { title: "Same-week service", desc: "Most repair calls are scheduled within 3–5 business days; emergencies same-day." },
        { title: "Leak detection", desc: "We trace leaks to the actual entry point — not just patch where the water shows up inside." },
        { title: "Shingle & tile replacement", desc: "Color-matched replacements blended into existing roof field." },
        { title: "Flashing repair", desc: "Step, valley, chimney, and skylight flashing rebuilt to code." },
        { title: "Pipe boot & vent repair", desc: "The #1 cause of residential leaks — replaced with lifetime boots." },
        { title: "Soft-spot decking repair", desc: "Rotted plywood replaced before it spreads." },
        { title: "Sealant & caulk renewal", desc: "All exposed sealants refreshed to manufacturer spec." },
        { title: "Photo documentation", desc: "Before/after photos of every repair, sent to you on completion." },
        { title: "30-day repair warranty", desc: "If our repair fails in 30 days, we come back and fix it free." },
      ]}
      testimonialIndices={[3, 6, 7]}
      extra={
        <section className="py-12 bg-primary/5 border-y border-primary/10">
          <div className="container mx-auto max-w-5xl px-4 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <AlertCircle className="w-10 h-10 text-primary shrink-0" />
              <div>
                <p className="font-display font-bold text-foreground text-lg tracking-tight">Storm or hurricane damage?</p>
                <p className="text-muted-foreground text-sm">We handle insurance documentation and emergency tarping.</p>
              </div>
            </div>
            <Link href="/services/storm-damage" className="bg-primary text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-primary/90 transition-colors">
              Storm Damage Help →
            </Link>
          </div>
        </section>
      }
    />
  );
}
