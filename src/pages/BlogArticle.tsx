import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock, ArrowLeft, Tag, BookOpen } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author_name: string;
  category: string;
  tags?: string[];
  featured_image_url?: string;
  created_at: string;
  view_count: number;
  read_time: number;
  slug?: string;
}

const BlogArticle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) throw error;

      if (data) {
        setPost(data);
        
        // Increment view count
        await supabase
          .from('blog_posts')
          .update({ view_count: (data.view_count || 0) + 1 })
          .eq('id', data.id);

        // Fetch related posts
        const { data: related } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('category', data.category)
          .eq('is_published', true)
          .neq('id', data.id)
          .limit(3);

        if (related) {
          setRelatedPosts(related);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar artigo:', error);
      toast({
        title: "Erro",
        description: "Artigo não encontrado ou ocorreu um erro ao carregar.",
        variant: "destructive",
      });
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'espiritualidade':
        return 'bg-blue-100 text-blue-800';
      case 'educacao':
        return 'bg-green-100 text-green-800';
      case 'comunidade':
        return 'bg-purple-100 text-purple-800';
      case 'testemunho':
        return 'bg-orange-100 text-orange-800';
      case 'familia':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'espiritualidade':
        return 'Espiritualidade';
      case 'educacao':
        return 'Educação Cristã';
      case 'comunidade':
        return 'Comunidade';
      case 'testemunho':
        return 'Testemunhos';
      case 'familia':
        return 'Família';
      default:
        return category;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-bethel-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando artigo...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Artigo não encontrado</h2>
          <p className="text-gray-600 mb-6">O artigo que você está procurando não existe ou foi removido.</p>
          <Button onClick={() => navigate('/blog')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Blog
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Breadcrumb */}
      <section className="py-4 bg-white border-b">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/blog')}
            className="text-bethel-blue hover:text-bethel-navy"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Blog
          </Button>
        </div>
      </section>

      {/* Article Header */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <Badge className={`${getCategoryColor(post.category)} border-0 mb-4`}>
              {getCategoryLabel(post.category)}
            </Badge>
            
            <h1 className="font-playfair text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                {post.excerpt}
              </p>
            )}

            <div className="flex items-center justify-center space-x-6 text-gray-500">
              <div className="flex items-center">
                <Avatar className="w-8 h-8 mr-3">
                  <AvatarFallback>{post.author_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{post.author_name}</span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(post.created_at)}</span>
              </div>
              
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>{post.read_time} min de leitura</span>
              </div>
            </div>
          </div>

          {post.featured_image_url && (
            <div className="mb-12">
              <img 
                src={post.featured_image_url} 
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardContent className="p-8 md:p-12">
              <div 
                className="prose prose-lg max-w-none"
                style={{ 
                  lineHeight: '1.8',
                  fontSize: '1.1rem'
                }}
              >
                {post.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-6 text-gray-700">
                    {paragraph}
                  </p>
                ))}
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t">
                  <div className="flex items-center flex-wrap gap-2">
                    <Tag className="w-4 h-4 text-gray-500 mr-2" />
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-gray-600">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-playfair font-bold text-center text-gray-900 mb-12">
              Artigos Relacionados
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Card 
                  key={relatedPost.id} 
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/blog/${relatedPost.slug}`)}
                >
                  <div className="aspect-video bg-gradient-to-br from-bethel-blue to-bethel-navy relative">
                    {relatedPost.featured_image_url ? (
                      <img 
                        src={relatedPost.featured_image_url} 
                        alt={relatedPost.title}
                        className="w-full h-full object-cover opacity-80"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-6">
                    <Badge className={`${getCategoryColor(relatedPost.category)} border-0 mb-3`}>
                      {getCategoryLabel(relatedPost.category)}
                    </Badge>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {relatedPost.excerpt || relatedPost.content.substring(0, 150) + '...'}
                    </p>
                    
                    <div className="flex items-center text-gray-500 text-sm mt-4">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(relatedPost.created_at)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default BlogArticle;