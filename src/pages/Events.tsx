
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, Search, Filter, CalendarDays, Plus, CreditCard, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EventForm from '@/components/EventForm';
import EventRegistration from '@/components/EventRegistration';
import EventPayment from '@/components/EventPayment';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/hooks/use-toast';

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  event_type: string | null;
  is_recurring: boolean | null;
  registration_required: boolean | null;
  max_participants: number | null;
  is_active: boolean | null;
  price: number;
  is_paid: boolean;
}

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('todos');
  const [selectedMonth, setSelectedMonth] = useState('todos');
  const [showEventForm, setShowEventForm] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventForPayment, setSelectedEventForPayment] = useState<Event | null>(null);
  const { isAdmin } = useUserRole();
  const { toast } = useToast();

  const fetchEvents = async () => {
    console.log('Fetching events from database...');
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('event_date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }

      console.log('Fetched events:', data);
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
      toast({
        title: 'Erro ao carregar eventos',
        description: 'Não foi possível carregar os eventos. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const getEventTypeColor = (type: string | null) => {
    switch (type) {
      case 'culto':
        return 'bg-green-100 text-green-800';
      case 'evento-especial':
        return 'bg-purple-100 text-purple-800';
      case 'estudo':
        return 'bg-blue-100 text-blue-800';
      case 'encontro':
        return 'bg-orange-100 text-orange-800';
      case 'conferencia':
        return 'bg-red-100 text-red-800';
      case 'retiro':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeLabel = (type: string | null) => {
    switch (type) {
      case 'culto':
        return 'Culto';
      case 'evento-especial':
        return 'Evento Especial';
      case 'estudo':
        return 'Estudo Bíblico';
      case 'encontro':
        return 'Encontro';
      case 'conferencia':
        return 'Conferência';
      case 'retiro':
        return 'Retiro';
      default:
        return type || 'Geral';
    }
  };

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

  const getMonthFromDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.getMonth();
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'todos' || event.event_type === selectedType;
    const matchesMonth = selectedMonth === 'todos' || getMonthFromDate(event.event_date) === parseInt(selectedMonth);
    
    return matchesSearch && matchesType && matchesMonth;
  });

  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.event_date);
    const today = new Date();
    return eventDate >= today;
  }).slice(0, 3);

  const handleEventFormSuccess = () => {
    fetchEvents();
  };

  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o evento "${eventTitle}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      toast({
        title: 'Evento excluído',
        description: 'O evento foi excluído com sucesso.',
      });

      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: 'Erro ao excluir evento',
        description: 'Não foi possível excluir o evento. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-bethel-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando eventos...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-bethel-blue to-bethel-navy text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-6">
            Eventos da Igreja
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Participe dos nossos eventos e fortaleça sua fé junto com a comunidade
          </p>
          {isAdmin && (
            <div className="mt-8">
              <Button 
                onClick={() => setShowEventForm(true)}
                className="bg-white text-bethel-blue hover:bg-gray-100"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Cadastrar Novo Evento
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full md:w-64"
                />
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Tipo de evento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  <SelectItem value="culto">Cultos</SelectItem>
                  <SelectItem value="estudo">Estudos Bíblicos</SelectItem>
                  <SelectItem value="encontro">Encontros</SelectItem>
                  <SelectItem value="evento-especial">Eventos Especiais</SelectItem>
                  <SelectItem value="conferencia">Conferências</SelectItem>
                  <SelectItem value="retiro">Retiros</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Mês" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os meses</SelectItem>
                  <SelectItem value="0">Janeiro</SelectItem>
                  <SelectItem value="1">Fevereiro</SelectItem>
                  <SelectItem value="2">Março</SelectItem>
                  <SelectItem value="3">Abril</SelectItem>
                  <SelectItem value="4">Maio</SelectItem>
                  <SelectItem value="5">Junho</SelectItem>
                  <SelectItem value="6">Julho</SelectItem>
                  <SelectItem value="7">Agosto</SelectItem>
                  <SelectItem value="8">Setembro</SelectItem>
                  <SelectItem value="9">Outubro</SelectItem>
                  <SelectItem value="10">Novembro</SelectItem>
                  <SelectItem value="11">Dezembro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Filter className="w-4 h-4" />
              <span>{filteredEvents.length} eventos encontrados</span>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <CalendarDays className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {events.length === 0 
                  ? 'Nenhum evento cadastrado' 
                  : 'Nenhum evento encontrado'
                }
              </h3>
              <p className="text-gray-500">
                {events.length === 0 
                  ? isAdmin ? 'Clique no botão acima para cadastrar o primeiro evento.' : 'Eventos serão exibidos aqui quando forem cadastrados.'
                  : 'Tente ajustar os filtros de busca'
                }
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="aspect-video bg-gradient-to-br from-bethel-blue to-bethel-navy relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Calendar className="w-12 h-12 text-white" />
                    </div>
                    <Badge className={`absolute top-4 right-4 ${getEventTypeColor(event.event_type)} border-0`}>
                      {event.is_recurring ? 'Recorrente' : 'Único'}
                    </Badge>
                  </div>
                  
                   <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl font-semibold text-gray-900 line-clamp-2">
                        {event.title}
                      </CardTitle>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEvent(event.id, event.title)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <Badge variant="outline" className={`${getEventTypeColor(event.event_type)} border-0 w-fit`}>
                      {getEventTypeLabel(event.event_type)}
                    </Badge>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="w-4 h-4 mr-2 text-bethel-blue flex-shrink-0" />
                        <span className="capitalize text-sm">{formatDate(event.event_date)}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-700">
                        <Clock className="w-4 h-4 mr-2 text-bethel-blue flex-shrink-0" />
                        <span className="text-sm">{formatTime(event.event_date)}</span>
                      </div>
                      
                      {event.location && (
                        <div className="flex items-center text-gray-700">
                          <MapPin className="w-4 h-4 mr-2 text-bethel-blue flex-shrink-0" />
                          <span className="text-sm">{event.location}</span>
                        </div>
                      )}
                    </div>

                    {event.description && (
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {event.description}
                      </p>
                    )}

                    {(event.registration_required || event.max_participants) && (
                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          {event.registration_required && (
                            <span>Inscrição obrigatória</span>
                          )}
                          {event.max_participants && (
                            <span>Vagas: {event.max_participants}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {event.is_paid && event.price > 0 ? (
                      <Button 
                        onClick={() => setSelectedEventForPayment(event)}
                        className="w-full bg-bethel-blue hover:bg-bethel-navy"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Inscrever-se - R$ {event.price.toFixed(2)}
                      </Button>
                    ) : (
                      <EventRegistration 
                        eventId={event.id} 
                        eventTitle={event.title} 
                      />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Calendar Preview */}
      {upcomingEvents.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-4">
                Próximos Eventos
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Confira os próximos eventos da nossa programação
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="border-l-4 border-l-bethel-blue">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className={`${getEventTypeColor(event.event_type)} border-0`}>
                        {getEventTypeLabel(event.event_type)}
                      </Badge>
                      <span className="text-sm text-gray-500">{formatDate(event.event_date)}</span>
                    </div>
                    
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {event.title}
                    </h3>
                    
                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatTime(event.event_date)}
                    </div>
                    
                    {event.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {event.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Event Form Modal */}
      {showEventForm && (
        <EventForm 
          onClose={() => setShowEventForm(false)}
          onSuccess={handleEventFormSuccess}
        />
      )}

      {/* Event Payment Modal */}
      {selectedEventForPayment && (
        <EventPayment
          event={selectedEventForPayment}
          isOpen={!!selectedEventForPayment}
          onClose={() => setSelectedEventForPayment(null)}
        />
      )}

      <Footer />
    </div>
  );
};

export default Events;
