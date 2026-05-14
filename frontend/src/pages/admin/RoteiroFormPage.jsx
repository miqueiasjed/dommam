import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import apiClient from '../../utils/apiClient';
import UploadField from '../../components/admin/UploadField';

const inputClass = 'bg-[#111214] border border-amber-500/15 rounded-lg px-3 py-2 text-[13px] text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 w-full';
const label = 'font-mono text-[10px] uppercase tracking-widest text-zinc-500 block mb-1.5';

function gerarSlug(titulo) {
  return titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function calcularAvailableAt(publishedAt) {
  if (!publishedAt) return '';
  const d = new Date(publishedAt);
  d.setHours(d.getHours() - 1);
  return d.toISOString().slice(0, 16);
}

export default function RoteiroFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [campos, setCampos] = useState({
    titulo: '',
    slug: '',
    sinopse: '',
    temas: [],
    published_at: '',
    available_at: '',
  });
  const [capa, setCapa] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [previewCapa, setPreviewCapa] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);
  const [temaSendoDigitado, setTemaSendoDigitado] = useState('');

  useEffect(() => {
    if (!id) return;
    apiClient.get(`/api/admin/roteiros/${id}`)
      .then(({ data }) => {
        setCampos({
          titulo: data.titulo ?? '',
          slug: data.slug ?? '',
          sinopse: data.sinopse ?? '',
          temas: data.temas ?? [],
          published_at: data.published_at ? data.published_at.slice(0, 16) : '',
          available_at: data.available_at ? data.available_at.slice(0, 16) : '',
        });
        if (data.capa_url) setPreviewCapa(data.capa_url);
      })
      .catch(() => setErro('Erro ao carregar roteiro.'));
  }, [id]);

  function adicionarTema(e) {
    if ((e.key === 'Enter' || e.key === ',') && temaSendoDigitado.trim()) {
      e.preventDefault();
      const tema = temaSendoDigitado.trim().replace(',', '');
      if (tema && !campos.temas.includes(tema)) {
        setCampos(p => ({ ...p, temas: [...p.temas, tema] }));
      }
      setTemaSendoDigitado('');
    }
  }

  function removerTema(tema) {
    setCampos(p => ({ ...p, temas: p.temas.filter(t => t !== tema) }));
  }

  async function salvar(status) {
    setSalvando(true);
    setErro(null);
    try {
      let roteiroId = id;

      if (id) {
        await apiClient.patch(`/api/admin/roteiros/${id}`, { ...campos, status });
      } else {
        const { data } = await apiClient.post('/api/admin/roteiros', { ...campos, status });
        roteiroId = data.id;
      }

      if (capa) {
        const form = new FormData();
        form.append('capa', capa);
        await apiClient.post(`/api/admin/roteiros/${roteiroId}/cover`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      if (pdf) {
        const form = new FormData();
        form.append('pdf', pdf);
        await apiClient.post(`/api/admin/roteiros/${roteiroId}/pdf`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      navigate('/admin/roteiros');
    } catch (e) {
      setErro(e.response?.data?.message ?? 'Erro ao salvar roteiro.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/admin/roteiros" className="text-zinc-500 hover:text-zinc-200 font-mono text-[12px] flex items-center gap-1.5 transition-colors">
          <ArrowLeft size={14} />
          Roteiros
        </Link>
        <span className="text-zinc-700">/</span>
        <span className="font-mono text-[12px] text-zinc-400">{id ? 'Editar roteiro' : 'Novo roteiro'}</span>
      </div>

      {erro && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-[12px]">
          {erro}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-5">
          <div>
            <label className={label}>Título</label>
            <input
              type="text"
              value={campos.titulo}
              onChange={e => setCampos(p => ({ ...p, titulo: e.target.value, slug: gerarSlug(e.target.value) }))}
              placeholder="Título do roteiro"
              className={inputClass}
            />
          </div>

          <div>
            <label className={label}>Slug (URL)</label>
            <input
              type="text"
              value={campos.slug}
              onChange={e => setCampos(p => ({ ...p, slug: e.target.value }))}
              placeholder="slug-do-roteiro"
              className={inputClass}
            />
          </div>

          <div>
            <label className={label}>Sinopse</label>
            <textarea
              rows={4}
              value={campos.sinopse}
              onChange={e => setCampos(p => ({ ...p, sinopse: e.target.value }))}
              placeholder="Breve descrição do roteiro..."
              className={inputClass + ' resize-none'}
            />
          </div>

          <div>
            <label className={label}>Temas</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {campos.temas.map(t => (
                <span key={t} className="bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full px-2.5 py-0.5 text-[11px] font-mono flex items-center gap-1.5">
                  {t}
                  <button type="button" onClick={() => removerTema(t)}>
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={temaSendoDigitado}
              onChange={e => setTemaSendoDigitado(e.target.value)}
              onKeyDown={adicionarTema}
              placeholder="Digite um tema e pressione Enter"
              className={inputClass}
            />
            <p className="text-zinc-600 font-mono text-[10px] mt-1">Pressione Enter ou vírgula para adicionar</p>
          </div>
        </div>

        <div className="lg:w-80 space-y-5">
          <UploadField
            label="Capa"
            accept="image/*"
            arquivo={capa}
            onArquivoChange={setCapa}
            preview={previewCapa}
          />

          <UploadField
            label="PDF do roteiro"
            accept="application/pdf"
            arquivo={pdf}
            onArquivoChange={setPdf}
          />

          <div>
            <label className={label}>Publicação no Instagram</label>
            <input
              type="datetime-local"
              value={campos.published_at}
              onChange={e => setCampos(p => ({ ...p, published_at: e.target.value, available_at: calcularAvailableAt(e.target.value) }))}
              className={inputClass}
            />
          </div>

          <div>
            <label className={label}>Disponível no portal</label>
            <input
              type="datetime-local"
              value={campos.available_at}
              onChange={e => setCampos(p => ({ ...p, available_at: e.target.value }))}
              className={inputClass}
            />
            <p className="text-zinc-600 font-mono text-[10px] mt-1">Auto-calculado: 1h antes do Instagram</p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="button"
              onClick={() => salvar('rascunho')}
              disabled={salvando}
              className="border border-amber-500/20 text-amber-400 hover:bg-amber-500/10 font-mono text-xs uppercase tracking-widest rounded-lg px-4 py-2.5 transition-colors w-full disabled:opacity-50"
            >
              {salvando ? 'Salvando...' : 'Salvar rascunho'}
            </button>
            <button
              type="button"
              onClick={() => { if (window.confirm('Publicar este roteiro?')) salvar('publicado'); }}
              disabled={salvando}
              className="bg-amber-500 hover:bg-amber-400 text-black font-mono font-semibold uppercase tracking-widest text-xs rounded-lg px-4 py-2.5 transition-colors w-full disabled:opacity-50"
            >
              {salvando ? 'Publicando...' : 'Publicar roteiro'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
