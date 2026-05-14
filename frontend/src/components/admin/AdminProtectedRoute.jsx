import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import Spinner from '../ui/Spinner';

export default function AdminProtectedRoute({ children }) {
  const { isAdminAuthenticated, carregando } = useAdminAuth();

  if (carregando) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#050606]">
        <Spinner tamanho={32} />
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
