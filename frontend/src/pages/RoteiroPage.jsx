import { useParams } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';

export default function RoteiroPage() {
  const { slug } = useParams();
  return (
    <AppShell>
      <div className="p-6">
        <p className="text-[12px] text-zinc-500">Roteiro: {slug} — implementado no Plano 8.</p>
      </div>
    </AppShell>
  );
}
