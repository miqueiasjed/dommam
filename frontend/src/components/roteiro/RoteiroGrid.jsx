import { BookOpen } from 'lucide-react';
import EmptyState from '../ui/EmptyState';
import RoteiroCard from '../roteiro/RoteiroCard';

export default function RoteiroGrid({ roteiros, carregando, erro }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
      {carregando && (
        Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[2/3] rounded-lg bg-zinc-800/50 animate-pulse" />
        ))
      )}

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

      {!carregando && !erro && roteiros.length > 0 && (
        roteiros.map((roteiro) => (
          <RoteiroCard key={roteiro.id} roteiro={roteiro} />
        ))
      )}
    </div>
  );
}
