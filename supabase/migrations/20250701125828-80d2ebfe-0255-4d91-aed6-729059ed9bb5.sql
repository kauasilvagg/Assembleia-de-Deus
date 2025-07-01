
-- Atualizar políticas RLS para Ministérios
DROP POLICY IF EXISTS "Authenticated users can manage ministries" ON public.ministries;
CREATE POLICY "Authenticated users can insert ministries" 
  ON public.ministries 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update ministries" 
  ON public.ministries 
  FOR UPDATE 
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete ministries" 
  ON public.ministries 
  FOR DELETE 
  TO authenticated
  USING (true);

-- Atualizar políticas RLS para Eventos
DROP POLICY IF EXISTS "Authenticated users can manage events" ON public.events;
CREATE POLICY "Authenticated users can insert events" 
  ON public.events 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update their events" 
  ON public.events 
  FOR UPDATE 
  TO authenticated
  USING (created_by = auth.uid() OR auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete their events" 
  ON public.events 
  FOR DELETE 
  TO authenticated
  USING (created_by = auth.uid() OR auth.uid() IS NOT NULL);

-- Atualizar políticas RLS para Sermões
DROP POLICY IF EXISTS "Authenticated users can manage sermons" ON public.sermons;
CREATE POLICY "Authenticated users can insert sermons" 
  ON public.sermons 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update sermons" 
  ON public.sermons 
  FOR UPDATE 
  TO authenticated
  USING (created_by = auth.uid() OR auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete sermons" 
  ON public.sermons 
  FOR DELETE 
  TO authenticated
  USING (created_by = auth.uid() OR auth.uid() IS NOT NULL);

-- Atualizar políticas RLS para Blog Posts
DROP POLICY IF EXISTS "Authors can manage their own posts" ON public.blog_posts;
CREATE POLICY "Authenticated users can insert blog posts" 
  ON public.blog_posts 
  FOR INSERT 
  TO authenticated
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can update their own posts" 
  ON public.blog_posts 
  FOR UPDATE 
  TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY "Authors can delete their own posts" 
  ON public.blog_posts 
  FOR DELETE 
  TO authenticated
  USING (author_id = auth.uid());

-- Manter a política de mensagens de contato como está (qualquer um pode enviar)
-- Mas apenas usuários autenticados podem gerenciar

-- Garantir que o campo created_by seja preenchido automaticamente para eventos
CREATE OR REPLACE FUNCTION public.set_created_by()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para eventos
DROP TRIGGER IF EXISTS set_events_created_by ON public.events;
CREATE TRIGGER set_events_created_by
  BEFORE INSERT ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();

-- Criar trigger para sermões
DROP TRIGGER IF EXISTS set_sermons_created_by ON public.sermons;
CREATE TRIGGER set_sermons_created_by
  BEFORE INSERT ON public.sermons
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();
