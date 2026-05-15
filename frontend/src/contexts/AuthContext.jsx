import { createContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/apiClient';

export const AuthContext = createContext(null);

const CHAVE_TOKEN = 'backstage_token';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function verificarSessao() {
      const token = localStorage.getItem(CHAVE_TOKEN);
      if (!token) {
        setCarregando(false);
        return;
      }
      try {
        const { data } = await apiClient.get('/api/auth/me');
        setUsuario(data.dados?.usuario ?? null);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem(CHAVE_TOKEN);
        setIsAuthenticated(false);
        setUsuario(null);
      } finally {
        setCarregando(false);
      }
    }
    verificarSessao();
  }, []);

  const login = useCallback(async (email, senha) => {
    const { data } = await apiClient.post('/api/auth/login', { email, password: senha });
    const { token, usuario: dadosUsuario } = data.dados;
    localStorage.setItem(CHAVE_TOKEN, token);
    setUsuario(dadosUsuario);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/api/auth/logout');
    } finally {
      localStorage.removeItem(CHAVE_TOKEN);
      setUsuario(null);
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, isAuthenticated, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
