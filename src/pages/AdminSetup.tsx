import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, AlertCircle, Loader2, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import logo from '@/assets/logo-pbh.png';

export default function AdminSetup() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'checking' | 'creating' | 'success' | 'exists' | 'error'>('idle');
  const [message, setMessage] = useState('Cliquez sur le bouton pour initialiser le compte Super Admin');

  const checkAndSetupAdmin = async () => {
    setStatus('checking');
    setMessage('Vérification en cours...');

    try {
      // Check if any admin exists
      const { data: existingAdmins } = await supabase
        .from('user_roles')
        .select('id')
        .eq('role', 'admin')
        .limit(1);

      if (existingAdmins && existingAdmins.length > 0) {
        setStatus('exists');
        setMessage('Un administrateur existe déjà. Vous pouvez vous connecter.');
        setTimeout(() => navigate('/admin/login'), 2000);
        return;
      }

      setStatus('creating');
      setMessage('Création du compte Super Admin...');

      // Create the admin user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'admin@pbh-ms.ci',
        password: '@PBH.ms2025.',
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
          data: {
            first_name: 'Super',
            last_name: 'Admin',
          },
        },
      });

      if (signUpError) {
        // If user already exists, try to sign in and add role
        if (signUpError.message.includes('already registered')) {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: 'admin@pbh-ms.ci',
            password: '@PBH.ms2025.',
          });

          if (signInError) throw signInError;

          if (signInData.user) {
            // Add admin role
            const { error: roleError } = await supabase.from('user_roles').insert({
              user_id: signInData.user.id,
              role: 'admin',
            });

            if (roleError && !roleError.message.includes('duplicate')) {
              console.error('Role error:', roleError);
            }

            setStatus('success');
            setMessage('Compte Super Admin configuré avec succès !');
            toast({
              title: 'Succès',
              description: 'Le compte Super Admin est prêt.',
            });
            setTimeout(() => navigate('/admin'), 2000);
            return;
          }
        }
        throw signUpError;
      }

      if (signUpData.user) {
        // Add admin role
        const { error: roleError } = await supabase.from('user_roles').insert({
          user_id: signUpData.user.id,
          role: 'admin',
        });

        if (roleError) {
          console.error('Error adding admin role:', roleError);
        }

        setStatus('success');
        setMessage('Compte Super Admin créé avec succès !');
        toast({
          title: 'Succès',
          description: 'Le compte Super Admin a été créé.',
        });
        setTimeout(() => navigate('/admin/login'), 3000);
      }
    } catch (error: any) {
      console.error('Setup error:', error);
      setStatus('error');
      setMessage(error.message || 'Une erreur est survenue');
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de créer le compte admin.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-dark via-navy to-navy-light flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="border-2 border-gold/20">
          <CardHeader className="text-center">
            <img src={logo} alt="PBH.M.S" className="h-16 w-auto mx-auto mb-4" />
            <CardTitle className="text-xl">Configuration Super Admin</CardTitle>
            <CardDescription>Initialisation du compte administrateur</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8">
            {status === 'idle' && (
              <KeyRound className="w-12 h-12 text-gold mb-4" />
            )}
            {(status === 'checking' || status === 'creating') && (
              <Loader2 className="w-12 h-12 text-gold animate-spin mb-4" />
            )}
            {status === 'exists' && (
              <Shield className="w-12 h-12 text-blue-500 mb-4" />
            )}
            {status === 'success' && (
              <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
            )}
            {status === 'error' && (
              <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            )}

            <p className="text-center text-foreground/70 mb-6">{message}</p>

            {status === 'idle' && (
              <Button
                variant="gold"
                size="lg"
                onClick={checkAndSetupAdmin}
              >
                Initialiser le Super Admin
              </Button>
            )}

            {status === 'success' && (
              <div className="mt-4 p-4 bg-muted rounded-lg text-sm w-full">
                <p className="font-semibold mb-2">Identifiants Super Admin :</p>
                <p>Email: <code className="bg-background px-2 py-1 rounded">admin@pbh-ms.ci</code></p>
                <p className="mt-1">Mot de passe: <code className="bg-background px-2 py-1 rounded">@PBH.ms2025.</code></p>
              </div>
            )}

            {status === 'error' && (
              <Button
                variant="gold"
                className="mt-4"
                onClick={checkAndSetupAdmin}
              >
                Réessayer
              </Button>
            )}

            <Button
              variant="ghost"
              className="mt-6"
              onClick={() => navigate('/admin/login')}
            >
              Retour à la connexion
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
