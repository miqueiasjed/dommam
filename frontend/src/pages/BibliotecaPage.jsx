import AppShell from '../components/layout/AppShell';
import { useRoteiros } from '../hooks/useRoteiros';
import SearchBar from '../components/biblioteca/SearchBar';
import SortSelector from '../components/biblioteca/SortSelector';
import FilterBar from '../components/biblioteca/FilterBar';
import RoteiroGrid from '../components/roteiro/RoteiroGrid';

export default function BibliotecaPage() {
  const {
    roteiros,
    carregando,
    erro,
    filtros,
    setFiltros,
    busca,
    setBusca,
    ordenacao,
    setOrdenacao,
  } = useRoteiros();

  return (
    <AppShell>
      <div className="flex min-h-full flex-col px-4 py-6 sm:px-6 lg:px-8 animate-fade-in">
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col">

          {/* Cabeçalho */}
          <div className="mb-6 animate-slide-up" style={{ animationDelay: '40ms' }}>
            <p className="font-mono text-[10px] uppercase tracking-[0.30em] text-[#bfff3c]/70">
              Biblioteca
            </p>
            <h1 className="mt-1 text-[22px] font-black leading-tight text-white">
              Explorar roteiros
            </h1>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">
              {carregando ? 'Carregando...' : `${roteiros.length} roteiros encontrados`}
            </p>
          </div>

          {/* Barra de busca + ordenação */}
          <div
            className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center animate-slide-up"
            style={{ animationDelay: '90ms' }}
          >
            <SearchBar busca={busca} onBuscaChange={setBusca} />
            <div className="shrink-0">
              <SortSelector ordenacao={ordenacao} onOrdenacaoChange={setOrdenacao} />
            </div>
          </div>

          {/* Filtros */}
          <div className="mb-6 animate-slide-up" style={{ animationDelay: '140ms' }}>
            <FilterBar filtros={filtros} onFiltrosChange={setFiltros} roteiros={roteiros} />
          </div>

          {/* Grid */}
          <div className="flex-1">
            <RoteiroGrid roteiros={roteiros} carregando={carregando} erro={erro} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
