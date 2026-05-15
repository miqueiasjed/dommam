import { useState, useEffect } from 'react';
import apiClient from '../../utils/apiClient';
import Spinner from '../../components/ui/Spinner';

const inputStyle =
  'bg-[#111214] border border-amber-500/15 rounded-lg px-3 py-1.5 text-[12px] text-zinc-300 font-mono focus:outline-none focus:border-amber-500/40';

function badgeAcao(acao) {
  if (acao === 'criar')
    return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2 py-0.5 text-[10px] font-mono shrink-0';
  if (acao === 'editar')
    return 'bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full px-2 py-0.5 text-[10px] font-mono shrink-0';
  if (acao === 'deletar')
    return 'bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-2 py-0.5 text-[10px] font-mono shrink-0';
  return 'bg-zinc-800/80 text-zinc-500 border border-zinc-700/50 rounded-full px-2 py-0.5 text-[10px] font-mono shrink-0';
}

function formatarData(valor) {
  if (!valor) return '—';
  const d = new Date(valor);
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminAuditLogPage() {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [filtros, setFiltros] = useState({ tipo: '', de: '', ate: '' });

  useEffect(() => {
    async function buscar() {
      setCarregando(true);
      setErro(null);
      try {
        const params = new URLSearchParams();
        if (filtros.tipo) params.set('tipo', filtros.tipo);
        if (filtros.de) params.set('de', filtros.de);
        if (filtros.ate) params.set('ate', filtros.ate);
        const { data } = await apiClient.get(`/api/admin/audit-log?${params.toString()}`);
        setItens(data.dados ?? []);
      } catch (e) {
        setErro(e.response?.data?.message ?? e.message);
      } finally {
        setCarregando(false);
      }
    }
    buscar();
  }, [filtros]);

  function atualizarFiltro(campo, valor) {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  }

  return (
    <div className="bg-[#050606] min-h-screen p-6 space-y-6">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
          Danuzio History — Admin
        </p>
        <h1 className="text-xl font-semibold text-white mt-0.5">Audit Log</h1>
        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 mt-1">
          Últimas 100 ações administrativas
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={filtros.tipo}
          onChange={(e) => atualizarFiltro('tipo', e.target.value)}
          className={inputStyle}
        >
          <option value="">Todos os tipos</option>
          <option value="criar">Criar</option>
          <option value="editar">Editar</option>
          <option value="deletar">Deletar</option>
          <option value="login">Login</option>
          <option value="logout">Logout</option>
        </select>
        <input
          type="date"
          value={filtros.de}
          onChange={(e) => atualizarFiltro('de', e.target.value)}
          placeholder="De"
          className={inputStyle}
        />
        <input
          type="date"
          value={filtros.ate}
          onChange={(e) => atualizarFiltro('ate', e.target.value)}
          placeholder="Até"
          className={inputStyle}
        />
      </div>

      {erro && (
        <p className="text-red-400 font-mono text-[12px]">{erro}</p>
      )}

      {carregando ? (
        <div className="flex justify-center py-12">
          <Spinner tamanho={24} />
        </div>
      ) : itens.length === 0 ? (
        <div className="text-center py-12 text-zinc-500 font-mono text-[12px]">
          Nenhuma ação registrada.
        </div>
      ) : (
        <div className="bg-[#0d0d0f] border border-amber-500/10 rounded-xl divide-y divide-amber-500/5">
          {itens.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-3">
              <span className={badgeAcao(item.acao)}>{item.acao}</span>
              <span className="text-zinc-300 text-[12px] flex-1">{item.admin_email}</span>
              <span className="text-zinc-500 text-[12px]">{item.alvo}</span>
              <span className="font-mono text-[10px] text-zinc-600 shrink-0">
                {formatarData(item.criado_em ?? item.created_at)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
