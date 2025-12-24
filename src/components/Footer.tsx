import { Mail, Phone, MapPin } from 'lucide-react';
import logo from '@/assets/logo-pbhms.png';

export default function Footer() {
  return (
    <footer id="contact" className="bg-navy-dark text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <img src={logo} alt="PBH.M.S Logo" className="h-20 w-auto mb-6" />
            <p className="text-primary-foreground/70 leading-relaxed max-w-md mb-6">
              <strong className="text-primary-foreground">PLANET BUILDING HOUSE MULTI-S</strong> -
              Votre partenaire de confiance pour une construction sécurisée et structurée.
            </p>
            <p className="text-gold font-semibold">
              Construire en toute confiance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-bold mb-6">Liens rapides</h4>
            <ul className="space-y-3">
              {['Accueil', 'Services', 'Sécurité', 'Vision', 'Contact'].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-primary-foreground/70 hover:text-gold transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-bold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-primary-foreground/70">
                <Mail className="w-5 h-5 text-gold flex-shrink-0" />
                <span>contact@pbhms.com</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/70">
                <Phone className="w-5 h-5 text-gold flex-shrink-0" />
                <span>+XXX XXX XXX XXX</span>
              </li>
              <li className="flex items-start gap-3 text-primary-foreground/70">
                <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                <span>Votre adresse ici</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-primary-foreground/50 text-sm">
          <p>
            © {new Date().getFullYear()} PLANET BUILDING HOUSE MULTI-S (PBH.M.S). Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
