import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, Eye, EyeOff } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';

const API = '/api/admin/usuarios';

const inputStyle =
  'w-full bg-[#111214] border border-amber-500/15 rounded-lg px-3 py-2 text-[13px] text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500/40';

const selectStyle =
  'w-full bg-[#111214] border border-amber-500/15 rounded-lg px-3 py-2 text-[13px] text-zinc-200 focus:outline-none focus:border-amber-500/40';

function badgeRole(role) {
  if (role === 'admin')
    return 'bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full px-2 py-0.5 text-[10px] font-mono';
  return 'bg-zinc-800/80 text-zinc-400 border border-zinc-700/50 rounded-full px-2 py-0.5 text-[10px] font-mono';
}

function badgeAtivo(ativo) {
  if (ativo)
    return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2 py-0.5 text-[10px] font-mono';
  return 'bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full px-2 py-0.5 text-[10px] font-mono';
}

function formatarData(valor) {
  if (!valor) return '—';
  return new Date(valor).toLocaleDateString('pt-BR');
}

const estadoInicialForm = { nome: '', email: '', password: '', role: 'operator' };

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(estadoInicialForm);
  const [errosForm, setErrosForm] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [confirmandoDelete, setConfirmandoDelete] = useState(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      const params = busca ? `?busca=${encodeURIComponent(busca)}` : '';
      const res = await fetch(`${API}${params}`, { credentials: 'include' });
      const json = await res.json();
      if (json.sucesso) setUsuarios(json.dados);
      else setErro(json.mensagem ?? 'Erro ao carregar usuários');
    } catch {
      setErro('Falha de conexão');
    } finally {
      setCarregando(false);
    }
  }, [busca]);

  useEffect(() => {
    const t = setTimeout(carregar, 300);
    return () => clearTimeout(t);
  }, [carregar]);

  function abrirCriar() {
    setEditando(null);
    setForm(estadoInicialForm);
    setErrosForm({});
    setMostrarSenha(false);
    setModalAberto(true);
  }

  function abrirEditar(usuario) {
    setEditando(usuario);
    setForm({ nome: usuario.nome, email: usuario.email, password: '', role: usuario.role });
    setErrosForm({});
    setMostrarSenha(false);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setEditando(null);
  }

  function campo(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrosForm((prev) => ({ ...prev, [name]: undefined }));
  }

  async function salvar(e) {
    e.preventDefault();
    setSalvando(true);
    setErrosForm({});

    const body = { nome: form.nome, email: form.email, role: form.role };
    if (!editando || form.password) body.password = form.password;

    try {
      const url = editando ? `${API}/${editando.id}` : API;
      const method = editando ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();

      if (json.sucesso) {
        fecharModal();
        carregar();
      } else if (res.status === 422 && json.errors) {
        setErrosForm(json.errors);
      } else {
        setErrosForm({ geral: json.mensagem ?? 'Erro ao salvar' });
      }
    } catch {
      setErrosForm({ geral: 'Falha de conexão' });
    } finally {
      setSalvando(false);
    }
  }

  async function toggleAtivo(usuario) {
    try {
      const res = await fetch(`${API}/${usuario.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ativo: !usuario.ativo }),
      });
      const json = await res.json();
      if (json.sucesso) carregar();
    } catch {
      // silencia — o estado não muda
    }
  }

  async function deletar(id) {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });
      const json = await res.json();
      if (json.sucesso) {
        setConfirmandoDelete(null);
        carregar();
      }
    } catch {
      // silencia
    }
  }

  return (
    <div className="bg-[#050606] min-h-screen p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
            Danuzio History — Admin
          </p>
          <h1 className="text-xl font-semibold text-white mt-0.5">Usuários Admin</h1>
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 mt-1">
            Somente administradores têm acesso
          </p>
        </div>
        <button
          onClick={abrirCriar}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-mono text-[11px] uppercase tracking-wider px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={13} />
          Novo usuário
        </button>
      </div>

      {/* Busca */}
      <div className="max-w-xs">
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome ou e-mail…"
          className="w-full bg-[#111214] border border-amber-500/15 rounded-lg px-3 py-1.5 text-[12px] text-zinc-300 font-mono placeholder-zinc-600 focus:outline-none focus:border-amber-500/40"
        />
      </div>

      {erro && <p className="text-red-400 font-mono text-[12px]">{erro}</p>}

      {/* Tabela */}
      <div className="bg-[#0d0d0f] border border-amber-500/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#111214] border-b border-amber-500/10">
            <tr>
              {['Nome', 'E-mail', 'Papel', 'Status', 'Último acesso', 'Ações'].map((col) => (
                <th
                  key={col}
                  className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr>
                <td colSpan={6}>
                  <div className="flex justify-center py-12">
                    <Spinner tamanho={24} />
                  </div>
                </td>
              </tr>
            ) : usuarios.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="text-center py-12 text-zinc-500 font-mono text-[12px]">
                    Nenhum usuário encontrado.
                  </div>
                </td>
              </tr>
            ) : (
              usuarios.map((u) => (
                <tr key={u.id} className="border-b border-amber-500/5 last:border-0">
                  <td className="px-4 py-3 text-zinc-200 text-[13px] font-medium">{u.nome}</td>
                  <td className="px-4 py-3 text-zinc-400 text-[12px] font-mono">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={badgeRole(u.role)}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={badgeAtivo(u.ativo)}>{u.ativo ? 'ativo' : 'inativo'}</span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 text-[12px]">
                    {formatarData(u.ultimo_acesso)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        title={u.ativo ? 'Desativar' : 'Ativar'}
                        onClick={() => toggleAtivo(u)}
                        className="text-zinc-500 hover:text-amber-400 transition-colors"
                      >
                        {u.ativo ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                      </button>
                      <button
                        title="Editar"
                        onClick={() => abrirEditar(u)}
                        className="text-zinc-500 hover:text-amber-400 transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        title="Remover"
                        onClick={() => setConfirmandoDelete(u)}
                        className="text-zinc-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal criar / editar */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md bg-[#0d0d0f] border border-amber-500/15 rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">
                {editando ? 'Editar usuário' : 'Novo usuário admin'}
              </h2>
              <button onClick={fecharModal} className="text-zinc-500 hover:text-zinc-200 transition-colors">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={salvar} className="space-y-4">
              {errosForm.geral && (
                <p className="text-rose-400 text-[12px] font-mono">{errosForm.geral}</p>
              )}

              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  Nome
                </label>
                <input
                  name="nome"
                  value={form.nome}
                  onChange={campo}
                  placeholder="Nome completo"
                  className={inputStyle}
                  required
                />
                {errosForm.nome && (
                  <p className="text-rose-400 text-[11px]">{errosForm.nome[0]}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  E-mail
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={campo}
                  placeholder="email@exemplo.com"
                  className={inputStyle}
                  required
                />
                {errosForm.email && (
                  <p className="text-rose-400 text-[11px]">{errosForm.email[0]}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  Senha {editando && <span className="text-zinc-600">(deixe em branco para manter)</span>}
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={mostrarSenha ? 'text' : 'password'}
                    value={form.password}
                    onChange={campo}
                    placeholder={editando ? '••••••••' : 'Mínimo 8 caracteres'}
                    className={inputStyle + ' pr-9'}
                    required={!editando}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {mostrarSenha ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errosForm.password && (
                  <p className="text-rose-400 text-[11px]">{errosForm.password[0]}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  Papel
                </label>
                <select name="role" value={form.role} onChange={campo} className={selectStyle}>
                  <option value="operator">Operador</option>
                  <option value="admin">Administrador</option>
                </select>
                {errosForm.role && (
                  <p className="text-rose-400 text-[11px]">{errosForm.role[0]}</p>
                )}
                <p className="text-zinc-600 text-[11px] font-mono">
                  Administrador pode criar/editar/remover usuários. Operador só gerencia roteiros.
                </p>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={fecharModal}
                  className="flex-1 border border-zinc-700 text-zinc-400 hover:text-zinc-200 font-mono text-[11px] uppercase tracking-wider py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-mono text-[11px] uppercase tracking-wider py-2 rounded-lg transition-colors"
                >
                  {salvando ? 'Salvando…' : editando ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal confirmar delete */}
      {confirmandoDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm bg-[#0d0d0f] border border-rose-500/20 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h2 className="text-base font-semibold text-white">Remover usuário?</h2>
            <p className="text-zinc-400 text-[13px]">
              <span className="text-zinc-200 font-medium">{confirmandoDelete.nome}</span> será removido
              permanentemente. Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmandoDelete(null)}
                className="flex-1 border border-zinc-700 text-zinc-400 hover:text-zinc-200 font-mono text-[11px] uppercase tracking-wider py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => deletar(confirmandoDelete.id)}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-mono text-[11px] uppercase tracking-wider py-2 rounded-lg transition-colors"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
