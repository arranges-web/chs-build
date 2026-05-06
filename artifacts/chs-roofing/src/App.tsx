import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SiteLayout from "@/components/SiteLayout";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Installation from "@/pages/services/Installation";
import Repair from "@/pages/services/Repair";
import Maintenance from "@/pages/services/Maintenance";
import StormDamage from "@/pages/services/StormDamage";
import SpecialtyRoofing from "@/pages/services/SpecialtyRoofing";
import Gutters from "@/pages/services/Gutters";
import RoofCoating from "@/pages/services/RoofCoating";
import Shingles from "@/pages/materials/Shingles";
import Metal from "@/pages/materials/Metal";
import Tile from "@/pages/materials/Tile";
import Flat from "@/pages/materials/Flat";
import GalleryResidential from "@/pages/gallery/Residential";
import GalleryCommercial from "@/pages/gallery/Commercial";
import GalleryMultifamily from "@/pages/gallery/Multifamily";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Estimator from "@/pages/Estimator";

const queryClient = new QueryClient();

function Router() {
  return (
    <SiteLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/services/installation" component={Installation} />
        <Route path="/services/repair" component={Repair} />
        <Route path="/services/maintenance" component={Maintenance} />
        <Route path="/services/storm-damage" component={StormDamage} />
        <Route path="/services/specialty-roofing" component={SpecialtyRoofing} />
        <Route path="/services/gutters" component={Gutters} />
        <Route path="/services/roof-coating" component={RoofCoating} />
        <Route path="/materials/asphalt-shingles" component={Shingles} />
        <Route path="/materials/metal" component={Metal} />
        <Route path="/materials/tile" component={Tile} />
        <Route path="/materials/flat" component={Flat} />
        <Route path="/gallery/residential" component={GalleryResidential} />
        <Route path="/gallery/commercial" component={GalleryCommercial} />
        <Route path="/gallery/multifamily" component={GalleryMultifamily} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/estimator" component={Estimator} />
        <Route component={NotFound} />
      </Switch>
    </SiteLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
