import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Target, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

const problems = [
  { icon: AlertCircle, text: 'Insécurité financière' },
  { icon: AlertCircle, text: 'Chantiers abandonnés' },
  { icon: Clock, text: 'Retards excessifs' },
  { icon: AlertCircle, text: 'Manque de transparence' },
];

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="services" className="section-padding bg-background">
      <div className="container mx-auto" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-gold/10 text-gold font-semibold rounded-full text-sm mb-6">
              À propos
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Une réponse aux défis de l'immobilier
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              <strong className="text-foreground">PLANET BUILDING HOUSE MULTI-S</strong> est une entreprise
              immobilière spécialisée dans la structuration, la sécurisation et
              la réalisation de projets immobiliers, de la conception à la
              livraison finale.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              L'entreprise se positionne comme un{' '}
              <strong className="text-gold">intermédiaire professionnel de confiance</strong>,
              assurant la coordination entre le client, le système financier et
              l'exécution technique, dans un cadre maîtrisé et sécurisé.
            </p>
          </motion.div>

          {/* Right Column - Problems Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-card rounded-2xl p-8 shadow-elegant border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center">
                  <Target className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  Les problèmes que nous résolvons
                </h3>
              </div>

              <div className="space-y-4">
                {problems.map((problem, index) => (
                  <motion.div
                    key={problem.text}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-destructive/5 rounded-xl"
                  >
                    <problem.icon className="w-5 h-5 text-destructive flex-shrink-0" />
                    <span className="text-foreground font-medium">
                      {problem.text}
                    </span>
                    <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto flex-shrink-0" />
                  </motion.div>
                ))}
              </div>

              <p className="mt-6 text-sm text-muted-foreground text-center">
                ✅ Tous résolus grâce à notre système sécurisé
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
