-- Criar tabelas para inscrições em eventos e ministérios
CREATE TABLE public.event_registrations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  registered_at timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  notes text,
  UNIQUE(user_id, event_id)
);

CREATE TABLE public.ministry_memberships (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  ministry_id uuid NOT NULL REFERENCES public.ministries(id) ON DELETE CASCADE,
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  role text DEFAULT 'member',
  UNIQUE(user_id, ministry_id)
);

-- Enable RLS
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministry_memberships ENABLE ROW LEVEL SECURITY;

-- Policies for event_registrations
CREATE POLICY "Users can view their own registrations" 
ON public.event_registrations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can register for events" 
ON public.event_registrations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel their own registrations" 
ON public.event_registrations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all registrations" 
ON public.event_registrations 
FOR ALL 
USING (is_admin(auth.uid()));

-- Policies for ministry_memberships
CREATE POLICY "Users can view their own memberships" 
ON public.ministry_memberships 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can join ministries" 
ON public.ministry_memberships 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memberships" 
ON public.ministry_memberships 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all memberships" 
ON public.ministry_memberships 
FOR ALL 
USING (is_admin(auth.uid()));