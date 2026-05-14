import { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';

export function useRoteiro(slug) {
  const [roteiro, setRoteiro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!slug) return;

    let cancelado = false;

    async function buscarRoteiro() {
      setCarregando(true);
      setErro(null);
      try {
        const res = await apiClient.get(`/api/roteiros/${slug}`);
        if (!cancelado) setRoteiro(res.data);
      } catch (e) {
        if (!cancelado) {
          if (e.response?.status === 404) {
            setErro('not_found');
          } else {
            setErro(e.message);
          }
          setRoteiro(null);
        }
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    buscarRoteiro();

    return () => { cancelado = true; };
  }, [slug]);

  return { roteiro, carregando, erro };
}
