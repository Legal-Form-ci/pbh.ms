import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Clock, Ruler, ArrowRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  project_type: string;
  surface_area: number | null;
  duration_months: number | null;
  budget_range: string | null;
  image_url: string | null;
  status: string | null;
  completion_date: string | null;
}

const projectTypes = ['Tous', 'Villa', 'Maison', 'Duplex', 'Immeuble', 'Commercial'];

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('Tous');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProjects(data);
    }
    setLoading(false);
  };

  const filteredProjects = selectedType === 'Tous' 
    ? projects 
    : projects.filter(p => p.project_type === selectedType);

  const getPlaceholderImage = (type: string) => {
    const images: Record<string, string> = {
      'Villa': 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
      'Maison': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'Duplex': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      'Immeuble': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
      'Commercial': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    };
    return images[type] || images['Villa'];
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-navy-dark via-navy to-navy-light text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-gold/20 text-gold px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Building2 className="w-4 h-4" />
              Nos réalisations
            </div>
            <h1 className="font-display text-4xl lg:text-5xl font-bold mb-6">
              Portfolio de nos projets
            </h1>
            <p className="text-primary-foreground/70 text-lg">
              Découvrez nos réalisations et projets en cours. Chaque construction 
              témoigne de notre engagement pour la qualité et la sécurité.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-muted border-b border-border sticky top-20 z-40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-foreground/50 flex-shrink-0" />
            {projectTypes.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? 'gold' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(type)}
                className="flex-shrink-0"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-56 bg-muted" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <Building2 className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Aucun projet trouvé
              </h3>
              <p className="text-foreground/60">
                Aucun projet ne correspond à ce filtre.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={project.image_url || getPlaceholderImage(project.project_type)}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm">
                        {project.project_type}
                      </Badge>
                      {project.status === 'in_progress' && (
                        <Badge className="bg-gold text-navy-dark">
                          En cours
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-gold transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-foreground/60 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="space-y-2 text-sm text-foreground/70">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gold" />
                        <span>{project.location}</span>
                      </div>
                      {project.surface_area && (
                        <div className="flex items-center gap-2">
                          <Ruler className="w-4 h-4 text-gold" />
                          <span>{project.surface_area} m²</span>
                        </div>
                      )}
                      {project.duration_months && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gold" />
                          <span>{project.duration_months} mois</span>
                        </div>
                      )}
                    </div>

                    {project.budget_range && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-sm text-foreground/50">Budget estimé</p>
                        <p className="font-bold text-gold">{project.budget_range}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <p className="text-foreground/70 mb-4">
              Vous avez un projet similaire en tête ?
            </p>
            <Link to="/simulateur">
              <Button variant="gold" size="lg">
                Simuler votre projet
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
