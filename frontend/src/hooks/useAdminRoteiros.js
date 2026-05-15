import { useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/apiClient';

export function useAdminRoteiros() {
  const [roteiros, setRoteiros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState('todos');

  const buscarRoteiros = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const params = filtroStatus !== 'todos' ? `?status=${filtroStatus}` : '';
      const { data } = await apiClient.get(`/api/admin/roteiros${params}`);
      setRoteiros(data.dados?.data ?? data.dados ?? []);
    } catch (e) {
      setErro(e.response?.data?.message ?? e.message);
    } finally {
      setCarregando(false);
    }
  }, [filtroStatus]);

  useEffect(() => { buscarRoteiros(); }, [buscarRoteiros]);

  const despublicar = useCallback(async (id) => {
    await apiClient.patch(`/api/admin/roteiros/${id}`, { status: 'rascunho' });
    await buscarRoteiros();
  }, [buscarRoteiros]);

  const deletar = useCallback(async (id) => {
    await apiClient.delete(`/api/admin/roteiros/${id}`);
    await buscarRoteiros();
  }, [buscarRoteiros]);

  return { roteiros, carregando, erro, filtroStatus, setFiltroStatus, despublicar, deletar };
}
