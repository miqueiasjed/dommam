import Spinner from '../components/ui/Spinner';

export default function MagicLinkCallbackPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-page">
      <Spinner tamanho={32} />
      <p className="text-[13px] text-zinc-400">Verificando link...</p>
    </div>
  );
}
