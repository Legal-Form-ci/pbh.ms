import { motion } from 'framer-motion';
import { Shield, Building2, ArrowRight, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import heroImage from '@/assets/hero-construction.jpg';
import logo from '@/assets/logo-pbh.png';
import { useLanguage } from '@/i18n/LanguageContext';

export default function HeroSection() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleNavClick = (href: string) => {
    navigate(href);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="accueil"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Construction moderne"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-navy-gradient opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <img
              src={logo}
              alt="PBH.M.S"
              className="h-28 md:h-36 w-auto mx-auto drop-shadow-2xl"
            />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight"
          >
            {t('hero_title_1')}{' '}
            <span className="text-gradient-gold">{t('hero_title_2')}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            {t('hero_subtitle')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              variant="hero" 
              size="lg" 
              className="group"
              onClick={() => handleNavClick('/simulateur')}
            >
              {t('hero_cta_primary')}
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline-light" 
              size="lg"
              onClick={() => handleNavClick('/a-propos')}
            >
              {t('hero_cta_secondary')}
            </Button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 flex flex-wrap justify-center gap-8"
          >
            <div className="flex items-center gap-3 text-primary-foreground/70">
              <Landmark className="w-6 h-6 text-gold" />
              <span className="text-sm font-medium">{t('hero_badge_escrow')}</span>
            </div>
            <div className="flex items-center gap-3 text-primary-foreground/70">
              <Shield className="w-6 h-6 text-gold" />
              <span className="text-sm font-medium">{t('hero_badge_secure')}</span>
            </div>
            <div className="flex items-center gap-3 text-primary-foreground/70">
              <Building2 className="w-6 h-6 text-gold" />
              <span className="text-sm font-medium">{t('hero_badge_certified')}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-primary-foreground/40 flex items-start justify-center p-2"
        >
          <div className="w-1.5 h-2.5 bg-gold rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
