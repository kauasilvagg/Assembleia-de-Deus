
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
    if (!user) {
      setUserRole(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Erro ao buscar role do usuário:', error);
        setUserRole('user'); // Fallback para user
      } else {
        setUserRole(data.role as UserRole);
      }
    } catch (error) {
      console.error('Erro ao buscar role:', error);
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

  return {
    userRole,
    isAdmin: userRole === 'admin',
    loading,
    refreshRole
  };
};
