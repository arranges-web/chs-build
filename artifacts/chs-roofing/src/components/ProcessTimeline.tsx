import { motion } from "framer-motion";
import { Search, Shield, Wrench, Droplets, Hammer, ClipboardCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PHOTOS } from "@/lib/site-config";

const STEP_ICONS = [Search, Shield, Wrench, Droplets, Hammer, ClipboardCheck];
const STEP_IMAGES = [
  PHOTOS.greyMetalHip,
  PHOTOS.flatPrepRedLine,
  PHOTOS.tearOff,
  PHOTOS.shingleInstallTopdown,
  PHOTOS.whiteStandingSeam,
  PHOTOS.finishedGreyShingle,
];

export default function ProcessTimeline() {
  const { t } = useTranslation();
  const steps = (
    t("process.steps", { returnObjects: true }) as { title: string; desc: string }[]
  ).map((s, i) => ({
    ...s,
    icon: STEP_ICONS[i] ?? Search,
    image: STEP_IMAGES[i] ?? PHOTOS.greyMetalHip,
  }));

  return (
    <section className="py-28 bg-background bg-wash-cool relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h4 className="text-primary font-semibold tracking-[0.2em] uppercase mb-3 text-xs">{t("process.eyebrow")}</h4>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-foreground leading-[1.05]">
            {t("process.title")}
          </h2>
          <p className="text-muted-foreground mt-6 text-lg leading-relaxed max-w-2xl mx-auto">
            {t("process.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg shingle-lift group flex flex-col"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  loading="lazy"
                  decoding="async"
                  src={s.image}
                  alt={`Step ${i + 1}: ${s.title}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute top-4 left-4 w-11 h-11 rounded-full bg-white shadow-lg border-2 border-primary flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-secondary text-white text-xs font-display font-bold flex items-center justify-center border-2 border-white shadow">
                  {i + 1}
                </div>
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-display font-bold tracking-tight text-white text-xl drop-shadow">
                    {s.title}
                  </h3>
                </div>
              </div>
              <div className="p-5 flex-1">
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
