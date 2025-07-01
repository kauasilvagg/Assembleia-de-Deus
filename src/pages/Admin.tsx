
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UserRoleManager from '@/components/UserRoleManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, FileText, Calendar, MessageSquare } from 'lucide-react';

const Admin = () => {
  const { user } = useAuth();
  const { isAdmin, loading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen font-inter">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bethel-blue"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null; // Será redirecionado
  }

  return (
    <div className="min-h-screen font-inter">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <Shield className="w-12 h-12 inline-block mr-4 text-bethel-blue" />
            Painel Administrativo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gerencie todos os aspectos do sistema da Assembleia de Deus Shalom.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/ministerios')}>
            <CardHeader className="text-center">
              <Users className="w-8 h-8 mx-auto text-bethel-blue mb-2" />
              <CardTitle className="text-lg">Ministérios</CardTitle>
              <CardDescription>
                Gerenciar ministérios da igreja
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/eventos')}>
            <CardHeader className="text-center">
              <Calendar className="w-8 h-8 mx-auto text-bethel-blue mb-2" />
              <CardTitle className="text-lg">Eventos</CardTitle>
              <CardDescription>
                Criar e gerir eventos
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/sermoes')}>
            <CardHeader className="text-center">
              <FileText className="w-8 h-8 mx-auto text-bethel-blue mb-2" />
              <CardTitle className="text-lg">Sermões</CardTitle>
              <CardDescription>
                Gerenciar sermões e pregações
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/contato')}>
            <CardHeader className="text-center">
              <MessageSquare className="w-8 h-8 mx-auto text-bethel-blue mb-2" />
              <CardTitle className="text-lg">Mensagens</CardTitle>
              <CardDescription>
                Ver mensagens de contato
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <UserRoleManager />
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
