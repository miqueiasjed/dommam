import { X } from 'lucide-react';

const btnBase = 'rounded-md border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-all duration-200';
const btnAtivo = `${btnBase} border-[#bfff3c]/35 bg-[#bfff3c]/10 text-white shadow-[0_0_16px_rgba(191,255,60,0.08)]`;
const btnInativo = `${btnBase} border-transparent text-zinc-400 hover:border-white/10 hover:bg-white/[0.04] hover:text-zinc-100`;

const selectClass = 'rounded-md border border-zinc-800 bg-zinc-900/80 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-400 outline-none transition-colors duration-200 hover:border-zinc-700 hover:text-zinc-200 focus:border-[#bfff3c]/30 cursor-pointer';

export default function FilterBar({ filtros, onFiltrosChange, roteiros }) {
  const meses = [...new Set(roteiros.map(r => r.publicado_em?.slice(0, 7)).filter(Boolean))].sort().reverse();
  const temas = [...new Set(roteiros.flatMap(r => r.tema ? [r.tema] : []))].sort();

  const filtroAtivo = filtros.mes || filtros.temas.length > 0 || filtros.tipo;

  function toggleTema(tema) {
    const novos = filtros.temas.includes(tema)
      ? filtros.temas.filter(t => t !== tema)
      : [...filtros.temas, tema];
    onFiltrosChange({ ...filtros, temas: novos });
  }

  function limpar() {
    onFiltrosChange({ mes: '', temas: [], tipo: '' });
  }

  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      <div className="flex min-w-max flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={limpar}
          className={!filtroAtivo ? btnAtivo : btnInativo}
        >
          Todos
        </button>

        {temas.map(tema => (
          <button
            key={tema}
            type="button"
            onClick={() => toggleTema(tema)}
            className={filtros.temas.includes(tema) ? btnAtivo : btnInativo}
          >
            {tema}
          </button>
        ))}

        <select
          value={filtros.tipo}
          onChange={e => onFiltrosChange({ ...filtros, tipo: e.target.value })}
          aria-label="Filtrar por tipo"
          className={selectClass}
        >
          <option value="">Tipo</option>
          <option value="Bastidor">Bastidor</option>
          <option value="Evento histórico">Evento histórico</option>
          <option value="Personagem">Personagem</option>
        </select>

        <select
          value={filtros.mes}
          onChange={e => onFiltrosChange({ ...filtros, mes: e.target.value })}
          aria-label="Filtrar por mês"
          className={selectClass}
        >
          <option value="">Todos os meses</option>
          {meses.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        {filtroAtivo && (
          <button
            type="button"
            onClick={limpar}
            className="flex items-center gap-1.5 rounded-md border border-zinc-700 bg-transparent px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200 animate-fade-in"
          >
            <X size={11} />
            Limpar
          </button>
        )}
      </div>
    </div>
  );
}
