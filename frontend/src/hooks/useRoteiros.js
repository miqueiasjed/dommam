import { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';

export function useRoteiros() {
  const [roteiros, setRoteiros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [filtros, setFiltros] = useState({ mes: '', temas: [], tipo: '' });
  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState('mais_recentes');

  useEffect(() => {
    const timer = setTimeout(async () => {
      setCarregando(true);
      setErro(null);
      try {
        const params = new URLSearchParams();
        if (filtros.mes) params.set('mes', filtros.mes);
        filtros.temas.forEach(t => params.append('temas[]', t));
        if (filtros.tipo) params.set('tipo', filtros.tipo);
        if (busca) params.set('busca', busca);
        params.set('ordenacao', ordenacao);

        const { data } = await apiClient.get(`/api/roteiros?${params.toString()}`);
        setRoteiros(data.dados ?? []);
      } catch (e) {
        setErro(e.message);
        setRoteiros([]);
      } finally {
        setCarregando(false);
      }
    }, busca ? 300 : 0);

    return () => clearTimeout(timer);
  }, [filtros, busca, ordenacao]);

  return { roteiros, carregando, erro, filtros, setFiltros, busca, setBusca, ordenacao, setOrdenacao };
}
