
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, Users, Book } from 'lucide-react';

const WelcomeSection = () => {
  const values = [
    {
      icon: Heart,
      title: 'Amor',
      description: 'Demonstramos o amor de Cristo através de nossas ações e relacionamentos.'
    },
    {
      icon: Users,
      title: 'Comunidade',
      description: 'Construímos uma família unida pela fé e pelo cuidado mútuo.'
    },
    {
      icon: Book,
      title: 'Palavra',
      description: 'Fundamentamos nossa vida na Palavra de Deus e em Seus ensinamentos.'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 animate-slide-in">
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-bethel-blue uppercase tracking-wider">
                Mensagem do Pastor
              </h2>
              <h3 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Bem-vindos à nossa família de fé
              </h3>
            </div>
            
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p className="text-lg">
                É com grande alegria que recebemos você em nossa comunidade. Aqui, acreditamos que 
                cada pessoa é especial aos olhos de Deus e tem um propósito único a cumprir.
              </p>
              <p>
                Nossa igreja é um lugar onde você pode crescer espiritualmente, encontrar amizades 
                verdadeiras e descobrir como Deus pode usar seus dons e talentos para abençoar outros.
              </p>
              <p className="font-medium text-gray-800">
                "Porque onde estiverem dois ou três reunidos em meu nome, aí estou eu no meio deles." 
                - Mateus 18:20
              </p>
            </div>

            <div className="pt-4">
              <Link to="/sobre">
                <Button size="lg" className="bg-bethel-blue hover:bg-bethel-navy">
                  Conheça Mais Sobre Nós
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Content - Values Cards */}
          <div className="space-y-6">
            {values.map((value, index) => (
              <Card key={value.title} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardContent className="p-6 flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-bethel-blue to-bethel-navy rounded-lg flex items-center justify-center flex-shrink-0">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xl text-gray-900 mb-2">{value.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
