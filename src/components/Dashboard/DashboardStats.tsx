import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, Calendar, Heart, BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StatsData {
  totalMembers: number;
  newMembersThisMonth: number;
  upcomingEvents: number;
  totalDonations: number;
  monthlyDonations: number;
  activeVolunteers: number;
  activeCourses: number;
  blogPosts: number;
}

const DashboardStats = () => {
  const [stats, setStats] = useState<StatsData>({
    totalMembers: 0,
    newMembersThisMonth: 0,
    upcomingEvents: 0,
    totalDonations: 0,
    monthlyDonations: 0,
    activeVolunteers: 0,
    activeCourses: 0,
    blogPosts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      // Total de membros
      const { count: totalMembers } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('member_status', 'active');

      // Novos membros este mês
      const { count: newMembersThisMonth } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .gte('member_since', firstDayOfMonth.toISOString())
        .eq('member_status', 'active');

      // Eventos próximos
      const { count: upcomingEvents } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .gte('event_date', now.toISOString())
        .eq('is_active', true);

      // Total de doações
      const { data: donationsData } = await supabase
        .from('donations')
        .select('amount');
      
      const totalDonations = donationsData?.reduce((sum, donation) => sum + Number(donation.amount), 0) || 0;

      // Doações deste mês
      const { data: monthlyDonationsData } = await supabase
        .from('donations')
        .select('amount')
        .gte('donation_date', firstDayOfMonth.toISOString().split('T')[0]);
      
      const monthlyDonations = monthlyDonationsData?.reduce((sum, donation) => sum + Number(donation.amount), 0) || 0;

      // Voluntários ativos
      const { count: activeVolunteers } = await supabase
        .from('volunteers')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Cursos ativos
      const { count: activeCourses } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Posts do blog
      const { count: blogPosts } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);

      setStats({
        totalMembers: totalMembers || 0,
        newMembersThisMonth: newMembersThisMonth || 0,
        upcomingEvents: upcomingEvents || 0,
        totalDonations,
        monthlyDonations,
        activeVolunteers: activeVolunteers || 0,
        activeCourses: activeCourses || 0,
        blogPosts: blogPosts || 0
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const statsCards = [
    {
      title: 'Total de Membros',
      value: stats.totalMembers,
      icon: Users,
      trend: stats.newMembersThisMonth > 0 ? 'up' : 'stable',
      trendValue: `+${stats.newMembersThisMonth} este mês`,
      color: 'text-blue-600'
    },
    {
      title: 'Eventos Próximos',
      value: stats.upcomingEvents,
      icon: Calendar,
      color: 'text-green-600'
    },
    {
      title: 'Doações Totais',
      value: formatCurrency(stats.totalDonations),
      icon: Heart,
      trend: stats.monthlyDonations > 0 ? 'up' : 'stable',
      trendValue: `${formatCurrency(stats.monthlyDonations)} este mês`,
      color: 'text-red-600'
    },
    {
      title: 'Voluntários Ativos',
      value: stats.activeVolunteers,
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Cursos Ativos',
      value: stats.activeCourses,
      icon: BookOpen,
      color: 'text-indigo-600'
    },
    {
      title: 'Artigos Publicados',
      value: stats.blogPosts,
      icon: BookOpen,
      color: 'text-orange-600'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statsCards.map((card, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {card.title}
            </CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {typeof card.value === 'string' ? card.value : card.value.toLocaleString()}
            </div>
            {card.trend && (
              <div className="flex items-center text-xs text-gray-600">
                {card.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span>{card.trendValue}</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;