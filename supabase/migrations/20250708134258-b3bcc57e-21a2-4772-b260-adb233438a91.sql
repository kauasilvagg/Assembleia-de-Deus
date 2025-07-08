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
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Atualizar o role para admin
  UPDATE user_roles 
  SET role = 'admin' 
  WHERE user_id = target_user_id;
  
  RETURN FOUND;
END;
$$;