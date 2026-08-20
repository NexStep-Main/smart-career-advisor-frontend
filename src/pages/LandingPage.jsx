import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/common/SEOHead";
import HeroSection from "./landing/HeroSection";
import MarqueeSection from "./landing/MarqueeSection";
import StatsSection from "./landing/StatsSection";
import ProcessSection from "./landing/ProcessSection";
import FeaturesSection from "./landing/FeaturesSection";
import DomainSection from "./landing/DomainSection";
import TestimonialsSection from "./landing/TestimonialsSection";
import FaqSection from "./landing/FaqSection";
import CtaSection from "./landing/CtaSection";

/**
 * Public marketing homepage. Guide § Landing Page — Component Breakdown.
 * Sections live in ./landing/, shared Navbar/Footer in components/layout/.
 *
 * The `bg-paper text-ink` wrapper scopes the editorial monochrome palette to
 * this page only — the authenticated dashboard and admin portal keep the
 * app's emerald semantic tokens (see styles/index.css § Editorial).
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <SEOHead
        title="Find Your Perfect Career Path"
        description="Free career guidance platform for Indian students after Class 10, 12, and Graduation. Personalised roadmaps, skill plans, and smart recommendations."
      />
      <Navbar />
      <main>
        <HeroSection />
        <MarqueeSection />
        <StatsSection />
        <ProcessSection />
        <FeaturesSection />
        <DomainSection />
        <TestimonialsSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
