import chsLogo from "@assets/image_1776870295916.png";
import { Facebook, MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground border-t border-border/10 pt-16 pb-8">
      <div className="container mx-auto max-w-7xl px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        
        {/* Brand Col */}
        <div className="space-y-6">
          <img src={chsLogo} alt="CHS Roofing" className="h-16 w-auto object-contain bg-white/10 p-2 rounded-lg" />
          <p className="text-sm text-secondary-foreground/80 leading-relaxed max-w-xs">
            Southwest Florida's trusted family-owned roofing contractor. Specializing in premium residential and commercial roofing systems designed to withstand Florida's toughest weather.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Contact Col */}
        <div>
          <h4 className="font-display text-xl font-bold mb-6 text-white tracking-wide uppercase">Contact Us</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <a href="tel:+12390000000" className="block text-white font-bold hover:text-primary transition-colors">
                  (239) XXX-XXXX
                </a>
                <span className="text-xs text-secondary-foreground/70">Available 24/7 for emergencies</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-primary mt-0.5" />
              <a href="mailto:info@chs-roofing.com" className="hover:text-primary transition-colors">
                info@chs-roofing.com
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <span>
                Cape Coral, FL<br />
                Serving all of SWFL
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary mt-0.5" />
              <span>
                Mon - Fri: 8am - 5pm<br />
                Weekend emergency service
              </span>
            </li>
          </ul>
        </div>

        {/* Services Col */}
        <div>
          <h4 className="font-display text-xl font-bold mb-6 text-white tracking-wide uppercase">Our Services</h4>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-primary transition-colors flex items-center gap-2"><span className="text-primary text-xs">▶</span> Asphalt Shingles</a></li>
            <li><a href="#" className="hover:text-primary transition-colors flex items-center gap-2"><span className="text-primary text-xs">▶</span> Metal Roofing</a></li>
            <li><a href="#" className="hover:text-primary transition-colors flex items-center gap-2"><span className="text-primary text-xs">▶</span> Tile Roofs</a></li>
            <li><a href="#" className="hover:text-primary transition-colors flex items-center gap-2"><span className="text-primary text-xs">▶</span> Flat & TPO Roofing</a></li>
            <li><a href="#" className="hover:text-primary transition-colors flex items-center gap-2"><span className="text-primary text-xs">▶</span> Storm Damage Repair</a></li>
            <li><a href="#" className="hover:text-primary transition-colors flex items-center gap-2"><span className="text-primary text-xs">▶</span> Commercial Roofing</a></li>
          </ul>
        </div>

        {/* Trust Col */}
        <div>
          <h4 className="font-display text-xl font-bold mb-6 text-white tracking-wide uppercase">Why Choose Us</h4>
          <ul className="space-y-4">
            <li className="bg-background/5 border border-white/10 p-3 rounded flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded text-primary font-bold">FL</div>
              <div className="text-sm">
                <span className="block text-white font-bold">Fully Licensed</span>
                <span className="text-secondary-foreground/70">#CCC1333902</span>
              </div>
            </li>
            <li className="bg-background/5 border border-white/10 p-3 rounded flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded text-primary font-bold">Insured</div>
              <div className="text-sm">
                <span className="block text-white font-bold">Fully Insured</span>
                <span className="text-secondary-foreground/70">For your protection</span>
              </div>
            </li>
            <li className="bg-background/5 border border-white/10 p-3 rounded flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded text-primary font-bold">$$</div>
              <div className="text-sm">
                <span className="block text-white font-bold">Free Estimates</span>
                <span className="text-secondary-foreground/70">Transparent pricing</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-secondary-foreground/60">
        <p>© {new Date().getFullYear()} Cordova Home Services LLC (CHS Roofing). All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
