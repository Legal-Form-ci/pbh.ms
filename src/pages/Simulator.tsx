import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Home, CreditCard, Clock, ChevronRight, CheckCircle, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { z } from 'zod';

// Validation schema for simulation data
const simulationSchema = z.object({
  project_type: z.string().min(1, "Type de projet requis").max(100),
  surface_area: z.number().int().min(10, "Surface minimum 10m²").max(10000, "Surface maximum 10000m²"),
  location: z.string().min(1, "Localisation requise").max(200),
  quality_level: z.string().min(1, "Niveau de qualité requis").max(100),
  estimated_budget: z.number().min(0).max(100000000000).nullable().optional(),
  loan_amount: z.number().min(0).max(100000000000).nullable().optional(),
  loan_duration_months: z.number().int().min(1).max(600).nullable().optional(),
  monthly_payment: z.number().min(0).max(100000000000).nullable().optional(),
  estimated_construction_months: z.number().int().min(1).max(120).nullable().optional(),
});

type SimulationInsert = {
  project_type: string;
  surface_area: number;
  location: string;
  quality_level: string;
  estimated_budget?: number | null;
  loan_amount?: number | null;
  loan_duration_months?: number | null;
  monthly_payment?: number | null;
  estimated_construction_months?: number | null;
};

// Prix au m² selon le type et la qualité (en FCFA)
const PRICE_PER_SQM: Record<string, Record<string, number>> = {
  'Maison économique': {
    'Économique': 180000,
    'Standard': 220000,
    'Premium': 280000,
  },
  'Villa standard': {
    'Économique': 250000,
    'Standard': 320000,
    'Premium': 450000,
  },
  'Villa de luxe': {
    'Économique': 400000,
    'Standard': 550000,
    'Premium': 800000,
  },
  'Duplex': {
    'Économique': 280000,
    'Standard': 380000,
    'Premium': 520000,
  },
  'Immeuble': {
    'Économique': 200000,
    'Standard': 280000,
    'Premium': 400000,
  },
};

// Durée estimée selon le type (en mois)
const DURATION_MONTHS: Record<string, Record<string, { min: number; max: number }>> = {
  'Maison économique': {
    'Économique': { min: 4, max: 5 },
    'Standard': { min: 5, max: 6 },
    'Premium': { min: 6, max: 8 },
  },
  'Villa standard': {
    'Économique': { min: 6, max: 8 },
    'Standard': { min: 8, max: 10 },
    'Premium': { min: 10, max: 12 },
  },
  'Villa de luxe': {
    'Économique': { min: 10, max: 12 },
    'Standard': { min: 12, max: 16 },
    'Premium': { min: 14, max: 20 },
  },
  'Duplex': {
    'Économique': { min: 8, max: 10 },
    'Standard': { min: 10, max: 12 },
    'Premium': { min: 12, max: 14 },
  },
  'Immeuble': {
    'Économique': { min: 12, max: 18 },
    'Standard': { min: 18, max: 24 },
    'Premium': { min: 20, max: 30 },
  },
};

const projectTypes = ['Maison économique', 'Villa standard', 'Villa de luxe', 'Duplex', 'Immeuble'];
const qualityLevels = ['Économique', 'Standard', 'Premium'];
const locations = ['Abidjan - Centre', 'Abidjan - Périphérie', 'Yamoussoukro', 'Bouaké', 'Autres villes'];

export default function Simulator() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    projectType: '',
    surfaceArea: 150,
    location: '',
    qualityLevel: '',
    loanAmount: 0,
    loanDuration: 180, // en mois (15 ans)
    interestRate: 7.5, // taux annuel
  });

  const [results, setResults] = useState<{
    estimatedBudget: number;
    monthlyPayment: number;
    totalInterest: number;
    constructionDuration: { min: number; max: number };
  } | null>(null);

  const calculateResults = () => {
    const pricePerSqm = PRICE_PER_SQM[formData.projectType]?.[formData.qualityLevel] || 300000;
    const estimatedBudget = formData.surfaceArea * pricePerSqm;
    
    const duration = DURATION_MONTHS[formData.projectType]?.[formData.qualityLevel] || { min: 8, max: 12 };
    
    // Calcul du crédit
    const loanAmount = formData.loanAmount || estimatedBudget;
    const monthlyRate = formData.interestRate / 100 / 12;
    const numPayments = formData.loanDuration;
    
    let monthlyPayment = 0;
    let totalInterest = 0;
    
    if (loanAmount > 0 && formData.interestRate > 0) {
      monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
      totalInterest = (monthlyPayment * numPayments) - loanAmount;
    }

    setResults({
      estimatedBudget,
      monthlyPayment: Math.round(monthlyPayment),
      totalInterest: Math.round(totalInterest),
      constructionDuration: duration,
    });

    setStep(4);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  const saveSimulation = async () => {
    setIsSubmitting(true);
    try {
      // Prepare and validate simulation data
      const simulationData = {
        project_type: formData.projectType,
        surface_area: formData.surfaceArea,
        location: formData.location,
        quality_level: formData.qualityLevel,
        estimated_budget: results?.estimatedBudget,
        loan_amount: formData.loanAmount || results?.estimatedBudget,
        loan_duration_months: formData.loanDuration,
        monthly_payment: results?.monthlyPayment,
        estimated_construction_months: results?.constructionDuration.max,
      };

      // Validate data before insertion
      const validationResult = simulationSchema.safeParse(simulationData);
      
      if (!validationResult.success) {
        const errorMessages = validationResult.error.errors.map(e => e.message).join(', ');
        toast({
          title: "Erreur de validation",
          description: errorMessages,
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('simulations')
        .insert([validationResult.data as SimulationInsert]);

      if (error) throw error;

      toast({
        title: "Simulation enregistrée !",
        description: "Notre équipe vous contactera bientôt pour discuter de votre projet.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la simulation.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-navy-dark via-navy to-navy-light text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-gold/20 text-gold px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Calculator className="w-4 h-4" />
              Simulateur complet
            </div>
            <h1 className="font-display text-4xl lg:text-5xl font-bold mb-6">
              Estimez votre projet
            </h1>
            <p className="text-primary-foreground/70 text-lg">
              Budget • Crédit • Délai — Obtenez une estimation complète et personnalisée 
              de votre projet de construction en quelques clics.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 bg-muted border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {[
              { num: 1, label: 'Type de projet', icon: Home },
              { num: 2, label: 'Caractéristiques', icon: Building2 },
              { num: 3, label: 'Financement', icon: CreditCard },
              { num: 4, label: 'Résultats', icon: CheckCircle },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center gap-2 md:gap-4">
                <div
                  className={`flex items-center gap-2 ${
                    step >= s.num ? 'text-gold' : 'text-foreground/40'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      step >= s.num
                        ? 'border-gold bg-gold/10'
                        : 'border-foreground/20'
                    }`}
                  >
                    <s.icon className="w-5 h-5" />
                  </div>
                  <span className="hidden md:block font-medium text-sm">{s.label}</span>
                </div>
                {i < 3 && (
                  <ChevronRight className="w-5 h-5 text-foreground/20" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simulator Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-card border border-border rounded-2xl p-8 shadow-lg"
          >
            {/* Step 1: Project Type */}
            {step === 1 && (
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                  Quel type de projet souhaitez-vous réaliser ?
                </h2>
                <div className="grid gap-4">
                  {projectTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setFormData({ ...formData, projectType: type });
                        setStep(2);
                      }}
                      className={`p-4 border rounded-xl text-left transition-all hover:border-gold hover:bg-gold/5 ${
                        formData.projectType === type
                          ? 'border-gold bg-gold/10'
                          : 'border-border'
                      }`}
                    >
                      <span className="font-semibold text-foreground">{type}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Characteristics */}
            {step === 2 && (
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                  Caractéristiques du projet
                </h2>
                
                <div className="space-y-8">
                  <div>
                    <Label className="text-foreground mb-4 block">
                      Surface souhaitée : <span className="font-bold text-gold">{formData.surfaceArea} m²</span>
                    </Label>
                    <Slider
                      value={[formData.surfaceArea]}
                      onValueChange={([value]) => setFormData({ ...formData, surfaceArea: value })}
                      min={50}
                      max={1000}
                      step={10}
                      className="my-4"
                    />
                    <div className="flex justify-between text-sm text-foreground/50">
                      <span>50 m²</span>
                      <span>1000 m²</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-foreground mb-4 block">Localisation</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {locations.map((loc) => (
                        <button
                          key={loc}
                          onClick={() => setFormData({ ...formData, location: loc })}
                          className={`p-3 border rounded-lg text-sm transition-all ${
                            formData.location === loc
                              ? 'border-gold bg-gold/10 text-gold'
                              : 'border-border text-foreground/70 hover:border-gold/50'
                          }`}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-foreground mb-4 block">Niveau de finition</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {qualityLevels.map((level) => (
                        <button
                          key={level}
                          onClick={() => setFormData({ ...formData, qualityLevel: level })}
                          className={`p-4 border rounded-lg text-center transition-all ${
                            formData.qualityLevel === level
                              ? 'border-gold bg-gold/10'
                              : 'border-border hover:border-gold/50'
                          }`}
                        >
                          <span className={`font-semibold ${formData.qualityLevel === level ? 'text-gold' : 'text-foreground'}`}>
                            {level}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Retour
                  </Button>
                  <Button
                    variant="gold"
                    onClick={() => setStep(3)}
                    disabled={!formData.location || !formData.qualityLevel}
                    className="flex-1"
                  >
                    Continuer
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Financing */}
            {step === 3 && (
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                  Options de financement
                </h2>
                
                <div className="space-y-8">
                  <div>
                    <Label className="text-foreground mb-2 block">
                      Montant du prêt souhaité (laisser vide pour estimer le coût total)
                    </Label>
                    <Input
                      type="number"
                      placeholder="Ex: 50000000"
                      value={formData.loanAmount || ''}
                      onChange={(e) => setFormData({ ...formData, loanAmount: Number(e.target.value) })}
                    />
                    <p className="text-sm text-foreground/50 mt-1">
                      Si vous laissez ce champ vide, nous calculerons avec le budget total estimé.
                    </p>
                  </div>

                  <div>
                    <Label className="text-foreground mb-4 block">
                      Durée du prêt : <span className="font-bold text-gold">{formData.loanDuration / 12} ans</span>
                    </Label>
                    <Slider
                      value={[formData.loanDuration]}
                      onValueChange={([value]) => setFormData({ ...formData, loanDuration: value })}
                      min={12}
                      max={300}
                      step={12}
                      className="my-4"
                    />
                    <div className="flex justify-between text-sm text-foreground/50">
                      <span>1 an</span>
                      <span>25 ans</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-foreground mb-4 block">
                      Taux d'intérêt annuel : <span className="font-bold text-gold">{formData.interestRate}%</span>
                    </Label>
                    <Slider
                      value={[formData.interestRate]}
                      onValueChange={([value]) => setFormData({ ...formData, interestRate: value })}
                      min={3}
                      max={15}
                      step={0.5}
                      className="my-4"
                    />
                    <div className="flex justify-between text-sm text-foreground/50">
                      <span>3%</span>
                      <span>15%</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                    Retour
                  </Button>
                  <Button variant="gold" onClick={calculateResults} className="flex-1">
                    Calculer mon projet
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Results */}
            {step === 4 && results && (
              <div>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    Votre estimation est prête !
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Budget Card */}
                  <div className="bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/20 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
                        <Calculator className="w-5 h-5 text-gold" />
                      </div>
                      <h3 className="font-semibold text-foreground">Budget estimé</h3>
                    </div>
                    <p className="text-3xl font-bold text-gold mb-2">
                      {formatCurrency(results.estimatedBudget)}
                    </p>
                    <p className="text-sm text-foreground/60">
                      {formData.surfaceArea} m² × {formatCurrency(PRICE_PER_SQM[formData.projectType]?.[formData.qualityLevel] || 300000)}/m²
                    </p>
                  </div>

                  {/* Duration Card */}
                  <div className="bg-gradient-to-br from-navy/10 to-navy/5 border border-navy/20 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-navy/20 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-navy" />
                      </div>
                      <h3 className="font-semibold text-foreground">Délai de construction</h3>
                    </div>
                    <p className="text-3xl font-bold text-navy mb-2">
                      {results.constructionDuration.min} - {results.constructionDuration.max} mois
                    </p>
                    <p className="text-sm text-foreground/60">
                      Estimation pour un projet {formData.qualityLevel.toLowerCase()}
                    </p>
                  </div>
                </div>

                {/* Credit Summary */}
                {results.monthlyPayment > 0 && (
                  <div className="bg-muted rounded-xl p-6 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <CreditCard className="w-5 h-5 text-gold" />
                      <h3 className="font-semibold text-foreground">Simulation de crédit</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-foreground/60">Mensualité</p>
                        <p className="text-xl font-bold text-foreground">
                          {formatCurrency(results.monthlyPayment)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-foreground/60">Durée</p>
                        <p className="text-xl font-bold text-foreground">
                          {formData.loanDuration / 12} ans
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-foreground/60">Coût total du crédit</p>
                        <p className="text-xl font-bold text-foreground">
                          {formatCurrency(results.totalInterest)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Project Summary */}
                <div className="bg-muted rounded-xl p-6 mb-8">
                  <h3 className="font-semibold text-foreground mb-4">Récapitulatif de votre projet</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-foreground/60">Type :</span>
                      <span className="ml-2 font-medium text-foreground">{formData.projectType}</span>
                    </div>
                    <div>
                      <span className="text-foreground/60">Surface :</span>
                      <span className="ml-2 font-medium text-foreground">{formData.surfaceArea} m²</span>
                    </div>
                    <div>
                      <span className="text-foreground/60">Localisation :</span>
                      <span className="ml-2 font-medium text-foreground">{formData.location}</span>
                    </div>
                    <div>
                      <span className="text-foreground/60">Finition :</span>
                      <span className="ml-2 font-medium text-foreground">{formData.qualityLevel}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Nouvelle simulation
                  </Button>
                  <Button
                    variant="gold"
                    onClick={saveSimulation}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? 'Enregistrement...' : 'Être contacté'}
                  </Button>
                </div>

                <p className="text-center text-sm text-foreground/50 mt-6">
                  * Ces estimations sont données à titre indicatif. 
                  Contactez-nous pour un devis détaillé et personnalisé.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
