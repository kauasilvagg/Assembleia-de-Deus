-- Função que garante o papel do usuário logado a partir do tipo escolhido no cadastro
CREATE OR REPLACE FUNCTION public.ensure_user_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _meta text;
  _existing text;
BEGIN
  IF _uid IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT role::text INTO _existing FROM public.user_roles WHERE user_id = _uid LIMIT 1;
  IF _existing IS NOT NULL THEN
    RETURN _existing;
  END IF;

  SELECT COALESCE(u.raw_user_meta_data->>'user_type', 'user') INTO _meta
  FROM auth.users u WHERE u.id = _uid;

  IF _meta NOT IN ('admin','user') THEN
    _meta := 'user';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (_uid, _meta::user_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN _meta;
END;
$$;

GRANT EXECUTE ON FUNCTION public.ensure_user_role() TO authenticated;

-- Corrige usuários que escolheram administrador no cadastro
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::user_role
FROM auth.users u
WHERE u.raw_user_meta_data->>'user_type' = 'admin'
ON CONFLICT (user_id, role) DO NOTHING;

DELETE FROM public.user_roles r
WHERE r.role = 'user'
  AND EXISTS (
    SELECT 1 FROM public.user_roles a
    WHERE a.user_id = r.user_id AND a.role = 'admin'
  );