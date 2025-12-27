import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Building2, 
  FileText, 
  Settings, 
  LogOut, 
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import logo from '@/assets/logo-pbh.png';

interface Project {
  id: string;
  title: string;
  project_type: string;
  location: string;
  estimated_budget: number;
  construction_status: string;
  construction_progress: number;
  escrow_account_status: string;
  created_at: string;
}

interface Simulation {
  id: string;
  project_type: string;
  surface_area: number;
  quality_level: string;
  location: string;
  estimated_budget: number;
  status: string;
  created_at: string;
}

interface Profile {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
}

export default function ClientDashboard() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [simulations, setSimulations] = useState<Simulation[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/espace-client/connexion');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', user?.id)
        .order('created_at', { ascending: false });

      if (projectsData) {
        setProjects(projectsData);
      }

      // Fetch simulations
      const { data: simulationsData } = await supabase
        .from('simulations')
        .select('*')
        .eq('client_id', user?.id)
        .order('created_at', { ascending: false });

      if (simulationsData) {
        setSimulations(simulationsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      planning: { variant: 'secondary', label: 'Planification' },
      approved: { variant: 'default', label: 'Approuvé' },
      in_progress: { variant: 'default', label: 'En cours' },
      completed: { variant: 'default', label: 'Terminé' },
      delivered: { variant: 'default', label: 'Livré' },
      pending: { variant: 'secondary', label: 'En attente' },
      opened: { variant: 'default', label: 'Ouvert' },
      funded: { variant: 'default', label: 'Financé' },
      released: { variant: 'default', label: 'Libéré' },
      closed: { variant: 'outline', label: 'Fermé' },
    };

    const config = statusConfig[status] || { variant: 'secondary', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="PBH.M.S" className="h-10 w-auto" />
            </Link>

            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-foreground">
                  {profile?.first_name} {profile?.last_name}
                </p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-8 py-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            {t('portal.welcome')}, {profile?.first_name || 'Client'} !
          </h1>
          <p className="text-muted-foreground mt-2">
            Suivez vos projets et simulations en temps réel.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Projets actifs
              </CardTitle>
              <Building2 className="w-4 h-4 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects.filter(p => p.construction_status !== 'delivered').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Simulations
              </CardTitle>
              <FileText className="w-4 h-4 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{simulations.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Investissement total
              </CardTitle>
              <CheckCircle className="w-4 h-4 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(projects.reduce((acc, p) => acc + (p.estimated_budget || 0), 0))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects" className="gap-2">
              <Building2 className="w-4 h-4" />
              {t('portal.my_projects')}
            </TabsTrigger>
            <TabsTrigger value="simulations" className="gap-2">
              <FileText className="w-4 h-4" />
              {t('portal.my_simulations')}
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              {t('portal.my_profile')}
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects">
            {projects.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Building2 className="w-12 h-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">{t('portal.no_projects')}</p>
                  <Link to="/simulateur">
                    <Button variant="gold" className="mt-4">
                      Démarrer un projet
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <Card key={project.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{project.title}</h3>
                            {getStatusBadge(project.construction_status)}
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Home className="w-4 h-4" />
                              {project.project_type}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {project.location}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-gold">
                            {formatCurrency(project.estimated_budget)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Séquestre: {getStatusBadge(project.escrow_account_status)}
                          </p>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="mt-6">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Progression des travaux</span>
                          <span className="font-medium">{project.construction_progress}%</span>
                        </div>
                        <Progress value={project.construction_progress} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Simulations Tab */}
          <TabsContent value="simulations">
            {simulations.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">{t('portal.no_simulations')}</p>
                  <Link to="/simulateur">
                    <Button variant="gold" className="mt-4">
                      Faire une simulation
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {simulations.map((sim) => (
                  <Card key={sim.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold">{sim.project_type}</h3>
                          <p className="text-sm text-muted-foreground">{sim.location}</p>
                        </div>
                        {getStatusBadge(sim.status)}
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Surface</span>
                          <span>{sim.surface_area} m²</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Qualité</span>
                          <span>{sim.quality_level}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Budget estimé</span>
                          <span className="font-bold text-gold">{formatCurrency(sim.estimated_budget)}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                          Créée le {new Date(sim.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Mon profil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gold" />
                    <div>
                      <p className="text-sm text-muted-foreground">Nom complet</p>
                      <p className="font-medium">{profile?.first_name} {profile?.last_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gold" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{profile?.email || user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gold" />
                    <div>
                      <p className="text-sm text-muted-foreground">Téléphone</p>
                      <p className="font-medium">{profile?.phone || 'Non renseigné'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
