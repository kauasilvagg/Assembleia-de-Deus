
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
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm text-gray-600 truncate max-w-[140px] md:max-w-[200px]">
            {user.user_metadata?.full_name || user.email}
          </span>
          {userRole && (
            <span
              className={`text-xs font-semibold px-2 py-1 rounded text-white shrink-0 ${
                userRole === 'admin' ? 'bg-red-600' : 'bg-green-600'
              }`}
            >
              {userRole === 'admin' ? 'Admin' : 'Usuário'}
            </span>
          )}
        </div>
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
