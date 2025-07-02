
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

type UserRole = 'admin' | 'user';

interface UserRoleHook {
  userRole: UserRole | null;
  isAdmin: boolean;
  loading: boolean;
  refreshRole: () => Promise<void>;
}

export const useUserRole = (): UserRoleHook => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async () => {
    console.log('Fetching user role for user:', user?.id);
    
    if (!user) {
      console.log('No user found, setting role to null');
      setUserRole(null);
      setLoading(false);
      return;
    }

    try {
      // Primeiro, verificar se o usuário tem um role na tabela user_roles
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('Role query result:', { data, error });

      if (error) {
        console.error('Error fetching user role:', error);
        setUserRole('user'); // Fallback para user
      } else if (!data) {
        // Usuário não tem role definido, tentar criar um
        console.log('User has no role, attempting to create one...');
        
        // Verificar se há informação do tipo de usuário nos metadados
        const userType = user.user_metadata?.user_type || 'user';
        console.log('Creating role based on user metadata:', userType);
        
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({ user_id: user.id, role: userType as UserRole });
        
        if (insertError) {
          console.error('Error creating user role:', insertError);
          setUserRole('user'); // Fallback
        } else {
          console.log('User role created successfully as:', userType);
          setUserRole(userType as UserRole);
        }
      } else {
        console.log('User role found:', data.role);
        setUserRole(data.role as UserRole);
      }
    } catch (error) {
      console.error('Exception while fetching role:', error);
      setUserRole('user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, [user]);

  const refreshRole = async () => {
    setLoading(true);
    await fetchUserRole();
  };

  console.log('Current user role state:', { userRole, isAdmin: userRole === 'admin', loading });

  return {
    userRole,
    isAdmin: userRole === 'admin',
    loading,
    refreshRole
  };
};
