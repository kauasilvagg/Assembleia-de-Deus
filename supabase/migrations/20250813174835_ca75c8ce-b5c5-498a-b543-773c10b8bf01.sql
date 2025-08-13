-- Criar triggers para enviar notificações automáticas quando admins criarem conteúdo

-- Função para enviar notificação de evento criado
CREATE OR REPLACE FUNCTION notify_event_created()
RETURNS TRIGGER AS $$
BEGIN
  -- Chamar edge function para enviar notificações por email
  PERFORM 
    net.http_post(
      url := 'https://vklazxjdvomamvoxxybj.supabase.co/functions/v1/send-notification-emails',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.jwt_token', true) || '"}'::jsonb,
      body := json_build_object(
        'type', 'event',
        'title', NEW.title,
        'description', NEW.description,
        'content_id', NEW.id::text,
        'event_date', NEW.event_date::text
      )::jsonb
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para enviar notificação de blog criado
CREATE OR REPLACE FUNCTION notify_blog_created()
RETURNS TRIGGER AS $$
BEGIN
  -- Só notificar quando o post for publicado
  IF NEW.is_published = true AND (OLD.is_published = false OR OLD IS NULL) THEN
    PERFORM 
      net.http_post(
        url := 'https://vklazxjdvomamvoxxybj.supabase.co/functions/v1/send-notification-emails',
        headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.jwt_token', true) || '"}'::jsonb,
        body := json_build_object(
          'type', 'blog',
          'title', NEW.title,
          'description', NEW.excerpt,
          'content_id', NEW.id::text,
          'author_name', NEW.author_name
        )::jsonb
      );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para enviar notificação de ministério criado
CREATE OR REPLACE FUNCTION notify_ministry_created()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM 
    net.http_post(
      url := 'https://vklazxjdvomamvoxxybj.supabase.co/functions/v1/send-notification-emails',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.jwt_token', true) || '"}'::jsonb,
      body := json_build_object(
        'type', 'ministry',
        'title', NEW.name,
        'description', NEW.description,
        'content_id', NEW.id::text
      )::jsonb
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para enviar notificação de sermão criado
CREATE OR REPLACE FUNCTION notify_sermon_created()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM 
    net.http_post(
      url := 'https://vklazxjdvomamvoxxybj.supabase.co/functions/v1/send-notification-emails',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.jwt_token', true) || '"}'::jsonb,
      body := json_build_object(
        'type', 'sermon',
        'title', NEW.title,
        'description', NEW.description,
        'content_id', NEW.id::text,
        'preacher_name', NEW.preacher_name
      )::jsonb
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar triggers para notificações automáticas
CREATE TRIGGER trigger_notify_event_created
  AFTER INSERT ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION notify_event_created();

CREATE TRIGGER trigger_notify_blog_created
  AFTER INSERT OR UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION notify_blog_created();

CREATE TRIGGER trigger_notify_ministry_created
  AFTER INSERT ON public.ministries
  FOR EACH ROW
  EXECUTE FUNCTION notify_ministry_created();

CREATE TRIGGER trigger_notify_sermon_created
  AFTER INSERT ON public.sermons
  FOR EACH ROW
  EXECUTE FUNCTION notify_sermon_created();