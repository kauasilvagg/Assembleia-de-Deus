-- Promover o usuário 'kaua' para administrador
UPDATE user_roles 
SET role = 'admin' 
WHERE user_id = 'f5a8090b-ab1c-44b0-9265-731b75f7186b';