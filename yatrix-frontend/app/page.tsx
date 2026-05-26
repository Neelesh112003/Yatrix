import { Navbar } from "@/components/Landing/Navbar";
import { HeroSection } from "@/components/Landing/HeroSection";
import { CitiesSection } from "@/components/Landing//CitiesSection";
import { FeaturesSection } from "@/components/Landing/FeatureSection";
import { HowItWorksSection } from "@/components/Landing/HowItWork";
import { PlannerPreviewSection } from "@/components/Landing/PlannerPreview";
import { WhyChooseSection } from "@/components/Landing/WhyChoose";
import { CTASection } from "@/components/Landing/CTASection";
import { Footer } from "@/components/Landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <CitiesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PlannerPreviewSection />
      <WhyChooseSection />
      <CTASection />
      <Footer />
    </main>
  );
}
