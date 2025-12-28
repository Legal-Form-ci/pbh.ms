-- Allow authenticated users to insert their own admin role during setup
-- This is needed for the initial admin setup flow

DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Recreate policies with proper permissions
CREATE POLICY "Admins can manage all roles" 
ON public.user_roles 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow new users to insert their own role if no admin exists
CREATE POLICY "First user can become admin"
ON public.user_roles
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin')
);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.simulations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_updates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;