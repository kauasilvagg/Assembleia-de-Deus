
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin } from 'lucide-react';

const EventsPreview = () => {
  const events = [
    {
      id: 1,
      title: 'Culto de Celebração',
      date: '2024-01-07',
      time: '19:00',
      location: 'Santuário Principal',
      description: 'Um momento especial de adoração e comunhão com toda a família.',
      type: 'culto',
      recurring: true
    },
    {
      id: 2,
      title: 'Conferência de Jovens',
      date: '2024-01-12',
      time: '19:30',
      location: 'Auditório',
      description: 'Três noites de louvor, palavra e comunhão para os jovens.',
      type: 'evento-especial',
      recurring: false
    },
    {
      id: 3,
      title: 'Escola Bíblica Dominical',
      date: '2024-01-07',
      time: '09:00',
      location: 'Salas de Aula',
      description: 'Estudo da Palavra de Deus para todas as idades.',
      type: 'estudo',
      recurring: true
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
      default:
        return 'bg-gray-100 text-gray-800';
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

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-sm font-semibold text-bethel-blue uppercase tracking-wider mb-4">
            Próximos Eventos
          </h2>
          <h3 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Participe da Nossa Programação
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Temos atividades durante toda a semana para você crescer na fé e 
            fortalecer os laços com nossa comunidade.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {events.map((event, index) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader className="bg-gradient-to-br from-bethel-blue to-bethel-navy text-white">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold">{event.title}</CardTitle>
                  <Badge className={`${getEventTypeColor(event.type)} border-0`}>
                    {event.recurring ? 'Semanal' : 'Especial'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-4 h-4 mr-2 text-bethel-blue" />
                    <span className="capitalize text-sm">{formatDate(event.date)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <Clock className="w-4 h-4 mr-2 text-bethel-blue" />
                    <span className="text-sm">{event.time}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-4 h-4 mr-2 text-bethel-blue" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {event.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/eventos">
            <Button size="lg" className="bg-bethel-blue hover:bg-bethel-navy">
              Ver Todos os Eventos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EventsPreview;
