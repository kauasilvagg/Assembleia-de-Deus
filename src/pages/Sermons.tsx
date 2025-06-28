
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Play, BookOpen, Calendar, Clock, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Sermon {
  id: string;
  title: string;
  description: string;
  preacher_name: string;
  sermon_date: string;
  biblical_text: string;
  audio_url: string;
  video_url: string;
  series_name: string;
  tags: string[];
  duration_minutes: number;
  is_featured: boolean;
  view_count: number;
}

const Sermons = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSermons();
  }, []);

  const fetchSermons = async () => {
    try {
      const { data, error } = await supabase
        .from('sermons')
        .select('*')
        .order('sermon_date', { ascending: false });

      if (error) throw error;
      setSermons(data || []);
    } catch (error) {
      console.error('Erro ao carregar sermões:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os sermões.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-inter">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sermões
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ouça e assista às mensagens transformadoras da Palavra de Deus compartilhadas em nossa igreja.
          </p>
        </div>

        {user && (
          <div className="flex justify-center mb-8">
            <Button className="bg-bethel-blue hover:bg-bethel-navy">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Sermão
            </Button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sermons.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum sermão encontrado
            </h3>
            <p className="text-gray-500">
              Em breve teremos mais sermões disponíveis.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sermons.map((sermon) => (
              <Card key={sermon.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2">
                      {sermon.title}
                    </CardTitle>
                    {sermon.is_featured && (
                      <Badge variant="secondary" className="bg-bethel-gold text-white">
                        Destaque
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-gray-600">
                    Por {sermon.preacher_name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sermon.description && (
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {sermon.description}
                    </p>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{format(new Date(sermon.sermon_date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                    </div>
                    
                    {sermon.biblical_text && (
                      <div className="flex items-center text-sm text-gray-600">
                        <BookOpen className="w-4 h-4 mr-2" />
                        <span>{sermon.biblical_text}</span>
                      </div>
                    )}
                    
                    {sermon.duration_minutes && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{sermon.duration_minutes} min</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Eye className="w-4 h-4 mr-2" />
                      <span>{sermon.view_count} visualizações</span>
                    </div>
                  </div>

                  {sermon.series_name && (
                    <Badge variant="outline" className="text-xs">
                      Série: {sermon.series_name}
                    </Badge>
                  )}

                  {sermon.tags && sermon.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {sermon.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    {sermon.audio_url && (
                      <Button size="sm" variant="outline">
                        <Play className="w-4 h-4 mr-1" />
                        Áudio
                      </Button>
                    )}
                    {sermon.video_url && (
                      <Button size="sm" variant="outline">
                        <Play className="w-4 h-4 mr-1" />
                        Vídeo
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Sermons;
