import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreditCard, Calendar, MapPin, Users, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface EventPaymentProps {
  event: {
    id: string;
    title: string;
    description?: string;
    event_date: string;
    location?: string;
    price: number;
    max_participants?: number;
  };
  isOpen: boolean;
  onClose: () => void;
}

const EventPayment = ({ event, isOpen, onClose }: EventPaymentProps) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para inscrever-se em eventos pagos.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-donation-payment', {
        body: {
          amount: event.price * 100, // Convert to cents
          type: 'event',
          isRecurring: false,
          notes: `Inscrição no evento: ${event.title}`,
          eventId: event.id,
        },
      });

      if (error) throw error;

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
        
        toast({
          title: "Redirecionando para pagamento",
          description: "Uma nova aba foi aberta com o checkout do Stripe.",
        });
        
        onClose();
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      toast({
        title: "Erro no pagamento",
        description: "Não foi possível processar o pagamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Inscrição no Evento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2 text-bethel-blue" />
                <span>{formatDate(event.event_date)}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2 text-bethel-blue" />
                <span>{formatTime(event.event_date)}</span>
              </div>

              {event.location && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-bethel-blue" />
                  <span>{event.location}</span>
                </div>
              )}

              {event.max_participants && (
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2 text-bethel-blue" />
                  <span>Máximo {event.max_participants} participantes</span>
                </div>
              )}

              {event.description && (
                <p className="text-sm text-gray-600 mt-3 pt-3 border-t">
                  {event.description}
                </p>
              )}
            </CardContent>
          </Card>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Valor da inscrição:</span>
              <Badge className="bg-bethel-blue text-white text-lg px-3 py-1">
                {formatCurrency(event.price)}
              </Badge>
            </div>
            <p className="text-xs text-gray-500">
              Pagamento processado via Stripe de forma segura
            </p>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handlePayment}
              disabled={loading}
              className="flex-1 bg-bethel-blue hover:bg-bethel-navy"
            >
              {loading ? (
                'Processando...'
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pagar Inscrição
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventPayment;