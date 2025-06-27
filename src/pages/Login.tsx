
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui seria implementada a lógica de autenticação
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bethel-blue to-bethel-navy flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao site
          </Link>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-bethel-blue font-bold text-xl">B</span>
            </div>
            <h1 className="font-playfair font-bold text-2xl text-white">
              Igreja Batista Bethel
            </h1>
          </div>
        </div>

        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Área do Membro
            </CardTitle>
            <CardDescription>
              Faça login para acessar conteúdo exclusivo da igreja
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-bethel-blue hover:bg-bethel-navy">
                <LogIn className="w-4 h-4 mr-2" />
                Entrar
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>Ainda não tem acesso?</p>
              <p className="mt-1">
                Entre em contato com a secretaria da igreja: 
                <br />
                <a href="mailto:contato@igrejabethel.com.br" className="text-bethel-blue hover:underline">
                  contato@igrejabethel.com.br
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
