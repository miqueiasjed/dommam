import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FileText, Users, Activity, LogOut, ArrowLeft, Menu, X, ShieldUser } from 'lucide-react';
import { useAdminAuth } from '../../hooks/useAdminAuth';

const itens = [
  { label: 'Roteiros', rota: '/admin/roteiros', icone: FileText },
  { label: 'Assinantes', rota: '/admin/assinantes', icone: Users },
  { label: 'Usuários', rota: '/admin/usuarios', icone: ShieldUser },
  { label: 'Audit Log', rota: '/admin/audit-log', icone: Activity },
];

export default function AdminLayout() {
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const { logoutAdmin } = useAdminAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logoutAdmin();
    navigate('/admin/login', { replace: true });
  }

  return (
    <div className="flex min-h-screen admin-bg text-zinc-100 overflow-auto">
      {/* Overlay mobile */}
      {sidebarAberta && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={() => setSidebarAberta(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 flex w-56 shrink-0 flex-col border-r border-amber-500/10 bg-[#0d0d0f] transition-transform duration-200 lg:static lg:translate-x-0 ${sidebarAberta ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-amber-500/60">
              Danuzio History
            </p>
            <NavLink
              to="/admin/roteiros"
              className="mt-0.5 block font-semibold text-amber-400 hover:text-amber-300 transition-colors"
            >
              Admin
            </NavLink>
          </div>
          <button
            className="lg:hidden text-zinc-500 hover:text-zinc-200"
            onClick={() => setSidebarAberta(false)}
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-0.5 px-3">
          {itens.map(({ label, rota, icone: Icone }) => (
            <NavLink
              key={rota}
              to={rota}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-md px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] transition-colors ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'text-zinc-500 hover:bg-white/4 hover:text-zinc-200'
                }`
              }
            >
              <Icone size={14} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer sidebar */}
        <div className="flex flex-col gap-0.5 border-t border-amber-500/10 px-3 py-4">
          <NavLink
            to="/biblioteca"
            className="flex items-center gap-2 rounded-md px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] text-zinc-500 transition-colors hover:bg-white/4 hover:text-zinc-200"
          >
            <ArrowLeft size={14} />
            Voltar ao portal
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-md px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] text-zinc-500 transition-colors hover:bg-white/4 hover:text-zinc-200"
          >
            <LogOut size={14} />
            Sair
          </button>
        </div>
      </aside>

      {/* Área principal */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Topbar mobile */}
        <header className="flex items-center gap-3 border-b border-amber-500/10 bg-[#0d0d0f] px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarAberta(true)}
            className="text-zinc-500 hover:text-zinc-200 transition-colors"
          >
            <Menu size={18} />
          </button>
          <span className="font-mono text-[11px] uppercase tracking-widest text-amber-400">
            Admin
          </span>
        </header>

        {/* Conteúdo da rota */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
