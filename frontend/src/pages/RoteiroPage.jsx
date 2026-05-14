import { useParams, Link } from 'react-router-dom';
import { FileX, AlertCircle } from 'lucide-react';
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
        <div className="overflow-y-auto h-full">
          {/* Hero skeleton */}
          <div className="w-full h-[400px] bg-zinc-800/50 animate-pulse rounded-none" />

          {/* Título skeleton */}
          <div className="h-8 w-2/3 bg-zinc-800/50 animate-pulse rounded mt-8 mx-8" />

          {/* Linhas de texto skeleton */}
          <div className="mx-8 mt-6 flex flex-col gap-3">
            <div className="h-4 w-full bg-zinc-800/50 animate-pulse rounded" />
            <div className="h-4 w-3/4 bg-zinc-800/50 animate-pulse rounded" />
            <div className="h-4 w-1/2 bg-zinc-800/50 animate-pulse rounded" />
          </div>
        </div>
      </AppShell>
    );
  }

  if (erro === 'not_found') {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center py-24 text-center px-8">
          <FileX size={40} className="text-zinc-600 mb-4" />
          <p className="text-white font-semibold text-[18px]">Roteiro não encontrado</p>
          <p className="text-muted text-[13px] mt-2">
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
        <div className="flex flex-col items-center justify-center py-24 text-center px-8">
          <AlertCircle size={40} className="text-zinc-600 mb-4" />
          <p className="text-white font-semibold text-[18px]">Erro ao carregar roteiro</p>
          <p className="text-muted text-[13px] mt-2">
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
      <div className="overflow-y-auto h-full">
        <RoteiroHero
          capa_url={roteiro.capa_url}
          titulo={roteiro.titulo}
          data_publicacao={roteiro.data_publicacao}
          temas={roteiro.temas}
          instagram_url={roteiro.instagram_url}
        />

        <div className="max-w-3xl mx-auto px-8 py-8">
          {/* Botão de download */}
          <div className="mb-8">
            <DownloadButton slug={slug} titulo={roteiro.titulo} />
          </div>

          {/* Sinopse */}
          <div className="prose-custom">
            <h2 className="text-[13px] font-semibold uppercase tracking-widest text-muted mb-4">
              Sinopse
            </h2>
            {roteiro.sinopse?.split('\n\n').map((paragrafo, i) => (
              <p key={i} className="text-zinc-300 text-[14px] leading-relaxed mb-4">
                {paragrafo}
              </p>
            ))}
          </div>
        </div>

        {/* Navegação prev/next */}
        <RoteiroNav
          anterior={roteiro.anterior ?? null}
          proximo={roteiro.proximo ?? null}
        />
      </div>
    </AppShell>
  );
}
