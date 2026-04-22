import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "Do you handle insurance claims for storm damage?",
    a: "Absolutely. We meet your adjuster on-site, document damage with drone and ground photography, and provide line-itemed scopes that match Xactimate pricing. Most of our hurricane-related projects are insurance-funded, and we walk you through every step."
  },
  {
    q: "How long does a full roof replacement take?",
    a: "Most single-family residential replacements are completed in one to three days, depending on roof size, material, and weather. Tile and standing-seam metal can take three to five days. We commit to daily clean-up and tarping if work spans overnight."
  },
  {
    q: "Are you really licensed and insured?",
    a: "Yes — Florida State Certified Roofing Contractor License #CCC1333902. We carry general liability and workers' compensation coverage, and we'll provide proof of insurance before the project starts. Always verify your contractor at MyFloridaLicense.com."
  },
  {
    q: "What warranty comes with my new roof?",
    a: "Every CHS Roofing installation includes a 10-year workmanship warranty in writing. Materials carry the manufacturer's warranty — typically 25 to 50 years for shingles, lifetime for metal, and 50 years for premium tile. Both warranties are transferable to future homeowners."
  },
  {
    q: "Do you offer financing?",
    a: "Yes — we partner with leading home-improvement lenders to offer plans starting at 0% APR for qualifying buyers, plus longer-term low-monthly-payment options up to 15 years. Pre-qualification is a soft credit pull and won't affect your score."
  },
  {
    q: "What roofing materials work best in Southwest Florida?",
    a: "It depends on your home and budget. Architectural asphalt shingles offer the best value (25–30 years). Standing-seam metal is unbeatable for hurricane resistance and longevity (50+ years). Concrete and clay tile suit Mediterranean-style homes (50+ years). We help you weigh longevity, energy efficiency, and HOA requirements."
  },
  {
    q: "Do I need permits, and who handles them?",
    a: "Yes — every reroof in SWFL requires a permit. We pull all permits, coordinate inspections, and handle the entire process with your county or city. You receive copies of all permits and final inspection sign-offs as part of your project closeout."
  },
  {
    q: "What sets CHS Roofing apart from other contractors?",
    a: "We're family-owned, locally headquartered in Cape Coral, and we use our own in-house crews — never day labor. Every quote is honest and itemized, every installation is supervised by an owner or master roofer, and we treat your home like our own. That's why we're 5-star rated across Google."
  }
];

export default function FAQ() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="text-center mb-12">
          <h4 className="text-primary font-bold tracking-wider uppercase mb-2 text-sm flex items-center justify-center gap-2">
            <HelpCircle className="w-4 h-4" /> Frequently Asked
          </h4>
          <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight text-foreground">
            Answers Before You Call
          </h2>
          <div className="w-24 h-1.5 bg-primary mx-auto mt-6"></div>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="bg-card border border-border rounded-xl px-6 shadow-sm data-[state=open]:shadow-md data-[state=open]:border-primary/30 transition-all"
            >
              <AccordionTrigger className="font-display font-bold uppercase tracking-tight text-foreground text-left text-base md:text-lg hover:no-underline py-5">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5 text-base">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
