import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import MissionSection from '@/components/MissionSection';
import SecuritySection from '@/components/SecuritySection';
import ConstructionSection from '@/components/ConstructionSection';
import VisionSection from '@/components/VisionSection';
import ValuesSection from '@/components/ValuesSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function Index() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <MissionSection />
      <SecuritySection />
      <ConstructionSection />
      <VisionSection />
      <ValuesSection />
      <CTASection />
      <Footer />
    </main>
  );
}
