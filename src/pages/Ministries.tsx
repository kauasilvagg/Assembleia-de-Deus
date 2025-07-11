import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, Clock, MapPin, Phone, Mail, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MinistryJoin from '@/components/MinistryJoin';
import MinistryForm from '@/components/MinistryForm';

interface Ministry {
  id: string;
  name: string;
  description: string;
  leader_name: string;
  leader_email: string;
  leader_phone: string;
  meeting_day: string;
  meeting_time: string;
  location: string;
  image_url: string;
  is_active: boolean;
}

const Ministries = () => {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const { toast } = useToast();
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMinistry, setEditingMinistry] = useState<Ministry | null>(null);

  useEffect(() => {
    fetchMinistries();
  }, []);

  const fetchMinistries = async () => {
    try {
      const { data, error } = await supabase
        .from('ministries')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setMinistries(data || []);
    } catch (error) {
      console.error('Erro ao carregar ministérios:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os ministérios.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este ministério?')) return;

    try {
      const { error } = await supabase
        .from('ministries')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      setMinistries(ministries.filter(m => m.id !== id));
      toast({
        title: "Sucesso",
        description: "Ministério excluído com sucesso."
      });
    } catch (error) {
      console.error('Erro ao excluir ministério:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o ministério.",
        variant: "destructive"
      });
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingMinistry(null);
    fetchMinistries();
  };

  return (
    <div className="min-h-screen font-inter">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nossos Ministérios
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubra as diversas formas de servir e crescer em comunidade na Assembleia de Deus Shalom Parque Vitória.
          </p>
        </div>

        {user && isAdmin && (
          <div className="flex justify-center mb-8">
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-bethel-blue hover:bg-bethel-navy"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Ministério
            </Button>
          </div>
        )}

        {showForm && (
          <MinistryForm
            ministry={editingMinistry}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingMinistry(null);
            }}
          />
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : ministries.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum ministério encontrado
            </h3>
            <p className="text-gray-500">
              {isAdmin ? "Clique no botão acima para adicionar o primeiro ministério." : "Em breve teremos mais informações sobre nossos ministérios."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ministries.map((ministry) => (
              <Card key={ministry.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {ministry.image_url && (
                  <div className="h-48 bg-gray-200">
                    <img 
                      src={ministry.image_url} 
                      alt={ministry.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {ministry.name}
                    </CardTitle>
                    {user && isAdmin && (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingMinistry(ministry);
                            setShowForm(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(ministry.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <CardDescription className="text-gray-600">
                    {ministry.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {ministry.leader_name && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span>Líder: {ministry.leader_name}</span>
                    </div>
                  )}
                  {ministry.meeting_day && ministry.meeting_time && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{ministry.meeting_day} às {ministry.meeting_time}</span>
                    </div>
                  )}
                  {ministry.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{ministry.location}</span>
                    </div>
                  )}
                  {ministry.leader_phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{ministry.leader_phone}</span>
                    </div>
                  )}
                  {ministry.leader_email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>{ministry.leader_email}</span>
                    </div>
                  )}
                  <MinistryJoin 
                    ministryId={ministry.id} 
                    ministryName={ministry.name} 
                  />
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

export default Ministries;
