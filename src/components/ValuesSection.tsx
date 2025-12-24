import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Eye, Lock, Zap, Award, Handshake } from 'lucide-react';

const values = [
  {
    icon: Eye,
    title: 'Transparence totale',
    description: 'Chaque étape de votre projet est visible et tracée.',
  },
  {
    icon: Lock,
    title: 'Sécurité financière',
    description: 'Protection absolue de vos fonds via un système bancaire sécurisé.',
  },
  {
    icon: Zap,
    title: 'Rapidité d\'exécution',
    description: 'Des délais optimisés grâce à nos équipes internes dédiées.',
  },
  {
    icon: Award,
    title: 'Qualité & Professionnalisme',
    description: 'Des standards élevés à chaque étape de la construction.',
  },
  {
    icon: Handshake,
    title: 'Confiance durable',
    description: 'Une relation client basée sur le respect et l\'engagement.',
  },
];

export default function ValuesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-gold/10 text-gold font-semibold rounded-full text-sm mb-6">
            🤝 Nos Valeurs
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Les fondements de notre engagement
          </h2>
        </motion.div>

        {/* Values Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              className={`group bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-elegant transition-all duration-300 ${
                index === values.length - 1 && values.length % 3 !== 0
                  ? 'lg:col-start-2'
                  : ''
              }`}
            >
              <div className="w-14 h-14 rounded-xl bg-navy flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <value.icon className="w-7 h-7 text-gold" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                {value.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
