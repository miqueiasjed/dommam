export default function Button({ children, variante = 'primario', tamanho = 'md', onClick, disabled, type = 'button', className = '' }) {
  const base = 'inline-flex items-center gap-1.5 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantes = {
    primario: 'bg-amber-600 text-white hover:bg-amber-500',
    secundario: 'border border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:text-white',
    ghost: 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200',
    perigo: 'bg-red-700 text-white hover:bg-red-600',
  };

  const tamanhos = {
    sm: 'px-2.5 py-1 text-[11px]',
    md: 'px-3 py-1.5 text-[12px]',
    lg: 'px-4 py-2 text-[13px]',
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
