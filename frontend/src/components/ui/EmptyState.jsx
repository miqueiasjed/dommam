import { Inbox } from 'lucide-react';

export default function EmptyState({ titulo = 'Nenhum item encontrado', descricao, acao, icone: Icone = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <Icone size={40} className="text-zinc-600" />
      <div>
        <p className="text-[14px] font-medium text-zinc-300">{titulo}</p>
        {descricao && <p className="mt-1 text-[12px] text-zinc-500">{descricao}</p>}
      </div>
      {acao}
    </div>
  );
}
