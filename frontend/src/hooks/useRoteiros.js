import { useState, useEffect } from 'react';

export function useRoteiros() {
  const [roteiros, setRoteiros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [filtros, setFiltros] = useState({ mes: '', temas: [], tipo: '' });
  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState('mais_recentes');

  useEffect(() => {
    // Debounce de 300ms apenas para a busca
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

        const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';
        const res = await fetch(`${baseUrl}/roteiros?${params.toString()}`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setRoteiros(data.data ?? data);
      } catch (e) {
        setErro(e.message);
        setRoteiros([]);
      } finally {
        setCarregando(false);
      }
    }, busca ? 300 : 0); // debounce só na busca

    return () => clearTimeout(timer);
  }, [filtros, busca, ordenacao]);

  return { roteiros, carregando, erro, filtros, setFiltros, busca, setBusca, ordenacao, setOrdenacao };
}
