
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, LogIn, UserPlus, Shield, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState<'user' | 'admin'>('user');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        console.log('Attempting login for:', email);
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Erro ao fazer login",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Login realizado com sucesso!",
            description: "Bem-vindo de volta!"
          });
        }
      } else {
        console.log('Attempting signup for:', email, 'as', userType);
        const { error } = await signUp(email, password, fullName, userType);
        if (error) {
          toast({
            title: "Erro ao criar conta",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Conta criada com sucesso!",
            description: `Usuário ${userType === 'admin' ? 'administrador' : ''} criado. Verifique seu e-mail para confirmar sua conta.`
          });
        }
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Algo deu errado. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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
            <div className="w-12 h-12 bg-gradient-to-br from-bethel-blue to-bethel-navy rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xl">ADS</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Assembleia de Deus Shalom
              </h1>
              <p className="text-white/80">
                {isLogin ? 'Faça login para acessar sua conta' : 'Junte-se à nossa comunidade'}
              </p>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {isLogin ? 'Área do Membro' : 'Criar Conta'}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Faça login para acessar conteúdo exclusivo da igreja'
                : 'Cadastre-se para fazer parte da nossa família'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Seleção do tipo de usuário - só aparece no cadastro */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="userType">Tipo de Acesso</Label>
                  <Select value={userType} onValueChange={(value: 'user' | 'admin') => setUserType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de acesso" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>Usuário - Visualizar conteúdo</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="admin">
                        <div className="flex items-center space-x-2">
                          <Shield className="w-4 h-4" />
                          <span>Administrador - Gerenciar sistema</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    {userType === 'admin' 
                      ? 'Administradores podem criar e gerenciar conteúdo, eventos, sermões e usuários.'
                      : 'Usuários podem visualizar conteúdo, participar de eventos e acessar área de membros.'
                    }
                  </p>
                </div>
              )}

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Seu nome completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              )}
              
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

              <Button 
                type="submit" 
                className="w-full bg-bethel-blue hover:bg-bethel-navy"
                disabled={loading}
              >
                {loading ? (
                  'Carregando...'
                ) : isLogin ? (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Entrar
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Criar Conta {userType === 'admin' ? 'de Administrador' : ''}
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => setIsLogin(!isLogin)}
                className="text-bethel-blue hover:text-bethel-navy"
              >
                {isLogin 
                  ? 'Não tem uma conta? Cadastre-se'
                  : 'Já tem uma conta? Faça login'
                }
              </Button>
            </div>

            {/* Informações sobre tipos de usuário */}
            {!isLogin && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm">
                <h4 className="font-semibold mb-2 text-gray-800">Tipos de Usuário:</h4>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <User className="w-4 h-4 mt-0.5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-700">Usuário</p>
                      <p className="text-gray-600">Visualizar conteúdo, eventos, sermões e blog</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Shield className="w-4 h-4 mt-0.5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-700">Administrador</p>
                      <p className="text-gray-600">Gerenciar todo o sistema, criar conteúdo e administrar usuários</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isLogin && (
              <div className="mt-6 text-center text-sm text-gray-600">
                <p>Precisa de ajuda? Entre em contato conosco:</p>
                <a href="mailto:contato@igrejashalom.com.br" className="text-bethel-blue hover:underline">
                  contato@igrejashalom.com.br
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
