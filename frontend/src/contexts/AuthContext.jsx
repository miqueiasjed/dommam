import { createContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/apiClient';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [email, setEmail] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function verificarSessao() {
      try {
        const { data } = await apiClient.get('/api/auth/me');
        setEmail(data.email);
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
        setEmail(null);
      } finally {
        setCarregando(false);
      }
    }
    verificarSessao();
  }, []);

  const login = useCallback((emailUsuario) => {
    setEmail(emailUsuario);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/api/auth/logout');
    } finally {
      setEmail(null);
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ email, isAuthenticated, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
