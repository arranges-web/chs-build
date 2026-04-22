import { Phone, ShieldCheck, Star, Home as HomeIcon } from "lucide-react";
import Monogram from "./Monogram";

export default function Header() {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Top Utility Bar */}
      <div className="bg-secondary text-secondary-foreground py-2 px-4 text-xs font-medium hidden md:block border-b border-white/5">
        <div className="container mx-auto max-w-7xl flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              Licensed #CCC1333902 & Insured
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-[hsl(var(--accent-gold))] fill-[hsl(var(--accent-gold))]" />
              Google 5-Star Rated
            </span>
            <span className="flex items-center gap-1.5">
              <HomeIcon className="w-3.5 h-3.5 text-primary" />
              Family-Owned Since 2010
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>Bilingual Service (English / Español)</span>
            <span className="text-[hsl(var(--accent-gold))] font-semibold">Serving All of SWFL</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-50 glass-surface border-b border-border/60">
        <div className="container mx-auto max-w-7xl px-4 py-3.5 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group" aria-label="CHS Roofing - Cordova Home Services">
            <Monogram className="w-11 h-11 md:w-12 md:h-12 transition-transform group-hover:scale-105 drop-shadow-sm" />
            <div className="flex flex-col">
              <span className="font-display text-lg md:text-xl font-bold tracking-tight text-foreground leading-none">
                CHS ROOFING
              </span>
              <span className="text-[9px] md:text-[10px] text-muted-foreground font-semibold tracking-[0.18em] uppercase mt-1">
                Cordova Home Services
              </span>
            </div>
          </a>

          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Call for emergency service
              </span>
              <a 
                href="tel:+12390000000" 
                className="font-display text-2xl font-bold text-foreground hover:text-primary transition-colors flex items-center gap-2"
              >
                <Phone className="w-5 h-5 text-primary" />
                (239) XXX-XXXX
              </a>
            </div>

            <button
              onClick={scrollToContact}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 md:px-6 py-2.5 md:py-3 rounded-full font-semibold tracking-tight transition-all duration-300 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 flex items-center gap-2 text-sm md:text-[15px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Get a Free Quote
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
