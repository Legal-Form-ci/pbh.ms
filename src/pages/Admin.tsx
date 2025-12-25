import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  Calculator, 
  LogOut, 
  Loader2, 
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Trash2,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  region: string;
  created_at: string;
}

interface ContactRequest {
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
  location: string;
  quality_level: string;
  estimated_budget: number;
  created_at: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const { user, isAdmin, loading, signOut } = useAuth();
  const { toast } = useToast();
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState('leads');

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchAllData();
    }
  }, [user, isAdmin]);

  const fetchAllData = async () => {
    setLoadingData(true);
    try {
      const [leadsRes, contactsRes, simulationsRes] = await Promise.all([
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('contact_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('simulations').select('*').order('created_at', { ascending: false }),
      ]);

      if (leadsRes.data) setLeads(leadsRes.data);
      if (contactsRes.data) setContacts(contactsRes.data);
      if (simulationsRes.data) setSimulations(simulationsRes.data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const handleDeleteLead = async (id: string) => {
    try {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) throw error;
      setLeads(leads.filter(l => l.id !== id));
      toast({ title: "Lead supprimé" });
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de supprimer", variant: "destructive" });
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      const { error } = await supabase.from('contact_requests').delete().eq('id', id);
      if (error) throw error;
      setContacts(contacts.filter(c => c.id !== id));
      toast({ title: "Demande supprimée" });
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de supprimer", variant: "destructive" });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">
              Administration PBH.M.S
            </h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAllData}
              disabled={loadingData}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loadingData ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{leads.length}</p>
                  <p className="text-sm text-muted-foreground">Leads</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{contacts.length}</p>
                  <p className="text-sm text-muted-foreground">Demandes de contact</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{simulations.length}</p>
                  <p className="text-sm text-muted-foreground">Simulations</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="leads">Leads ({leads.length})</TabsTrigger>
            <TabsTrigger value="contacts">Contacts ({contacts.length})</TabsTrigger>
            <TabsTrigger value="simulations">Simulations ({simulations.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="leads">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="text-left p-4 font-medium text-muted-foreground">Nom</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Contact</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Région</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id} className="border-b border-border hover:bg-muted/20">
                        <td className="p-4">
                          <p className="font-medium text-foreground">
                            {lead.first_name} {lead.last_name}
                          </p>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <p className="text-sm flex items-center gap-2 text-muted-foreground">
                              <Mail className="w-3 h-3" /> {lead.email}
                            </p>
                            <p className="text-sm flex items-center gap-2 text-muted-foreground">
                              <Phone className="w-3 h-3" /> {lead.phone}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="flex items-center gap-2 text-sm">
                            <MapPin className="w-3 h-3 text-gold" /> {lead.region}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="w-3 h-3" /> {formatDate(lead.created_at)}
                          </span>
                        </td>
                        <td className="p-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteLead(lead.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {leads.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                          Aucun lead pour le moment
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="contacts">
            <div className="space-y-4">
              {contacts.map((contact) => (
                <Card key={contact.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-medium text-foreground">{contact.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          contact.status === 'pending' 
                            ? 'bg-yellow-500/10 text-yellow-600' 
                            : 'bg-green-500/10 text-green-600'
                        }`}>
                          {contact.status === 'pending' ? 'En attente' : 'Traité'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{contact.subject}</p>
                      <p className="text-sm text-foreground/80 mb-4">{contact.message}</p>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {contact.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {contact.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {formatDate(contact.created_at)}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteContact(contact.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
              {contacts.length === 0 && (
                <Card className="p-8 text-center text-muted-foreground">
                  Aucune demande de contact pour le moment
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="simulations">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="text-left p-4 font-medium text-muted-foreground">Type</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Surface</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Localisation</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Budget estimé</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simulations.map((sim) => (
                      <tr key={sim.id} className="border-b border-border hover:bg-muted/20">
                        <td className="p-4">
                          <p className="font-medium text-foreground">{sim.project_type}</p>
                          <p className="text-sm text-muted-foreground">{sim.quality_level}</p>
                        </td>
                        <td className="p-4 text-sm">{sim.surface_area} m²</td>
                        <td className="p-4 text-sm">{sim.location}</td>
                        <td className="p-4 text-sm font-medium text-gold">
                          {sim.estimated_budget ? formatCurrency(sim.estimated_budget) : '-'}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {formatDate(sim.created_at)}
                        </td>
                      </tr>
                    ))}
                    {simulations.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                          Aucune simulation pour le moment
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
