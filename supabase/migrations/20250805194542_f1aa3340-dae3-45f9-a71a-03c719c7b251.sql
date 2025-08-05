
-- Adicionar campo de preço aos eventos
ALTER TABLE public.events 
ADD COLUMN price DECIMAL(10,2) DEFAULT 0,
ADD COLUMN is_paid BOOLEAN DEFAULT false;

-- Atualizar a tabela de blog_posts para suportar conteúdo completo
ALTER TABLE public.blog_posts 
ADD COLUMN slug TEXT UNIQUE,
ADD COLUMN read_time INTEGER DEFAULT 5;

-- Criar índice para melhor performance na busca de slugs
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);

-- Função para gerar slug automaticamente
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(trim(regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g')));
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar slug automaticamente
CREATE OR REPLACE FUNCTION set_blog_post_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.title) || '-' || extract(epoch from now())::text;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_blog_post_slug ON public.blog_posts;
CREATE TRIGGER trigger_set_blog_post_slug
  BEFORE INSERT OR UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION set_blog_post_slug();
