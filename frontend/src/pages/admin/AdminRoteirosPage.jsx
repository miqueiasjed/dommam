import { Link } from 'react-router-dom';
import { Plus, Pencil, EyeOff, Trash2 } from 'lucide-react';
import { useAdminRoteiros } from '../../hooks/useAdminRoteiros';
import Spinner from '../../components/ui/Spinner';

const btnPrimario =
  'bg-amber-500 hover:bg-amber-400 text-black font-mono font-semibold uppercase tracking-widest text-xs rounded-lg px-4 py-2 transition-colors flex items-center gap-2';

const btnGhost =
  'text-zinc-500 hover:text-zinc-200 hover:bg-white/5 rounded-lg p-2 transition-colors';

function badgeStatus(status) {
  if (status === 'publicado')
    return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2 py-0.5 text-[10px] font-mono';
  if (status === 'agendado')
    return 'bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full px-2 py-0.5 text-[10px] font-mono';
  return 'bg-zinc-800/80 text-zinc-500 border border-zinc-700/50 rounded-full px-2 py-0.5 text-[10px] font-mono';
}

function formatarData(valor) {
  if (!valor) return '—';
  const d = new Date(valor);
  return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdminRoteirosPage() {
  const { roteiros, carregando, erro, filtroStatus, setFiltroStatus, despublicar, deletar } =
    useAdminRoteiros();

  async function handleDespublicar(id, titulo) {
    if (!window.confirm(`Despublicar "${titulo}"?`)) return;
    await despublicar(id);
  }

  async function handleDeletar(id, titulo) {
    if (!window.confirm(`Deletar permanentemente "${titulo}"?`)) return;
    await deletar(id);
  }

  return (
    <div className="bg-[#050606] min-h-screen p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
            Danuzio History — Admin
          </p>
          <h1 className="text-xl font-semibold text-white mt-0.5">Roteiros</h1>
        </div>
        <Link to="/admin/roteiros/novo" className={btnPrimario}>
          <Plus size={14} />
          Novo roteiro
        </Link>
      </div>

      <div className="flex gap-6 border-b border-amber-500/10">
        {['todos', 'publicado', 'agendado', 'rascunho'].map((status) => (
          <button
            key={status}
            onClick={() => setFiltroStatus(status)}
            className={`font-mono text-xs uppercase tracking-widest pb-3 border-b-2 transition-colors ${
              filtroStatus === status
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {status === 'todos' ? 'Todos' : status}
          </button>
        ))}
      </div>

      {erro && (
        <p className="text-red-400 font-mono text-[12px]">{erro}</p>
      )}

      <div className="bg-[#0d0d0f] border border-amber-500/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#111214] border-b border-amber-500/10">
            <tr>
              {['Título', 'Status', 'Publicação Instagram', 'Portal', 'Ações'].map((col) => (
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
            ) : roteiros.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="text-center py-12 text-zinc-500 font-mono text-[12px]">
                    Nenhum roteiro encontrado.
                  </div>
                </td>
              </tr>
            ) : (
              roteiros.map((roteiro) => (
                <tr key={roteiro.id} className="border-b border-amber-500/5 last:border-0">
                  <td className="px-4 py-3 text-zinc-200 text-[13px]">{roteiro.titulo}</td>
                  <td className="px-4 py-3">
                    <span className={badgeStatus(roteiro.status)}>{roteiro.status}</span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 text-[12px] hidden lg:table-cell">
                    {formatarData(roteiro.publicado_em_instagram ?? roteiro.publicado_em)}
                  </td>
                  <td className="px-4 py-3 text-zinc-500 text-[12px] hidden lg:table-cell">
                    {formatarData(roteiro.disponivel_em)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        to={`/admin/roteiros/${roteiro.id}/editar`}
                        className={btnGhost}
                        title="Editar"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => handleDespublicar(roteiro.id, roteiro.titulo)}
                        className={btnGhost}
                        title="Despublicar"
                      >
                        <EyeOff size={14} />
                      </button>
                      <button
                        onClick={() => handleDeletar(roteiro.id, roteiro.titulo)}
                        className={`${btnGhost} hover:text-red-400`}
                        title="Deletar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
