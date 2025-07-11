
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users, Calendar, FileText, MessageSquare, BookOpen, Church, BarChart3 } from 'lucide-react';
import AdminRoleDebug from '@/components/AdminRoleDebug';
import AdminUserManager from '@/components/AdminUserManager';
import UserRoleManager from '@/components/UserRoleManager';
import EventForm from '@/components/EventForm';
import SermonForm from '@/components/SermonForm';
import MinistryForm from '@/components/MinistryForm';
import DashboardStats from '@/components/Dashboard/DashboardStats';
import RecentActivity from '@/components/Dashboard/RecentActivity';

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !roleLoading) {
      if (!user) {
        navigate('/login');
      } else if (!isAdmin) {
        navigate('/');
      }
    }
  }, [user, isAdmin, authLoading, roleLoading, navigate]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-bethel-blue"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Painel Administrativo
          </h1>
          <p className="text-gray-600">
            Gerencie todo o conteúdo e configurações da igreja
          </p>
        </div>

        <AdminRoleDebug />

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Usuários</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Eventos</span>
            </TabsTrigger>
            <TabsTrigger value="sermons" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Sermões</span>
            </TabsTrigger>
            <TabsTrigger value="ministries" className="flex items-center space-x-2">
              <Church className="w-4 h-4" />
              <span>Ministérios</span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Blog</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Config</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardStats />
            <RecentActivity />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <AdminUserManager />
            <UserRoleManager />
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Gerenciar Eventos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EventForm onClose={() => {}} onSuccess={() => {}} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sermons">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Gerenciar Sermões
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SermonForm onSuccess={() => {}} onCancel={() => {}} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ministries">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Church className="w-5 h-5 mr-2" />
                  Gerenciar Ministérios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MinistryForm onSuccess={() => {}} onCancel={() => {}} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blog">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Gerenciar Blog
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Funcionalidade de blog em desenvolvimento...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Configurações do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Configurações gerais do sistema em desenvolvimento...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Admin;
