
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const AdminRoleDebug = () => {
  const { user } = useAuth();
  const { userRole, isAdmin, loading, refreshRole } = useUserRole();
  const { toast } = useToast();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const fetchDebugInfo = async () => {
    if (!user) return;

    try {
      // Verificar role atual
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id);

      // Verificar metadados do usuário
      const userMetadata = user.user_metadata;

      setDebugInfo({
        userId: user.id,
        userEmail: user.email,
        userMetadata,
        roleData,
        roleError,
        currentRole: userRole,
        isAdminFlag: isAdmin
      });

    } catch (error) {
      console.error('Debug info error:', error);
    }
  };

  const makeUserAdmin = async () => {
    if (!user) return;

    try {
      // Primeiro, verificar se já existe um role
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (existingRole) {
        // Atualizar role existente
        const { error } = await supabase
          .from('user_roles')
          .update({ role: 'admin' })
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Criar novo role como admin
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: user.id, role: 'admin' });

        if (error) throw error;
      }

      toast({
        title: "Sucesso",
        description: "Usuário promovido a administrador!"
      });

      await refreshRole();
      await fetchDebugInfo();

    } catch (error) {
      console.error('Erro ao promover usuário:', error);
      toast({
        title: "Erro",
        description: "Não foi possível promover o usuário.",
        variant: "destructive"
      });
    }
  };

  const fixUserRole = async () => {
    if (!user) return;

    try {
      // Verificar o tipo de usuário nos metadados
      const userType = user.user_metadata?.user_type || 'user';
      console.log('User metadata type:', userType);

      // Deletar role existente se houver
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', user.id);

      // Criar novo role baseado nos metadados
      const { error } = await supabase
        .from('user_roles')
        .insert({ 
          user_id: user.id, 
          role: userType as 'admin' | 'user'
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Role corrigido para: ${userType}`
      });

      await refreshRole();
      await fetchDebugInfo();

    } catch (error) {
      console.error('Erro ao corrigir role:', error);
      toast({
        title: "Erro",
        description: "Não foi possível corrigir o role.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchDebugInfo();
    }
  }, [user, userRole]);

  if (!user) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Debug - Informações de Role</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>User ID:</strong> {user.id}
          </div>
          <div>
            <strong>Email:</strong> {user.email}
          </div>
          <div>
            <strong>Role Atual:</strong> {loading ? 'Carregando...' : userRole || 'Nenhum'}
          </div>
          <div>
            <strong>É Admin:</strong> {isAdmin ? 'Sim' : 'Não'}
          </div>
          <div>
            <strong>Tipo nos Metadados:</strong> {user.user_metadata?.user_type || 'Não definido'}
          </div>
        </div>

        {debugInfo && (
          <div className="bg-gray-50 p-4 rounded text-xs">
            <strong>Debug completo:</strong>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}

        <div className="flex space-x-2">
          <Button onClick={fetchDebugInfo} variant="outline" size="sm">
            Atualizar Debug
          </Button>
          <Button onClick={refreshRole} variant="outline" size="sm">
            Refresh Role
          </Button>
          <Button onClick={fixUserRole} variant="outline" size="sm">
            Corrigir Role pelos Metadados
          </Button>
          {!isAdmin && (
            <Button onClick={makeUserAdmin} size="sm">
              Forçar Admin
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminRoleDebug;
