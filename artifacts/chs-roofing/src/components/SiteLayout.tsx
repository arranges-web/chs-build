import { useEffect } from "react";
import { useLocation } from "wouter";
import Header from "./Header";
import Footer from "./Footer";
import StickyMobileBar from "./StickyMobileBar";
import ScrollProgress from "./ScrollProgress";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location]);

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/30 flex flex-col">
      <a href="#main" className="skip-link" data-testid="skip-to-content">
        Skip to main content
      </a>
      <ScrollProgress />
      <Header />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <Footer />
      <StickyMobileBar />
    </div>
  );
}
