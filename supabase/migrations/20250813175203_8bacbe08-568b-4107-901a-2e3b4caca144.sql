-- Fix security issue: Restrict profiles table access
-- Remove the overly permissive policy that allows all users to read all profiles
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;

-- Create new restrictive policies for profiles table
-- Users can only see their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Admins can manage all profiles
CREATE POLICY "Admins can manage all profiles" 
ON public.profiles 
FOR ALL 
USING (is_admin(auth.uid()));

-- Fix event registrations policies to ensure users can properly check their registration status
-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can view their own registrations" ON public.event_registrations;

-- Recreate with proper policy
CREATE POLICY "Users can view their own registrations" 
ON public.event_registrations 
FOR SELECT 
USING (auth.uid() = user_id);