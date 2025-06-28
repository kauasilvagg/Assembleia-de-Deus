
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, BookOpen, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen font-inter">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-r from-bethel-blue to-bethel-navy">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-playfair text-4xl md:text-6xl font-bold text-white mb-6">
              Sobre Nós
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Conheça a história da Assembleia de Deus Shalom Parque Vitória e nossa missão de transformar vidas através do amor de Cristo.
            </p>
          </div>
        </section>

        {/* Nossa História */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Nossa História
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    A Assembleia de Deus Shalom Parque Vitória nasceu do desejo de um grupo de irmãos em estabelecer uma comunidade cristã sólida e acolhedora no bairro Parque Vitória. Fundada em 1985, nossa igreja tem sido um farol de esperança e transformação na região.
                  </p>
                  <p>
                    Ao longo de quase quatro décadas, temos testemunhado inúmeras vidas sendo tocadas pelo poder do Evangelho. Nossa congregação cresceu não apenas em número, mas principalmente em maturidade espiritual e compromisso com a obra de Deus.
                  </p>
                  <p>
                    Hoje somos uma igreja que valoriza a adoração genuína, o ensino bíblico sólido e o cuidado mútuo. Acreditamos que cada pessoa é especial aos olhos de Deus e tem um propósito único para cumprir.
                  </p>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Nossa Igreja"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Nossos Valores */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nossos Valores
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Os valores que norteiam nossa caminhada e definem nossa identidade como igreja.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-bethel-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold">Amor</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    O amor de Cristo é o centro de tudo o que fazemos. Amamos a Deus e ao próximo incondicionalmente.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-bethel-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold">Comunidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Valorizamos o relacionamento e a vida em comunidade, onde cada um cuida do outro.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-bethel-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold">Palavra</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    A Bíblia é nossa única regra de fé e prática. Ensinamos e vivemos conforme a Palavra de Deus.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-bethel-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold">Missão</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Somos chamados para levar o Evangelho a toda criatura, começando em nossa cidade.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Missão, Visão e Valores */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-bethel-blue">
                    Nossa Missão
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Proclamar o Evangelho de Jesus Cristo com poder e demonstração do Espírito Santo, formando discípulos maduros e comprometidos com a obra de Deus.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-bethel-blue">
                    Nossa Visão
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Ser uma igreja próspera, relevante e influente, que impacta positivamente nossa comunidade e contribui para a expansão do Reino de Deus.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-bethel-blue">
                    Nossos Valores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Autoridade das Escrituras</li>
                    <li>• Adoração genuína</li>
                    <li>• Comunhão cristã</li>
                    <li>• Evangelização</li>
                    <li>• Discipulado</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Liderança */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nossa Liderança
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Conhece a equipe pastoral que lidera nossa comunidade com amor e dedicação.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <CardTitle className="text-xl font-bold">Pastor Principal</CardTitle>
                  <CardDescription>Liderança e visão pastoral</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Responsável pela visão geral da igreja e pelo ensino da Palavra de Deus.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <CardTitle className="text-xl font-bold">Pastor Auxiliar</CardTitle>
                  <CardDescription>Cuidado pastoral</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Auxilia no cuidado pastoral e no desenvolvimento dos ministérios.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <CardTitle className="text-xl font-bold">Conselho</CardTitle>
                  <CardDescription>Governança da igreja</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Grupo de líderes experientes que auxiliam na tomada de decisões importantes.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
