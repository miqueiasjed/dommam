import { useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';

export default function UploadField({ label, accept, arquivo, onArquivoChange, preview }) {
  const inputRef = useRef(null);

  function handleArquivoSelecionado(e) {
    const f = e.target.files?.[0];
    if (f) onArquivoChange(f);
  }

  const ehImagem = accept?.includes('image');

  return (
    <div className="space-y-1.5">
      <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 block">
        {label}
      </label>

      <div
        onClick={() => inputRef.current?.click()}
        className="border border-dashed border-amber-500/20 hover:border-amber-500/40 rounded-xl p-4 cursor-pointer transition-colors bg-[#111214] min-h-[100px] flex flex-col items-center justify-center gap-2"
      >
        {ehImagem && (preview || arquivo) ? (
          <img
            src={arquivo ? URL.createObjectURL(arquivo) : preview}
            alt="Preview"
            className="w-full max-h-32 object-cover rounded-lg"
          />
        ) : arquivo ? (
          <div className="flex items-center gap-2 text-amber-400">
            <FileText size={16} />
            <span className="text-[12px] font-mono truncate max-w-[180px]">{arquivo.name}</span>
          </div>
        ) : (
          <>
            <Upload size={18} className="text-zinc-600" />
            <span className="text-zinc-600 text-[11px] font-mono">Clique para selecionar</span>
          </>
        )}
      </div>

      {(arquivo || preview) && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onArquivoChange(null); }}
          className="text-zinc-600 hover:text-red-400 font-mono text-[10px] uppercase tracking-widest transition-colors flex items-center gap-1"
        >
          <X size={10} />
          Remover
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleArquivoSelecionado}
      />
    </div>
  );
}
