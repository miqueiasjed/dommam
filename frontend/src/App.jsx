import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import MagicLinkCallbackPage from './pages/MagicLinkCallbackPage';
import BibliotecaPage from './pages/BibliotecaPage';
import RoteiroPage from './pages/RoteiroPage';
import AdminPage from './pages/admin/AdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/verificar" element={<MagicLinkCallbackPage />} />
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
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requerAdmin>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
