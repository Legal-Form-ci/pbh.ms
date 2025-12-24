import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "Comment fonctionne le système de compte séquestre ?",
    answer: "Le compte séquestre est un compte bancaire sécurisé ouvert auprès de notre banque partenaire. Vos fonds y sont déposés et protégés. Ils ne sont libérés qu'après vérification de l'avancement réel du chantier et validation technique des travaux. Cela garantit une utilisation transparente et sécurisée de votre investissement."
  },
  {
    question: "Quels sont les délais moyens de construction ?",
    answer: "Les délais varient selon le type de projet : une maison économique (80-120m²) prend environ 4-6 mois, une villa standard (150-250m²) entre 6-10 mois, une villa de luxe (300m² et plus) entre 10-14 mois, et un immeuble résidentiel entre 12-24 mois selon sa taille. Nos équipes internes permettent de réduire significativement ces délais."
  },
  {
    question: "Quelles garanties offrez-vous contre les abandons de chantier ?",
    answer: "Notre système de décaissement par paliers élimine le risque d'abandon : les fonds ne sont libérés qu'après validation de chaque étape. De plus, nous disposons d'équipes techniques internes (ingénieurs, architectes, ouvriers qualifiés), ce qui nous rend totalement indépendants des sous-traitants externes et garantit la continuité des travaux."
  },
  {
    question: "Comment sont calculés les coûts de construction ?",
    answer: "Le coût dépend de plusieurs facteurs : la surface à construire, le type de projet (maison, villa, immeuble), le niveau de finition souhaité (économique, standard, luxe), et la localisation. Utilisez notre simulateur en ligne pour obtenir une estimation personnalisée, ou contactez-nous pour un devis détaillé gratuit."
  },
  {
    question: "Puis-je suivre l'avancement de mon chantier ?",
    answer: "Absolument ! Nous offrons un suivi transparent avec des rapports réguliers, des photos d'avancement, et des visites de chantier programmées. Chaque étape est documentée et validée avant le déblocage des fonds suivants. Vous avez une visibilité totale sur votre projet."
  },
  {
    question: "Quels types de projets réalisez-vous ?",
    answer: "Nous réalisons tous types de projets immobiliers : maisons individuelles économiques, villas de standing, duplex et triplex, immeubles résidentiels, bâtiments commerciaux, et projets mixtes. Chaque projet bénéficie du même niveau de sécurité et de professionnalisme."
  },
  {
    question: "Comment financer mon projet de construction ?",
    answer: "Plusieurs options sont possibles : fonds propres versés sur le compte séquestre, prêt bancaire immobilier (nous travaillons avec des banques partenaires), financement mixte, ou paiement échelonné selon le planning des travaux. Notre simulateur de crédit peut vous aider à estimer vos mensualités."
  },
  {
    question: "Que se passe-t-il en cas de modification du projet en cours de chantier ?",
    answer: "Les modifications sont possibles sous certaines conditions. Elles font l'objet d'un avenant au contrat avec une révision du budget et du planning si nécessaire. Nous vous conseillons de bien définir vos besoins en amont pour éviter les surcoûts et retards liés aux modifications."
  }
];

export default function FAQSection() {
  return (
    <section id="faq" className="py-20 lg:py-32 bg-muted">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <HelpCircle className="w-4 h-4" />
            Questions fréquentes
          </div>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">
            Tout ce que vous devez savoir
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto text-lg">
            Retrouvez les réponses aux questions les plus posées sur notre processus de construction, 
            le système de compte séquestre et les délais de réalisation.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-gold py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70 pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
