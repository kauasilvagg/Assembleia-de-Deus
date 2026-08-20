import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Lock, Eye, EyeOff, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ResetPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validLink, setValidLink] = useState<boolean | null>(null);

  useEffect(() => {
    // O Supabase cria uma sessão temporária de recuperação ao abrir o link do e-mail
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setValidLink(true);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      const hash = window.location.hash;
      setValidLink(!!session || hash.includes('type=recovery'));
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast({
        title: 'Senha muito curta',
        description: 'A senha deve ter pelo menos 6 caracteres.',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'As senhas não coincidem',
        description: 'Digite a mesma senha nos dois campos.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      toast({
        title: 'Senha alterada com sucesso!',
        description: 'Faça login com sua nova senha.',
      });

      await supabase.auth.signOut();
      navigate('/login');
    } catch (error: any) {
      toast({
        title: 'Erro ao alterar a senha',
        description: error?.message || 'O link pode ter expirado. Solicite um novo.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          to="/login"
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao login
        </Link>

        <Card className="shadow-2xl shadow-primary/10 border-0 bg-card/80 backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-3">
              <KeyRound className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Criar nova senha</CardTitle>
            <CardDescription>
              Defina uma nova senha para acessar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            {validLink === false ? (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Link inválido ou expirado. Solicite uma nova redefinição de senha.
                </p>
                <Button className="w-full" onClick={() => navigate('/login')}>
                  Ir para o login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="password">Nova senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo de 6 caracteres"
                      className="pl-10 pr-12 h-12"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita a nova senha"
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-12" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar nova senha'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
