import { ExternalLink } from 'lucide-react';

export default function RoteiroHero({ capa_url, titulo, data_publicacao, temas, instagram_url }) {
  const dataFormatada = data_publicacao
    ? new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(data_publicacao))
    : '';

  return (
    <div className="relative w-full h-[400px] md:h-[45vh] md:min-h-[300px]">
      {/* Imagem de capa ou fallback */}
      {capa_url ? (
        <img
          src={capa_url}
          alt=""
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="w-full h-full bg-zinc-900" />
      )}

      {/* Gradiente inferior */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030406] via-[#030406]/60 to-transparent" />

      {/* Conteúdo no rodapé do hero */}
      <div className="absolute bottom-0 left-0 right-0 p-8">
        {/* Temas */}
        {temas && temas.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {temas.map((tema) => (
              <span
                key={tema}
                className="rounded-full bg-amber-900/30 px-2.5 py-0.5 text-[10px] font-medium text-amber-400"
              >
                {tema}
              </span>
            ))}
          </div>
        )}

        {/* Título */}
        <h1 className="text-white font-bold text-[28px] md:text-[36px] leading-tight">
          {titulo}
        </h1>

        {/* Data */}
        {dataFormatada && (
          <p className="text-muted text-[13px] mt-1">{dataFormatada}</p>
        )}

        {/* Link Instagram */}
        {instagram_url && (
          <a
            href={instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[12px] text-zinc-400 hover:text-white transition-colors mt-3"
          >
            <ExternalLink size={13} />
            Ver no Instagram
          </a>
        )}
      </div>
    </div>
  );
}
