import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Spinner from '../ui/Spinner';

export default function ProtectedRoute({ children, requerAdmin = false }) {
  const { isAuthenticated, carregando } = useAuth();
  const location = useLocation();

  if (carregando) {
    return (
      <div className="flex h-screen items-center justify-center bg-page">
        <Spinner tamanho={32} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
