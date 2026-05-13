export default function Tag({ children, onClick, ativa = false, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-colors ${
        ativa
          ? 'bg-amber-600 text-white'
          : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700/80 hover:text-zinc-200'
      } ${className}`}
    >
      {children}
    </button>
  );
}
