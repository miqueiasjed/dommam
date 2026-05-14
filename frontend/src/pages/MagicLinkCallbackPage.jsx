import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../utils/apiClient';

export default function MagicLinkCallbackPage() {
  const [estado, setEstado] = useState('verificando');
  const [mensagemErro, setMensagemErro] = useState(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    async function verificar() {
      const token = searchParams.get('token');

      if (!token) {
        setMensagemErro('Link inválido.');
        setEstado('erro');
        return;
      }

      try {
        const { data } = await apiClient.get('/api/auth/verificar', { params: { token } });
        const { email, primeiro_acesso } = data;
        login(email);
        navigate(primeiro_acesso ? '/boas-vindas' : '/biblioteca', { replace: true });
      } catch (err) {
        setMensagemErro(err.response?.data?.message ?? 'Link inválido ou expirado.');
        setEstado('erro');
      }
    }

    verificar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (estado === 'verificando') {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-page">
        <Spinner tamanho={32} />
        <p className="text-[13px] text-muted">Verificando link...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-page">
      <XCircle size={40} className="text-red-400" />
      <p className="text-[16px] font-semibold text-white">Link inválido ou expirado</p>
      <p className="text-[13px] text-muted">{mensagemErro}</p>
      <Button variante="secundario" onClick={() => navigate('/login')}>
        Solicitar novo link
      </Button>
    </div>
  );
}
