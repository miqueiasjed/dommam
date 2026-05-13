import { LogOut, BookOpen } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function AppShell({ children }) {
  const { email, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="flex h-screen flex-col bg-page">
      <header className="flex h-14 items-center justify-between border-b border-zinc-800/80 bg-surface px-6">
        <div className="flex items-center gap-2.5">
          <BookOpen size={20} className="text-amber-500" />
          <span className="text-[14px] font-semibold text-white">Danuzio History</span>
          <span className="rounded-full bg-amber-900/40 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-amber-400">
            Backstage
          </span>
        </div>

        {email && (
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-zinc-500">{email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-zinc-200"
            >
              <LogOut size={13} />
              Sair
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
