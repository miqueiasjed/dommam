import { useState } from 'react';
import { BookOpen, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import apiClient from '../utils/apiClient';

export default function LoginPage() {
  const [estadoEnvio, setEstadoEnvio] = useState('idle'); // 'idle' | 'loading' | 'sucesso' | 'erro'
  const [email, setEmail] = useState('');
  const [mensagemErro, setMensagemErro] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setEstadoEnvio('loading');
    setMensagemErro(null);
    try {
      await apiClient.post('/api/auth/solicitar-link', { email });
      setEstadoEnvio('sucesso');
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Não foi possível enviar o link.';
      setMensagemErro(msg);
      setEstadoEnvio('erro');
    }
  }

  function reiniciar() {
    setEstadoEnvio('idle');
    setMensagemErro(null);
  }

  return (
    <div className="h-screen flex items-center justify-center bg-page">
      {estadoEnvio === 'sucesso' ? (
        <div className="bg-surface border border-zinc-800/80 rounded-xl p-8 w-full max-w-sm flex flex-col items-center gap-4 text-center">
          <CheckCircle size={40} className="text-amber-500" />
          <div>
            <p className="text-white font-semibold text-[16px]">Link enviado!</p>
            <p className="text-muted text-[12px] mt-1">
              Verifique sua caixa de entrada. O link expira em 15 minutos.
            </p>
          </div>
          <button
            type="button"
            onClick={reiniciar}
            className="text-amber-500 hover:text-amber-400 text-[12px] underline underline-offset-2 transition-colors"
          >
            Tentar outro e-mail
          </button>
        </div>
      ) : (
        <div className="bg-surface border border-zinc-800/80 rounded-xl p-8 w-full max-w-sm">
          {/* Cabeçalho */}
          <div className="flex items-center gap-2 mb-6">
            <BookOpen size={20} className="text-amber-500" />
            <span className="text-white font-semibold text-[14px]">Danuzio History</span>
            <span className="ml-1 bg-amber-600/20 text-amber-500 border border-amber-600/30 rounded px-1.5 py-0.5 text-[10px] font-medium">
              Backstage
            </span>
          </div>

          {/* Título e subtítulo */}
          <h1 className="text-white font-semibold text-[18px] mb-1">Acesse o Backstage</h1>
          <p className="text-muted text-[12px] mb-6">
            Insira seu e-mail para receber o link de acesso.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Campo e-mail */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-[12px] text-muted font-medium mb-1.5"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={estadoEnvio === 'loading'}
                placeholder="seu@email.com"
                className="bg-surface-elevated border border-zinc-800/80 rounded-lg px-3 py-2 text-[13px] text-white w-full focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-subtle"
              />
            </div>

            {/* Banner de erro */}
            {estadoEnvio === 'erro' && (
              <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-3 mb-4">
                <p className="text-red-400 text-[12px]">
                  {mensagemErro || 'Não foi possível enviar o link. Tente novamente.'}
                </p>
              </div>
            )}

            {/* Botão de submit */}
            <Button
              type="submit"
              variante="primario"
              tamanho="lg"
              disabled={estadoEnvio === 'loading'}
              className="w-full justify-center"
            >
              {estadoEnvio === 'loading' ? (
                <>
                  <Spinner tamanho={16} />
                  Enviando...
                </>
              ) : (
                'Enviar link de acesso'
              )}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
