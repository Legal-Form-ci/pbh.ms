import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { HardHat, Clock, Award, ShieldCheck } from 'lucide-react';

const team = [
  'Ingénieurs',
  'Architectes',
  'Chefs de chantier',
  'Ouvriers qualifiés',
];

const results = [
  {
    icon: Clock,
    title: 'Délais réduits',
    description: 'Réduction significative des délais de construction',
  },
  {
    icon: Award,
    title: 'Qualité garantie',
    description: 'Exécution rigoureusement contrôlée à chaque étape',
  },
  {
    icon: ShieldCheck,
    title: 'Zéro risque d\'arrêt',
    description: 'Suppression des risques de retard ou d\'abandon',
  },
];

export default function ConstructionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Team */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-gold/10 text-gold font-semibold rounded-full text-sm mb-6">
              🏗️ Réalisation des Chantiers
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Une équipe technique interne d'excellence
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Une fois le budget total sécurisé sur le compte séquestre, PBH.M.S
              mobilise ses équipes techniques internes avec des ressources
              humaines propres et des moyens matériels maîtrisés.
            </p>

            {/* Team Grid */}
            <div className="grid grid-cols-2 gap-4">
              {team.map((member, index) => (
                <motion.div
                  key={member}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border shadow-sm"
                >
                  <HardHat className="w-5 h-5 text-gold flex-shrink-0" />
                  <span className="font-medium text-foreground">{member}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Results */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="text-center lg:text-left mb-8">
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                ✅ Résultats concrets
              </h3>
              <p className="text-muted-foreground">
                Des garanties tangibles pour votre projet
              </p>
            </div>

            {results.map((result, index) => (
              <motion.div
                key={result.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.15 }}
                className="flex items-start gap-5 p-6 bg-card rounded-2xl border border-border shadow-elegant hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gold-gradient flex items-center justify-center flex-shrink-0">
                  <result.icon className="w-7 h-7 text-navy-dark" />
                </div>
                <div>
                  <h4 className="font-display text-lg font-bold text-foreground mb-2">
                    {result.title}
                  </h4>
                  <p className="text-muted-foreground">{result.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
