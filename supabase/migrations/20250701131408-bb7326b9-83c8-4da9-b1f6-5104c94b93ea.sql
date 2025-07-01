
-- Criar enum para os tipos de usuário
CREATE TYPE public.user_role AS ENUM ('admin', 'user');

-- Criar tabela de roles de usuário
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Habilitar RLS na tabela user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Criar função para verificar se usuário tem role específico
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Criar função para verificar se usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

-- Criar função para automaticamente criar role de usuário quando alguém se registra
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

-- Criar trigger para automaticamente criar role quando usuário se registra
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Políticas RLS para user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert roles"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update roles"
  ON public.user_roles
  FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles
  FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Atualizar políticas das outras tabelas para incluir verificação de admin

-- Ministérios: apenas admins podem criar/editar/deletar
DROP POLICY IF EXISTS "Authenticated users can insert ministries" ON public.ministries;
DROP POLICY IF EXISTS "Authenticated users can update ministries" ON public.ministries;
DROP POLICY IF EXISTS "Authenticated users can delete ministries" ON public.ministries;

CREATE POLICY "Admins can insert ministries"
  ON public.ministries
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update ministries"
  ON public.ministries
  FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete ministries"
  ON public.ministries
  FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Eventos: apenas admins podem criar/editar/deletar
DROP POLICY IF EXISTS "Authenticated users can insert events" ON public.events;
DROP POLICY IF EXISTS "Authenticated users can update their events" ON public.events;
DROP POLICY IF EXISTS "Authenticated users can delete their events" ON public.events;

CREATE POLICY "Admins can insert events"
  ON public.events
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update events"
  ON public.events
  FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete events"
  ON public.events
  FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Sermões: apenas admins podem criar/editar/deletar
DROP POLICY IF EXISTS "Authenticated users can insert sermons" ON public.sermons;
DROP POLICY IF EXISTS "Authenticated users can update sermons" ON public.sermons;
DROP POLICY IF EXISTS "Authenticated users can delete sermons" ON public.sermons;

CREATE POLICY "Admins can insert sermons"
  ON public.sermons
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update sermons"
  ON public.sermons
  FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete sermons"
  ON public.sermons
  FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Blog Posts: apenas admins podem criar/editar/deletar
DROP POLICY IF EXISTS "Authenticated users can insert blog posts" ON public.blog_posts;

CREATE POLICY "Admins can insert blog posts"
  ON public.blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()) AND author_id = auth.uid());

-- Mensagens de contato: admins podem gerenciar todas, usuários podem apenas enviar
DROP POLICY IF EXISTS "Authenticated users can manage contact messages" ON public.contact_messages;

CREATE POLICY "Admins can manage all contact messages"
  ON public.contact_messages
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update contact messages"
  ON public.contact_messages
  FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete contact messages"
  ON public.contact_messages
  FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));
