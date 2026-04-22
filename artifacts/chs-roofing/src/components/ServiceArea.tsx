import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const cities = [
  "Cape Coral", "Fort Myers", "Naples", "Bonita Springs",
  "Estero", "Lehigh Acres", "Sanibel", "Punta Gorda",
  "Marco Island", "North Fort Myers", "Pine Island", "Fort Myers Beach"
];

export default function ServiceArea() {
  return (
    <section className="py-24 bg-secondary text-secondary-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
        backgroundSize: "24px 24px"
      }} />
      <div className="container mx-auto max-w-7xl px-4 relative">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-2">
            <h4 className="text-[hsl(var(--accent-gold))] font-bold tracking-wider uppercase mb-2 text-sm">Local & Trusted</h4>
            <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight text-white mb-6">
              Proudly Serving Southwest Florida
            </h2>
            <div className="w-20 h-1 bg-primary mb-6" />
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
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
                  className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all p-4 rounded-lg flex items-center gap-2.5 group"
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
