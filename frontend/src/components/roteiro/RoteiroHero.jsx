import { Calendar, ExternalLink, FileText } from 'lucide-react';

export default function RoteiroHero({ capa_url, titulo, data_publicacao, temas, instagram_url }) {
  const dataFormatada = data_publicacao
    ? new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(data_publicacao))
    : '';

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-[#1e2020] animate-scale-in"
      style={{ minHeight: '380px' }}
    >
      {/* Imagem de fundo */}
      {capa_url ? (
        <img
          src={capa_url}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#111113] text-zinc-800">
          <FileText size={56} />
        </div>
      )}

      {/* Gradiente cinematográfico — começa transparente no topo, escurece pesado embaixo */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050606] via-[#050606]/60 to-[#050606]/10" />
      {/* Gradiente lateral esquerdo sutil para legibilidade do texto */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050606]/40 to-transparent" />

      {/* Conteúdo sobreposto */}
      <div className="relative flex h-full min-h-[380px] flex-col justify-end p-6 sm:p-8 lg:p-10">
        {temas && temas.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2 animate-slide-up" style={{ animationDelay: '80ms' }}>
            {temas.map((tema) => (
              <span
                key={tema}
                className="rounded-full border border-[#bfff3c]/30 bg-[#bfff3c]/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.20em] text-[#bfff3c] backdrop-blur-sm"
              >
                {tema}
              </span>
            ))}
          </div>
        )}

        <h1
          className="max-w-3xl text-[28px] font-black leading-[1.08] tracking-tight text-white sm:text-[36px] lg:text-[42px] animate-slide-up"
          style={{ animationDelay: '140ms' }}
        >
          {titulo}
        </h1>

        <div
          className="mt-4 flex flex-wrap items-center gap-3 animate-slide-up"
          style={{ animationDelay: '200ms' }}
        >
          {dataFormatada && (
            <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-300 backdrop-blur-sm">
              <Calendar size={12} className="text-[#bfff3c]" />
              {dataFormatada}
            </span>
          )}

          {instagram_url && (
            <a
              href={instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-300 backdrop-blur-sm transition-colors hover:border-[#bfff3c]/25 hover:text-white"
            >
              <ExternalLink size={12} className="text-[#bfff3c]" />
              Instagram
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
