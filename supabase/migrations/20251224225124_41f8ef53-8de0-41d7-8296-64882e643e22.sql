-- Table pour les leads/visiteurs collectés par l'assistant virtuel
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Côte d''Ivoire',
  region TEXT NOT NULL,
  source TEXT DEFAULT 'virtual_assistant',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les demandes de contact
CREATE TABLE public.contact_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les projets portfolio
CREATE TABLE public.portfolio_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  project_type TEXT NOT NULL,
  surface_area INTEGER,
  duration_months INTEGER,
  budget_range TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'completed',
  completion_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les simulations
CREATE TABLE public.simulations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  project_type TEXT NOT NULL,
  surface_area INTEGER NOT NULL,
  location TEXT NOT NULL,
  quality_level TEXT NOT NULL,
  estimated_budget DECIMAL(15,2),
  loan_amount DECIMAL(15,2),
  loan_duration_months INTEGER,
  monthly_payment DECIMAL(15,2),
  estimated_construction_months INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;

-- Public read policy for portfolio (visible to everyone)
CREATE POLICY "Portfolio projects are publicly viewable" 
ON public.portfolio_projects 
FOR SELECT 
USING (true);

-- Public insert policies for leads and contact requests (visitors can submit)
CREATE POLICY "Anyone can submit a lead" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can submit a contact request" 
ON public.contact_requests 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can create a simulation" 
ON public.simulations 
FOR INSERT 
WITH CHECK (true);

-- Insert sample portfolio projects
INSERT INTO public.portfolio_projects (title, description, location, project_type, surface_area, duration_months, budget_range, status, completion_date) VALUES
('Villa Moderne Cocody', 'Villa contemporaine de standing avec piscine, 4 chambres, salon double, cuisine américaine équipée', 'Cocody, Abidjan', 'Villa', 350, 8, '150-200M FCFA', 'completed', '2024-06-15'),
('Résidence Les Palmiers', 'Immeuble résidentiel de 12 appartements avec parking souterrain et espaces verts', 'Marcory, Abidjan', 'Immeuble', 1200, 18, '500-700M FCFA', 'completed', '2024-03-20'),
('Duplex Familial Riviera', 'Duplex spacieux avec jardin privatif, 5 chambres, 3 salles de bain, garage double', 'Riviera Palmeraie, Abidjan', 'Duplex', 280, 10, '120-150M FCFA', 'completed', '2024-09-10'),
('Bureau Commercial Plateau', 'Espace de bureaux modernes sur 3 niveaux avec salle de conférence et cafétéria', 'Plateau, Abidjan', 'Commercial', 450, 12, '250-300M FCFA', 'completed', '2023-12-01'),
('Maison Économique Yopougon', 'Maison économique 3 chambres, conception optimisée pour budget maîtrisé', 'Yopougon, Abidjan', 'Maison', 120, 5, '35-50M FCFA', 'completed', '2024-08-25'),
('Villa de Luxe Assinie', 'Villa bord de mer avec vue panoramique, 6 chambres, piscine à débordement', 'Assinie', 'Villa', 500, 14, '400-500M FCFA', 'in_progress', NULL);