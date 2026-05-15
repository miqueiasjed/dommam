import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function RoteiroNav({ anterior, proximo }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {anterior ? (
        <Link
          to={`/roteiro/${anterior.slug}`}
          className="group flex min-h-20 flex-col justify-between rounded-xl border border-[#1e2020] bg-[#111113] p-4 transition-colors duration-200 hover:border-[#bfff3c]/25"
        >
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600 transition-colors group-hover:text-[#bfff3c]/70">
            <ArrowLeft size={12} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
            Roteiro anterior
          </span>
          <span className="text-[13px] font-semibold leading-snug text-zinc-300 line-clamp-2 transition-colors group-hover:text-white">
            {anterior.titulo}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}

      {proximo ? (
        <Link
          to={`/roteiro/${proximo.slug}`}
          className="group flex min-h-20 flex-col items-end justify-between rounded-xl border border-[#1e2020] bg-[#111113] p-4 text-right transition-colors duration-200 hover:border-[#bfff3c]/25"
        >
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600 transition-colors group-hover:text-[#bfff3c]/70">
            Próximo roteiro
            <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
          <span className="text-[13px] font-semibold leading-snug text-zinc-300 line-clamp-2 transition-colors group-hover:text-white">
            {proximo.titulo}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
    </div>
  );
}
