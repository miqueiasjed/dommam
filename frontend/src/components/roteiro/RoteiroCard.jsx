import { useNavigate } from 'react-router-dom';
import { Calendar, Eye, FileText, ArrowRight } from 'lucide-react';

export default function RoteiroCard({ roteiro, style }) {
  const navigate = useNavigate();
  const { slug, titulo, sinopse, cover_image_url, publicado_em, tema, tipo } = roteiro;

  const dataFormatada = publicado_em
    ? new Date(publicado_em).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
    : '';

  return (
    <article
      style={style}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-[#1e2020] bg-[#111113] shadow-[0_0_0_1px_rgba(255,255,255,0.02)] animate-slide-up transition-colors duration-200 hover:border-[#bfff3c]/30"
      onClick={() => navigate(`/roteiro/${slug}`)}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-zinc-900/60">
        {cover_image_url ? (
          <img
            src={cover_image_url}
            alt={titulo}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-700">
            <FileText size={34} />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="flex items-center gap-2 rounded-full border border-[#bfff3c]/40 bg-[#bfff3c]/15 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#d7ff69] backdrop-blur-sm">
            <Eye size={12} />
            Ver roteiro
          </span>
        </div>

        {dataFormatada && (
          <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.10em] text-zinc-400 backdrop-blur transition-opacity duration-300 group-hover:opacity-0">
            <Calendar size={10} />
            {dataFormatada}
          </span>
        )}
      </div>

      <div className="space-y-3 p-4">
        <div>
          <h2 className="text-[14px] font-bold leading-tight text-white line-clamp-1">
            {titulo}
          </h2>
          {sinopse && (
            <p className="mt-2 min-h-10 text-[12px] leading-5 text-zinc-500 line-clamp-2">
              {sinopse}
            </p>
          )}
        </div>

        <div className="flex min-h-6 flex-wrap gap-2">
          {tema && (
            <span className="rounded-full border border-[#bfff3c]/20 bg-[#bfff3c]/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#bfff3c]">
              {tema}
            </span>
          )}
          {tipo && (
            <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
              {tipo}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/5 pt-3 text-[12px] font-semibold text-zinc-600">
          <span className="inline-flex items-center gap-1.5 transition-colors duration-200 group-hover:text-[#bfff3c]">
            <Eye size={13} />
            Ver roteiro
          </span>
          <ArrowRight
            size={13}
            className="transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#bfff3c]"
          />
        </div>
      </div>
    </article>
  );
}
