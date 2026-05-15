import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import Button from '../ui/Button';
import apiClient from '../../utils/apiClient';

export default function DownloadButton({ slug, titulo, className = '' }) {
  const [baixando, setBaixando] = useState(false);
  const [erro, setErro] = useState(null);

  async function handleDownload() {
    setBaixando(true);
    setErro(null);
    try {
      const response = await apiClient.get(`/api/roteiros/${slug}/download`, {
        responseType: 'blob',
      });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${titulo ?? slug}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setErro('Não foi possível baixar o PDF. Tente novamente.');
    } finally {
      setBaixando(false);
    }
  }

  return (
    <div className="flex flex-col items-start">
      <Button
        variante="primario"
        tamanho="lg"
        onClick={handleDownload}
        disabled={baixando}
        className={className}
      >
        {baixando ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <Download size={15} />
        )}
        {baixando ? 'Baixando...' : 'Baixar PDF'}
      </Button>
      {erro && <p className="mt-2 text-[11px] text-red-400">{erro}</p>}
    </div>
  );
}
