import AppShell from '../components/layout/AppShell';
import EmptyState from '../components/ui/EmptyState';
import { BookOpen } from 'lucide-react';

export default function BibliotecaPage() {
  return (
    <AppShell>
      <div className="p-6">
        <h1 className="mb-6 text-[20px] font-semibold text-white">Biblioteca</h1>
        <EmptyState
          titulo="Nenhum roteiro disponível"
          descricao="Os roteiros aparecerão aqui após o Plano 7 ser implementado."
          icone={BookOpen}
        />
      </div>
    </AppShell>
  );
}
