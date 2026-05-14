import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function RoteiroNav({ anterior, proximo }) {
  return (
    <div className="flex items-center justify-between px-8 py-6 border-t border-zinc-800/80">
      {/* Lado esquerdo — roteiro anterior */}
      {anterior ? (
        <Link
          to={`/roteiro/${anterior.slug}`}
          className="flex flex-col gap-1 text-muted hover:text-white transition-colors max-w-[45%]"
        >
          <span className="flex items-center gap-1 text-[11px]">
            <ArrowLeft size={13} />
            Roteiro anterior
          </span>
          <span className="text-zinc-300 text-[13px] font-medium line-clamp-1">
            {anterior.titulo}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {/* Lado direito — próximo roteiro */}
      {proximo ? (
        <Link
          to={`/roteiro/${proximo.slug}`}
          className="flex flex-col items-end gap-1 text-muted hover:text-white transition-colors max-w-[45%]"
        >
          <span className="flex items-center gap-1 text-[11px]">
            Próximo roteiro
            <ArrowRight size={13} />
          </span>
          <span className="text-zinc-300 text-[13px] font-medium line-clamp-1 text-right">
            {proximo.titulo}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
