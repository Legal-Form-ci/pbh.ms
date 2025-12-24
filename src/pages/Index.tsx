import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import MissionSection from '@/components/MissionSection';
import SecuritySection from '@/components/SecuritySection';
import ConstructionSection from '@/components/ConstructionSection';
import VisionSection from '@/components/VisionSection';
import ValuesSection from '@/components/ValuesSection';
import FAQSection from '@/components/FAQSection';
import ContactSection from '@/components/ContactSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import VirtualAssistant from '@/components/VirtualAssistant';

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
      <FAQSection />
      <ContactSection />
      <CTASection />
      <Footer />
      <VirtualAssistant />
    </main>
  );
}
