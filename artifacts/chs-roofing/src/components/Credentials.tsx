import { motion } from "framer-motion";
import { Award, ShieldCheck, BadgeCheck, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

const ICONS = [Award, BadgeCheck, ShieldCheck, Star];
const ACCENTS: ("primary" | "gold")[] = ["primary", "gold", "primary", "gold"];

export default function Credentials() {
  const { t } = useTranslation();
  const items = (
    t("credentials.items", { returnObjects: true }) as { badge: string; label: string; desc: string }[]
  ).map((item, i) => ({
    ...item,
    icon: ICONS[i] ?? Award,
    accent: ACCENTS[i] ?? "primary",
  }));

  return (
    <section className="py-28 bg-background relative grain-overlay">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h4 className="text-primary font-semibold tracking-[0.2em] uppercase mb-3 text-xs">{t("credentials.eyebrow")}</h4>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-foreground leading-[1.05]">
            {t("credentials.title")}
          </h2>
          <p className="text-muted-foreground mt-6 text-lg leading-relaxed max-w-2xl mx-auto">
            {t("credentials.subtitle")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((c, i) => {
            const isGold = c.accent === "gold";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative bg-card border border-border/60 rounded-2xl p-7 shadow-sm hover:shadow-md lift-on-hover overflow-hidden group"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity ${isGold ? "bg-[hsl(var(--accent-gold))]" : "bg-primary"}`} />
                <div className="relative">
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-14 h-14 rounded-lg flex items-center justify-center border-2 ${isGold ? "bg-[hsl(var(--accent-gold))]/10 border-[hsl(var(--accent-gold))]" : "bg-primary/10 border-primary"}`}>
                      <c.icon className={`w-7 h-7 ${isGold ? "text-[hsl(var(--accent-gold))]" : "text-primary"}`} />
                    </div>
                    <div className="text-right">
                      <p className={`font-display text-xl font-bold tracking-tight ${isGold ? "text-[hsl(var(--accent-gold))]" : "text-primary"}`}>{c.badge}</p>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">{t("credentials.certified")}</p>
                    </div>
                  </div>
                  <h3 className="font-display font-bold tracking-tight text-foreground text-base mb-2 leading-tight">
                    {c.label}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
