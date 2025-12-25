import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Mail, Phone, MapPin, CheckCircle, Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type Step = 'welcome' | 'firstName' | 'lastName' | 'email' | 'phone' | 'region' | 'registered' | 'chat';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
}

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

const quickQuestions = [
  "Je veux construire une maison",
  "Comment fonctionne le financement ?",
  "Quels sont vos tarifs ?",
  "Je veux un devis",
];

export default function VirtualAssistant() {
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
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
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

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

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (value: string) => {
    const fieldMap: Record<Step, keyof typeof formData> = {
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      phone: 'phone',
      region: 'region',
      welcome: 'firstName',
      registered: 'firstName',
      chat: 'firstName',
    };
    
    if (step !== 'welcome' && step !== 'registered' && step !== 'chat') {
      setFormData(prev => ({ ...prev, [fieldMap[step]]: value }));
    }
  };

  const nextStep = () => {
    const steps: Step[] = ['welcome', 'firstName', 'lastName', 'email', 'phone', 'region', 'registered'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handleSubmitLead = async () => {
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
      
      setStep('registered');
      setHasInteracted(true);
      
      // Add welcome message for chat
      setMessages([{
        id: '1',
        role: 'assistant',
        content: `Merci ${formData.firstName} ! 🎉 Vos informations ont été enregistrées. Maintenant, comment puis-je vous aider avec votre projet immobilier ?`,
        timestamp: new Date(),
      }]);
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
    if (e.key === 'Enter' && step !== 'welcome' && step !== 'region' && step !== 'registered' && step !== 'chat') {
      if (step === 'phone') {
        handleSubmitLead();
      } else {
        nextStep();
      }
    }
  };

  const startChat = () => {
    setStep('chat');
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || currentMessage.trim();
    if (!text) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simulate assistant response
    setTimeout(() => {
      const responses: Record<string, string> = {
        "Je veux construire une maison": `Excellent choix ${formData.firstName} ! 🏠 Chez PBH.M.S, nous vous accompagnons de A à Z. Pour commencer, je vous invite à utiliser notre simulateur de projet pour avoir une estimation personnalisée. Rendez-vous sur la page Simulateur ou contactez-nous directement au +225 07 79 26 16 39.`,
        "Comment fonctionne le financement ?": `Notre système de financement est sécurisé via un compte séquestre bancaire. Vos fonds sont débloqués progressivement selon l'avancement des travaux, ce qui vous garantit une transparence totale. Souhaitez-vous plus de détails sur nos offres de crédit ?`,
        "Quels sont vos tarifs ?": `Nos tarifs varient selon le type de construction, la surface et le niveau de finition. En général, comptez entre 150 000 et 450 000 FCFA/m². Utilisez notre simulateur pour une estimation précise adaptée à votre projet !`,
        "Je veux un devis": `Pour un devis personnalisé, notre équipe commerciale vous contactera dans les 24h. En attendant, vous pouvez utiliser notre simulateur pour avoir une première estimation. Avez-vous des questions spécifiques sur votre projet ?`,
      };

      const response = responses[text] || `Merci pour votre message ${formData.firstName} ! Un conseiller PBH.M.S vous contactera très bientôt au ${formData.phone} pour discuter de votre demande en détail. En attendant, n'hésitez pas à explorer notre site ou à utiliser le simulateur de projet.`;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleChatKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
      case 'registered':
        return {
          title: "Merci beaucoup ! ✨",
          message: `${formData.firstName}, vos informations ont été enregistrées. Comment puis-je vous aider avec votre projet ?`,
          action: (
            <Button variant="gold" onClick={startChat} className="w-full">
              Continuer la conversation
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
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: 'min(600px, calc(100vh - 6rem))' }}
          >
            {/* Header */}
            <div className="bg-gradient-primary p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
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
            {step !== 'chat' ? (
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
                    {step === 'registered' && (
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
                          onClick={() => step === 'phone' ? handleSubmitLead() : nextStep()}
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
                              setTimeout(() => handleSubmitLead(), 300);
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
            ) : (
              /* Chat Mode */
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          msg.role === 'user'
                            ? 'bg-gold text-navy-dark rounded-br-md'
                            : 'bg-muted text-foreground rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Questions */}
                {messages.length <= 1 && (
                  <div className="px-4 pb-2">
                    <p className="text-xs text-muted-foreground mb-2">Questions fréquentes :</p>
                    <div className="flex flex-wrap gap-2">
                      {quickQuestions.map((q) => (
                        <button
                          key={q}
                          onClick={() => handleSendMessage(q)}
                          className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-gold/20 text-foreground/70 hover:text-gold transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-border flex-shrink-0">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Écrivez votre message..."
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={handleChatKeyPress}
                      className="min-h-[44px] max-h-[100px] resize-none"
                      rows={1}
                    />
                    <Button
                      variant="gold"
                      size="icon"
                      onClick={() => handleSendMessage()}
                      disabled={!currentMessage.trim() || isTyping}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Progress */}
            {step !== 'welcome' && step !== 'registered' && step !== 'chat' && (
              <div className="px-5 pb-4 flex-shrink-0">
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
