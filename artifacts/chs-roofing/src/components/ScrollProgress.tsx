import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * Top-of-page scroll progress indicator.
 * A thin crimson bar that fills with scroll, with a small roof-peak (▲) marker
 * riding the leading edge — a subtle nod to the CHS roof brand.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });
  // Marker rides the leading edge of the bar.
  const markerLeft = useTransform(
    scrollYProgress,
    (v) => `calc(${(v * 100).toFixed(2)}% - 7px)`,
  );

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[60] motion-reduce:hidden pointer-events-none"
    >
      <motion.div
        style={{ scaleX }}
        className="h-[3px] origin-left bg-gradient-to-r from-primary to-primary/85"
      />
      <motion.div
        style={{ left: markerLeft }}
        className="absolute -top-[1px] will-change-transform"
      >
        <svg width="14" height="9" viewBox="0 0 14 9">
          <path d="M7 0 L14 9 L0 9 Z" fill="hsl(var(--primary))" />
        </svg>
      </motion.div>
    </div>
  );
}
