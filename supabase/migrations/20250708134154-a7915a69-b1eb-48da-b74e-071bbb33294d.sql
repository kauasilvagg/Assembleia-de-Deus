
-- Promover alguns usuários existentes para administradores
UPDATE user_roles 
SET role = 'admin' 
WHERE user_id IN (
  SELECT ur.user_id 
  FROM user_roles ur 
  LEFT JOIN profiles p ON ur.user_id = p.id 
  WHERE p.full_name IN ('admin', 'kauazin', 'loginho')
  LIMIT 3
);

-- Criar uma função para facilitar a promoção de usuários para admin
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Buscar o user_id pelo email (isso seria feito via API administrativa)
  -- Por enquanto, vamos assumir que o admin conhece o user_id
  
  -- Atualizar o role para admin
  UPDATE user_roles 
  SET role = 'admin' 
  WHERE user_id = target_user_id;
  
  RETURN FOUND;
END;
$$;

-- Inserir alguns administradores padrão se necessário
-- (Este é um exemplo, você pode ajustar conforme necessário)
INSERT INTO user_roles (user_id, role) 
SELECT id, 'admin'::user_role 
FROM auth.users 
WHERE email IN ('admin@igreja.com', 'pastor@igreja.com')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
