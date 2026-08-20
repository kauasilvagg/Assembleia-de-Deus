-- Cascade deletes for ministry references
ALTER TABLE public.ministry_memberships
  DROP CONSTRAINT IF EXISTS ministry_memberships_ministry_id_fkey;
ALTER TABLE public.ministry_memberships
  ADD CONSTRAINT ministry_memberships_ministry_id_fkey
  FOREIGN KEY (ministry_id) REFERENCES public.ministries(id) ON DELETE CASCADE;

ALTER TABLE public.ministry_schedules
  DROP CONSTRAINT IF EXISTS ministry_schedules_ministry_id_fkey;
ALTER TABLE public.ministry_schedules
  ADD CONSTRAINT ministry_schedules_ministry_id_fkey
  FOREIGN KEY (ministry_id) REFERENCES public.ministries(id) ON DELETE CASCADE;

-- Recreate admin policies scoped to authenticated role, with WITH CHECK on update
DROP POLICY IF EXISTS "Admins can delete ministries" ON public.ministries;
CREATE POLICY "Admins can delete ministries"
  ON public.ministries FOR DELETE TO authenticated
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update ministries" ON public.ministries;
CREATE POLICY "Admins can update ministries"
  ON public.ministries FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can insert ministries" ON public.ministries;
CREATE POLICY "Admins can insert ministries"
  ON public.ministries FOR INSERT TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

-- Admins can also view inactive ministries
DROP POLICY IF EXISTS "Admins can view all ministries" ON public.ministries;
CREATE POLICY "Admins can view all ministries"
  ON public.ministries FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));