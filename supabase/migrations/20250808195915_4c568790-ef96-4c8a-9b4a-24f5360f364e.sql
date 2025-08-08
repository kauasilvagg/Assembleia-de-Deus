-- Habilitar realtime para notificações em tempo real no admin
-- Configurar REPLICA IDENTITY FULL para capturar dados completos das mudanças

-- Habilitar replica identity para capturar dados completos
ALTER TABLE public.event_registrations REPLICA IDENTITY FULL;
ALTER TABLE public.ministry_memberships REPLICA IDENTITY FULL;
ALTER TABLE public.donations REPLICA IDENTITY FULL;

-- Adicionar tabelas ao realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_registrations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ministry_memberships; 
ALTER PUBLICATION supabase_realtime ADD TABLE public.donations;