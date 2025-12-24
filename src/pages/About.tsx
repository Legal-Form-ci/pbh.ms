import { motion } from 'framer-motion';
import { Shield, Target, Eye, Heart, Users, Award, Building2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const values = [
  {
    icon: Shield,
    title: "Transparence totale",
    description: "Chaque étape de votre projet est documentée et communiquée. Vous avez une visibilité complète sur l'utilisation de vos fonds et l'avancement des travaux."
  },
  {
    icon: Target,
    title: "Sécurité financière absolue",
    description: "Le système de compte séquestre garantit que vos fonds sont protégés et utilisés uniquement pour votre projet, avec décaissement par paliers validés."
  },
  {
    icon: Award,
    title: "Rapidité d'exécution",
    description: "Nos équipes internes et nos processus optimisés permettent de réduire significativement les délais de construction tout en maintenant la qualité."
  },
  {
    icon: Heart,
    title: "Qualité et professionnalisme",
    description: "Des ingénieurs, architectes et ouvriers qualifiés à votre service pour garantir une construction durable et conforme aux normes les plus strictes."
  },
  {
    icon: Users,
    title: "Confiance client durable",
    description: "Notre mission est de bâtir des relations de confiance à long terme avec nos clients, fondées sur le respect, l'écoute et la satisfaction."
  },
];

const stats = [
  { value: "50+", label: "Projets réalisés" },
  { value: "100%", label: "Chantiers livrés" },
  { value: "0", label: "Chantier abandonné" },
  { value: "98%", label: "Clients satisfaits" },
];

export default function About() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-navy-dark via-navy to-navy-light text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-gold/20 text-gold px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Building2 className="w-4 h-4" />
              Qui sommes-nous
            </div>
            <h1 className="font-display text-4xl lg:text-5xl font-bold mb-6">
              À propos de PBH.M.S
            </h1>
            <p className="text-primary-foreground/70 text-lg">
              PLANET BUILDING HOUSE MULTI-S — Votre partenaire de confiance 
              pour une construction sécurisée et structurée.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gold">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="font-display text-4xl lg:text-5xl font-bold text-navy-dark mb-2">
                  {stat.value}
                </div>
                <div className="text-navy-dark/70 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Notre histoire
              </h2>
              <div className="space-y-4 text-foreground/70 leading-relaxed">
                <p>
                  PBH.M.S a été conçue pour résoudre les principaux blocages du secteur immobilier 
                  en Côte d'Ivoire et en Afrique : l'insécurité financière, les chantiers abandonnés, 
                  les retards excessifs et le manque de transparence.
                </p>
                <p>
                  Face à ces défis récurrents qui minent la confiance des investisseurs et des 
                  particuliers, nous avons développé un modèle unique qui allie sécurité financière, 
                  excellence technique et transparence totale.
                </p>
                <p>
                  Aujourd'hui, nous nous positionnons comme un intermédiaire professionnel de confiance, 
                  assurant la coordination entre le client, le système financier et l'exécution technique, 
                  dans un cadre maîtrisé et sécurisé.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="bg-card border border-border rounded-2xl p-6 text-center">
                <Target className="w-12 h-12 text-gold mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Mission</h3>
                <p className="text-sm text-foreground/60">
                  Faciliter l'accès à la construction et à la propriété immobilière
                </p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6 text-center">
                <Eye className="w-12 h-12 text-gold mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Vision</h3>
                <p className="text-sm text-foreground/60">
                  Permettre à chaque citoyen d'accéder à un bien immobilier fiable et durable
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-32 bg-muted">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Nos valeurs fondamentales
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Ces valeurs guident chacune de nos actions et définissent notre engagement 
              envers nos clients.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center mb-6">
                  <value.icon className="w-7 h-7 text-gold" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-foreground/60 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl lg:text-4xl font-bold mb-6">
              Prêt à construire en toute confiance ?
            </h2>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto mb-8">
              Découvrez comment PBH.M.S peut sécuriser et réaliser votre projet immobilier.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/simulateur">
                <Button variant="gold" size="lg">
                  Simuler mon projet
                </Button>
              </Link>
              <Link to="/portfolio">
                <Button variant="outline-light" size="lg">
                  Voir nos réalisations
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
