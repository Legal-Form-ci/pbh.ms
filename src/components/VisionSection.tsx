import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Globe, Sparkles, Heart, Shield } from 'lucide-react';

export default function VisionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="vision" className="section-padding bg-navy-gradient text-primary-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-gold blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-gold blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gold-gradient flex items-center justify-center">
              <Globe className="w-10 h-10 text-navy-dark" />
            </div>
          </div>

          <span className="inline-block px-4 py-2 bg-gold/20 text-gold font-semibold rounded-full text-sm mb-6">
            🌍 Notre Vision
          </span>

          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight">
            L'immobilier accessible à tous
          </h2>

          <p className="text-xl md:text-2xl text-primary-foreground/80 leading-relaxed mb-12">
            Permettre à chaque citoyen, quel que soit son niveau de revenu,
            d'accéder à un bien immobilier{' '}
            <span className="text-gold font-semibold">fiable</span>,{' '}
            <span className="text-gold font-semibold">durable</span> et{' '}
            <span className="text-gold font-semibold">sécurisé</span>.
          </p>

          {/* Vision Pillars */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, text: 'Confiance' },
              { icon: Sparkles, text: 'Sérénité' },
              { icon: Heart, text: 'Stabilité' },
            ].map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.15 }}
                className="bg-primary-foreground/5 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/10"
              >
                <item.icon className="w-8 h-8 text-gold mx-auto mb-4" />
                <span className="font-display text-lg font-bold">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
