import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destino = location.state?.from?.pathname || '/biblioteca';

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setCarregando(true);
    setErro(null);
    try {
      await login(email, senha);
      navigate(destino, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.mensagem ?? 'Não foi possível fazer login. Tente novamente.';
      setErro(msg);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-page">
      <div className="bg-surface border border-zinc-800/80 rounded-xl p-8 w-full max-w-sm">
        {/* Cabeçalho */}
        <div className="flex items-center gap-2 mb-6">
          <BookOpen size={20} className="text-amber-500" />
          <span className="text-white font-semibold text-[14px]">Danuzio History</span>
          <span className="ml-1 bg-amber-600/20 text-amber-500 border border-amber-600/30 rounded px-1.5 py-0.5 text-[10px] font-medium">
            Backstage
          </span>
        </div>

        <h1 className="text-white font-semibold text-[18px] mb-1">Acesse o Backstage</h1>
        <p className="text-muted text-[12px] mb-6">
          Entre com seu e-mail e senha para continuar.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="email" className="block text-[12px] text-muted font-medium mb-1.5">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={carregando}
              placeholder="seu@email.com"
              className="bg-surface-elevated border border-zinc-800/80 rounded-lg px-3 py-2 text-[13px] text-white w-full focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-subtle"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="senha" className="block text-[12px] text-muted font-medium mb-1.5">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={carregando}
              placeholder="••••••••"
              className="bg-surface-elevated border border-zinc-800/80 rounded-lg px-3 py-2 text-[13px] text-white w-full focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-subtle"
            />
          </div>

          {erro && (
            <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-3 mb-4">
              <p className="text-red-400 text-[12px]">{erro}</p>
            </div>
          )}

          <Button
            type="submit"
            variante="primario"
            tamanho="lg"
            disabled={carregando}
            className="w-full justify-center"
          >
            {carregando ? (
              <>
                <Spinner tamanho={16} />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
