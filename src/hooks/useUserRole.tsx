
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
        .single();

      console.log('Role query result:', { data, error });

      if (error) {
        if (error.code === 'PGRST116') {
          // Usuário não tem role definido, criar um role padrão de 'user'
          console.log('User has no role, creating default user role');
          const { error: insertError } = await supabase
            .from('user_roles')
            .insert({ user_id: user.id, role: 'user' });
          
          if (insertError) {
            console.error('Error creating default user role:', insertError);
          }
          
          setUserRole('user');
        } else {
          console.error('Error fetching user role:', error);
          setUserRole('user'); // Fallback para user
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
