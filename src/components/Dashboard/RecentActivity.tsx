import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Heart, UserPlus, MessageSquare, BookOpen, Users, Church } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ActivityItem {
  id: string;
  type: 'member' | 'donation' | 'event' | 'contact' | 'blog' | 'event_registration' | 'ministry_membership';
  title: string;
  description: string;
  time: string;
  icon: any;
  color: string;
}

const RecentActivity = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
    
    // Configurar notificações em tempo real
    const channel = supabase
      .channel('admin-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'event_registrations'
        },
        () => {
          console.log('Nova inscrição em evento detectada');
          fetchRecentActivity();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ministry_memberships'
        },
        () => {
          console.log('Nova participação em ministério detectada');
          fetchRecentActivity();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'donations'
        },
        () => {
          console.log('Nova doação detectada');
          fetchRecentActivity();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRecentActivity = async () => {
    try {
      const activities: ActivityItem[] = [];

      // Novos membros (últimos 5)
      const { data: newMembers } = await supabase
        .from('members')
        .select('full_name, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      newMembers?.forEach(member => {
        activities.push({
          id: `member-${member.full_name}`,
          type: 'member',
          title: 'Novo Membro',
          description: `${member.full_name} se juntou à igreja`,
          time: formatTimeAgo(member.created_at),
          icon: UserPlus,
          color: 'text-blue-600'
        });
      });

      // Doações recentes (últimas 5)
      const { data: recentDonations } = await supabase
        .from('donations')
        .select(`
          amount,
          donation_type,
          created_at,
          members(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      recentDonations?.forEach(donation => {
        activities.push({
          id: `donation-${donation.created_at}`,
          type: 'donation',
          title: 'Nova Doação',
          description: `${donation.members?.full_name || 'Anônimo'} doou R$ ${Number(donation.amount).toFixed(2)}`,
          time: formatTimeAgo(donation.created_at),
          icon: Heart,
          color: 'text-red-600'
        });
      });

      // Eventos recentes (últimos 3)
      const { data: recentEvents } = await supabase
        .from('events')
        .select('title, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      recentEvents?.forEach(event => {
        activities.push({
          id: `event-${event.title}`,
          type: 'event',
          title: 'Novo Evento',
          description: `Evento "${event.title}" foi criado`,
          time: formatTimeAgo(event.created_at),
          icon: Calendar,
          color: 'text-green-600'
        });
      });

      // Mensagens de contato recentes (últimas 5)
      const { data: recentContacts } = await supabase
        .from('contact_messages')
        .select('name, subject, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      recentContacts?.forEach(contact => {
        activities.push({
          id: `contact-${contact.name}`,
          type: 'contact',
          title: 'Nova Mensagem',
          description: `${contact.name} enviou: ${contact.subject}`,
          time: formatTimeAgo(contact.created_at),
          icon: MessageSquare,
          color: 'text-purple-600'
        });
      });

      // Posts do blog recentes (últimos 3)
      const { data: recentPosts } = await supabase
        .from('blog_posts')
        .select('title, created_at')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(3);

      recentPosts?.forEach(post => {
        activities.push({
          id: `blog-${post.title}`,
          type: 'blog',
          title: 'Novo Artigo',
          description: `Artigo "${post.title}" foi publicado`,
          time: formatTimeAgo(post.created_at),
          icon: BookOpen,
          color: 'text-indigo-600'
        });
      });

      // Inscrições em eventos recentes (últimas 10)
      const { data: eventRegistrations } = await supabase
        .from('event_registrations')
        .select(`
          registered_at,
          status,
          user_id,
          events(title)
        `)
        .eq('status', 'confirmed')
        .order('registered_at', { ascending: false })
        .limit(10);

      // Buscar perfis dos usuários que se inscreveram em eventos
      if (eventRegistrations?.length) {
        const userIds = eventRegistrations.map(reg => reg.user_id);
        const { data: userProfiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds);

        eventRegistrations.forEach(registration => {
          const userProfile = userProfiles?.find(profile => profile.id === registration.user_id);
          activities.push({
            id: `event-registration-${registration.registered_at}`,
            type: 'event_registration',
            title: 'Nova Inscrição em Evento',
            description: `${userProfile?.full_name || 'Usuário'} se inscreveu em "${registration.events?.title}"`,
            time: formatTimeAgo(registration.registered_at),
            icon: Users,
            color: 'text-orange-600'
          });
        });
      }

      // Participações em ministérios recentes (últimas 10)
      const { data: ministryMemberships } = await supabase
        .from('ministry_memberships')
        .select(`
          joined_at,
          status,
          user_id,
          ministries(name)
        `)
        .eq('status', 'active')
        .order('joined_at', { ascending: false })
        .limit(10);

      // Buscar perfis dos usuários que participaram de ministérios
      if (ministryMemberships?.length) {
        const userIds = ministryMemberships.map(membership => membership.user_id);
        const { data: userProfiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds);

        ministryMemberships.forEach(membership => {
          const userProfile = userProfiles?.find(profile => profile.id === membership.user_id);
          activities.push({
            id: `ministry-membership-${membership.joined_at}`,
            type: 'ministry_membership',
            title: 'Nova Participação em Ministério',
            description: `${userProfile?.full_name || 'Usuário'} se juntou ao ministério "${membership.ministries?.name}"`,
            time: formatTimeAgo(membership.joined_at),
            icon: Church,
            color: 'text-teal-600'
          });
        });
      }

      // Ordenar por tempo e pegar apenas os 10 mais recentes
      activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      setActivities(activities.slice(0, 10));

    } catch (error) {
      console.error('Erro ao buscar atividades recentes:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d`;
    return time.toLocaleDateString('pt-BR');
  };

  const getActivityBadgeColor = (type: string) => {
    switch (type) {
      case 'member': return 'bg-blue-100 text-blue-800';
      case 'donation': return 'bg-red-100 text-red-800';
      case 'event': return 'bg-green-100 text-green-800';
      case 'contact': return 'bg-purple-100 text-purple-800';
      case 'blog': return 'bg-indigo-100 text-indigo-800';
      case 'event_registration': return 'bg-orange-100 text-orange-800';
      case 'ministry_membership': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Nenhuma atividade recente encontrada
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className={activity.color}>
                    <activity.icon className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getActivityBadgeColor(activity.type)}`}
                    >
                      {activity.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {activity.description}
                  </p>
                </div>
                
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;