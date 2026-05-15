export default function Tag({ children, onClick, ativa = false, className = '' }) {
  const classes = `rounded-full border font-mono text-[10px] uppercase tracking-[0.16em] px-2.5 py-0.5 transition-colors ${
    ativa
      ? 'border-[#bfff3c]/20 bg-[#bfff3c]/10 text-[#bfff3c]'
      : 'border-white/8 bg-white/[0.03] text-zinc-500 hover:border-white/15 hover:text-zinc-300'
  } ${className}`;

  if (!onClick) {
    return <span className={classes}>{children}</span>;
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
