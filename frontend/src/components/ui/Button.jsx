export default function Button({ children, variante = 'primario', tamanho = 'md', onClick, disabled, type = 'button', className = '' }) {
  const base = 'inline-flex items-center gap-1.5 rounded-md font-mono uppercase tracking-[0.14em] transition-colors focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed';

  const variantes = {
    primario:   'border border-[#bfff3c]/40 bg-[#bfff3c]/15 text-[#d7ff69] hover:border-[#bfff3c]/70 hover:bg-[#bfff3c]/25',
    secundario: 'border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white',
    ghost:      'border border-transparent text-zinc-400 hover:border-white/10 hover:bg-white/[0.04] hover:text-zinc-100',
    perigo:     'border border-red-700/50 bg-red-700/20 text-red-400 hover:bg-red-700/30 hover:text-red-300',
  };

  const tamanhos = {
    sm: 'px-2.5 py-1 text-[10px]',
    md: 'px-3 py-1.5 text-[11px]',
    lg: 'px-4 py-2.5 text-[12px]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variantes[variante]} ${tamanhos[tamanho]} ${className}`}
    >
      {children}
    </button>
  );
}
