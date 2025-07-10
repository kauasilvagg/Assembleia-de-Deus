import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Filter, Calendar, User, Tag, ArrowRight, BookOpen, Plus } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [selectedAuthor, setSelectedAuthor] = useState('todos');

  const blogPosts = [];

  const categories = [
    { id: 'todos', name: 'Todas as Categorias' },
    { id: 'espiritualidade', name: 'Espiritualidade' },
    { id: 'educacao', name: 'Educação Cristã' },
    { id: 'comunidade', name: 'Comunidade' },
    { id: 'testemunho', name: 'Testemunhos' },
    { id: 'familia', name: 'Família' }
  ];

  const authors = [
    { id: 'todos', name: 'Todos os Autores' },
    { id: 'Pr. João Silva', name: 'Pr. João Silva' },
    { id: 'Maria Oliveira', name: 'Maria Oliveira' },
    { id: 'Pr. Marcos Santos', name: 'Pr. Marcos Santos' },
    { id: 'Ana Costa', name: 'Ana Costa' },
    { id: 'Carlos e Juliana Mendes', name: 'Carlos e Juliana Mendes' },
    { id: 'David Lima', name: 'David Lima' }
  ];

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

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || post.category === selectedCategory;
    const matchesAuthor = selectedAuthor === 'todos' || post.author.name === selectedAuthor;
    
    return matchesSearch && matchesCategory && matchesAuthor;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);
  const recentPosts = blogPosts.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-bethel-blue to-bethel-navy text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-6">
            Blog da Igreja
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Artigos, reflexões e testemunhos para fortalecer sua fé e crescimento espiritual
          </p>
          <Button size="lg" className="bg-white text-bethel-blue hover:bg-gray-100">
            <Plus className="w-5 h-5 mr-2" />
            Cadastrar Artigo
          </Button>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-4">
                Artigos em Destaque
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Conteúdo selecionado especialmente para você
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="aspect-video bg-gradient-to-br from-bethel-blue to-bethel-navy relative">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-white" />
                    </div>
                    <Badge className="absolute top-4 left-4 bg-bethel-gold text-white border-0">
                      Destaque
                    </Badge>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className={`${getCategoryColor(post.category)} border-0`}>
                        {getCategoryLabel(post.category)}
                      </Badge>
                      <span className="text-sm text-gray-500">{post.readTime}</span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
                          <p className="text-xs text-gray-500">{post.author.role}</p>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm" className="text-bethel-blue hover:text-bethel-navy">
                        Ler mais <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filters Section */}
      <section className="py-8 bg-gray-100 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar artigos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full md:w-64"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Autor" />
                </SelectTrigger>
                <SelectContent>
                  {authors.map((author) => (
                    <SelectItem key={author.id} value={author.id}>
                      {author.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Filter className="w-4 h-4" />
              <span>{filteredPosts.length} artigos encontrados</span>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum artigo encontrado</h3>
              <p className="text-gray-500">Tente ajustar os filtros de busca</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="aspect-video bg-gradient-to-br from-bethel-blue to-bethel-navy relative">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className={`${getCategoryColor(post.category)} border-0`}>
                        {getCategoryLabel(post.category)}
                      </Badge>
                      <span className="text-sm text-gray-500">{post.readTime}</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {formatDate(post.publishDate)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback className="text-xs">{post.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-gray-900">{post.author.name}</span>
                      </div>
                      
                      <Button variant="ghost" size="sm" className="text-bethel-blue hover:text-bethel-navy">
                        Ler mais <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Posts Sidebar */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-4">
              Artigos Recentes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Fique por dentro das últimas publicações do nosso blog
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <Card key={post.id} className="border-l-4 border-l-bethel-blue">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={`${getCategoryColor(post.category)} border-0`}>
                      {getCategoryLabel(post.category)}
                    </Badge>
                    <span className="text-sm text-gray-500">{formatDate(post.publishDate)}</span>
                  </div>
                  
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <User className="w-4 h-4 mr-1" />
                    {post.author.name}
                  </div>
                  
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    Ler Artigo
                  </Button>
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

export default Blog; 