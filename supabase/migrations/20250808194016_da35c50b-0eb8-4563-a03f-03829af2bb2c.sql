-- Deletar todos os usuários da tabela auth.users para produção
-- CUIDADO: Isso vai remover TODOS os usuários do sistema de autenticação

DELETE FROM auth.users;