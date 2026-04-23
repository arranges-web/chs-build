import { useEffect } from "react";
import { useLocation } from "wouter";
import Header from "./Header";
import Footer from "./Footer";
import StickyMobileBar from "./StickyMobileBar";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location]);

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/30 flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <StickyMobileBar />
    </div>
  );
}
