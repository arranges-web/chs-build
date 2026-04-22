import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle, Shield, Home, Building2, Wrench, HardHat, Award, Star, Quote, ChevronRight, Clock, ShieldCheck, Phone, ChevronLeft, Play } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import Monogram from "@/components/Monogram";
import ProcessTimeline from "@/components/ProcessTimeline";
import ServiceArea from "@/components/ServiceArea";
import WarrantyFinancing from "@/components/WarrantyFinancing";
import FAQ from "@/components/FAQ";
import Credentials from "@/components/Credentials";
import StickyMobileBar from "@/components/StickyMobileBar";
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

const testimonials = [
  {
    name: "Melissa L.",
    date: "Apr 2025",
    text: "I hired Cordova to replace my roof. I dealt directly with Gustavo, he was great. He really worked with me and went out of his way to help me & answer all my questions. His crew did an awesome job!"
  },
  {
    name: "Angela",
    date: "Jan 2025",
    text: "Definitely a 5 star! Excellent Contractor for all your roof needs. Fast, efficient, excellent customer service, quality materials, responds to calls and questions in a timely manner, always on top of things, and no problems with clean up."
  },
  {
    name: "Petra",
    date: "Jan 2025",
    text: "Our experience working with Melissa from Cordova has been nothing but great. As honest as you can get a contractor these days. Highly recommend."
  },
  {
    name: "Karen",
    date: "Apr 2025",
    text: "Just had my roof done by Cordova after hurricane damage. They were so easy to work with. The job was completed so quickly and done well. The site was left clean. I couldn't have asked for better."
  },
  {
    name: "Rudy",
    date: "Jan 2025",
    text: "Melissa Blayman with Cordova is one of the most capable, reliable, and trustworthy business people we have ever met. She consistently keeps her promises, delivers on time, and prioritizes her customers above all else."
  },
  {
    name: "Brian",
    date: "Apr 2025",
    text: "Cordova was the only one who showed up on time as promised and delivered an actual quote on their first visit. They've been excellent. Resolved issues without complaint or undue expense. I would recommend them to anyone."
  },
  {
    name: "Christine",
    date: "Apr 2025",
    text: "Needed my roof repaired after the hurricane and CHS was the only one that came out quickly. Punctual, professional and experienced with metal roofs which is hard to find. Highly recommended."
  },
  {
    name: "Jennifer",
    date: "Apr 2025",
    text: "Highly recommend to anyone needing home services! Very professional, quick, and you can tell they have a lot of experience! Very pleased with the work."
  }
];

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

function BeforeAfterGallery() {
  const projects = [
    {
      label: "Hurricane Damage Restoration",
      before: "/images/before-storm.png",
      after: "/images/after-storm.png",
      location: "Cape Coral, FL"
    },
    {
      label: "Full Shingle Replacement",
      before: "/images/before-shingle.png",
      after: "/images/after-shingle.png",
      location: "Fort Myers, FL"
    },
    {
      label: "Commercial Flat to Metal",
      before: "/images/before-flat.png",
      after: "/images/after-metal.png",
      location: "Bonita Springs, FL"
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {projects.map((project, i) => (
        <FadeIn key={i} delay={i * 0.15}>
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-md group">
            <div className="relative">
              <div className="grid grid-cols-2">
                <div className="relative">
                  <img src={project.before} alt={`Before: ${project.label}`} className="w-full h-48 object-cover" />
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-0.5 rounded">BEFORE</div>
                </div>
                <div className="relative">
                  <img src={project.after} alt={`After: ${project.label}`} className="w-full h-48 object-cover" />
                  <div className="absolute bottom-2 right-2 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded">AFTER</div>
                </div>
              </div>
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center z-10">
                <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-primary">
                  <div className="flex gap-0.5">
                    <ChevronLeft className="w-3 h-3 text-primary" />
                    <ChevronRight className="w-3 h-3 text-primary" />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="font-bold text-foreground">{project.label}</p>
              <p className="text-sm text-muted-foreground mt-1">{project.location}</p>
            </div>
          </div>
        </FadeIn>
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

  const services = [
    {
      title: "Asphalt Shingles",
      desc: "Durable, cost-effective, and beautiful architectural shingles for your home.",
      icon: Home,
      image: "/images/hero-roof.png"
    },
    {
      title: "Metal Roofing",
      desc: "Premium standing seam metal roofs built to withstand Florida hurricanes.",
      icon: Shield,
      image: "/images/metal-roof.png"
    },
    {
      title: "Tile Roofs",
      desc: "Classic Southwest Florida terracotta and concrete tile roofing solutions.",
      icon: HardHat,
      image: "/images/tile-roof.png"
    },
    {
      title: "Flat & TPO Roofing",
      desc: "Energy-efficient flat roofing for commercial buildings and modern homes.",
      icon: Building2,
      image: "/images/flat-roof.png"
    }
  ];

  const team = [
    {
      name: "Gustavo Cordova",
      role: "Owner & Master Roofer",
      bio: "With over 15 years of hands-on roofing experience across Southwest Florida, Gustavo founded CHS Roofing on a simple principle: treat every client like family.",
      image: "/images/team-gustavo.png"
    },
    {
      name: "Melissa Blayman",
      role: "Customer Relations Manager",
      bio: "Melissa is the heartbeat of our customer experience. She ensures every project runs smoothly from first call to final inspection, with zero surprises.",
      image: "/images/team-melissa.png"
    },
    {
      name: "Carlos Rivera",
      role: "Lead Project Foreman",
      bio: "Carlos leads our in-house installation crew with a decade of Florida roofing under his belt. He's on every job site to guarantee every detail meets CHS standards.",
      image: "/images/team-foreman.png"
    }
  ];

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/30">
      <Header />

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
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-transparent"></div>
            <div className="absolute inset-0 bg-black/40"></div>
            {/* Subtle brand pattern overlay */}
            <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay" style={{
              backgroundImage: "repeating-linear-gradient(45deg, white 0 1px, transparent 1px 24px)"
            }} />
            <Monogram className="hidden lg:block absolute top-1/3 right-[8%] w-72 h-72 opacity-10 text-white" variant="outline" />
          </div>

          <div className="container mx-auto max-w-7xl px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-2xl"
              >
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/90 text-primary-foreground text-sm font-bold tracking-wide uppercase shadow-lg backdrop-blur-sm border border-white/20">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                    Southwest Florida's #1 Roofer
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-[hsl(var(--accent-gold))]/40 text-[hsl(var(--accent-gold))] text-xs font-bold tracking-wider uppercase">
                    <Award className="w-3.5 h-3.5" />
                    Family-Owned · Est. 2010
                  </div>
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.05] tracking-tight mb-6 uppercase drop-shadow-lg">
                  Protect Your Home With A <span className="text-primary drop-shadow-md">Roof Built To Last</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed max-w-xl font-medium">
                  Licensed, insured, and family-owned. From quick hurricane repairs to premium full replacements, CHS Roofing delivers battle-tested quality you can trust.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={scrollToContact}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-md font-bold text-lg tracking-wide transition-all shadow-[0_0_40px_rgba(200,20,50,0.4)] hover:shadow-[0_0_60px_rgba(200,20,50,0.6)] hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    Get Your Free Quote <ArrowRight className="w-5 h-5" />
                  </button>
                  <a
                    href="tel:+12390000000"
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-md font-bold text-lg tracking-wide transition-all flex items-center justify-center gap-2"
                  >
                    Call (239) XXX-XXXX
                  </a>
                </div>

                <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-1 text-white">
                    <span className="font-display text-3xl font-bold text-primary">15+</span>
                    <span className="text-xs uppercase tracking-wider font-semibold opacity-80">Years in Business</span>
                  </div>
                  <div className="flex flex-col gap-1 text-white">
                    <span className="font-display text-3xl font-bold text-primary">500+</span>
                    <span className="text-xs uppercase tracking-wider font-semibold opacity-80">Projects Completed</span>
                  </div>
                  <div className="flex flex-col gap-1 text-white">
                    <span className="font-display text-3xl font-bold text-primary">5★</span>
                    <span className="text-xs uppercase tracking-wider font-semibold opacity-80">Google Rated</span>
                  </div>
                  <div className="flex flex-col gap-1 text-white">
                    <span className="font-display text-3xl font-bold text-primary">24/7</span>
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
        <section className="bg-white border-b border-border py-8 relative z-20 -mt-8 shadow-xl mx-4 rounded-xl lg:mx-auto lg:max-w-7xl">
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

        {/* URGENCY / STORM DAMAGE */}
        <section className="py-20 bg-secondary text-secondary-foreground overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 transform origin-top"></div>
          <div className="container mx-auto max-w-7xl px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <FadeIn>
                <div className="bg-primary/10 border-l-4 border-primary p-8 rounded-r-xl">
                  <h2 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tight text-white mb-4">
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
                  <img src="/images/metal-roof.png" alt="Roof Inspection" className="w-full h-full object-cover" />
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
        <section className="py-24 bg-background">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h4 className="text-primary font-bold tracking-wider uppercase mb-2">Our Expertise</h4>
              <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight text-foreground">
                Premium Roofing Solutions
              </h2>
              <div className="w-24 h-1.5 bg-primary mx-auto mt-6"></div>
              <p className="text-muted-foreground mt-6 text-lg">
                We specialize in installing and repairing high-quality roofing systems for Southwest Florida's unique climate demands.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <FadeIn key={index} delay={index * 0.1}>
                  <div className="group relative bg-card border border-border rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                    <div className="h-48 overflow-hidden relative">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                      <service.icon className="absolute bottom-4 left-4 w-8 h-8 text-white z-20" />
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-xl font-display font-bold uppercase tracking-tight text-foreground mb-3 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground flex-grow mb-4">
                        {service.desc}
                      </p>
                      <button onClick={scrollToContact} className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1 group-hover:text-primary transition-colors mt-auto">
                        Learn More <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* PROCESS TIMELINE */}
        <ProcessTimeline />

        {/* VIDEO SHOWCASE SECTION */}
        <section className="py-24 bg-secondary relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-5">
            <img src="/images/hero-roof.png" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="container mx-auto max-w-7xl px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h4 className="text-primary font-bold tracking-wider uppercase mb-2">See Our Work</h4>
              <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight text-white">
                Metal & Commercial Roofing Excellence
              </h2>
              <div className="w-24 h-1.5 bg-primary mx-auto mt-6"></div>
              <p className="text-gray-300 mt-6 text-lg">
                Watch how our expert crews deliver flawless standing seam metal installations and commercial flat roofing — on time, every time.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Residential Metal Roofing Video */}
              <FadeIn>
                <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10 group relative bg-black">
                  <div className="relative aspect-video bg-secondary-foreground/5 flex items-center justify-center">
                    <img
                      src="/images/metal-roof.png"
                      alt="Residential Metal Roofing Installation"
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-[0_0_40px_rgba(200,20,50,0.6)] group-hover:scale-110 transition-transform">
                        <Play className="w-7 h-7 text-white ml-1" fill="white" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-xs font-bold uppercase tracking-widest text-primary">Residential</span>
                      <h3 className="text-xl font-display font-bold uppercase mt-1">Standing Seam Metal Roofing</h3>
                      <p className="text-sm text-gray-300 mt-1">Hurricane-rated, lifetime warranty installation</p>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* Commercial Flat Roofing Video */}
              <FadeIn delay={0.2}>
                <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10 group relative bg-black">
                  <div className="relative aspect-video bg-secondary-foreground/5 flex items-center justify-center">
                    <img
                      src="/images/flat-roof.png"
                      alt="Commercial Flat Roofing"
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-[0_0_40px_rgba(200,20,50,0.6)] group-hover:scale-110 transition-transform">
                        <Play className="w-7 h-7 text-white ml-1" fill="white" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-xs font-bold uppercase tracking-widest text-primary">Commercial</span>
                      <h3 className="text-xl font-display font-bold uppercase mt-1">Flat & TPO Roofing Systems</h3>
                      <p className="text-sm text-gray-300 mt-1">Energy-efficient, code-compliant installations</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>

            <div className="text-center mt-10">
              <button
                onClick={scrollToContact}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-md font-bold text-lg tracking-wide transition-all hover:-translate-y-1 shadow-lg"
              >
                Schedule a Free Walkthrough <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US / VALUE PROPS */}
        <section className="py-24 bg-muted border-y border-border relative">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <FadeIn>
                <div className="grid grid-cols-2 gap-4">
                  <img src="/images/tile-roof.png" alt="Tile Roof" className="rounded-xl shadow-lg w-full h-[300px] object-cover" />
                  <img src="/images/flat-roof.png" alt="Flat Roof" className="rounded-xl shadow-lg w-full h-[300px] object-cover mt-8" />
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div>
                  <h4 className="text-primary font-bold tracking-wider uppercase mb-2">The CHS Difference</h4>
                  <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight text-foreground mb-6">
                    We Treat Every Client Like Family
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8">
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

        {/* BEFORE / AFTER GALLERY */}
        <section className="py-24 bg-background">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h4 className="text-primary font-bold tracking-wider uppercase mb-2">Real Results</h4>
              <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight text-foreground">
                Before & After Transformations
              </h2>
              <div className="w-24 h-1.5 bg-primary mx-auto mt-6"></div>
              <p className="text-muted-foreground mt-6 text-lg">
                See the dramatic difference a quality CHS Roofing project makes for Southwest Florida homeowners.
              </p>
            </div>
            <BeforeAfterGallery />
            <div className="text-center mt-12">
              <button
                onClick={scrollToContact}
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-md font-bold text-lg tracking-wide transition-all hover:-translate-y-1"
              >
                Get Your Free Estimate <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* MANUFACTURER CREDENTIALS */}
        <Credentials />

        {/* TESTIMONIALS CAROUSEL */}
        <section className="py-24 bg-muted overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>

          <div className="container mx-auto max-w-7xl px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h4 className="text-primary font-bold tracking-wider uppercase mb-2">5-Star Reviews</h4>
              <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight text-foreground">
                Don't Just Take Our Word For It
              </h2>
              <div className="w-24 h-1.5 bg-primary mx-auto mt-6"></div>
            </div>
            <TestimonialsCarousel />
          </div>
        </section>

        {/* SERVICE AREA */}
        <ServiceArea />

        {/* MEET THE TEAM */}
        <section className="py-24 bg-background">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h4 className="text-primary font-bold tracking-wider uppercase mb-2">People You Can Trust</h4>
              <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight text-foreground">
                Meet Your Roofing Team
              </h2>
              <div className="w-24 h-1.5 bg-primary mx-auto mt-6"></div>
              <p className="text-muted-foreground mt-6 text-lg">
                Family-owned means you deal with the owners directly — not a call center.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {team.map((member, i) => (
                <FadeIn key={i} delay={i * 0.2}>
                  <div className="bg-card border border-border rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group">
                    <div className="h-64 overflow-hidden relative">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{member.role}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-display font-bold uppercase tracking-tight text-foreground mb-1">{member.name}</h3>
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

        {/* TRUST BADGES & PARTNERS */}
        <section className="py-14 bg-white border-y border-border/50">
          <div className="container mx-auto max-w-7xl px-4">
            <p className="text-center text-sm font-bold text-muted-foreground uppercase tracking-widest mb-10">Verified Ratings & Licenses</p>

            {/* Trust Badges Row */}
            <div className="flex flex-wrap justify-center items-center gap-6 mb-10">
              {/* Google 5-Star Badge */}
              <div className="flex items-center gap-3 border border-border rounded-xl px-5 py-3 shadow-sm bg-card hover:shadow-md transition-shadow">
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
              <div className="flex items-center gap-3 border border-border rounded-xl px-5 py-3 shadow-sm bg-card hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-[#006DA6] flex items-center justify-center text-white font-display font-bold text-lg">BBB</div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Accredited Business</p>
                  <p className="text-lg font-display font-bold text-[#006DA6]">A+ Rating</p>
                </div>
              </div>

              {/* Licensed Badge */}
              <div className="flex items-center gap-3 border border-border rounded-xl px-5 py-3 shadow-sm bg-card hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">FL State Licensed</p>
                  <p className="text-sm font-bold text-foreground">#CCC1333902</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* FINAL CTA & CONTACT FORM */}
        <section id="contact" className="py-24 bg-secondary relative">
          <div className="absolute inset-0 z-0 opacity-10">
            <img src="/images/hero-roof.png" alt="Background" className="w-full h-full object-cover" />
          </div>
          <div className="container mx-auto max-w-7xl px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <FadeIn>
                <div className="text-white max-w-xl">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold uppercase tracking-tight mb-6 leading-tight">
                    Ready For A <span className="text-primary">Better Roof?</span>
                  </h2>
                  <p className="text-xl text-gray-300 mb-8">
                    Get a free, honest assessment of your roof. No high-pressure sales tactics, just straight talk from local experts.
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-lg backdrop-blur-sm">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider">Call Us Directly</p>
                        <a href="tel:+12390000000" className="text-2xl font-bold text-white hover:text-primary transition-colors">
                          (239) XXX-XXXX
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-lg backdrop-blur-sm">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                        <CheckCircle className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider">Our Promise</p>
                        <p className="text-lg font-bold text-white">
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

      <Footer />
      <StickyMobileBar />
    </div>
  );
}
