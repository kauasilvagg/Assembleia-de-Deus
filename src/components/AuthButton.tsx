
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const AuthButton = () => {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return (
      <Button variant="ghost" disabled>
        Carregando...
      </Button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 hidden md:block">
          Olá, {user.user_metadata?.full_name || user.email}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={signOut}
          className="flex items-center space-x-1"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair</span>
        </Button>
      </div>
    );
  }

  return (
    <Link to="/login">
      <Button variant="outline" size="sm" className="flex items-center space-x-1">
        <User className="w-4 h-4" />
        <span>Área do Membro</span>
      </Button>
    </Link>
  );
};

export default AuthButton;
