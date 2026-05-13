import { Search } from 'lucide-react';

export default function SearchBar({ busca, onBuscaChange }) {
  return (
    <div className="relative flex-1 min-w-[180px]">
      <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
      <input
        type="text"
        value={busca}
        onChange={e => onBuscaChange(e.target.value)}
        placeholder="Buscar roteiros..."
        className="w-full rounded-lg border border-zinc-800 bg-surface pl-8 pr-3 py-1.5 text-[12px] text-zinc-300 placeholder:text-zinc-600 focus:border-zinc-700 focus:outline-none"
      />
    </div>
  );
}
