import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Play, Clock, Calendar, User, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SermonForm from '@/components/SermonForm';

interface Sermon {
  id: string;
  title: string;
  description: string;
  preacher_name: string;
  sermon_date: string;
  biblical_text: string;
  series_name: string;
  audio_url: string;
  video_url: string;
  duration_minutes: number;
  tags: string[];
  is_featured: boolean;
  view_count: number;
}

const Sermons = () => {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const { toast } = useToast();
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);

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

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este sermão?')) return;

    try {
      const { error } = await supabase
        .from('sermons')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSermons(sermons.filter(s => s.id !== id));
      toast({
        title: "Sucesso",
        description: "Sermão excluído com sucesso."
      });
    } catch (error) {
      console.error('Erro ao excluir sermão:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o sermão.",
        variant: "destructive"
      });
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingSermon(null);
    fetchSermons();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
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
            Ouça e assista aos sermões da Assembleia de Deus Shalom Parque Vitória.
          </p>
        </div>

        {user && isAdmin && (
          <div className="flex justify-center mb-8">
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-bethel-blue hover:bg-bethel-navy"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Sermão
            </Button>
          </div>
        )}

        {showForm && (
          <SermonForm
            sermon={editingSermon}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingSermon(null);
            }}
          />
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
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sermons.length === 0 ? (
          <div className="text-center py-12">
            <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum sermão encontrado
            </h3>
            <p className="text-gray-500">
              {isAdmin ? "Clique no botão acima para adicionar o primeiro sermão." : "Em breve teremos sermões disponíveis."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sermons.map((sermon) => (
              <Card key={sermon.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold text-gray-900 mb-2">
                        {sermon.title}
                      </CardTitle>
                      {sermon.is_featured && (
                        <Badge variant="secondary" className="mb-2">
                          Destaque
                        </Badge>
                      )}
                    </div>
                    {user && isAdmin && (
                      <div className="flex space-x-1 ml-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingSermon(sermon);
                            setShowForm(true);
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(sermon.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <CardDescription className="text-gray-600">
                    {sermon.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span>{sermon.preacher_name}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(sermon.sermon_date)}</span>
                  </div>

                  {sermon.duration_minutes && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{sermon.duration_minutes} minutos</span>
                    </div>
                  )}

                  {sermon.biblical_text && (
                    <div className="text-sm text-gray-600">
                      <strong>Texto:</strong> {sermon.biblical_text}
                    </div>
                  )}

                  {sermon.series_name && (
                    <div className="text-sm text-gray-600">
                      <strong>Série:</strong> {sermon.series_name}
                    </div>
                  )}

                  {sermon.tags && sermon.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {sermon.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex space-x-2 mt-4">
                    {sermon.audio_url && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={sermon.audio_url} target="_blank" rel="noopener noreferrer">
                          <Play className="w-3 h-3 mr-1" />
                          Áudio
                        </a>
                      </Button>
                    )}
                    {sermon.video_url && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={sermon.video_url} target="_blank" rel="noopener noreferrer">
                          <Play className="w-3 h-3 mr-1" />
                          Vídeo
                        </a>
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
