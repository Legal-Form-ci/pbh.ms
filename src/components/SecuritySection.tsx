import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Shield, Banknote, Eye, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

const benefits = [
  'Fonds entièrement sécurisés',
  'Traçabilité complète',
  'Affectation stricte au projet',
];

const eliminated = [
  'Risques de détournement',
  'Abandons de chantier',
  'Mauvaise gestion financière',
];

export default function SecuritySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="securite" className="section-padding bg-silver-light">
      <div className="container mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-navy/10 text-navy font-semibold rounded-full text-sm mb-6">
            🔐 Système de Sécurité Financière
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 max-w-3xl mx-auto leading-tight">
            Protection absolue de vos fonds
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-card rounded-2xl p-8 shadow-elegant border border-border">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-navy flex items-center justify-center">
                  <Shield className="w-7 h-7 text-gold" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    Compte Séquestre Bancaire
                  </h3>
                  <p className="text-muted-foreground">
                    Auprès d'une banque partenaire
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-foreground font-medium">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              {/* Smart Disbursement */}
              <div className="bg-muted rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Banknote className="w-6 h-6 text-gold" />
                  <h4 className="font-bold text-foreground">
                    Décaissement intelligent
                  </h4>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Les fonds sont libérés par paliers, uniquement après{' '}
                  <strong className="text-foreground">
                    vérification de l'avancement réel
                  </strong>{' '}
                  et{' '}
                  <strong className="text-foreground">
                    validation technique
                  </strong>{' '}
                  des travaux.
                </p>
              </div>
            </div>
          </motion.div>

          {/* What we eliminate */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-navy rounded-2xl p-8 text-primary-foreground">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gold-gradient flex items-center justify-center">
                  <Eye className="w-7 h-7 text-navy-dark" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold">
                    Ce que nous éliminons
                  </h3>
                  <p className="text-primary-foreground/70">Grâce à notre mécanisme</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {eliminated.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-3 p-4 bg-primary-foreground/5 rounded-xl"
                  >
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                    <span className="font-medium line-through opacity-70">
                      {item}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gold ml-auto" />
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  </motion.div>
                ))}
              </div>

              <p className="text-center text-primary-foreground/80 text-sm">
                👉 Transparence totale et protection absolue
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
