import { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';

export function useAdminAssinantes() {
  const [assinantes, setAssinantes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [filtros, setFiltros] = useState({ status: '', plano: '' });

  useEffect(() => {
    async function buscar() {
      setCarregando(true);
      setErro(null);
      try {
        const params = new URLSearchParams();
        if (filtros.status) params.set('status', filtros.status);
        if (filtros.plano) params.set('plano', filtros.plano);
        const { data } = await apiClient.get(`/api/admin/assinantes?${params.toString()}`);
        setAssinantes(data.data ?? data);
      } catch (e) {
        setErro(e.response?.data?.message ?? e.message);
      } finally {
        setCarregando(false);
      }
    }
    buscar();
  }, [filtros]);

  return { assinantes, carregando, erro, filtros, setFiltros };
}
