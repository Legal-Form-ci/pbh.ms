import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type Step = 'welcome' | 'firstName' | 'lastName' | 'email' | 'phone' | 'region' | 'complete';

const regions = [
  "Abidjan",
  "Yamoussoukro",
  "Bouaké",
  "San-Pédro",
  "Daloa",
  "Korhogo",
  "Man",
  "Gagnoa",
  "Abengourou",
  "Divo",
  "Autre ville"
];

export default function VirtualAssistant() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [step, setStep] = useState<Step>('welcome');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    region: '',
  });

  // Show assistant after 3 seconds on first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('pbhms_visited');
    if (!hasVisited) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem('pbhms_visited', 'true');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleInputChange = (value: string) => {
    const fieldMap: Record<Step, keyof typeof formData> = {
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      phone: 'phone',
      region: 'region',
      welcome: 'firstName',
      complete: 'firstName',
    };
    
    if (step !== 'welcome' && step !== 'complete') {
      setFormData(prev => ({ ...prev, [fieldMap[step]]: value }));
    }
  };

  const nextStep = () => {
    const steps: Step[] = ['welcome', 'firstName', 'lastName', 'email', 'phone', 'region', 'complete'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('leads')
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          region: formData.region,
          country: "Côte d'Ivoire",
          source: 'virtual_assistant',
        });

      if (error) throw error;
      
      setStep('complete');
      setHasInteracted(true);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && step !== 'welcome' && step !== 'region' && step !== 'complete') {
      if (step === 'phone') {
        handleSubmit();
      } else {
        nextStep();
      }
    }
  };

  const getStepContent = () => {
    switch (step) {
      case 'welcome':
        return {
          title: "Bienvenue chez PBH.M.S ! 👋",
          message: "Je suis votre assistant virtuel. Je suis là pour vous aider à démarrer votre projet de construction. Puis-je vous poser quelques questions rapides ?",
          action: (
            <Button variant="gold" onClick={() => nextStep()} className="w-full">
              Oui, commençons !
            </Button>
          ),
        };
      case 'firstName':
        return {
          title: "Ravi de vous rencontrer !",
          message: "Quel est votre prénom ?",
          icon: <User className="w-5 h-5" />,
          input: true,
          placeholder: "Votre prénom",
          value: formData.firstName,
        };
      case 'lastName':
        return {
          title: `Enchanté ${formData.firstName} !`,
          message: "Et votre nom de famille ?",
          icon: <User className="w-5 h-5" />,
          input: true,
          placeholder: "Votre nom",
          value: formData.lastName,
        };
      case 'email':
        return {
          title: "Parfait !",
          message: "Quelle est votre adresse email ?",
          icon: <Mail className="w-5 h-5" />,
          input: true,
          placeholder: "votre@email.com",
          value: formData.email,
          type: 'email',
        };
      case 'phone':
        return {
          title: "Super !",
          message: "Votre numéro de téléphone (WhatsApp de préférence) ?",
          icon: <Phone className="w-5 h-5" />,
          input: true,
          placeholder: "+225 XX XX XX XX XX",
          value: formData.phone,
          type: 'tel',
        };
      case 'region':
        return {
          title: "Dernière question !",
          message: "Dans quelle région/ville souhaitez-vous construire ?",
          icon: <MapPin className="w-5 h-5" />,
          options: regions,
        };
      case 'complete':
        return {
          title: "Merci beaucoup ! ✨",
          message: `${formData.firstName}, vos informations ont été enregistrées. Notre équipe vous contactera très bientôt pour discuter de votre projet.`,
          action: (
            <Button variant="gold" onClick={() => setIsOpen(false)} className="w-full">
              Fermer et explorer le site
            </Button>
          ),
        };
      default:
        return { title: "", message: "" };
    }
  };

  const content = getStepContent();

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gold rounded-full shadow-lg flex items-center justify-center text-navy-dark hover:bg-gold-light transition-colors"
          >
            <MessageCircle className="w-7 h-7" />
            {!hasInteracted && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full animate-pulse" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-primary p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Assistant PBH.M.S</h4>
                  <p className="text-white/70 text-sm">En ligne</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 min-h-[280px] flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1"
                >
                  {step === 'complete' && (
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                    </div>
                  )}
                  
                  <h5 className="font-display font-bold text-lg text-foreground mb-2">
                    {content.title}
                  </h5>
                  <p className="text-foreground/70 mb-6">
                    {content.message}
                  </p>

                  {content.input && (
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50">
                        {content.icon}
                      </div>
                      <Input
                        type={content.type || 'text'}
                        placeholder={content.placeholder}
                        value={content.value}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="pl-10"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        variant="gold"
                        className="absolute right-1 top-1/2 -translate-y-1/2"
                        onClick={() => step === 'phone' ? handleSubmit() : nextStep()}
                        disabled={!content.value || isSubmitting}
                      >
                        {isSubmitting ? '...' : <Send className="w-4 h-4" />}
                      </Button>
                    </div>
                  )}

                  {content.options && (
                    <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                      {content.options.map((option) => (
                        <Button
                          key={option}
                          variant="outline"
                          size="sm"
                          className={`text-sm ${formData.region === option ? 'border-gold bg-gold/10 text-gold' : ''}`}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, region: option }));
                            setTimeout(() => handleSubmit(), 300);
                          }}
                          disabled={isSubmitting}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  )}

                  {content.action && (
                    <div className="mt-4">
                      {content.action}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress */}
            {step !== 'welcome' && step !== 'complete' && (
              <div className="px-5 pb-4">
                <div className="flex gap-1">
                  {['firstName', 'lastName', 'email', 'phone', 'region'].map((s, i) => (
                    <div
                      key={s}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        ['firstName', 'lastName', 'email', 'phone', 'region'].indexOf(step) >= i
                          ? 'bg-gold'
                          : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
