import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/auth';

export function Protected({ children, roles }: { children: React.ReactNode; roles?: Array<'customer'|'provider'|'admin'> }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (roles && !roles.includes(user.role)) return <div>Acesso negado</div>;

  return <>{children}</>;
}
