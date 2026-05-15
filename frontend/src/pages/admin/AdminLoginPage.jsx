import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import apiClient from '../../utils/apiClient';
import Spinner from '../../components/ui/Spinner';
import { useAdminAuth } from '../../hooks/useAdminAuth';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { loginAdmin } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      const { data } = await apiClient.post('/api/admin/login', { email, senha });
      if (data.dados?.requer_2fa) {
        navigate('/admin/2fa', { state: { pending_token: data.dados.pending_token } });
      } else {
        loginAdmin(data.dados?.email ?? email);
        navigate('/admin/roteiros', { replace: true });
      }
    } catch (err) {
      const mensagem = err.response?.data?.message || 'Credenciais inválidas. Tente novamente.';
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050606]">
      <div className="bg-[#0d0d0f] border border-amber-500/15 rounded-xl p-8 w-full max-w-sm shadow-xl shadow-black/40">
        <div className="flex items-center gap-2 mb-1">
          <Shield size={18} className="text-amber-500" />
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-amber-500/60">
            Danuzio History
          </span>
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded px-1.5 py-0.5 text-[10px] font-mono">
            Admin
          </span>
        </div>

        <h1 className="text-white text-[18px] font-semibold mt-4 mb-1">Acesso restrito</h1>
        <p className="text-zinc-500 text-[12px] mb-6">Faça login com suas credenciais de administrador.</p>

        {erro && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-[12px] mb-4">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@danuzio.com"
              required
              className="bg-[#111214] border border-amber-500/15 rounded-lg px-3 py-2 text-[13px] text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 w-full"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-[#111214] border border-amber-500/15 rounded-lg px-3 py-2 text-[13px] text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 w-full"
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="bg-amber-500 hover:bg-amber-400 text-black font-mono font-semibold uppercase tracking-widest rounded-lg px-4 py-2.5 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {carregando ? <Spinner tamanho={16} /> : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
