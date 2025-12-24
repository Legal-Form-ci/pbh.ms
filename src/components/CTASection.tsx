import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Building2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section-padding bg-silver-light">
      <div className="container mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center bg-navy rounded-3xl p-12 md:p-16 shadow-lg relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gold-gradient flex items-center justify-center">
                <Building2 className="w-8 h-8 text-navy-dark" />
              </div>
            </div>

            <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground mb-6 italic leading-relaxed">
              "PBH.M.S ne vend pas seulement des bâtiments.
              <br />
              <span className="text-gold">
                Elle sécurise des vies, des patrimoines et des projets de vie.
              </span>
              "
            </blockquote>

            <p className="text-primary-foreground/70 mb-10 text-lg">
              Prêt à construire en toute confiance ?
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" className="group">
                Démarrer mon projet
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline-light" size="lg">
                Nous contacter
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
