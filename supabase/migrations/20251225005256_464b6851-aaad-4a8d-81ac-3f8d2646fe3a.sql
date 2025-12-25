-- Create app_role enum for admin system
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policy: Users can see their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- RLS policy: Only admins can manage roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ========================================
-- SECURE RLS POLICIES FOR EXISTING TABLES
-- ========================================

-- CONTACT_REQUESTS: Add admin-only SELECT, UPDATE, DELETE
CREATE POLICY "Admins can view all contact requests"
ON public.contact_requests
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update contact requests"
ON public.contact_requests
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete contact requests"
ON public.contact_requests
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- LEADS: Add admin-only SELECT, UPDATE, DELETE
CREATE POLICY "Admins can view all leads"
ON public.leads
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update leads"
ON public.leads
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete leads"
ON public.leads
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- SIMULATIONS: Add admin-only SELECT, UPDATE, DELETE
CREATE POLICY "Admins can view all simulations"
ON public.simulations
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update simulations"
ON public.simulations
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete simulations"
ON public.simulations
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- PORTFOLIO_PROJECTS: Add admin-only INSERT, UPDATE, DELETE
CREATE POLICY "Admins can create portfolio projects"
ON public.portfolio_projects
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update portfolio projects"
ON public.portfolio_projects
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete portfolio projects"
ON public.portfolio_projects
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));