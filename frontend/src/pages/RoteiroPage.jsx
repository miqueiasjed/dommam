import { useParams, Link } from 'react-router-dom';
import { FileX, AlertCircle, ArrowLeft, Calendar, FileText, Sparkles } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import { useRoteiro } from '../hooks/useRoteiro';
import RoteiroHero from '../components/roteiro/RoteiroHero';
import RoteiroNav from '../components/roteiro/RoteiroNav';
import DownloadButton from '../components/roteiro/DownloadButton';
import Button from '../components/ui/Button';

export default function RoteiroPage() {
  const { slug } = useParams();
  const { roteiro, carregando, erro } = useRoteiro(slug);

  if (carregando) {
    return (
      <AppShell>
        <div className="min-h-full px-4 py-6 sm:px-6 lg:px-8 animate-fade-in">
          <div className="mx-auto max-w-5xl">
            <div className="mb-5 h-7 w-24 rounded animate-shimmer" />
            {/* banner skeleton */}
            <div className="rounded-2xl border border-[#1e2020] animate-shimmer" style={{ minHeight: '380px' }} />
            {/* content skeleton */}
            <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div className="rounded-2xl border border-[#1e2020] bg-[#111113] p-6 space-y-3">
                <div className="h-4 w-full rounded animate-shimmer" />
                <div className="h-4 w-5/6 rounded animate-shimmer" style={{ animationDelay: '80ms' }} />
                <div className="h-4 w-3/4 rounded animate-shimmer" style={{ animationDelay: '160ms' }} />
                <div className="h-4 w-full rounded animate-shimmer" style={{ animationDelay: '120ms' }} />
                <div className="h-4 w-2/3 rounded animate-shimmer" style={{ animationDelay: '200ms' }} />
              </div>
              <div className="space-y-4">
                <div className="h-36 rounded-2xl border border-[#1e2020] animate-shimmer" />
                <div className="h-32 rounded-2xl border border-[#1e2020] animate-shimmer" style={{ animationDelay: '120ms' }} />
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  if (erro === 'not_found') {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center py-24 text-center px-8 animate-fade-in">
          <FileX size={36} className="text-zinc-700 mb-4" />
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-600 mb-2">404</p>
          <p className="text-white font-bold text-[18px]">Roteiro não encontrado</p>
          <p className="text-zinc-500 text-[13px] mt-2">
            O roteiro que você procura não existe ou foi removido.
          </p>
          <div className="mt-6">
            <Link to="/biblioteca">
              <Button variante="secundario">← Voltar para a biblioteca</Button>
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  if (erro) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center py-24 text-center px-8 animate-fade-in">
          <AlertCircle size={36} className="text-zinc-700 mb-4" />
          <p className="text-white font-bold text-[18px]">Erro ao carregar roteiro</p>
          <p className="text-zinc-500 text-[13px] mt-2">
            Não foi possível carregar este roteiro. Verifique sua conexão e tente novamente.
          </p>
          <div className="mt-6">
            <Button variante="secundario" onClick={() => window.location.reload()}>
              Tentar novamente
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="min-h-full px-4 py-6 sm:px-6 lg:px-8 animate-fade-in">
        <div className="mx-auto max-w-5xl">

          {/* Breadcrumb */}
          <Link
            to="/biblioteca"
            className="group mb-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-600 transition-colors hover:text-zinc-200 animate-slide-in-left"
          >
            <ArrowLeft size={12} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
            Biblioteca
          </Link>

          {/* Banner hero - largura total, título sobreposto */}
          <RoteiroHero
            capa_url={roteiro.capa_url}
            titulo={roteiro.titulo}
            data_publicacao={roteiro.data_publicacao}
            temas={roteiro.temas}
            instagram_url={roteiro.instagram_url}
          />

          {/* Conteúdo + Aside — grid único, coerente */}
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">

            {/* Sinopse */}
            <article
              className="rounded-2xl border border-[#1e2020] bg-[#111113] p-6 sm:p-8 animate-slide-up"
              style={{ animationDelay: '180ms' }}
            >
              <div className="mb-6 flex items-center gap-3 border-b border-white/5 pb-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#bfff3c]/20 bg-[#bfff3c]/10 text-[#bfff3c]">
                  <FileText size={15} />
                </span>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-600">Conteúdo</p>
                  <h2 className="text-[16px] font-black text-white">Sinopse</h2>
                </div>
              </div>

              <div>
                {roteiro.sinopse?.split('\n\n').filter(Boolean).map((paragrafo, i) => (
                  <p
                    key={i}
                    className="mb-5 text-[14px] leading-8 text-zinc-400 last:mb-0 animate-slide-up"
                    style={{ animationDelay: `${260 + i * 55}ms` }}
                  >
                    {paragrafo}
                  </p>
                ))}
              </div>
            </article>

            {/* Aside */}
            <aside
              className="space-y-4 lg:sticky lg:top-6 animate-slide-in-right"
              style={{ animationDelay: '220ms' }}
            >
              {/* Download */}
              <div className="rounded-2xl border border-[#1e2020] bg-[#111113] p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-600">Ações</p>
                <h2 className="mb-4 mt-1 text-[15px] font-black text-white">Material</h2>
                <DownloadButton slug={slug} titulo={roteiro.titulo} className="w-full justify-center" />
              </div>

              {/* Detalhes */}
              <div className="rounded-2xl border border-[#1e2020] bg-[#111113] p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-600">Detalhes</p>
                <dl className="mt-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar size={14} className="mt-0.5 shrink-0 text-[#bfff3c]" />
                    <div>
                      <dt className="text-[12px] font-semibold text-zinc-300">Publicação</dt>
                      <dd className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.10em] text-zinc-600">
                        {roteiro.data_publicacao
                          ? new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(roteiro.data_publicacao))
                          : 'Sem data'}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Sparkles size={14} className="mt-0.5 shrink-0 text-[#bfff3c]" />
                    <div>
                      <dt className="text-[12px] font-semibold text-zinc-300">Formato</dt>
                      <dd className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.10em] text-zinc-600">PDF com marca d'água</dd>
                    </div>
                  </div>
                </dl>
              </div>
            </aside>
          </div>

          {/* Navegação prev/next */}
          <div className="mt-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <RoteiroNav
              anterior={roteiro.anterior ?? null}
              proximo={roteiro.proximo ?? null}
            />
          </div>

        </div>
      </div>
    </AppShell>
  );
}
