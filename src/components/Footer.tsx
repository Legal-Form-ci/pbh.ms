import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo-pbhms.png';

export default function Footer() {
  const whatsappNumber = "+2250779261639";
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\s+/g, '').replace('+', '')}`;

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
              <li>
                <Link to="/" className="text-primary-foreground/70 hover:text-gold transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-primary-foreground/70 hover:text-gold transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-primary-foreground/70 hover:text-gold transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/simulateur" className="text-primary-foreground/70 hover:text-gold transition-colors">
                  Simulateur
                </Link>
              </li>
              <li>
                <Link to="/a-propos" className="text-primary-foreground/70 hover:text-gold transition-colors">
                  À propos
                </Link>
              </li>
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
                <span>+225 07 79 26 16 39</span>
              </li>
              <li className="flex items-start gap-3 text-primary-foreground/70">
                <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                <span>Daloa, au feu du carrefour Acemon, à droite de la Pharmacie Palvis, en partance vers Acemon</span>
              </li>
              <li>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Nous contacter sur WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-primary-foreground/50 text-sm">
          <p>
            © {new Date().getFullYear()} PLANET BUILDING HOUSE MULTI-S (PBH.M.S). Tous droits réservés.
          </p>
          <Link
            to="/admin/login"
            className="text-primary-foreground/30 hover:text-primary-foreground/50 transition-colors text-xs"
          >
            Administration
          </Link>
        </div>
      </div>
    </footer>
  );
}
