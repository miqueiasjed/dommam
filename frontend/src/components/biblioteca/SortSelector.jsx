import { ChevronDown } from 'lucide-react';

export default function SortSelector({ ordenacao, onOrdenacaoChange }) {
  const opcoes = [
    { valor: 'mais_recentes', rotulo: 'Mais recentes' },
    { valor: 'mais_antigos', rotulo: 'Mais antigos' },
    { valor: 'alfabetico_asc', rotulo: 'A → Z' },
    { valor: 'alfabetico_desc', rotulo: 'Z → A' },
  ];

  return (
    <div className="relative w-full sm:w-auto">
      <select
        value={ordenacao}
        onChange={e => onOrdenacaoChange(e.target.value)}
        className="h-12 w-full appearance-none rounded-xl border border-zinc-800 bg-surface py-0 pl-4 pr-10 text-[13px] font-semibold text-zinc-300 outline-none transition-colors focus:border-amber-700/70 sm:w-auto"
      >
        {opcoes.map(o => (
          <option key={o.valor} value={o.valor}>{o.rotulo}</option>
        ))}
      </select>
      <ChevronDown size={15} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" />
    </div>
  );
}
