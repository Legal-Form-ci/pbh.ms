-- Add client_role to app_role enum if not exists
DO $$ BEGIN
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'client';
EXCEPTION WHEN others THEN null;
END $$;

-- Create profiles table for user profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    email TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Create projects table for client projects with escrow system
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    project_type TEXT NOT NULL,
    surface_area INTEGER NOT NULL,
    quality_level TEXT NOT NULL,
    location TEXT NOT NULL,
    estimated_budget NUMERIC,
    escrow_amount NUMERIC,
    escrow_account_status TEXT DEFAULT 'pending' CHECK (escrow_account_status IN ('pending', 'opened', 'funded', 'released', 'closed')),
    escrow_bank TEXT,
    construction_status TEXT DEFAULT 'planning' CHECK (construction_status IN ('planning', 'approved', 'in_progress', 'completed', 'delivered')),
    construction_progress INTEGER DEFAULT 0 CHECK (construction_progress >= 0 AND construction_progress <= 100),
    start_date DATE,
    estimated_completion_date DATE,
    actual_completion_date DATE,
    expert_validation_date DATE,
    expert_validation_status TEXT CHECK (expert_validation_status IN ('pending', 'approved', 'rejected')),
    keys_delivered_date DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Clients can view their own projects" 
ON public.projects FOR SELECT 
USING (auth.uid() = client_id);

CREATE POLICY "Clients can create their own projects" 
ON public.projects FOR INSERT 
WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Admins can view all projects" 
ON public.projects FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all projects" 
ON public.projects FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete projects" 
ON public.projects FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Create project_updates table for tracking project progress
CREATE TABLE IF NOT EXISTS public.project_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    progress_percentage INTEGER CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    image_url TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on project_updates
ALTER TABLE public.project_updates ENABLE ROW LEVEL SECURITY;

-- Project updates policies
CREATE POLICY "Project owners can view their project updates" 
ON public.project_updates FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.projects 
        WHERE projects.id = project_updates.project_id 
        AND projects.client_id = auth.uid()
    )
);

CREATE POLICY "Admins can manage project updates" 
ON public.project_updates FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Create project_documents table for storing project documents
CREATE TABLE IF NOT EXISTS public.project_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    document_type TEXT NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on project_documents
ALTER TABLE public.project_documents ENABLE ROW LEVEL SECURITY;

-- Project documents policies
CREATE POLICY "Project owners can view their documents" 
ON public.project_documents FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.projects 
        WHERE projects.id = project_documents.project_id 
        AND projects.client_id = auth.uid()
    )
);

CREATE POLICY "Admins can manage project documents" 
ON public.project_documents FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Update simulations table to link to clients
ALTER TABLE public.simulations 
ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'reviewed', 'converted')),
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS converted_to_project_id UUID REFERENCES public.projects(id);

-- Add policy for clients to view their own simulations
CREATE POLICY "Clients can view their own simulations" 
ON public.simulations FOR SELECT 
USING (client_id = auth.uid());

CREATE POLICY "Clients can update their own simulations" 
ON public.simulations FOR UPDATE 
USING (client_id = auth.uid());

-- Function to handle new user signup - create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, first_name, last_name)
    VALUES (
        NEW.id, 
        NEW.email,
        NEW.raw_user_meta_data ->> 'first_name',
        NEW.raw_user_meta_data ->> 'last_name'
    );
    RETURN NEW;
END;
$$;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();