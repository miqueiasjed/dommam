import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, FileText, Library } from 'lucide-react';
import Button from '../components/ui/Button';

const TOUR_KEY = 'danuzio_tour_concluido';

const slides = [
  {
    icone: BookOpen,
    titulo: 'Bem-vindo ao Backstage',
    descricao: 'Acesse os roteiros completos do @danuzio_history com 1 hora de antecedência, antes de qualquer pessoa.',
  },
  {
    icone: FileText,
    titulo: 'Roteiros em PDF',
    descricao: "Baixe os roteiros em PDF com marca d'água personalizada. Salve para assistir offline quando quiser.",
  },
  {
    icone: Library,
    titulo: 'Sua biblioteca',
    descricao: 'Todos os episódios organizados por tema e data. Use os filtros para encontrar o que procura.',
  },
];

export default function WelcomeTourPage() {
  const [slideAtual, setSlideAtual] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem(TOUR_KEY)) {
      navigate('/biblioteca', { replace: true });
    }
  }, [navigate]);

  function concluir() {
    localStorage.setItem(TOUR_KEY, '1');
    navigate('/biblioteca', { replace: true });
  }

  function avancar() {
    if (slideAtual < slides.length - 1) {
      setSlideAtual(slideAtual + 1);
    } else {
      concluir();
    }
  }

  const slide = slides[slideAtual];
  const Icone = slide.icone;
  const isUltimoSlide = slideAtual === slides.length - 1;

  return (
    <div className="h-screen bg-page flex flex-col items-center justify-center relative">
      {/* Pular tour */}
      <button
        onClick={concluir}
        className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-200 text-[13px] transition-colors"
      >
        Pular tour
      </button>

      {/* Conteúdo do slide */}
      <div className="max-w-md w-full px-8 text-center">
        {/* Ícone */}
        <div className="flex justify-center mb-6">
          <Icone size={48} className="text-amber-500" />
        </div>

        {/* Título */}
        <h1 className="text-white font-semibold text-[20px] mt-6 mb-3">
          {slide.titulo}
        </h1>

        {/* Descrição */}
        <p className="text-muted text-[14px] leading-relaxed mb-10">
          {slide.descricao}
        </p>

        {/* Dots de navegação */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${i === slideAtual ? 'bg-amber-500' : 'bg-zinc-700'}`}
            />
          ))}
        </div>

        {/* Botão de ação */}
        <Button
          variante="primario"
          tamanho="lg"
          onClick={avancar}
          className="w-full justify-center"
        >
          {isUltimoSlide ? 'Começar' : 'Próximo'}
        </Button>
      </div>
    </div>
  );
}
