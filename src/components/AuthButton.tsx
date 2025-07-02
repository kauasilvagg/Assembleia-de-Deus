
import { Button } from '@/components/ui/button';
import { LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Link } from 'react-router-dom';

const AuthButton = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { isAdmin, userRole, loading: roleLoading } = useUserRole();

  console.log('AuthButton state:', { user: !!user, isAdmin, userRole, authLoading, roleLoading });

  if (authLoading || roleLoading) {
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
          {userRole && (
            <span className="ml-1 text-xs bg-gray-100 px-2 py-1 rounded">
              {userRole === 'admin' ? 'Admin' : 'Usuário'}
            </span>
          )}
        </span>
        {isAdmin && (
          <Link to="/admin">
            <Button variant="outline" size="sm" className="flex items-center space-x-1">
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </Button>
          </Link>
        )}
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
