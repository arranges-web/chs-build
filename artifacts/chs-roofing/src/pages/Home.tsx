import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Shield, Home, Building2, Wrench, HardHat, Award, Star, Quote, ChevronRight, Clock, ShieldCheck, Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export default function HomePage() {
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

  const testimonials = [
    {
      name: "Melissa L.",
      date: "04/14/25",
      text: "I hired Cordova to replace my roof. I dealt directly with Gustavo, he was great. He really worked with me and went out of his way to help me & answer all my questions. His crew did an awesome job!"
    },
    {
      name: "Angela",
      date: "01/21/25",
      text: "Definitely a 5 star! Excellent Contractor for all your roof needs. Fast, efficient, excellent customer service, quality materials, responds to calls and questions in a timely manner, always on top of things, and no problems with clean up."
    },
    {
      name: "Petra",
      date: "01/20/25",
      text: "Our experience working with Melissa from Cordova has been nothing but great. As honest as you can get a contractor these days. Highly recommend."
    },
    {
      name: "Karen",
      date: "04/02/25",
      text: "Just had my roof done by Cordova after hurricane damage. They were so easy to work with. The job was completed so quickly and done well. The site was left clean. I couldn't have asked for better."
    },
    {
      name: "Rudy",
      date: "01/22/25",
      text: "Melissa Blayman with Cordova is one of the most capable, reliable, and trustworthy business people we have ever met. She consistently keeps her promises, delivers on time, and prioritizes her customers above all else."
    },
    {
      name: "Brian",
      date: "04/22/25",
      text: "Cordova was the only one who showed up on time as promised and delivered an actual quote on their first visit. They've been excellent. Resolved issues without complaint or undue expense. I would recommend them to anyone."
    },
    {
      name: "Christine",
      date: "04/29/25",
      text: "Needed my roof repaired after the hurricane and CHS was the only one that came out quickly. Punctual, professional and experienced with metal roofs which is hard to find. Highly recommended."
    },
    {
      name: "Jennifer",
      date: "04/29/25",
      text: "Highly recommend to anyone needing home services! Very professional, quick, and you can tell they have a lot of experience! Very pleased with the work."
    }
  ];

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/30">
      <Header />

      <main>
        {/* HERO SECTION */}
        <section className="relative pt-24 pb-32 lg:pt-32 lg:pb-48 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/hero-roof.png" 
              alt="Premium Florida Roofing" 
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-transparent"></div>
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          
          <div className="container mx-auto max-w-7xl px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-2xl"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/90 text-primary-foreground text-sm font-bold tracking-wide uppercase mb-6 shadow-lg backdrop-blur-sm border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  Southwest Florida's #1 Roofer
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.05] tracking-tight mb-6 uppercase drop-shadow-lg">
                  Protect Your Home With A <span className="text-primary drop-shadow-md">Roof Built To Last</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed max-w-xl font-medium text-shadow-sm">
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
                    <span className="font-display text-3xl font-bold text-primary">5★</span>
                    <span className="text-xs uppercase tracking-wider font-semibold opacity-80">Google Rated</span>
                  </div>
                  <div className="flex flex-col gap-1 text-white">
                    <span className="font-display text-3xl font-bold text-primary">A+</span>
                    <span className="text-xs uppercase tracking-wider font-semibold opacity-80">BBB Accredited</span>
                  </div>
                  <div className="flex flex-col gap-1 text-white">
                    <span className="font-display text-3xl font-bold text-primary">100%</span>
                    <span className="text-xs uppercase tracking-wider font-semibold opacity-80">Licensed</span>
                  </div>
                  <div className="flex flex-col gap-1 text-white">
                    <span className="font-display text-3xl font-bold text-primary">24/7</span>
                    <span className="text-xs uppercase tracking-wider font-semibold opacity-80">Response</span>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="hidden lg:block relative"
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

        {/* TESTIMONIALS */}
        <section className="py-24 bg-background overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto max-w-7xl px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight text-foreground">
                Don't Just Take Our Word For It
              </h2>
              <div className="w-24 h-1.5 bg-primary mx-auto mt-6"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonials.map((t, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="bg-card border border-border p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow relative h-full flex flex-col">
                    <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10" />
                    <div className="flex gap-1 mb-4 text-primary">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-primary" />)}
                    </div>
                    <p className="text-foreground font-medium italic mb-6 flex-grow leading-relaxed">
                      "{t.text}"
                    </p>
                    <div>
                      <p className="font-bold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.date}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* PARTNERS LOGO STRIP */}
        <section className="py-12 bg-white border-y border-border/50">
          <div className="container mx-auto max-w-7xl px-4">
            <p className="text-center text-sm font-bold text-muted-foreground uppercase tracking-widest mb-8">Trusted By Industry Leaders</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              {['Carlisle', 'GAF', 'Metal Alliance', 'ABC Supply', 'CertainTeed', 'TAMKO', 'Westlake Royal'].map((partner, i) => (
                <span key={i} className="font-display text-xl md:text-2xl font-bold text-foreground uppercase tracking-wider">{partner}</span>
              ))}
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
    </div>
  );
}
