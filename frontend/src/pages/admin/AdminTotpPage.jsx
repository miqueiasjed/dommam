import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import apiClient from '../../utils/apiClient';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import Spinner from '../../components/ui/Spinner';

export default function AdminTotpPage() {
  const navigate = useNavigate();
  const { loginAdmin } = useAdminAuth();
  const [codigo, setCodigo] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      const { data } = await apiClient.post('/api/admin/2fa/verificar', { codigo });
      loginAdmin(data.email);
      navigate('/admin/roteiros');
    } catch (err) {
      const mensagem = err.response?.data?.message || 'Código inválido ou expirado.';
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050606]">
      <div className="bg-[#0d0d0f] border border-amber-500/15 rounded-xl p-8 w-full max-w-sm shadow-xl shadow-black/40">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck size={18} className="text-amber-500" />
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-amber-500/60">
            Danuzio History
          </span>
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded px-1.5 py-0.5 text-[10px] font-mono">
            Admin
          </span>
        </div>

        <h1 className="text-white text-[18px] font-semibold mt-4 mb-1">Verificação em Dois Fatores</h1>
        <p className="text-zinc-500 text-[12px] mb-6">Insira o código de 6 dígitos do seu aplicativo autenticador.</p>

        {erro && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-[12px] mb-4">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              Código
            </label>
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              pattern="\d{6}"
              placeholder="000000"
              required
              className="bg-[#111214] border border-amber-500/15 rounded-lg px-3 py-2 text-[13px] text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 w-full text-center text-[24px] tracking-[0.5em] font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={carregando || codigo.length < 6}
            className="bg-amber-500 hover:bg-amber-400 text-black font-mono font-semibold uppercase tracking-widest rounded-lg px-4 py-2.5 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {carregando ? <Spinner tamanho={16} /> : 'Verificar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/admin/login"
            className="text-zinc-500 hover:text-zinc-300 text-[12px] font-mono transition-colors"
          >
            ← Voltar
          </Link>
        </div>
      </div>
    </div>
  );
}
