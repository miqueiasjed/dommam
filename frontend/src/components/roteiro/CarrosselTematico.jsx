import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import RoteiroCard from './RoteiroCard';

export default function CarrosselTematico({ tema, roteiros }) {
  const scrollRef = useRef(null);

  function scrollPrev() {
    scrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' });
  }

  function scrollNext() {
    scrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' });
  }

  if (!roteiros?.length) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-[14px] font-semibold text-white">{tema}</h2>

      <div className="group/carrossel relative">
        {/* Botão anterior */}
        <button
          onClick={scrollPrev}
          className="absolute left-1 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/70 p-1.5 text-white opacity-0 transition-opacity hover:bg-black/90 group-hover/carrossel:opacity-100"
          aria-label="Anterior"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Container de scroll */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scroll-smooth pb-2 scrollbar-hide"
        >
          {roteiros.map(r => (
            <div key={r.slug} className="w-[140px] sm:w-[160px] flex-shrink-0">
              <RoteiroCard roteiro={r} />
            </div>
          ))}
        </div>

        {/* Botão próximo */}
        <button
          onClick={scrollNext}
          className="absolute right-1 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/70 p-1.5 text-white opacity-0 transition-opacity hover:bg-black/90 group-hover/carrossel:opacity-100"
          aria-label="Próximo"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}
