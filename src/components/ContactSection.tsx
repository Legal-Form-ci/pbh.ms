import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  email: z.string().email("Email invalide").max(255),
  phone: z.string().min(8, "Numéro de téléphone invalide").max(20),
  subject: z.string().min(3, "Le sujet doit contenir au moins 3 caractères").max(200),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères").max(2000),
});

const WHATSAPP_NUMBER = "2250779261639";

export default function ContactSection() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    try {
      const validatedData = contactSchema.parse(formData);
      setIsSubmitting(true);

      const { error } = await supabase
        .from('contact_requests')
        .insert({
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          subject: validatedData.subject,
          message: validatedData.message,
        });

      if (error) throw error;

      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });

      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur s'est produite. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent("Bonjour PBH.M.S, je souhaite obtenir des informations sur vos services de construction.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <section id="contact" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Mail className="w-4 h-4" />
            Contactez-nous
          </div>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">
            Parlons de votre projet
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto text-lg">
            Notre équipe est à votre disposition pour répondre à toutes vos questions 
            et vous accompagner dans votre projet immobilier.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
              <h3 className="font-display text-2xl font-bold text-foreground mb-6">
                Nos coordonnées
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Téléphone / WhatsApp</p>
                    <a href="tel:+2250779261639" className="text-foreground/70 hover:text-gold transition-colors">
                      +225 07 79 26 16 39
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Email</p>
                    <a href="mailto:contact@pbhms.com" className="text-foreground/70 hover:text-gold transition-colors">
                      contact@pbhms.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Adresse</p>
                    <p className="text-foreground/70">Abidjan, Côte d'Ivoire</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Button */}
              <Button
                onClick={openWhatsApp}
                className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Discuter sur WhatsApp
              </Button>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 shadow-lg space-y-6">
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                Envoyez-nous un message
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    name="name"
                    placeholder="Votre nom complet"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Votre email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="Votre téléphone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'border-destructive' : ''}
                  />
                  {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <Input
                    name="subject"
                    placeholder="Sujet"
                    value={formData.subject}
                    onChange={handleChange}
                    className={errors.subject ? 'border-destructive' : ''}
                  />
                  {errors.subject && <p className="text-destructive text-sm mt-1">{errors.subject}</p>}
                </div>
              </div>

              <div>
                <Textarea
                  name="message"
                  placeholder="Décrivez votre projet..."
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className={errors.message ? 'border-destructive' : ''}
                />
                {errors.message && <p className="text-destructive text-sm mt-1">{errors.message}</p>}
              </div>

              <Button
                type="submit"
                variant="gold"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Envoi en cours..."
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Envoyer le message
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
