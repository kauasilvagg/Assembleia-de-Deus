import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Calendar } from 'lucide-react';

interface EventRegistrationProps {
  eventId: string;
  eventTitle: string;
}

const EventRegistration = ({ eventId, eventTitle }: EventRegistrationProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    if (user) {
      checkRegistrationStatus();
    }
  }, [user, eventId]);

  const checkRegistrationStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('user_id', user.id)
        .eq('event_id', eventId)
        .eq('status', 'confirmed')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking registration:', error);
      } else {
        setIsRegistered(!!data);
      }
    } catch (error) {
      console.error('Exception checking registration:', error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleRegistration = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para se inscrever em eventos.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      if (isRegistered) {
        // Cancelar inscrição
        const { error } = await supabase
          .from('event_registrations')
          .update({ status: 'cancelled' })
          .eq('user_id', user.id)
          .eq('event_id', eventId);

        if (error) throw error;

        setIsRegistered(false);
        toast({
          title: "Inscrição cancelada",
          description: `Sua inscrição no evento "${eventTitle}" foi cancelada.`
        });
      } else {
        // Fazer inscrição
        const { error } = await supabase
          .from('event_registrations')
          .upsert({ 
            user_id: user.id, 
            event_id: eventId,
            status: 'confirmed'
          });

        if (error) throw error;

        setIsRegistered(true);
        toast({
          title: "Inscrição confirmada!",
          description: `Você foi inscrito no evento "${eventTitle}".`
        });
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível processar sua inscrição.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Button variant="outline" disabled>
        <Calendar className="w-4 h-4 mr-2" />
        Faça login para se inscrever
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
      onClick={handleRegistration}
      disabled={loading}
      variant={isRegistered ? "outline" : "default"}
      className={isRegistered ? "border-green-500 text-green-600 hover:bg-green-50" : ""}
    >
      {loading ? (
        'Processando...'
      ) : isRegistered ? (
        <>
          <CheckCircle className="w-4 h-4 mr-2" />
          Inscrito - Cancelar
        </>
      ) : (
        <>
          <Calendar className="w-4 h-4 mr-2" />
          Inscrever-se
        </>
      )}
    </Button>
  );
};

export default EventRegistration;