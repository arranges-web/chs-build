import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const cities = [
  "Cape Coral", "Fort Myers", "Naples", "Bonita Springs",
  "Estero", "Lehigh Acres", "Sanibel", "Punta Gorda",
  "Marco Island", "North Fort Myers", "Pine Island", "Fort Myers Beach"
];

export default function ServiceArea() {
  return (
    <section className="py-28 bg-secondary text-secondary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-primary/10"></div>
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
        backgroundSize: "24px 24px"
      }} />
      <div className="container mx-auto max-w-7xl px-4 relative">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-2">
            <h4 className="text-[hsl(var(--accent-gold))] font-semibold tracking-[0.2em] uppercase mb-3 text-xs">Local & Trusted</h4>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-white mb-6 leading-[1.05]">
              Proudly Serving Southwest Florida
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Born and built in Cape Coral. We know SWFL's salt air, hurricane patterns, and building codes
              inside and out — because we live and work in these neighborhoods every day.
            </p>
            <div className="flex items-center gap-3 text-white">
              <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold">Headquartered in Cape Coral, FL</p>
                <p className="text-sm text-gray-400">Crews dispatched across all of SWFL</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {cities.map((city, i) => (
                <motion.div
                  key={city}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="bg-white/[0.04] backdrop-blur-md border border-white/10 hover:border-primary/40 hover:bg-white/[0.08] transition-all duration-300 p-4 rounded-xl flex items-center gap-2.5 group"
                >
                  <MapPin className="w-4 h-4 text-primary group-hover:scale-110 transition-transform shrink-0" />
                  <span className="font-semibold text-white text-sm">{city}</span>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-sm text-gray-400 mt-6">
              Don't see your city? We likely serve it — <a href="#contact" className="text-[hsl(var(--accent-gold))] hover:underline font-semibold">just ask</a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
