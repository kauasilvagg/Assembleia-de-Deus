import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, Search, Filter, CalendarDays } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('todos');
  const [selectedMonth, setSelectedMonth] = useState('todos');

  const events = [
    {
      id: 1,
      title: 'Culto de Celebração',
      date: '2024-01-07',
      time: '19:00',
      location: 'Santuário Principal',
      description: 'Um momento especial de adoração e comunhão com toda a família. Venha celebrar conosco e fortalecer sua fé através da música, oração e pregação da Palavra.',
      type: 'culto',
      recurring: true,
      image: '/placeholder.svg',
      speaker: 'Pr. João Silva',
      capacity: 200
    },
    {
      id: 2,
      title: 'Conferência de Jovens',
      date: '2024-01-12',
      time: '19:30',
      location: 'Auditório',
      description: 'Três noites de louvor, palavra e comunhão para os jovens. Uma oportunidade única de crescimento espiritual e relacionamento com outros jovens cristãos.',
      type: 'evento-especial',
      recurring: false,
      image: '/placeholder.svg',
      speaker: 'Pr. Marcos Santos',
      capacity: 150
    },
    {
      id: 3,
      title: 'Escola Bíblica Dominical',
      date: '2024-01-07',
      time: '09:00',
      location: 'Salas de Aula',
      description: 'Estudo da Palavra de Deus para todas as idades. Classes específicas para crianças, adolescentes, jovens e adultos.',
      type: 'estudo',
      recurring: true,
      image: '/placeholder.svg',
      speaker: 'Equipe de Professores',
      capacity: 100
    },
    {
      id: 4,
      title: 'Encontro de Mulheres',
      date: '2024-01-15',
      time: '14:00',
      location: 'Sala de Reuniões',
      description: 'Momento especial para as mulheres da igreja se reunirem, orarem e estudarem a Bíblia juntas.',
      type: 'encontro',
      recurring: true,
      image: '/placeholder.svg',
      speaker: 'Maria Oliveira',
      capacity: 50
    },
    {
      id: 5,
      title: 'Culto de Oração',
      date: '2024-01-17',
      time: '19:00',
      location: 'Santuário Principal',
      description: 'Noite dedicada à oração e intercessão. Venha orar pela igreja, família e necessidades.',
      type: 'culto',
      recurring: true,
      image: '/placeholder.svg',
      speaker: 'Pr. João Silva',
      capacity: 200
    },
    {
      id: 6,
      title: 'Retiro de Famílias',
      date: '2024-01-20',
      time: '08:00',
      location: 'Chácara Recanto',
      description: 'Um fim de semana especial para fortalecer os laços familiares através de atividades, estudos bíblicos e comunhão.',
      type: 'evento-especial',
      recurring: false,
      image: '/placeholder.svg',
      speaker: 'Equipe Pastoral',
      capacity: 80
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'culto':
        return 'bg-green-100 text-green-800';
      case 'evento-especial':
        return 'bg-purple-100 text-purple-800';
      case 'estudo':
        return 'bg-blue-100 text-blue-800';
      case 'encontro':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'culto':
        return 'Culto';
      case 'evento-especial':
        return 'Evento Especial';
      case 'estudo':
        return 'Estudo Bíblico';
      case 'encontro':
        return 'Encontro';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const getMonthFromDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.getMonth();
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'todos' || event.type === selectedType;
    const matchesMonth = selectedMonth === 'todos' || getMonthFromDate(event.date) === parseInt(selectedMonth);
    
    return matchesSearch && matchesType && matchesMonth;
  });

  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    return eventDate >= today;
  }).slice(0, 3);

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
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum evento encontrado</h3>
              <p className="text-gray-500">Tente ajustar os filtros de busca</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="aspect-video bg-gradient-to-br from-bethel-blue to-bethel-navy relative">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Calendar className="w-12 h-12 text-white" />
                    </div>
                    <Badge className={`absolute top-4 right-4 ${getEventTypeColor(event.type)} border-0`}>
                      {event.recurring ? 'Recorrente' : 'Especial'}
                    </Badge>
                  </div>
                  
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl font-semibold text-gray-900 line-clamp-2">
                        {event.title}
                      </CardTitle>
                    </div>
                    <Badge variant="outline" className={`${getEventTypeColor(event.type)} border-0`}>
                      {getEventTypeLabel(event.type)}
                    </Badge>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="w-4 h-4 mr-2 text-bethel-blue flex-shrink-0" />
                        <span className="capitalize text-sm">{formatDate(event.date)}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-700">
                        <Clock className="w-4 h-4 mr-2 text-bethel-blue flex-shrink-0" />
                        <span className="text-sm">{formatTime(event.time)}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-700">
                        <MapPin className="w-4 h-4 mr-2 text-bethel-blue flex-shrink-0" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {event.description}
                    </p>

                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Palestrante: {event.speaker}</span>
                        <span>Capacidade: {event.capacity}</span>
                      </div>
                    </div>

                    <Button className="w-full bg-bethel-blue hover:bg-bethel-navy">
                      Ver Detalhes
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Calendar Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-4">
              Próximos Eventos
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Confira os próximos eventos da nossa programação semanal
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="border-l-4 border-l-bethel-blue">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={`${getEventTypeColor(event.type)} border-0`}>
                      {getEventTypeLabel(event.type)}
                    </Badge>
                    <span className="text-sm text-gray-500">{formatDate(event.date)}</span>
                  </div>
                  
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {event.title}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <Clock className="w-4 h-4 mr-1" />
                    {event.time}
                  </div>
                  
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {event.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events; 