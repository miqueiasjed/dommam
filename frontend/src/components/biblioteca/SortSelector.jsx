export default function SortSelector({ ordenacao, onOrdenacaoChange }) {
  const opcoes = [
    { valor: 'mais_recentes', rotulo: 'Mais recentes' },
    { valor: 'mais_antigos', rotulo: 'Mais antigos' },
    { valor: 'alfabetico_asc', rotulo: 'A → Z' },
    { valor: 'alfabetico_desc', rotulo: 'Z → A' },
  ];

  return (
    <select
      value={ordenacao}
      onChange={e => onOrdenacaoChange(e.target.value)}
      className="rounded-lg border border-zinc-800 bg-surface px-3 py-1.5 text-[12px] text-zinc-300 focus:border-zinc-700 focus:outline-none"
    >
      {opcoes.map(o => (
        <option key={o.valor} value={o.valor}>{o.rotulo}</option>
      ))}
    </select>
  );
}
