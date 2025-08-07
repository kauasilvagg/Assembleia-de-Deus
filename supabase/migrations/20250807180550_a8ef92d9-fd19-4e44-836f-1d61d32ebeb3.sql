-- Deletar todos os dados de usuários para produção
-- Nota: Não deletamos auth.users pois é gerenciado pelo Supabase

-- Deletar memberships e relacionamentos primeiro (foreign keys)
DELETE FROM ministry_memberships;
DELETE FROM event_registrations;
DELETE FROM cell_memberships;
DELETE FROM course_enrollments;
DELETE FROM volunteers;
DELETE FROM bookings;
DELETE FROM donations;

-- Deletar membros
DELETE FROM members;

-- Deletar roles de usuários
DELETE FROM user_roles;

-- Deletar perfis (isso deve ser feito por último)
DELETE FROM profiles;