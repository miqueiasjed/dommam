export default function Badge({ children, cor = 'padrao', className = '' }) {
  const cores = {
    padrao: 'bg-zinc-800/80 text-zinc-400',
    dourado: 'bg-amber-900/40 text-amber-400',
    verde: 'bg-emerald-900/40 text-emerald-400',
    vermelho: 'bg-red-900/40 text-red-400',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${cores[cor]} ${className}`}>
      {children}
    </span>
  );
}
