import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '@/assets/logo-pbh.png';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/i18n/LanguageContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const navLinks = [
    { label: t('nav_home'), href: '/' },
    { label: t('nav_services'), href: '/services' },
    { label: t('nav_portfolio'), href: '/portfolio' },
    { label: t('nav_simulator'), href: '/simulateur' },
    { label: t('nav_about'), href: '/a-propos' },
    { label: t('nav_faq'), href: '/faq' },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    navigate(href);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img src={logo} alt="PBH.M.S Logo" className="h-14 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`font-medium transition-colors duration-300 ${
                  location.pathname === link.href ? 'text-gold' : 'text-foreground/80 hover:text-gold'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right side: Language + CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitcher />
            <Button 
              variant="gold" 
              size="default"
              onClick={() => handleNavClick('/simulateur')}
            >
              {t('nav_cta')}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <LanguageSwitcher />
            <button
              className="p-2 text-foreground"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-card border-t border-border"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`font-medium py-2 transition-colors text-left ${
                    location.pathname === link.href ? 'text-gold' : 'text-foreground/80 hover:text-gold'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <Button 
                variant="gold" 
                className="mt-4 w-full"
                onClick={() => handleNavClick('/simulateur')}
              >
                {t('nav_cta')}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
