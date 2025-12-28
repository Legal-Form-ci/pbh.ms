import { motion } from 'framer-motion';
import { HelpCircle, Shield, Landmark, Clock, FileCheck, Users, Building2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/i18n/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const { t } = useLanguage();

  const faqCategories = [
    {
      title: t('faq_category_escrow'),
      icon: Landmark,
      questions: [
        {
          q: t('faq_q1'),
          a: t('faq_a1'),
        },
        {
          q: t('faq_q2'),
          a: t('faq_a2'),
        },
        {
          q: t('faq_q3'),
          a: t('faq_a3'),
        },
      ],
    },
    {
      title: t('faq_category_process'),
      icon: Clock,
      questions: [
        {
          q: t('faq_q4'),
          a: t('faq_a4'),
        },
        {
          q: t('faq_q5'),
          a: t('faq_a5'),
        },
        {
          q: t('faq_q6'),
          a: t('faq_a6'),
        },
      ],
    },
    {
      title: t('faq_category_security'),
      icon: Shield,
      questions: [
        {
          q: t('faq_q7'),
          a: t('faq_a7'),
        },
        {
          q: t('faq_q8'),
          a: t('faq_a8'),
        },
      ],
    },
  ];

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-navy-dark via-navy to-navy-light text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-gold/20 text-gold px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <HelpCircle className="w-4 h-4" />
              {t('faq_badge')}
            </div>
            <h1 className="font-display text-4xl lg:text-5xl font-bold mb-6">
              {t('faq_title')}
            </h1>
            <p className="text-primary-foreground/70 text-lg">
              {t('faq_subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          {faqCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                  <category.icon className="w-5 h-5 text-gold" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground">
                  {category.title}
                </h2>
              </div>

              <Accordion type="single" collapsible className="space-y-4">
                {category.questions.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`${categoryIndex}-${index}`}
                    className="border border-border rounded-xl px-6 bg-card"
                  >
                    <AccordionTrigger className="text-left font-medium text-foreground hover:text-gold">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/70 leading-relaxed">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center bg-gradient-to-br from-navy/10 to-navy/5 border border-navy/20 rounded-2xl p-8"
          >
            <h3 className="font-display text-2xl font-bold text-foreground mb-4">
              {t('faq_cta_title')}
            </h3>
            <p className="text-foreground/70 mb-6">
              {t('faq_cta_description')}
            </p>
            <a
              href="https://wa.me/2250779261639"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold hover:bg-gold-dark text-navy font-semibold rounded-lg transition-colors"
            >
              {t('faq_cta_button')}
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
