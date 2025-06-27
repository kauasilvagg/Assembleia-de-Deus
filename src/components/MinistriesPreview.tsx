
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, Heart, BookOpen, Music } from 'lucide-react';

const MinistriesPreview = () => {
  const ministries = [
    {
      icon: Users,
      title: 'Ministério Infantil',
      description: 'Ensinamos as crianças sobre o amor de Jesus através de atividades lúdicas e educativas.',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      icon: Heart,
      title: 'Ministério de Jovens',
      description: 'Um espaço onde os jovens podem crescer na fé e construir amizades duradouras.',
      image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      icon: BookOpen,
      title: 'Ministério de Ensino',
      description: 'Estudos bíblicos profundos para fortalecer o conhecimento da Palavra de Deus.',
      image: 'https://images.unsplash.com/photo-1481627645764-5aa73dd90cfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      icon: Music,
      title: 'Ministério de Louvor',
      description: 'Através da música, elevamos nossos corações em adoração ao Senhor.',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-sm font-semibold text-bethel-blue uppercase tracking-wider mb-4">
            Nossos Ministérios
          </h2>
          <h3 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Encontre Seu Lugar de Servir
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Temos diversos ministérios onde você pode usar seus dons e talentos 
            para abençoar outros e crescer espiritualmente.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {ministries.map((ministry, index) => (
            <Card key={ministry.title} className="overflow-hidden group hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div 
                className="h-48 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${ministry.image})` }}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                    <ministry.icon className="w-8 h-8 text-bethel-blue" />
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <CardTitle className="text-xl font-semibold text-gray-900 mb-3 text-center">
                  {ministry.title}
                </CardTitle>
                <p className="text-gray-600 text-sm leading-relaxed text-center">
                  {ministry.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/ministerios">
            <Button size="lg" className="bg-bethel-blue hover:bg-bethel-navy">
              Conheça Todos os Ministérios
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MinistriesPreview;
