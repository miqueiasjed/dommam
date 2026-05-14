import { ExternalLink } from 'lucide-react';
import { useAdminAssinantes } from '../../hooks/useAdminAssinantes';
import Spinner from '../../components/ui/Spinner';

const selectStyle =
  'bg-[#111214] border border-amber-500/15 rounded-lg px-3 py-1.5 text-[12px] text-zinc-300 font-mono focus:outline-none focus:border-amber-500/40';

function badgeStatus(status) {
  if (status === 'ativo')
    return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2 py-0.5 text-[10px] font-mono';
  if (status === 'cancelado')
    return 'bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full px-2 py-0.5 text-[10px] font-mono';
  if (status === 'suspenso')
    return 'bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full px-2 py-0.5 text-[10px] font-mono';
  return 'bg-zinc-800/80 text-zinc-500 border border-zinc-700/50 rounded-full px-2 py-0.5 text-[10px] font-mono';
}

function formatarData(valor) {
  if (!valor) return '—';
  const d = new Date(valor);
  return d.toLocaleDateString('pt-BR');
}

export default function AdminAssinantesPage() {
  const { assinantes, carregando, erro, filtros, setFiltros } = useAdminAssinantes();

  function atualizarFiltro(campo, valor) {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  }

  return (
    <div className="bg-[#050606] min-h-screen p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
            Danuzio History — Admin
          </p>
          <h1 className="text-xl font-semibold text-white mt-0.5">Assinantes</h1>
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 mt-1">
            Dados somente leitura via Lastlink
          </p>
        </div>
        {!carregando && (
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full px-3 py-1 text-[11px] font-mono">
            {assinantes.length} assinantes
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <select
          value={filtros.status}
          onChange={(e) => atualizarFiltro('status', e.target.value)}
          className={selectStyle}
        >
          <option value="">Todos os status</option>
          <option value="ativo">Ativo</option>
          <option value="cancelado">Cancelado</option>
          <option value="suspenso">Suspenso</option>
        </select>
        <select
          value={filtros.plano}
          onChange={(e) => atualizarFiltro('plano', e.target.value)}
          className={selectStyle}
        >
          <option value="">Todos os planos</option>
          <option value="mensal">Mensal</option>
          <option value="anual">Anual</option>
        </select>
      </div>

      {erro && (
        <p className="text-red-400 font-mono text-[12px]">{erro}</p>
      )}

      <div className="bg-[#0d0d0f] border border-amber-500/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#111214] border-b border-amber-500/10">
            <tr>
              {['E-mail', 'Plano', 'Status', 'Membro desde', 'Link'].map((col) => (
                <th
                  key={col}
                  className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr>
                <td colSpan={5}>
                  <div className="flex justify-center py-12">
                    <Spinner tamanho={24} />
                  </div>
                </td>
              </tr>
            ) : assinantes.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="text-center py-12 text-zinc-500 font-mono text-[12px]">
                    Nenhum assinante encontrado.
                  </div>
                </td>
              </tr>
            ) : (
              assinantes.map((assinante) => (
                <tr key={assinante.id} className="border-b border-amber-500/5 last:border-0">
                  <td className="px-4 py-3 text-zinc-200 text-[13px]">{assinante.email}</td>
                  <td className="px-4 py-3 text-zinc-500 text-[12px] font-mono">{assinante.plano}</td>
                  <td className="px-4 py-3">
                    <span className={badgeStatus(assinante.status)}>{assinante.status}</span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 text-[12px]">
                    {formatarData(assinante.criado_em ?? assinante.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    {assinante.lastlink_url && (
                      <a
                        href={assinante.lastlink_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-400 hover:text-amber-300 transition-colors"
                      >
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="text-zinc-600 text-[11px] font-mono text-center py-3 border-t border-amber-500/5">
          Para gerenciar assinaturas, acesse diretamente o Lastlink.
        </div>
      </div>
    </div>
  );
}
