import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, CheckCircle, BadgeDollarSign, FileCheck, Wallet } from "lucide-react";

export default function WarrantyFinancing() {
  return (
    <section className="py-28 bg-background bg-wash-warm">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h4 className="text-primary font-semibold tracking-[0.2em] uppercase mb-3 text-xs">Peace of Mind</h4>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-foreground leading-[1.05]">
            Backed By Warranty. <br className="hidden sm:block"/>Made Affordable.
          </h2>
          
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative bg-card border border-border/60 rounded-2xl p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-[hsl(var(--accent-gold))]" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">Warranty Coverage</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-foreground">10-Year Workmanship Warranty</p>
                  <p className="text-sm text-muted-foreground">Every install backed by our written labor guarantee.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-foreground">Up to 50-Year Manufacturer Warranty</p>
                  <p className="text-sm text-muted-foreground">GAF Golden Pledge & lifetime architectural shingle coverage available.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-foreground">Wind Coverage to 130 MPH</p>
                  <p className="text-sm text-muted-foreground">Engineered fastener patterns meet Florida's strictest wind codes.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FileCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-foreground">Transferable to Future Owners</p>
                  <p className="text-sm text-muted-foreground">Boost your home's resale value with documented coverage.</p>
                </div>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative bg-card border border-border/60 rounded-2xl p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[hsl(var(--accent-gold))] to-primary" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-[hsl(var(--accent-gold))]/15 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-[hsl(var(--accent-gold))]" />
              </div>
              <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">Flexible Financing</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <BadgeDollarSign className="w-5 h-5 text-[hsl(var(--accent-gold))] mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-foreground">0% APR for 18 Months*</p>
                  <p className="text-sm text-muted-foreground">Qualifying buyers — no interest if paid in full within promo period.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Wallet className="w-5 h-5 text-[hsl(var(--accent-gold))] mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-foreground">Low Monthly Payment Plans</p>
                  <p className="text-sm text-muted-foreground">Terms up to 15 years available — fit any budget.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FileCheck className="w-5 h-5 text-[hsl(var(--accent-gold))] mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-foreground">Insurance Claim Specialists</p>
                  <p className="text-sm text-muted-foreground">We work directly with your carrier and document every step.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[hsl(var(--accent-gold))] mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-foreground">Soft Credit Pull — No Impact</p>
                  <p className="text-sm text-muted-foreground">Pre-qualify in minutes without hurting your credit score.</p>
                </div>
              </li>
            </ul>
            <p className="text-xs text-muted-foreground mt-6">*Subject to credit approval. Terms vary by lender.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
