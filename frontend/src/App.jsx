import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import BibliotecaPage from './pages/BibliotecaPage';
import RoteiroPage from './pages/RoteiroPage';
import WelcomeTourPage from './pages/WelcomeTourPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminTotpPage from './pages/admin/AdminTotpPage';
import AdminRoteirosPage from './pages/admin/AdminRoteirosPage';
import RoteiroFormPage from './pages/admin/RoteiroFormPage';
import AdminAssinantesPage from './pages/admin/AdminAssinantesPage';
import AdminAuditLogPage from './pages/admin/AdminAuditLogPage';
import AdminUsuariosPage from './pages/admin/AdminUsuariosPage';

export default function App() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Portal de membros */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/boas-vindas" element={<WelcomeTourPage />} />
          <Route
            path="/biblioteca"
            element={
              <ProtectedRoute>
                <BibliotecaPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roteiro/:slug"
            element={
              <ProtectedRoute>
                <RoteiroPage />
              </ProtectedRoute>
            }
          />

          {/* Admin — auth */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/2fa" element={<AdminTotpPage />} />

          {/* Admin — painel protegido */}
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/roteiros" replace />} />
            <Route path="roteiros" element={<AdminRoteirosPage />} />
            <Route path="roteiros/novo" element={<RoteiroFormPage />} />
            <Route path="roteiros/:id/editar" element={<RoteiroFormPage />} />
            <Route path="assinantes" element={<AdminAssinantesPage />} />
            <Route path="usuarios" element={<AdminUsuariosPage />} />
            <Route path="audit-log" element={<AdminAuditLogPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AdminAuthProvider>
  );
}
