import { lazy, Suspense, useEffect, useState } from "react";
import { useLocation } from "wouter";
import Header from "./Header";
import Footer from "./Footer";
import StickyMobileBar from "./StickyMobileBar";

// Defer the chat widget + social-proof toast — they aren't needed
// for first paint and they pull in framer-motion + sessionStorage
// reads. Mounting them after idle keeps mobile LCP / TBT clean.
const SupportChat = lazy(() => import("./SupportChat"));
const LocalInquiryToast = lazy(() => import("./LocalInquiryToast"));

function useAfterIdle(delayMs = 1200): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };
    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(() => setReady(true), { timeout: delayMs + 500 });
      return () => {
        if (typeof (w as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback === "function") {
          (w as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(id);
        }
      };
    }
    const t = window.setTimeout(() => setReady(true), delayMs);
    return () => window.clearTimeout(t);
  }, [delayMs]);
  return ready;
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const showDeferred = useAfterIdle();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location]);

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/30 flex flex-col">
      <a href="#main" className="skip-link" data-testid="skip-to-content">
        Skip to main content
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <Footer />
      <StickyMobileBar />
      {showDeferred && (
        <Suspense fallback={null}>
          <SupportChat />
          <LocalInquiryToast />
        </Suspense>
      )}
    </div>
  );
}
