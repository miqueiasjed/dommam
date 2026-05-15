import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import Spinner from '../ui/Spinner';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, carregando } = useAuth();
  const { isAdminAuthenticated, carregando: carregandoAdmin } = useAdminAuth();
  const location = useLocation();

  if (carregando || carregandoAdmin) {
    return (
      <div className="flex h-screen items-center justify-center bg-page">
        <Spinner tamanho={32} />
      </div>
    );
  }

  if (!isAuthenticated && !isAdminAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
