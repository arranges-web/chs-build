import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle, Shield, Home, Building2, Wrench, HardHat, Award, Star, Quote, ChevronRight, Clock, ShieldCheck, Phone, ChevronLeft, Sparkles, CloudLightning, Droplets, Paintbrush, Calculator } from "lucide-react";
import { Link } from "wouter";
import ContactForm from "@/components/ContactForm";
import ProcessTimeline from "@/components/ProcessTimeline";
import ServiceArea from "@/components/ServiceArea";
import WarrantyFinancing from "@/components/WarrantyFinancing";
import FAQ from "@/components/FAQ";
import Credentials from "@/components/Credentials";
import Partners from "@/components/Partners";
import BBBBadges from "@/components/BBBBadges";
import CountUp from "@/components/CountUp";
import SectionEyebrow from "@/components/SectionEyebrow";
import TestimonialMarquee from "@/components/TestimonialMarquee";
import RoofDivider from "@/components/RoofDivider";
import ShingleDivider from "@/components/ShingleDivider";
import RaindropOverlay from "@/components/RaindropOverlay";
import { TEAM, SITE, SERVICES, MATERIALS, TESTIMONIALS, PHOTOS } from "@/lib/site-config";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useRef, useState } from "react";

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const testimonials = TESTIMONIALS;

function TestimonialsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", slidesToScroll: 1 });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="flex-none w-[90%] sm:w-[48%] lg:w-[31%] bg-card border border-border p-8 rounded-xl shadow-sm relative flex flex-col">
              <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10" />
              <div className="flex gap-1 mb-4 text-primary">
                {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-primary" />)}
              </div>
              <p className="text-foreground font-medium italic mb-6 flex-grow leading-relaxed">
                "{t.text}"
              </p>
              <div>
                <p className="font-bold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={scrollPrev}
          className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === selectedIndex ? "bg-primary w-6" : "bg-border"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={scrollNext}
          className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function FeaturedProjectsGallery() {
  const projects = [
    { src: PHOTOS.beachfrontMetal, label: "Standing Seam · Sanibel", category: "Residential · Metal" },
    { src: PHOTOS.terracottaWaterfront, label: "Terracotta Tile · Naples", category: "Residential · Tile" },
    { src: PHOTOS.flatTpoCrew, label: "TPO Flat · Cape Coral", category: "Commercial · Flat" },
    { src: PHOTOS.darkMetalAerial, label: "Dark Metal Aerial · Fort Myers", category: "Residential · Metal" },
    { src: PHOTOS.multiToneTile, label: "Multi-Tone Tile · Bonita Springs", category: "Residential · Tile" },
    { src: PHOTOS.whiteStandingSeam, label: "White Standing Seam · Cape Coral", category: "Residential · Metal" },
    { src: PHOTOS.silverMetalPoolCage, label: "Silver Metal · Punta Gorda", category: "Residential · Metal" },
    { src: PHOTOS.finishedGreyShingle, label: "Architectural Shingle · Fort Myers", category: "Residential · Shingle" },
  ];

  // Index of the spans in CSS-grid units to vary heights without overflowing.
  const heights = [
    "row-span-2",
    "",
    "",
    "row-span-2",
    "",
    "",
    "",
    "",
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[180px] md:auto-rows-[210px] gap-3 md:gap-4">
      {projects.map((p, i) => (
        <motion.figure
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.45, delay: (i % 4) * 0.06 }}
          className={`relative rounded-2xl overflow-hidden border border-border/60 shadow-sm group ${heights[i] ?? ""}`}
        >
          <img
            loading="lazy"
            decoding="async"
            src={p.src}
            alt={p.label}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <figcaption className="absolute bottom-3 left-3 right-3 text-white">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-foreground/85">
              {p.category}
            </p>
            <p className="font-display font-bold tracking-tight text-sm md:text-base leading-tight drop-shadow">
              {p.label}
            </p>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], [0, 180]);

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const SERVICE_ICONS: Record<string, typeof Home> = {
    installation: Home,
    repair: Wrench,
    maintenance: ShieldCheck,
    "storm-damage": CloudLightning,
    "specialty-roofing": Sparkles,
    gutters: Droplets,
    "roof-coating": Paintbrush,
  };
  const SERVICE_IMAGES: Record<string, string> = {
    installation: PHOTOS.beachfrontMetal,
    repair: PHOTOS.tearOff,
    maintenance: PHOTOS.greyMetalHip,
    "storm-damage": PHOTOS.redMetalAccent,
    "specialty-roofing": PHOTOS.terracottaWaterfront,
    gutters: PHOTOS.silverMetalPorch,
    "roof-coating": PHOTOS.flatTpoCrew,
  };
  const services = SERVICES.map((s) => ({
    title: s.title,
    desc: s.short,
    icon: SERVICE_ICONS[s.slug] ?? Home,
    image: SERVICE_IMAGES[s.slug] ?? PHOTOS.beachfrontMetal,
    href: s.href,
  }));

  const team = TEAM;

  return (
    <>
      <main>
        {/* HERO SECTION */}
        <section ref={heroRef} className="relative pt-24 pb-32 lg:pt-32 lg:pb-48 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <motion.img
              src="/images/hero-roof.png"
              alt="Premium Florida Roofing"
              style={{ y: parallaxY, scale: 1.15 }}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/75 to-secondary/30"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-secondary/40"></div>
            {/* Subtle brand pattern overlay */}
            <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay" style={{
              backgroundImage: "repeating-linear-gradient(45deg, white 0 1px, transparent 1px 28px)"
            }} />
            <img src={SITE.logo} alt="" aria-hidden="true" className="hidden lg:block absolute top-1/3 right-[8%] w-72 h-72 opacity-10 object-contain" />
          </div>

          <div className="container mx-auto max-w-7xl px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-2xl"
              >
                <div className="flex flex-wrap items-center gap-3 mb-7">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/90 text-primary-foreground text-xs font-semibold tracking-wide uppercase shadow-lg backdrop-blur-md border border-white/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    Southwest Florida's #1 Roofer
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-[hsl(var(--accent-gold))]/40 text-[hsl(var(--accent-gold))] text-[11px] font-semibold tracking-wider uppercase">
                    <Award className="w-3.5 h-3.5" />
                    Family-Owned · Est. 2010
                  </div>
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.02] tracking-tight mb-6 drop-shadow-lg">
                  Protect Your Home With A <span className="text-primary drop-shadow-md">Roof Built To Last</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-200/90 mb-10 leading-relaxed max-w-xl font-normal">
                  Licensed, insured, and family-owned. From quick hurricane repairs to premium full replacements, CHS Roofing delivers battle-tested quality you can trust.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/contact"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-7 py-4 rounded-full font-semibold text-base tracking-tight transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
                  >
                    Get Your Free Quote <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href={`tel:${SITE.phoneTel}`}
                    className="bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/25 text-white px-7 py-4 rounded-full font-semibold text-base tracking-tight transition-all duration-300 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
                  >
                    <Phone className="w-4 h-4" />
                    Call {SITE.phoneDisplay}
                  </a>
                </div>

                <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-1 text-white">
                    <CountUp to={15} suffix="+" className="font-display text-3xl font-bold text-primary" />
                    <span className="text-xs uppercase tracking-wider font-semibold opacity-80">Years in Business</span>
                  </div>
                  <div className="flex flex-col gap-1 text-white">
                    <CountUp to={500} suffix="+" className="font-display text-3xl font-bold text-primary" />
                    <span className="text-xs uppercase tracking-wider font-semibold opacity-80">Projects Completed</span>
                  </div>
                  <div className="flex flex-col gap-1 text-white">
                    <CountUp
                      to={5}
                      duration={1.2}
                      format={(n) => `${n.toFixed(1)}★`}
                      className="font-display text-3xl font-bold text-primary"
                    />
                    <span className="text-xs uppercase tracking-wider font-semibold opacity-80">Google Rated</span>
                  </div>
                  <div className="flex flex-col gap-1 text-white">
                    <CountUp
                      to={247}
                      duration={1.4}
                      format={(n) => {
                        const r = Math.round(n);
                        return `${Math.floor(r / 10)}/${r % 10}`;
                      }}
                      className="font-display text-3xl font-bold text-primary"
                    />
                    <span className="text-xs uppercase tracking-wider font-semibold opacity-80">Emergency Response</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="relative"
              >
                <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full"></div>
                <div className="relative" id="hero-form">
                  <ContactForm />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* TRUST BAR */}
        <section className="bg-white/95 backdrop-blur-xl border border-border/60 py-7 relative z-20 -mt-10 shadow-xl mx-4 rounded-2xl lg:mx-auto lg:max-w-7xl">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 md:gap-4 text-center">
              <div className="flex items-center gap-2 text-foreground font-bold">
                <CheckCircle className="w-5 h-5 text-primary" /> License #CCC1333902
              </div>
              <div className="hidden md:block w-px h-6 bg-border"></div>
              <div className="flex items-center gap-2 text-foreground font-bold">
                <Shield className="w-5 h-5 text-primary" /> Fully Insured
              </div>
              <div className="hidden lg:block w-px h-6 bg-border"></div>
              <div className="flex items-center gap-2 text-foreground font-bold">
                <Award className="w-5 h-5 text-primary" /> BBB Accredited
              </div>
              <div className="hidden md:block w-px h-6 bg-border"></div>
              <div className="flex items-center gap-2 text-foreground font-bold">
                <Home className="w-5 h-5 text-primary" /> Family-Owned
              </div>
              <div className="hidden lg:block w-px h-6 bg-border"></div>
              <div className="flex items-center gap-2 text-foreground font-bold">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> 5-Star Google Rating
              </div>
            </div>
          </div>
        </section>

        {/* Subtle shingle divider between the floating trust bar and the dark storm-damage section. */}
        <ShingleDivider variant="light" className="container mx-auto max-w-7xl px-4" />

        {/* URGENCY / STORM DAMAGE */}
        <section className="py-20 bg-secondary text-secondary-foreground overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 transform origin-top"></div>
          <RaindropOverlay count={20} tint="light" className="z-0" />
          <div className="container mx-auto max-w-7xl px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <FadeIn>
                <div className="bg-primary/10 border-l-4 border-primary p-10 rounded-r-2xl backdrop-blur-sm">
                  <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-white mb-4">
                    Storm Damage? Don't Wait.
                  </h2>
                  <p className="text-lg text-gray-300 mb-6">
                    Florida storms can compromise your roof's integrity invisibly. We provide fast, emergency tarping, thorough inspections, and complete restoration services to protect your home.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {[
                      "Free, no-obligation storm damage inspection",
                      "Emergency leak response and tarping",
                      "Insurance claims assistance and documentation",
                      "Complete structural repair and replacement"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-primary shrink-0" />
                        <span className="text-white font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={scrollToContact}
                    className="text-primary font-bold uppercase tracking-wider flex items-center gap-2 hover:gap-4 transition-all"
                  >
                    Request an Inspection <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="relative h-[400px] rounded-xl overflow-hidden shadow-2xl border border-white/10">
                  <img loading="lazy" decoding="async" src={PHOTOS.tearOff} alt="Storm-damage tear-off and decking inspection in progress" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-lg text-white font-semibold">
                      "Punctual, professional and experienced... Highly recommended." — Christine
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section className="py-28 bg-background bg-wash-warm">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <SectionEyebrow number="01" label="Our Services" className="mx-auto" />
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-foreground leading-[1.05]">
                Everything Your Roof Needs — In One Place
              </h2>
              <p className="text-muted-foreground mt-6 text-lg leading-relaxed max-w-2xl mx-auto">
                From new installs to emergency hurricane response, our crews handle the full lifecycle of every roof we touch.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {services.map((service, index) => (
                <FadeIn key={index} delay={index * 0.08}>
                  <Link
                    href={service.href}
                    className="group relative bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg shingle-lift h-full flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    data-testid={`service-card-${index}`}
                  >
                    <div className="h-40 overflow-hidden relative">
                      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors z-10"></div>
                      <img loading="lazy" decoding="async"
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                      <div className="absolute bottom-3 left-3 z-20 w-9 h-9 rounded-xl bg-white/95 backdrop-blur flex items-center justify-center shadow">
                        <service.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="absolute top-3 right-3 z-20 text-[10px] font-display font-bold tracking-[0.2em] text-white/80">
                        0{index + 1}
                      </span>
                    </div>
                    <div className="p-5 flex-grow flex flex-col">
                      <h3 className="text-base font-display font-bold tracking-tight text-foreground mb-2 group-hover:text-primary transition-colors leading-tight relative inline-block w-fit after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-0 after:bg-primary after:transition-[width] after:duration-500 group-hover:after:w-full">
                        {service.title}
                      </h3>
                      <p className="text-sm text-muted-foreground flex-grow mb-4 leading-relaxed">
                        {service.desc}
                      </p>
                      <span className="text-xs font-semibold text-foreground tracking-wide uppercase flex items-center gap-1 group-hover:text-primary group-hover:gap-2 transition-all mt-auto">
                        Learn More <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ESTIMATOR PROMO */}
        <section className="py-16 bg-background">
          <div className="container mx-auto max-w-7xl px-4">
            <FadeIn>
              <div className="relative overflow-hidden rounded-3xl bg-secondary text-white p-8 md:p-12 shadow-2xl">
                <div className="absolute -top-16 -right-16 w-72 h-72 bg-primary/25 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative grid md:grid-cols-[1fr_auto] gap-8 items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary mb-4">
                      <Sparkles className="w-3.5 h-3.5" />
                      New · Free Tool
                    </div>
                    <h2 className="font-display font-bold tracking-tight text-3xl md:text-4xl lg:text-5xl leading-[1.05]">
                      Get an instant <span className="text-primary">roof estimate</span> in under a minute.
                    </h2>
                    <p className="text-gray-300/90 mt-4 text-base md:text-lg leading-relaxed max-w-2xl">
                      Pick your material, dial in pitch and complexity, and our estimator delivers a transparent ballpark price — no email or phone required.
                    </p>
                  </div>
                  <Link
                    href="/estimator"
                    className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-7 py-4 rounded-full font-semibold tracking-tight shadow-lg shadow-primary/40 hover:-translate-y-0.5 transition-all whitespace-nowrap"
                  >
                    <Calculator className="w-4 h-4" />
                    Try the Estimator
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* PROCESS TIMELINE */}
        <ProcessTimeline />

        {/* WHY CHOOSE US / VALUE PROPS */}
        <section className="py-28 bg-muted bg-wash-cool relative">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <FadeIn>
                <div className="grid grid-cols-2 gap-4">
                  <img loading="lazy" decoding="async" src={PHOTOS.terracottaWaterfront} alt="Terracotta tile roof on a SWFL waterfront home" className="rounded-2xl shadow-md w-full h-[300px] object-cover" />
                  <img loading="lazy" decoding="async" src={PHOTOS.flatTpoCrew} alt="CHS crew installing TPO on a commercial flat roof" className="rounded-2xl shadow-md w-full h-[300px] object-cover mt-8" />
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div>
                  <SectionEyebrow number="02" label="The CHS Difference" />
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-foreground mb-6 leading-[1.05]">
                    We Treat Every Client Like Family
                  </h2>
                  <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                    We don't just build roofs; we build lasting partnerships based on trust, security, and transparent communication. No hidden surprises.
                  </p>

                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Wrench className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">Expert Craftsmanship</h3>
                        <p className="text-muted-foreground">Our knowledgeable team brings years of industry expertise to every single project.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">Timely & Dependable</h3>
                        <p className="text-muted-foreground">Count on us to show up when promised and complete the job efficiently.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">Licensed & Insured</h3>
                        <p className="text-muted-foreground">Complete peace of mind knowing your property is protected.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Subtle shingle divider between the cool "Why Choose Us" section and the warm Before/After gallery. */}
        <ShingleDivider variant="light" className="bg-background" />

        {/* FEATURED PROJECTS GALLERY */}
        <section className="py-28 bg-background">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <SectionEyebrow number="03" label="Featured Projects" className="mx-auto" />
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-foreground leading-[1.05]">
                Recent Roofs Across Southwest Florida
              </h2>
              <p className="text-muted-foreground mt-6 text-lg leading-relaxed max-w-2xl mx-auto">
                A small selection of recent residential and commercial roofs from Sanibel to Sarasota — built to weather the climate, designed to last.
              </p>
            </div>
            <FeaturedProjectsGallery />
            <div className="text-center mt-12 flex flex-wrap justify-center gap-3">
              <Link
                href="/gallery/residential"
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-full font-semibold text-sm tracking-tight transition-all duration-300 hover:-translate-y-0.5 shadow-md shadow-secondary/20"
              >
                Residential Gallery <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/gallery/commercial"
                className="inline-flex items-center gap-2 bg-card border border-border/60 text-foreground hover:border-primary/40 px-6 py-3 rounded-full font-semibold text-sm tracking-tight transition-all"
              >
                Commercial Gallery
              </Link>
              <Link
                href="/gallery/multifamily"
                className="inline-flex items-center gap-2 bg-card border border-border/60 text-foreground hover:border-primary/40 px-6 py-3 rounded-full font-semibold text-sm tracking-tight transition-all"
              >
                Multifamily Gallery
              </Link>
            </div>
          </div>
        </section>

        <RoofDivider variant="dark" className="text-foreground bg-background" />

        {/* MANUFACTURER CREDENTIALS */}
        <Credentials />

        {/* TESTIMONIALS CAROUSEL */}
        <section className="py-24 bg-muted overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>

          <div className="container mx-auto max-w-7xl px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <SectionEyebrow number="04" label="5-Star Reviews" className="mx-auto" />
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-foreground leading-[1.05]">
                Don't Just Take Our Word For It
              </h2>
            </div>
            <TestimonialsCarousel />
            <div className="text-center mt-10">
              <a
                href={SITE.social.google}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-card border border-border/60 hover:border-primary/40 px-5 py-2.5 rounded-full text-sm font-semibold text-foreground hover:text-primary transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                Read all reviews on Google
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
          <TestimonialMarquee />
        </section>

        {/* SERVICE AREA */}
        <ServiceArea />

        {/* MEET THE TEAM */}
        <section className="py-28 bg-background">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <SectionEyebrow number="05" label="People You Can Trust" className="mx-auto" />
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-foreground leading-[1.05]">
                Meet Your Roofing Team
              </h2>
              <p className="text-muted-foreground mt-6 text-lg leading-relaxed max-w-2xl mx-auto">
                Family-owned means you deal with the owners directly — not a call center.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {team.map((member, i) => (
                <FadeIn key={i} delay={(i % 3) * 0.15}>
                  <div className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg lift-on-hover group">
                    <div className="h-64 overflow-hidden relative">
                      <img loading="lazy" decoding="async"
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-primary text-white text-[11px] font-semibold px-3 py-1.5 rounded-full uppercase tracking-[0.15em] shadow-md shadow-primary/30">{member.role}</span>
                      </div>
                    </div>
                    <div className="p-7">
                      <h3 className="text-2xl font-display font-bold tracking-tight text-foreground mb-2">{member.name}</h3>
                      <p className="text-muted-foreground leading-relaxed">{member.bio}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* WARRANTY & FINANCING */}
        <WarrantyFinancing />

        {/* FAQ */}
        <FAQ />

        {/* MANUFACTURER PARTNERS */}
        <Partners />

        {/* TRUST BADGES & PARTNERS */}
        <section className="py-16 bg-white border-y border-border/40">
          <div className="container mx-auto max-w-7xl px-4">
            <p className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-10">Verified Ratings & Licenses</p>

            {/* Trust Badges Row */}
            <div className="flex flex-wrap justify-center items-center gap-4 mb-2">
              {/* Google 5-Star Badge */}
              <div className="flex items-center gap-3 border border-border/60 rounded-2xl px-5 py-3.5 shadow-sm bg-card hover:shadow-md transition-all hover:-translate-y-0.5">
                <svg className="w-6 h-6" viewBox="0 0 48 48" fill="none">
                  <path d="M43.6 20.5H24v7h11.1c-1.1 5.4-5.8 9-11.1 9a12.5 12.5 0 010-25c3.1 0 5.9 1.1 8.1 3l5-5A21 21 0 003 24a21 21 0 0021 21 21 21 0 0020.6-25.5z" fill="#4285F4"/>
                  <path d="M6.3 14.7l5.8 4.3A12.5 12.5 0 0124 11.5c3.1 0 5.9 1.1 8.1 3l5-5A21 21 0 006.3 14.7z" fill="#EA4335"/>
                  <path d="M24 45a21 21 0 0014.6-5.8l-6.7-5.5A12.5 12.5 0 0124 36.5a12.4 12.4 0 01-11.7-8.2l-5.9 4.5A21 21 0 0024 45z" fill="#34A853"/>
                  <path d="M43.6 20.5H24v7h11.1a11.3 11.3 0 01-4.2 5.7l6.7 5.5C41.5 35 44 30 44 24c0-1.2-.1-2.4-.4-3.5z" fill="#FBBC05"/>
                </svg>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Google Rating</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
                    <span className="text-sm font-bold text-foreground ml-1">5.0</span>
                  </div>
                </div>
              </div>

              {/* BBB A+ Badge */}
              <div className="flex items-center gap-3 border border-border/60 rounded-2xl px-5 py-3.5 shadow-sm bg-card hover:shadow-md transition-all hover:-translate-y-0.5">
                <div className="w-10 h-10 rounded-lg bg-[#006DA6] flex items-center justify-center text-white font-display font-bold text-lg">BBB</div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Accredited Business</p>
                  <p className="text-lg font-display font-bold text-[#006DA6]">A+ Rating</p>
                </div>
              </div>

              {/* GAF Certified Badge */}
              <div className="flex items-center gap-3 border border-border/60 rounded-2xl px-5 py-3.5 shadow-sm bg-card hover:shadow-md transition-all hover:-translate-y-0.5">
                <div className="w-10 h-10 rounded-lg bg-[#0033A0] flex items-center justify-center text-white font-display font-bold text-sm">GAF</div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Manufacturer Certified</p>
                  <p className="text-sm font-bold text-[#0033A0]">GAF® Certified</p>
                </div>
              </div>

              {/* Certified Roofing Contractor Badge */}
              <div className="flex items-center gap-3 border border-border/60 rounded-2xl px-5 py-3.5 shadow-sm bg-card hover:shadow-md transition-all hover:-translate-y-0.5">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">FL Certified</p>
                  <p className="text-sm font-bold text-foreground">Roofing Contractor</p>
                </div>
              </div>

              {/* Licensed Badge */}
              <div className="flex items-center gap-3 border border-border/60 rounded-2xl px-5 py-3.5 shadow-sm bg-card hover:shadow-md transition-all hover:-translate-y-0.5">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">FL State Licensed</p>
                  <p className="text-sm font-bold text-foreground">#CCC1333902</p>
                </div>
              </div>
            </div>

            {/* Official BBB badges */}
            <div className="mt-10 pt-8 border-t border-border/60">
              <p className="text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.22em] mb-5">
                BBB Accredited · West Florida
              </p>
              <BBBBadges />
            </div>
          </div>
        </section>

        {/* FINAL CTA & CONTACT FORM */}
        <section id="contact" className="py-28 bg-secondary relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-10">
            <img loading="lazy" decoding="async" src={PHOTOS.darkMetalEstate} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-secondary via-secondary to-primary/15"></div>
          <div className="container mx-auto max-w-7xl px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <FadeIn>
                <div className="text-white max-w-xl">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6 leading-[1.05]">
                    Ready For A <span className="text-primary">Better Roof?</span>
                  </h2>
                  <p className="text-xl text-gray-300/90 mb-10 leading-relaxed">
                    Get a free, honest assessment of your roof. No high-pressure sales tactics, just straight talk from local experts.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 glass-surface-dark border border-white/10 p-5 rounded-2xl">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0 shadow-md shadow-primary/30">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-[0.2em]">Call Us Directly</p>
                        <a href="tel:+12390000000" className="text-2xl font-bold text-white hover:text-primary transition-colors tracking-tight">
                          (239) XXX-XXXX
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 glass-surface-dark border border-white/10 p-5 rounded-2xl">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                        <CheckCircle className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-[0.2em]">Our Promise</p>
                        <p className="text-lg font-semibold text-white tracking-tight">
                          Transparent pricing. Quality materials.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <ContactForm />
              </FadeIn>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
