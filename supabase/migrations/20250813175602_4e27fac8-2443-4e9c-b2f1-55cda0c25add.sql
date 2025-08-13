-- Verificar e corrigir possíveis problemas com as triggers de notificação
-- Vamos temporariamente desabilitar as triggers para permitir o cadastro de conteúdo

-- Desabilitar triggers de notificação temporariamente
DROP TRIGGER IF EXISTS trigger_notify_event_created ON public.events;
DROP TRIGGER IF EXISTS trigger_notify_blog_created ON public.blog_posts;
DROP TRIGGER IF EXISTS trigger_notify_ministry_created ON public.ministries;
DROP TRIGGER IF EXISTS trigger_notify_sermon_created ON public.sermons;

-- Verificar se as funções de notificação estão causando problemas
-- Vamos recriar as funções com melhor tratamento de erros

CREATE OR REPLACE FUNCTION public.notify_event_created()
RETURNS TRIGGER AS $$
BEGIN
  -- Tentar chamar a edge function, mas não falhar se houver erro
  BEGIN
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
  EXCEPTION WHEN OTHERS THEN
    -- Log o erro mas não falhe a inserção
    RAISE NOTICE 'Failed to send notification for event %: %', NEW.id, SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.notify_blog_created()
RETURNS TRIGGER AS $$
BEGIN
  -- Só notificar quando o post for publicado
  IF NEW.is_published = true AND (OLD.is_published = false OR OLD IS NULL) THEN
    BEGIN
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
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Failed to send notification for blog post %: %', NEW.id, SQLERRM;
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.notify_ministry_created()
RETURNS TRIGGER AS $$
BEGIN
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
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Failed to send notification for ministry %: %', NEW.id, SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.notify_sermon_created()
RETURNS TRIGGER AS $$
BEGIN
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
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Failed to send notification for sermon %: %', NEW.id, SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recriar as triggers com as funções atualizadas
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