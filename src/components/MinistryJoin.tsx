import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, UserCheck, Users } from 'lucide-react';

interface MinistryJoinProps {
  ministryId: string;
  ministryName: string;
}

const MinistryJoin = ({ ministryId, ministryName }: MinistryJoinProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    if (user) {
      checkMembershipStatus();
    }
  }, [user, ministryId]);

  const checkMembershipStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ministry_memberships')
        .select('*')
        .eq('user_id', user.id)
        .eq('ministry_id', ministryId)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking membership:', error);
      } else {
        setIsMember(!!data);
      }
    } catch (error) {
      console.error('Exception checking membership:', error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleMembership = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para participar de ministérios.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      if (isMember) {
        // Sair do ministério
        const { error } = await supabase
          .from('ministry_memberships')
          .update({ status: 'inactive' })
          .eq('user_id', user.id)
          .eq('ministry_id', ministryId);

        if (error) throw error;

        setIsMember(false);
        toast({
          title: "Saiu do ministério",
          description: `Você saiu do ministério "${ministryName}".`
        });
      } else {
        // Entrar no ministério
        const { error } = await supabase
          .from('ministry_memberships')
          .upsert({ 
            user_id: user.id, 
            ministry_id: ministryId,
            status: 'active',
            role: 'member'
          });

        if (error) throw error;

        setIsMember(true);
        toast({
          title: "Bem-vindo ao ministério!",
          description: `Você agora faz parte do ministério "${ministryName}".`
        });
      }
    } catch (error: any) {
      console.error('Membership error:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível processar sua solicitação.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Button variant="outline" disabled>
        <Users className="w-4 h-4 mr-2" />
        Faça login para participar
      </Button>
    );
  }

  if (checkingStatus) {
    return (
      <Button variant="outline" disabled>
        Verificando...
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleMembership}
      disabled={loading}
      variant={isMember ? "outline" : "default"}
      className={isMember ? "border-green-500 text-green-600 hover:bg-green-50" : ""}
    >
      {loading ? (
        'Processando...'
      ) : isMember ? (
        <>
          <UserCheck className="w-4 h-4 mr-2" />
          Membro - Sair
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4 mr-2" />
          Participar
        </>
      )}
    </Button>
  );
};

export default MinistryJoin;