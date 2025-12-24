import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Lock, Cog, Users } from 'lucide-react';

const pillars = [
  {
    icon: Lock,
    title: 'Cadre financier sécurisé',
    description:
      'Vos fonds sont protégés via un compte séquestre, garantissant transparence et traçabilité.',
  },
  {
    icon: Cog,
    title: 'Exécution technique rigoureuse',
    description:
      'Nos équipes internes certifiées assurent une qualité d\'exécution irréprochable.',
  },
  {
    icon: Users,
    title: 'Accompagnement de bout en bout',
    description:
      'De la conception à la livraison, un suivi personnalisé pour chaque projet.',
  },
];

export default function MissionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section-padding bg-navy-gradient text-primary-foreground">
      <div className="container mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-gold/20 text-gold font-semibold rounded-full text-sm mb-6">
            🎯 Notre Mission
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6 max-w-3xl mx-auto leading-tight">
            Faciliter l'accès à la construction et à la propriété immobilière
          </h2>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            Nous mettons en place un système complet garantissant la réussite
            effective de chaque projet immobilier.
          </p>
        </motion.div>

        {/* Pillars Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
              className="group"
            >
              <div className="bg-primary-foreground/5 backdrop-blur-sm rounded-2xl p-8 h-full border border-primary-foreground/10 hover:border-gold/50 transition-all duration-300 hover:bg-primary-foreground/10">
                <div className="w-14 h-14 rounded-xl bg-gold-gradient flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <pillar.icon className="w-7 h-7 text-navy-dark" />
                </div>
                <h3 className="font-display text-xl font-bold mb-4">
                  {pillar.title}
                </h3>
                <p className="text-primary-foreground/70 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
