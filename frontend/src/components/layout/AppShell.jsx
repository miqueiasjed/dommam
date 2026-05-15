import { LogOut, BookOpen } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function AppShell({ children }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="flex h-screen flex-col bg-[#050606]">
      {/* Fundo global: gradiente radial + grid — igual ao geopolitica */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_0%,rgba(191,255,60,0.10),transparent_28%),radial-gradient(circle_at_96%_34%,rgba(255,91,32,0.09),transparent_24%),linear-gradient(180deg,rgba(7,10,8,0.6),rgba(5,6,6,1))]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex h-14 shrink-0 items-center justify-between border-b border-[rgba(191,255,60,0.10)] bg-[#070808]/95 px-6 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <BookOpen size={18} className="text-[#bfff3c]" />
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-[#bfff3c]/70">
              backstage exclusivo
            </p>
            <p className="text-[13px] font-black leading-none text-white">
              Danuzio History
            </p>
          </div>
        </div>

        {usuario && (
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
              {usuario.email}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-md border border-white/8 bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400 transition-colors hover:border-[#bfff3c]/30 hover:text-[#d7ff69]"
            >
              <LogOut size={12} />
              Sair
            </button>
          </div>
        )}
      </header>

      <main className="relative z-10 flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
