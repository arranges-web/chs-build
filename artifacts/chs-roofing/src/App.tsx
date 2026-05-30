import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SiteLayout from "@/components/SiteLayout";
// Home is the default landing target — keep it eager so first paint
// has no extra round trip. Every other route is lazy-loaded on demand
// so the initial mobile bundle stays small.
import Home from "@/pages/Home";

const NotFound = lazy(() => import("@/pages/not-found"));
const Installation = lazy(() => import("@/pages/services/Installation"));
const Repair = lazy(() => import("@/pages/services/Repair"));
const Maintenance = lazy(() => import("@/pages/services/Maintenance"));
const StormDamage = lazy(() => import("@/pages/services/StormDamage"));
const SpecialtyRoofing = lazy(() => import("@/pages/services/SpecialtyRoofing"));
const Gutters = lazy(() => import("@/pages/services/Gutters"));
const RoofCoating = lazy(() => import("@/pages/services/RoofCoating"));
const Shingles = lazy(() => import("@/pages/materials/Shingles"));
const Metal = lazy(() => import("@/pages/materials/Metal"));
const Tile = lazy(() => import("@/pages/materials/Tile"));
const Flat = lazy(() => import("@/pages/materials/Flat"));
const GalleryResidential = lazy(() => import("@/pages/gallery/Residential"));
const GalleryCommercial = lazy(() => import("@/pages/gallery/Commercial"));
const GalleryMultifamily = lazy(() => import("@/pages/gallery/Multifamily"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Estimator = lazy(() => import("@/pages/Estimator"));
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const Admin = lazy(() => import("@/pages/Admin"));
const AdminRegister = lazy(() => import("@/pages/AdminRegister"));
const Portal = lazy(() => import("@/pages/Portal"));

const queryClient = new QueryClient();

/**
 * Minimal Suspense fallback — kept brand-coloured but invisible
 * enough to avoid a flash. Most lazy chunks resolve in under a
 * second on a modern phone.
 */
function RouteFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" aria-hidden="true">
      <div className="w-9 h-9 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

// Each lazy chunk gets its own Suspense boundary so the SiteLayout
// chrome (header, footer, scroll progress) doesn't unmount when the
// user moves between pages.
type Page = React.LazyExoticComponent<React.ComponentType<unknown>>;
const lazyEl = (C: Page) => (
  <Suspense fallback={<RouteFallback />}>
    <C />
  </Suspense>
);

function MainSiteRoutes() {
  return (
    <SiteLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/services/installation">{lazyEl(Installation)}</Route>
        <Route path="/services/repair">{lazyEl(Repair)}</Route>
        <Route path="/services/maintenance">{lazyEl(Maintenance)}</Route>
        <Route path="/services/storm-damage">{lazyEl(StormDamage)}</Route>
        <Route path="/services/specialty-roofing">{lazyEl(SpecialtyRoofing)}</Route>
        <Route path="/services/gutters">{lazyEl(Gutters)}</Route>
        <Route path="/services/roof-coating">{lazyEl(RoofCoating)}</Route>
        <Route path="/materials/asphalt-shingles">{lazyEl(Shingles)}</Route>
        <Route path="/materials/metal">{lazyEl(Metal)}</Route>
        <Route path="/materials/tile">{lazyEl(Tile)}</Route>
        <Route path="/materials/flat">{lazyEl(Flat)}</Route>
        <Route path="/gallery/residential">{lazyEl(GalleryResidential)}</Route>
        <Route path="/gallery/commercial">{lazyEl(GalleryCommercial)}</Route>
        <Route path="/gallery/multifamily">{lazyEl(GalleryMultifamily)}</Route>
        <Route path="/about">{lazyEl(About)}</Route>
        <Route path="/contact">{lazyEl(Contact)}</Route>
        <Route path="/estimator">{lazyEl(Estimator)}</Route>
        <Route path="/privacy">{lazyEl(Privacy)}</Route>
        <Route path="/terms">{lazyEl(Terms)}</Route>
        <Route>{lazyEl(NotFound)}</Route>
      </Switch>
    </SiteLayout>
  );
}

function Router() {
  return (
    <Switch>
      {/* Dedicated paid-traffic landing page renders OUTSIDE the main site
          chrome — minimal nav, no chat widget, no social-proof toast. */}
      <Route path="/free-quote">{lazyEl(LandingPage)}</Route>
      <Route path="/admin/join">{lazyEl(AdminRegister)}</Route>
      <Route path="/admin">{lazyEl(Admin)}</Route>
      <Route path="/portal">{lazyEl(Portal)}</Route>
      <Route>
        <MainSiteRoutes />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
}

export default App;
