import { X } from 'lucide-react';
import Button from '../ui/Button';

export default function FilterBar({ filtros, onFiltrosChange, roteiros }) {
  const meses = [...new Set(roteiros.map(r => r.publicado_em?.slice(0, 7)).filter(Boolean))].sort().reverse();
  const temas = [...new Set(roteiros.flatMap(r => r.tema ? [r.tema] : []))].sort();
  const tipos = ['Bastidor', 'Evento histórico', 'Personagem'];

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
    <div className="flex flex-wrap items-center gap-2">
      {/* Filtro mês */}
      <select
        value={filtros.mes}
        onChange={e => onFiltrosChange({ ...filtros, mes: e.target.value })}
        className="rounded-lg border border-zinc-800 bg-surface px-2.5 py-1 text-[11px] text-zinc-300 focus:border-zinc-700 focus:outline-none"
      >
        <option value="">Todos os meses</option>
        {meses.map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      {/* Tags de tema */}
      {temas.map(tema => (
        <button
          key={tema}
          onClick={() => toggleTema(tema)}
          className={`rounded-full px-3 py-0.5 text-[11px] font-medium transition-colors border ${
            filtros.temas.includes(tema)
              ? 'bg-amber-600 border-amber-600 text-white'
              : 'border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
          }`}
        >
          {tema}
        </button>
      ))}

      {/* Filtro tipo */}
      <select
        value={filtros.tipo}
        onChange={e => onFiltrosChange({ ...filtros, tipo: e.target.value })}
        className="rounded-lg border border-zinc-800 bg-surface px-2.5 py-1 text-[11px] text-zinc-300 focus:border-zinc-700 focus:outline-none"
      >
        <option value="">Todos os tipos</option>
        {tipos.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      {/* Limpar filtros */}
      {filtroAtivo && (
        <Button variante="ghost" tamanho="sm" onClick={limpar}>
          <X size={12} />
          Limpar filtros
        </Button>
      )}
    </div>
  );
}
