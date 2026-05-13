import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Tag from '../ui/Tag';
import { Eye } from 'lucide-react';

export default function RoteiroCard({ roteiro }) {
  const navigate = useNavigate();
  const { slug, titulo, sinopse, cover_image_url, publicado_em, tema } = roteiro;

  const dataFormatada = publicado_em
    ? new Date(publicado_em).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
    : '';

  return (
    <div
      className="group relative aspect-[2/3] overflow-hidden rounded-lg cursor-pointer bg-zinc-900"
      onClick={() => navigate(`/roteiro/${slug}`)}
    >
      {/* Imagem de capa */}
      {cover_image_url ? (
        <img
          src={cover_image_url}
          alt={titulo}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 bg-zinc-800" />
      )}

      {/* Overlay de hover — desktop */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:flex">
        {tema && (
          <Tag ativa className="mb-2 self-start">
            {tema}
          </Tag>
        )}
        <p className="mb-0.5 text-[13px] font-semibold text-white line-clamp-2">{titulo}</p>
        <p className="mb-2 text-[11px] text-muted">{dataFormatada}</p>
        {sinopse && <p className="mb-3 text-[11px] text-zinc-400 line-clamp-2">{sinopse}</p>}
        <Button variante="primario" tamanho="sm" className="self-start">
          <Eye size={12} />
          Ver roteiro
        </Button>
      </div>

      {/* Rodapé fixo — mobile (sempre visível) */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 sm:hidden">
        <p className="text-[11px] font-medium text-white line-clamp-1">{titulo}</p>
        {tema && <span className="text-[9px] text-amber-400">{tema}</span>}
      </div>
    </div>
  );
}
