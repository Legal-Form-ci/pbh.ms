import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FileText, 
  Mail, 
  Settings, 
  LogOut,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Trash2,
  Eye,
  Plus,
  Filter,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import logo from '@/assets/logo-pbh.png';

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  region: string;
  source: string;
  created_at: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

interface Simulation {
  id: string;
  project_type: string;
  surface_area: number;
  quality_level: string;
  location: string;
  estimated_budget: number;
  created_at: string;
}

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

export default function AdminDashboard() {
  const { toast } = useToast();
  const { user, isAdmin, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/admin/login');
        return;
      }
      if (!isAdmin) {
        toast({
          title: 'Accès refusé',
          description: "Vous n'avez pas les droits d'administration.",
          variant: 'destructive',
        });
        navigate('/');
        return;
      }
      fetchAllData();
    }
  }, [user, isAdmin, authLoading, navigate]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [leadsRes, contactsRes, simulationsRes, projectsRes] = await Promise.all([
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('contact_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('simulations').select('*').order('created_at', { ascending: false }),
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
      ]);

      if (leadsRes.data) setLeads(leadsRes.data);
      if (contactsRes.data) setContacts(contactsRes.data);
      if (simulationsRes.data) setSimulations(simulationsRes.data);
      if (projectsRes.data) setProjects(projectsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLead = async (id: string) => {
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (!error) {
      setLeads(leads.filter(l => l.id !== id));
      toast({ title: 'Lead supprimé' });
    }
  };

  const handleDeleteContact = async (id: string) => {
    const { error } = await supabase.from('contact_requests').delete().eq('id', id);
    if (!error) {
      setContacts(contacts.filter(c => c.id !== id));
      toast({ title: 'Contact supprimé' });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  const stats = [
    { label: 'Leads', value: leads.length, icon: Users, color: 'text-blue-500' },
    { label: 'Contacts', value: contacts.length, icon: Mail, color: 'text-green-500' },
    { label: 'Simulations', value: simulations.length, icon: FileText, color: 'text-purple-500' },
    { label: 'Projets', value: projects.length, icon: Building2, color: 'text-gold' },
  ];

  return (
    <div className="min-h-screen bg-muted flex">
      {/* Sidebar */}
      <aside className="w-64 bg-navy-dark text-primary-foreground flex-shrink-0 hidden lg:flex flex-col">
        <div className="p-6">
          <Link to="/">
            <img src={logo} alt="PBH.M.S" className="h-12 w-auto" />
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
            { id: 'leads', label: 'Leads', icon: Users },
            { id: 'contacts', label: 'Demandes de contact', icon: Mail },
            { id: 'simulations', label: 'Simulations', icon: FileText },
            { id: 'projects', label: 'Projets', icon: Building2 },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-gold text-navy-dark'
                  : 'text-primary-foreground/70 hover:bg-primary-foreground/10'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-primary-foreground/10">
          <Button
            variant="ghost"
            className="w-full justify-start text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="bg-card border-b border-border sticky top-0 z-40 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Administration</h1>
              <p className="text-sm text-muted-foreground">
                Bienvenue, {user?.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={fetchAllData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <Card key={stat.label}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                          <p className="text-3xl font-bold mt-1">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center ${stat.color}`}>
                          <stat.icon className="w-6 h-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Leads */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Derniers leads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {leads.slice(0, 5).map((lead) => (
                        <div key={lead.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                          <div>
                            <p className="font-medium">{lead.first_name} {lead.last_name}</p>
                            <p className="text-sm text-muted-foreground">{lead.email}</p>
                          </div>
                          <Badge variant="secondary">{lead.region}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Simulations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Dernières simulations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {simulations.slice(0, 5).map((sim) => (
                        <div key={sim.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                          <div>
                            <p className="font-medium">{sim.project_type}</p>
                            <p className="text-sm text-muted-foreground">{sim.surface_area} m² - {sim.location}</p>
                          </div>
                          <p className="font-bold text-gold">{formatCurrency(sim.estimated_budget)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Leads View */}
          {activeTab === 'leads' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des leads</CardTitle>
                  <CardDescription>{leads.length} lead(s) enregistré(s)</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Téléphone</TableHead>
                        <TableHead>Région</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leads.map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell className="font-medium">{lead.first_name} {lead.last_name}</TableCell>
                          <TableCell>{lead.email}</TableCell>
                          <TableCell>{lead.phone}</TableCell>
                          <TableCell><Badge variant="secondary">{lead.region}</Badge></TableCell>
                          <TableCell>{lead.source}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">{formatDate(lead.created_at)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteLead(lead.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Contacts View */}
          {activeTab === 'contacts' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Demandes de contact</CardTitle>
                  <CardDescription>{contacts.length} demande(s)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contacts.map((contact) => (
                      <Card key={contact.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{contact.name}</h4>
                              <p className="text-sm text-muted-foreground">{contact.email} · {contact.phone}</p>
                              <Badge variant="outline" className="mt-2">{contact.subject}</Badge>
                              <p className="mt-3 text-sm">{contact.message}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge variant={contact.status === 'pending' ? 'secondary' : 'default'}>
                                {contact.status === 'pending' ? 'En attente' : 'Traité'}
                              </Badge>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteContact(contact.id)}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-3">{formatDate(contact.created_at)}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Simulations View */}
          {activeTab === 'simulations' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Simulations</CardTitle>
                  <CardDescription>{simulations.length} simulation(s)</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type de projet</TableHead>
                        <TableHead>Surface</TableHead>
                        <TableHead>Qualité</TableHead>
                        <TableHead>Localisation</TableHead>
                        <TableHead>Budget estimé</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {simulations.map((sim) => (
                        <TableRow key={sim.id}>
                          <TableCell className="font-medium">{sim.project_type}</TableCell>
                          <TableCell>{sim.surface_area} m²</TableCell>
                          <TableCell><Badge variant="secondary">{sim.quality_level}</Badge></TableCell>
                          <TableCell>{sim.location}</TableCell>
                          <TableCell className="font-bold text-gold">{formatCurrency(sim.estimated_budget)}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">{formatDate(sim.created_at)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Projects View */}
          {activeTab === 'projects' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Projets clients</CardTitle>
                    <CardDescription>{projects.length} projet(s)</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  {projects.length === 0 ? (
                    <div className="text-center py-12">
                      <Building2 className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">Aucun projet en cours</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {projects.map((project) => (
                        <Card key={project.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold">{project.title}</h4>
                                <p className="text-sm text-muted-foreground">{project.project_type} - {project.location}</p>
                              </div>
                              <Badge>{project.construction_status}</Badge>
                            </div>
                            <div className="mt-4">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Progression</span>
                                <span>{project.construction_progress}%</span>
                              </div>
                              <Progress value={project.construction_progress} />
                            </div>
                            <div className="mt-4 flex justify-between text-sm">
                              <span>Séquestre: <Badge variant="outline">{project.escrow_account_status}</Badge></span>
                              <span className="font-bold text-gold">{formatCurrency(project.estimated_budget)}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
