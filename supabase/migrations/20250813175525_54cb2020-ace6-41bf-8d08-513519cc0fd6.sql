-- Promover o usuário atual para admin
-- Primeiro, vamos verificar o user_id do usuário logado e promovê-lo para admin
UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = '7b796f76-01f1-4440-b7ce-7aedbd090535';

-- Se o usuário não tiver um registro na tabela user_roles, vamos criar um
INSERT INTO public.user_roles (user_id, role)
SELECT '7b796f76-01f1-4440-b7ce-7aedbd090535', 'admin'
WHERE NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = '7b796f76-01f1-4440-b7ce-7aedbd090535'
);