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
      <div className="flex flex-col h-full">
        {/* Barra de controles sticky */}
        <div className="sticky top-0 z-10 bg-page border-b border-zinc-800/80 px-6 py-3 space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <SearchBar busca={busca} onBuscaChange={setBusca} />
            <SortSelector ordenacao={ordenacao} onOrdenacaoChange={setOrdenacao} />
          </div>
          <FilterBar filtros={filtros} onFiltrosChange={setFiltros} roteiros={roteiros} />
        </div>

        {/* Grid de roteiros */}
        <div className="flex-1 overflow-auto px-6 py-6">
          <RoteiroGrid roteiros={roteiros} carregando={carregando} erro={erro} />
        </div>
      </div>
    </AppShell>
  );
}
