import { BookOpen } from 'lucide-react';
import EmptyState from '../ui/EmptyState';
import RoteiroCard from '../roteiro/RoteiroCard';

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#1e2020] bg-[#111113]">
      <div className="aspect-[16/9] animate-shimmer" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-4/5 rounded animate-shimmer" />
        <div className="h-3 w-full rounded animate-shimmer" style={{ animationDelay: '80ms' }} />
        <div className="h-3 w-2/3 rounded animate-shimmer" style={{ animationDelay: '160ms' }} />
        <div className="flex gap-2 pt-1">
          <div className="h-5 w-20 rounded-full animate-shimmer" style={{ animationDelay: '120ms' }} />
          <div className="h-5 w-14 rounded-full animate-shimmer" style={{ animationDelay: '200ms' }} />
        </div>
      </div>
    </div>
  );
}

export default function RoteiroGrid({ roteiros, carregando, erro }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {carregando && Array.from({ length: 12 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}

      {!carregando && erro && (
        <p className="col-span-full py-12 text-center text-[13px] text-muted">
          Erro ao carregar roteiros. Tente novamente.
        </p>
      )}

      {!carregando && !erro && roteiros.length === 0 && (
        <div className="col-span-full">
          <EmptyState
            titulo="Nenhum roteiro encontrado"
            descricao="Tente ajustar os filtros ou a busca."
            icone={BookOpen}
          />
        </div>
      )}

      {!carregando && !erro && roteiros.length > 0 &&
        roteiros.map((roteiro, i) => (
          <RoteiroCard
            key={roteiro.id}
            roteiro={roteiro}
            style={{ animationDelay: `${Math.min(i * 45, 360)}ms` }}
          />
        ))
      }
    </div>
  );
}
