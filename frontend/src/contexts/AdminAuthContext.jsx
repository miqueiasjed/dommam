import { createContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/apiClient';

export const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [adminEmail, setAdminEmail] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function verificarSessaoAdmin() {
      try {
        const { data } = await apiClient.get('/api/admin/me');
        setAdminEmail(data.dados?.email);
        setIsAdminAuthenticated(true);
      } catch {
        setIsAdminAuthenticated(false);
        setAdminEmail(null);
      } finally {
        setCarregando(false);
      }
    }
    verificarSessaoAdmin();
  }, []);

  const loginAdmin = useCallback((email) => {
    setAdminEmail(email);
    setIsAdminAuthenticated(true);
  }, []);

  const logoutAdmin = useCallback(async () => {
    try {
      await apiClient.post('/api/admin/logout');
    } finally {
      setAdminEmail(null);
      setIsAdminAuthenticated(false);
    }
  }, []);

  return (
    <AdminAuthContext.Provider value={{ adminEmail, isAdminAuthenticated, carregando, loginAdmin, logoutAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
