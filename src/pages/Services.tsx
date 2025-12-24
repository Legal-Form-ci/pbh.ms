import { motion } from 'framer-motion';
import { Shield, Building2, FileCheck, Users, Hammer, Eye, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: Shield,
    title: "Sécurisation financière",
    description: "Mise en place d'un compte séquestre auprès de notre banque partenaire pour une protection totale de vos fonds. Décaissement intelligent par paliers après validation de chaque étape.",
    features: [
      "Compte séquestre sécurisé",
      "Traçabilité complète des fonds",
      "Décaissement par paliers",
      "Zéro risque de détournement"
    ]
  },
  {
    icon: FileCheck,
    title: "Structuration de projet",
    description: "Accompagnement complet dans la définition et la planification de votre projet immobilier, de l'étude de faisabilité à la livraison finale.",
    features: [
      "Étude de faisabilité",
      "Plans architecturaux",
      "Devis détaillé",
      "Planning prévisionnel"
    ]
  },
  {
    icon: Building2,
    title: "Construction clé en main",
    description: "Réalisation complète de votre projet par nos équipes techniques internes : ingénieurs, architectes, chefs de chantier et ouvriers qualifiés.",
    features: [
      "Équipes internes qualifiées",
      "Matériaux de qualité",
      "Normes de construction strictes",
      "Garantie décennale"
    ]
  },
  {
    icon: Eye,
    title: "Suivi transparent",
    description: "Visibilité totale sur l'avancement de votre chantier avec rapports réguliers, photos et visites programmées.",
    features: [
      "Rapports d'avancement",
      "Photos du chantier",
      "Visites sur site",
      "Communication continue"
    ]
  },
  {
    icon: Users,
    title: "Conseil et accompagnement",
    description: "Notre équipe d'experts vous conseille à chaque étape : choix du terrain, financement, optimisation fiscale, etc.",
    features: [
      "Conseil personnalisé",
      "Accompagnement financement",
      "Optimisation budget",
      "Support juridique"
    ]
  },
  {
    icon: Hammer,
    title: "Rénovation et extension",
    description: "Nous prenons également en charge vos projets de rénovation, d'extension ou d'aménagement avec le même niveau de sécurité et de qualité.",
    features: [
      "Rénovation complète",
      "Extension de bâtiment",
      "Aménagement intérieur",
      "Mise aux normes"
    ]
  },
];

const projectTypes = [
  { type: "Maisons individuelles", price: "À partir de 35M FCFA" },
  { type: "Villas de standing", price: "À partir de 100M FCFA" },
  { type: "Duplex / Triplex", price: "À partir de 80M FCFA" },
  { type: "Immeubles résidentiels", price: "Sur devis" },
  { type: "Bâtiments commerciaux", price: "Sur devis" },
  { type: "Projets mixtes", price: "Sur devis" },
];

export default function Services() {
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
              Nos services
            </div>
            <h1 className="font-display text-4xl lg:text-5xl font-bold mb-6">
              Des solutions complètes pour votre projet
            </h1>
            <p className="text-primary-foreground/70 text-lg">
              De la conception à la livraison, nous vous accompagnons à chaque étape 
              avec un niveau de sécurité et de professionnalisme inégalé.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-gold to-gold-light rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <service.icon className="w-7 h-7 text-navy-dark" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-foreground/60 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-foreground/70">
                      <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Types */}
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
              Types de projets
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Nous réalisons tous types de projets immobiliers, chacun bénéficiant 
              du même niveau de sécurité et de professionnalisme.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {projectTypes.map((project, index) => (
              <motion.div
                key={project.type}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 text-center hover:border-gold transition-colors"
              >
                <h3 className="font-semibold text-foreground mb-2">{project.type}</h3>
                <p className="text-gold font-medium">{project.price}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Notre processus
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Un parcours structuré et sécurisé, de votre première idée jusqu'à 
              la remise des clés.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {[
              { step: 1, title: "Consultation initiale", desc: "Échange sur votre projet, vos besoins et votre budget" },
              { step: 2, title: "Étude et conception", desc: "Plans architecturaux, devis détaillé et planning prévisionnel" },
              { step: 3, title: "Sécurisation des fonds", desc: "Ouverture du compte séquestre et dépôt des fonds" },
              { step: 4, title: "Lancement du chantier", desc: "Démarrage des travaux avec nos équipes internes" },
              { step: 5, title: "Suivi et validation", desc: "Contrôle qualité et décaissement par paliers" },
              { step: 6, title: "Livraison", desc: "Remise des clés et garanties associées" },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-6 mb-8 last:mb-0"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-navy-dark font-bold text-lg">
                    {item.step}
                  </div>
                  {index < 5 && <div className="w-0.5 h-full bg-gold/30 mt-2" />}
                </div>
                <div className="pb-8">
                  <h3 className="font-semibold text-foreground text-lg mb-1">{item.title}</h3>
                  <p className="text-foreground/60">{item.desc}</p>
                </div>
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
              Estimez votre projet maintenant
            </h2>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto mb-8">
              Utilisez notre simulateur pour obtenir une estimation personnalisée 
              de votre budget, financement et délais.
            </p>
            <Link to="/simulateur">
              <Button variant="gold" size="lg">
                Accéder au simulateur
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
