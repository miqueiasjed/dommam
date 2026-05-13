import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 bg-page">
      <h1 className="text-[32px] font-bold text-white">Danuzio History <span className="text-amber-500">Backstage</span></h1>
      <p className="text-[14px] text-zinc-400">Acesse os roteiros antes de todo mundo.</p>
      <Button variante="primario" tamanho="lg" onClick={() => navigate('/login')}>
        Entrar
      </Button>
    </div>
  );
}
