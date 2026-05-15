import { Search, X } from 'lucide-react';

export default function SearchBar({ busca, onBuscaChange }) {
  return (
    <div className="relative w-full max-w-2xl">
      <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
      <input
        type="text"
        value={busca}
        onChange={e => onBuscaChange(e.target.value)}
        placeholder="Buscar roteiros, temas, tipos..."
        className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/80 pl-9 pr-10 text-[13px] text-zinc-100 placeholder-zinc-600 outline-none transition-colors duration-200 focus:border-[#bfff3c]/40 focus:ring-0"
      />
      {busca && (
        <button
          type="button"
          onClick={() => onBuscaChange('')}
          aria-label="Limpar busca"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
