
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, LogIn, UserPlus, Shield, User, Eye, EyeOff, Mail, Lock, Sparkles, KeyRound } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState<'user' | 'admin'>('user');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirecionar apenas se já estiver logado ao abrir a página
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isForgot) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) {
          toast({
            title: "Erro ao enviar e-mail",
            description: error.message,
            variant: "destructive"
          });
        } else {
          setResetSent(true);
          toast({
            title: "E-mail enviado!",
            description: "Enviamos um link para redefinir sua senha. Verifique sua caixa de entrada e o spam."
          });
        }
      } else if (isLogin) {
        console.log('Attempting login for:', email, 'as', userType);
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Erro ao fazer login",
            description: error.message,
            variant: "destructive"
          });
        } else {
          // Garante/consulta o papel real do usuário no banco
          const { data: roleData } = await (supabase as any).rpc('ensure_user_role');
          const realRole = (roleData as string) || 'user';

          if (realRole !== userType) {
            await supabase.auth.signOut();
            toast({
              title: "Tipo de acesso incorreto",
              description: `Esta conta é do tipo "${realRole === 'admin' ? 'Administrador' : 'Usuário'}". Selecione o tipo correto para entrar.`,
              variant: "destructive"
            });
          } else {
            toast({
              title: "Login realizado com sucesso!",
              description: realRole === 'admin' ? "Bem-vindo, administrador!" : "Bem-vindo de volta!"
            });
            navigate(realRole === 'admin' ? '/admin' : '/');
          }
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

  const toggleMode = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (isForgot) {
        setIsForgot(false);
        setResetSent(false);
      } else {
        setIsLogin(!isLogin);
      }
      setIsAnimating(false);
    }, 150);
  };

  const openForgot = () => {
    setIsForgot(true);
    setResetSent(false);
    setIsLogin(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className={`w-full max-w-md relative z-10 transition-all duration-500 ${isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
        <div className="mb-8 text-center animate-fade-in">
          <Link 
            to="/" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-all duration-300 mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Voltar ao site
          </Link>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <div className="relative">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105">
                <span className="text-primary-foreground font-bold text-xl">ADS</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-primary to-secondary rounded-2xl opacity-20 blur animate-pulse"></div>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Assembleia de Deus
              </h1>
              <h2 className="text-lg sm:text-xl font-semibold text-muted-foreground">Shalom</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {isForgot ? 'Recupere seu acesso' : isLogin ? 'Bem-vindo de volta!' : 'Junte-se à família'}
              </p>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl shadow-primary/10 border-0 bg-card/80 backdrop-blur-xl animate-scale-in hover:shadow-primary/20 transition-all duration-500">
          <CardHeader className="text-center pb-6 pt-6 sm:pb-8 sm:pt-8">
            <div className="flex items-center justify-center mb-4">
              {isForgot ? (
                <KeyRound className="w-8 h-8 text-primary animate-fade-in" />
              ) : isLogin ? (
                <LogIn className="w-8 h-8 text-primary animate-fade-in" />
              ) : (
                <UserPlus className="w-8 h-8 text-primary animate-fade-in" />
              )}
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {isForgot ? 'Recuperar Senha' : isLogin ? 'Área do Membro' : 'Criar Conta'}
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              {isForgot
                ? 'Informe seu e-mail para receber o link de redefinição'
                : isLogin
                ? 'Acesse conteúdo exclusivo da nossa comunidade'
                : 'Faça parte da nossa família cristã'
              }
            </CardDescription>
          </CardHeader>

          
          <CardContent className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Seleção do tipo de acesso - aparece no login e no cadastro (mobile-friendly) */}
              {!isForgot && (
                <div className="space-y-3 animate-fade-in">
                  <Label className="text-sm font-medium text-foreground">Tipo de Acesso</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setUserType('user')}
                      aria-pressed={userType === 'user'}
                      className={`flex flex-col items-center justify-center gap-1 rounded-lg border-2 px-2 py-3 text-xs sm:text-sm font-medium transition-all ${
                        userType === 'user'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      <User className="w-5 h-5" />
                      Usuário
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserType('admin')}
                      aria-pressed={userType === 'admin'}
                      className={`flex flex-col items-center justify-center gap-1 rounded-lg border-2 px-2 py-3 text-xs sm:text-sm font-medium transition-all ${
                        userType === 'admin'
                          ? 'border-destructive bg-destructive/10 text-destructive'
                          : 'border-border text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      <Shield className="w-5 h-5" />
                      Administrador
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground bg-muted/30 p-2 rounded-md">
                    {userType === 'admin'
                      ? 'Administradores podem criar e gerenciar conteúdo, eventos, sermões e usuários.'
                      : 'Usuários podem visualizar conteúdo, participar de eventos e acessar área de membros.'
                    }
                  </p>
                </div>
              )}


              {!isLogin && !isForgot && (
                <div className="space-y-3 animate-fade-in">
                  <Label htmlFor="fullName" className="text-sm font-medium text-foreground">Nome Completo</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Seu nome completo"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 h-12 border-2 border-border focus:border-primary transition-all duration-300 hover:border-primary/50"
                      required
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">E-mail</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-2 border-border focus:border-primary transition-all duration-300 hover:border-primary/50"
                    required
                  />
                </div>
              </div>
              
              {!isForgot && (
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">Senha</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-12 h-12 border-2 border-border focus:border-primary transition-all duration-300 hover:border-primary/50"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                      )}
                    </Button>
                  </div>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={openForgot}
                      className="text-xs text-primary hover:underline"
                    >
                      Esqueceu sua senha?
                    </button>
                  )}
                </div>
              )}

              {isForgot && resetSent && (
                <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
                  Enviamos um link de redefinição para <strong>{email}</strong>. Verifique sua caixa de entrada e o spam.
                </p>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-primary/25 transition-all duration-300 group"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2"></div>
                    Carregando...
                  </div>
                ) : isForgot ? (
                  <>
                    <KeyRound className="w-4 h-4 mr-2" />
                    Enviar link de recuperação
                  </>
                ) : isLogin ? (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Entrar como {userType === 'admin' ? 'Administrador' : 'Usuário'}
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Criar Conta {userType === 'admin' ? 'de Administrador' : ''}
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 sm:mt-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">ou</span>
                </div>
              </div>
              
              <Button
                variant="ghost"
                onClick={toggleMode}
                className="mt-4 text-primary hover:text-primary/80 hover:bg-primary/10 transition-all duration-300 text-sm whitespace-normal h-auto py-2"
                disabled={isAnimating}
              >
                {isForgot
                  ? 'Voltar para o login'
                  : isLogin
                  ? 'Não tem uma conta? Cadastre-se'
                  : 'Já tem uma conta? Faça login'
                }
              </Button>
            </div>


            {/* Informações sobre tipos de usuário */}
            {!isLogin && !isForgot && (
              <div className="mt-6 p-4 sm:p-6 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl border border-border/50 text-sm animate-fade-in">
                <h4 className="font-semibold mb-4 text-foreground flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-primary" />
                  Tipos de Usuário:
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-background/50 transition-colors">
                    <div className="p-1 rounded-md bg-primary/10">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Usuário</p>
                      <p className="text-muted-foreground">Visualizar conteúdo, eventos, sermões e blog</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-background/50 transition-colors">
                    <div className="p-1 rounded-md bg-secondary/10">
                      <Shield className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Administrador</p>
                      <p className="text-muted-foreground">Gerenciar todo o sistema, criar conteúdo e administrar usuários</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isLogin && !isForgot && (
              <div className="mt-6 text-center text-sm">
                <p className="text-muted-foreground mb-2">Precisa de ajuda? Entre em contato conosco:</p>
                <a 
                  href="mailto:magalhaeskaua13@gmail.com" 
                  className="text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-all duration-300 font-medium break-all"
                >
                  magalhaeskaua13@gmail.com
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
