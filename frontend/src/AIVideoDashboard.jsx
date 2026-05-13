import React, { useState } from 'react';
import {
  Search, Bell, Compass, Heart, Folder, Lightbulb, PlaySquare,
  ChevronDown, Settings2, Play, Bookmark, Copy, Plus,
  ArrowLeft, Eye, Users, ArrowRight, TrendingUp, Share2,
  Volume2, Maximize2, Star, Filter, Clock,
} from 'lucide-react';

const videos = [
  // Guerra
  {
    title: 'Desembarque na Normandia',
    category: 'Guerra',
    img: 'https://image.pollinations.ai/prompt/cinematic%20astronaut%20standing%20on%20alien%20planet%20with%20huge%20crescent%20planet%20in%20sky%2C%20dark%20mountains%2C%20epic%20sci-fi%20lighting%2C%20film%20still?width=640&height=420&nologo=true&seed=12',
    duration: '0:08',
    tags: ['Guerra', 'Épico'],
    views: '234K',
    likes: '178K',
    shares: '42K',
    description: 'Reconstrução épica do Dia D em 6 de junho de 1944, quando as forças Aliadas invadiram as praias da Normandia para libertar a Europa ocupada pelo nazismo.',
  },
  {
    title: 'Batalha de Stalingrado',
    category: 'Guerra',
    img: 'https://image.pollinations.ai/prompt/close%20portrait%20of%20a%20cyberpunk%20woman%20with%20neural%20implants%2C%20golden%20rim%20light%2C%20cinematic%2C%20ultra%20detailed?width=640&height=420&nologo=true&seed=22',
    duration: '0:07',
    tags: ['Guerra', 'Cinemático'],
    views: '198K',
    likes: '145K',
    shares: '31K',
    description: 'A batalha mais sangrenta da Segunda Guerra Mundial, travada entre 1942 e 1943 nas ruínas de Stalingrado, marcou a virada decisiva contra as forças nazistas.',
  },
  {
    title: 'Trincheiras da Grande Guerra',
    category: 'Guerra',
    img: 'https://image.pollinations.ai/prompt/japanese%20temple%20beside%20a%20lake%20in%20autumn%2C%20red%20maple%20trees%2C%20misty%20mountains%2C%20cinematic%20landscape?width=640&height=420&nologo=true&seed=32',
    duration: '0:06',
    tags: ['Guerra', 'Histórico'],
    views: '156K',
    likes: '112K',
    shares: '24K',
    description: 'A vida brutal nas trincheiras da Primeira Guerra Mundial, onde milhões de soldados viveram e morreram em condições desumanas nas frentes da Europa.',
  },
  {
    title: 'A Queda de Berlim',
    category: 'Guerra',
    img: 'https://image.pollinations.ai/prompt/cute%20small%20chef%20robot%20serving%20food%20in%20warm%20restaurant%2C%203d%20animation%20film%20still?width=640&height=420&nologo=true&seed=42',
    duration: '0:06',
    tags: ['Guerra', 'Dramático'],
    views: '143K',
    likes: '98K',
    shares: '19K',
    description: 'Os últimos dias da Segunda Guerra Mundial na Europa, com a tomada de Berlim pelo Exército Vermelho e o fim do Terceiro Reich em abril de 1945.',
  },
  // História
  {
    title: 'Gladiadores de Roma',
    category: 'História',
    img: 'https://image.pollinations.ai/prompt/stormy%20ocean%20with%20lighthouse%2C%20dramatic%20clouds%2C%20dark%20cinematic%20realistic%20film%20still?width=640&height=420&nologo=true&seed=52',
    duration: '0:07',
    tags: ['História', 'Épico'],
    views: '312K',
    likes: '241K',
    shares: '58K',
    description: 'Os jogos gladiatórios no Coliseu de Roma, onde escravos e guerreiros lutavam pela vida diante de 80 mil espectadores na maior arena do mundo antigo.',
  },
  {
    title: 'O Faraó e o Nilo',
    category: 'História',
    img: 'https://image.pollinations.ai/prompt/astronaut%20watching%20a%20purple%20galaxy%20portal%20in%20deep%20space%2C%20surreal%20cinematic%20wide%20shot?width=640&height=420&nologo=true&seed=62',
    duration: '0:08',
    tags: ['História', 'Cinemático'],
    views: '287K',
    likes: '198K',
    shares: '47K',
    description: 'O esplendor do Egito Antigo às margens do Nilo, civilização que por mais de 3000 anos construiu monumentos que desafiam o tempo e a razão humana.',
  },
  {
    title: 'As Cruzadas',
    category: 'História',
    img: 'https://image.pollinations.ai/prompt/neon%20rainy%20cyberpunk%20street%20at%20night%2C%20lone%20person%2C%20reflections%2C%20cinematic%20futuristic?width=640&height=420&nologo=true&seed=72',
    duration: '0:07',
    tags: ['História', 'Medieval'],
    views: '198K',
    likes: '143K',
    shares: '32K',
    description: 'As guerras santas medievais que por dois séculos enviaram exércitos cristãos à Terra Santa, redesenhando o mapa da Europa e do Oriente Médio.',
  },
  {
    title: 'Revolução Francesa',
    category: 'História',
    img: 'https://image.pollinations.ai/prompt/floating%20fantasy%20island%20above%20clouds%20with%20ancient%20towers%2C%20surreal%20cinematic%20matte%20painting?width=640&height=420&nologo=true&seed=82',
    duration: '0:06',
    tags: ['História', 'Épico'],
    views: '176K',
    likes: '124K',
    shares: '28K',
    description: 'A revolução de 1789 que derrubou a monarquia francesa, decapitou o rei e lançou ao mundo os ideais de Liberdade, Igualdade e Fraternidade.',
  },
  // Brasil
  {
    title: 'Amazônia Eterna',
    category: 'Brasil',
    img: 'https://image.pollinations.ai/prompt/futuristic%20sports%20car%20speeding%20through%20neon%20city%2C%20motion%20blur%2C%20cinematic%20red%20and%20blue%20lighting?width=640&height=420&nologo=true&seed=92',
    duration: '0:08',
    tags: ['Brasil', 'Natureza'],
    views: '421K',
    likes: '356K',
    shares: '89K',
    description: 'A maior floresta tropical do planeta, lar de 10% de todas as espécies vivas da Terra, vista de cima em toda a sua imensidão verde e fluvial.',
  },
  {
    title: 'Cristo Redentor',
    category: 'Brasil',
    img: 'https://image.pollinations.ai/prompt/anime%20warrior%20portrait%20in%20rainy%20city%20lights%2C%20dramatic%20red%20background%2C%20action%20scene?width=640&height=420&nologo=true&seed=102',
    duration: '0:07',
    tags: ['Brasil', 'Cinemático'],
    views: '398K',
    likes: '312K',
    shares: '76K',
    description: 'O Cristo Redentor no alto do Corcovado, uma das sete maravilhas do mundo moderno, de braços abertos sobre o Rio de Janeiro ao entardecer.',
  },
  {
    title: 'Cataratas do Iguaçu',
    category: 'Brasil',
    img: 'https://image.pollinations.ai/prompt/golden%20sunset%20over%20rolling%20hills%20and%20quiet%20road%2C%20cinematic%20landscape%2C%20warm%20light?width=640&height=420&nologo=true&seed=112',
    duration: '0:06',
    tags: ['Brasil', 'Natureza'],
    views: '356K',
    likes: '287K',
    shares: '65K',
    description: 'O maior conjunto de quedas d’água do mundo, com mais de 270 saltos na fronteira entre Brasil e Argentina, gerando uma cortina de névoa visível a quilômetros.',
  },
  {
    title: 'Carnaval do Rio',
    category: 'Brasil',
    img: 'https://image.pollinations.ai/prompt/abstract%20fluid%20cosmic%20art%20with%20red%20and%20blue%20energy%2C%20dynamic%20motion%2C%20cinematic?width=640&height=420&nologo=true&seed=122',
    duration: '0:05',
    tags: ['Brasil', 'Cultura'],
    views: '445K',
    likes: '389K',
    shares: '94K',
    description: 'O maior espetáculo da Terra. O Carnaval do Rio de Janeiro reúne milhões de pessoas em dias de samba, fantasias e alegria que movem o mundo.',
  },
];

const NAV_ITEMS = [
  { icon: Compass, label: 'Explorar', id: 'explorar' },
  { icon: TrendingUp, label: 'Em Alta', id: 'alta' },
  { icon: Heart, label: 'Favoritos', id: 'favoritos' },
  { icon: Folder, label: 'Coleções', id: 'colecoes' },
  { icon: Lightbulb, label: 'Inspirações', id: 'inspiracoes' },
  { icon: PlaySquare, label: 'Tutoriais', id: 'tutoriais' },
];

const CATEGORIES = ['Todos', 'Guerra', 'História', 'Brasil'];

const FILTERS = [
  { label: 'Categoria', value: 'Todos' },
  { label: 'Estilo', value: 'Todos' },
  { label: 'Modelo de IA', value: 'Todos' },
  { label: 'Duração', value: 'Todos' },
  { label: 'Orientação', value: 'Todos' },
  { label: 'Ordenar por', value: 'Mais recentes' },
];

export default function AIVideoDashboard() {
  const [activeNav, setActiveNav] = useState('explorar');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activeTab, setActiveTab] = useState('gerar');
  const [selected, setSelected] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#030406] p-3.5 text-[12px] text-zinc-300 antialiased">
      <div className="flex h-full min-w-0">

        {/* ===== LEFT PANEL + MAIN ===== */}
        <div className="flex min-w-0 flex-1 overflow-hidden rounded-2xl border border-zinc-800 bg-[#080a0e] shadow-2xl shadow-black/60">

          {/* Sidebar */}
          <aside className="flex w-[196px] shrink-0 flex-col border-r border-zinc-800 bg-[linear-gradient(180deg,#0c0f16_0%,#080a0d_100%)]">

            {/* Logo */}
            <div className="flex h-[62px] shrink-0 items-center gap-3 px-5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-[10px] font-bold text-white shadow-lg shadow-violet-950/70">
                IA
              </div>
              <div>
                <div className="text-[13px] font-bold leading-none text-white">IA Videos</div>
                <div className="mt-0.5 text-[9px] text-zinc-500">Galeria Criativa</div>
              </div>
            </div>

            {/* Nav */}
            <nav className="space-y-0.5 border-t border-zinc-800/80 px-3 py-3">
              {NAV_ITEMS.map(({ icon: Icon, label, id }) => (
                <button
                  key={id}
                  onClick={() => setActiveNav(id)}
                  className={`flex h-8 w-full items-center gap-2.5 rounded-lg px-3 text-[12px] font-medium transition-all ${
                    activeNav === id
                      ? 'border border-violet-500/25 bg-violet-500/10 text-violet-300'
                      : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100'
                  }`}
                >
                  <Icon size={13} className={activeNav === id ? 'text-violet-400' : 'text-zinc-500'} />
                  {label}
                </button>
              ))}
            </nav>

            {/* Filters */}
            <div className="min-h-0 flex-1 overflow-y-auto border-t border-zinc-800/80 px-3 pt-4 scrollbar-none">
              <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-widest text-zinc-500">
                  <Filter size={9} /> Filtros
                </span>
                <button className="text-[9px] font-medium text-violet-500 transition-colors hover:text-violet-400">
                  Limpar
                </button>
              </div>
              <div className="space-y-2.5">
                {FILTERS.map(({ label, value }) => (
                  <FilterSelect key={label} label={label} value={value} />
                ))}
              </div>
            </div>

            {/* Upload CTA */}
            <div className="p-3 pt-3">
              <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-3.5">
                <div className="mb-1.5 flex items-center gap-1.5">
                  <Star size={11} className="text-violet-400" />
                  <h4 className="text-[11px] font-semibold text-white">Envie seu vídeo</h4>
                </div>
                <p className="mb-3 text-[10px] leading-relaxed text-zinc-400">
                  Compartilhe criações geradas por IA com a comunidade.
                </p>
                <button className="h-7 w-full rounded-lg bg-violet-600 text-[11px] font-semibold text-white shadow shadow-violet-950/50 transition-colors hover:bg-violet-500">
                  Enviar agora
                </button>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex min-w-0 flex-1 flex-col bg-[radial-gradient(ellipse_at_50%_0%,rgba(60,65,90,0.18),transparent_50%),#07090d]">

            {/* Header */}
            <header className="flex h-[62px] shrink-0 items-center gap-4 border-b border-zinc-800 px-5">
              <div className="relative flex-1 max-w-[460px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={13} />
                <input
                  type="text"
                  placeholder="Buscar vídeos, estilos, modelos de IA..."
                  className="h-9 w-full rounded-xl border border-zinc-800/80 bg-[#0c0f16] pl-9 pr-10 text-[11.5px] text-zinc-300 outline-none transition-all placeholder:text-zinc-600 focus:border-violet-500/50 focus:bg-[#0f1219]"
                />
                <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-5 items-center rounded-md border border-zinc-700/80 bg-zinc-900 px-1.5 text-[9px] text-zinc-500">
                  /
                </kbd>
              </div>

              <div className="ml-auto flex items-center gap-2.5">
                <button className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-800/80 bg-[#0c0f16] text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200">
                  <Bell size={14} />
                  <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-[#080a0e]" />
                </button>
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-violet-500/40 bg-zinc-800">
                    <img src="https://i.pravatar.cc/100?img=33" alt="Usuário" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold leading-none text-white">Miqueias</div>
                    <div className="mt-0.5 text-[9px] text-zinc-500">Criador</div>
                  </div>
                </div>
              </div>
            </header>

            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto border-b border-zinc-800 px-5 py-3 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`h-7 shrink-0 rounded-full px-3.5 text-[11px] font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-950/50'
                      : 'border border-zinc-800/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Content area */}
            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 custom-scrollbar">

              {/* Page header */}
              <div className="flex items-center justify-between py-4">
                <div>
                  <h1 className="text-[18px] font-bold leading-none text-white">Explorar vídeos</h1>
                  <p className="mt-1 text-[11px] text-zinc-500">{videos.filter(v => activeCategory === 'Todos' || v.category === activeCategory).length} vídeos encontrados</p>
                </div>
                <button className="flex h-8 items-center gap-1.5 rounded-xl border border-zinc-800/80 bg-[#0c0f16] px-3 text-[11px] font-medium text-zinc-300 transition-colors hover:border-zinc-700">
                  <Clock size={11} className="text-zinc-500" />
                  Mais recentes
                  <ChevronDown size={11} className="text-zinc-500" />
                </button>
              </div>

              {/* Video grid */}
              <div className="grid grid-cols-[repeat(auto-fill,minmax(162px,1fr))] gap-3">
                {videos.filter(v => activeCategory === 'Todos' || v.category === activeCategory).map((video) => (
                  <VideoCard
                    key={video.title}
                    {...video}
                    isSelected={selected?.title === video.title}
                    onClick={() => { setSelected(video); setPanelOpen(true); }}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-7 flex items-center justify-center gap-1">
                <PageButton><ArrowLeft size={12} /></PageButton>
                <button className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-600 text-[11.5px] font-bold text-white shadow shadow-violet-950/50">
                  1
                </button>
                <PageButton>2</PageButton>
                <PageButton>3</PageButton>
                <span className="px-1.5 text-zinc-600 text-[13px]">···</span>
                <PageButton>52</PageButton>
                <PageButton><ArrowRight size={12} /></PageButton>
              </div>
            </div>
          </main>
        </div>

        {/* ===== RIGHT PANEL ===== */}
        <div
          style={{
            width: panelOpen && selected ? 'min(34vw, 490px)' : '0',
            marginLeft: panelOpen && selected ? '12px' : '0',
            opacity: panelOpen && selected ? 1 : 0,
            flexShrink: 0,
            overflow: 'hidden',
            transition: 'width 380ms cubic-bezier(0.25, 0.46, 0.45, 0.94), margin-left 380ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 280ms ease',
          }}
        >
          <aside className="flex h-full w-[min(34vw,490px)] min-w-[420px] flex-col gap-3 overflow-y-auto custom-scrollbar">
          {selected && <>

          {/* Player section */}
          <section className="rounded-2xl border border-zinc-800 bg-[#0b0d12] p-4 shadow-2xl shadow-black/40">
            <button onClick={() => setPanelOpen(false)} className="mb-3.5 flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 transition-colors hover:text-zinc-200">
              <ArrowLeft size={12} /> Voltar para galeria
            </button>

            {/* Player */}
            <div className="relative mb-4 overflow-hidden rounded-xl bg-zinc-950 group cursor-pointer" style={{ aspectRatio: '16/9' }}>
              <img src={selected.img} alt="Player" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-600/90 pl-0.5 text-white shadow-2xl shadow-violet-950/60 backdrop-blur-sm transition-all hover:bg-violet-500 hover:scale-110">
                  <Play size={20} fill="currentColor" />
                </button>
              </div>

              {/* Bottom controls */}
              <div className="absolute inset-x-0 bottom-0 p-3">
                <div className="mb-2 h-[3px] rounded-full bg-white/20 overflow-hidden">
                  <div className="h-full w-[22%] rounded-full bg-violet-400" />
                </div>
                <div className="flex items-center justify-between text-[10px] text-white/70">
                  <div className="flex items-center gap-2">
                    <Play size={9} fill="currentColor" />
                    <span>0:00 / 0:08</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Volume2 size={11} />
                    <Settings2 size={11} />
                    <Maximize2 size={11} />
                  </div>
                </div>
              </div>
            </div>

            {/* Title + tags */}
            <div className="mb-3.5">
              <h2 className="mb-2 text-[15px] font-bold text-white">{selected.title}</h2>
              <div className="flex flex-wrap gap-1.5">
                {selected.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </div>

            {/* Metrics + actions */}
            <div className="flex items-center justify-between gap-3 border-y border-zinc-800 py-3.5 mb-3.5">
              <div className="flex gap-5">
                <Metric icon={<Eye size={13} />} value={selected.views} label="Visualizações" />
                <Metric icon={<Users size={13} />} value={selected.likes} label="Alcançadas" />
                <Metric icon={<Share2 size={13} />} value={selected.shares} label="Compartilhamentos" />
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`flex h-8 w-8 items-center justify-center rounded-xl border transition-all ${
                    liked
                      ? 'border-red-500/50 bg-red-500/10 text-red-400'
                      : 'border-zinc-800 bg-[#11141a] text-zinc-400 hover:border-red-500/40 hover:text-red-400'
                  }`}
                >
                  <Heart size={13} fill={liked ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={() => setSaved(!saved)}
                  className={`flex h-8 items-center gap-1.5 rounded-xl px-3 text-[11px] font-semibold transition-all ${
                    saved
                      ? 'bg-violet-500 text-white'
                      : 'bg-violet-600 text-white hover:bg-violet-500'
                  }`}
                >
                  <Bookmark size={12} fill={saved ? 'currentColor' : 'none'} />
                  {saved ? 'Salvo' : 'Salvar'}
                </button>
              </div>
            </div>

            {/* About + metadata */}
            <div className="grid grid-cols-[1fr_136px] gap-5">
              <div>
                <h3 className="mb-1.5 text-[11.5px] font-semibold text-white">Sobre o vídeo</h3>
                <p className="text-[10.5px] leading-relaxed text-zinc-500">
                  {selected.description}
                </p>
              </div>
              <div className="space-y-2 text-[10px]">
                {[
                  ['Modelo', 'Runway Gen-3'],
                  ['Duração', '8 segundos'],
                  ['Resolução', '1080×1920'],
                  ['Orientação', 'Vertical'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-2">
                    <span className="text-zinc-600">{label}</span>
                    <span className="font-medium text-zinc-300">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Generation details section */}
          <section className="flex-1 rounded-2xl border border-zinc-800 bg-[#0b0d12] shadow-2xl shadow-black/40">
            <div className="flex gap-6 border-b border-zinc-800 px-5">
              {[
                { id: 'gerar', label: 'Como gerar' },
                { id: 'tecnico', label: 'Detalhes técnicos' },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`py-3.5 text-[11px] font-medium transition-colors ${
                    activeTab === id
                      ? 'border-b-2 border-violet-500 text-violet-400'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="p-5">
              {activeTab === 'gerar' ? (
                <>
                  {/* Prompt */}
                  <div className="mb-5">
                    <h4 className="mb-2 text-[11.5px] font-semibold text-white">Prompt utilizado</h4>
                    <div className="relative rounded-xl border border-zinc-800/80 bg-[#10131a] p-3.5 pr-10">
                      <p className="font-mono text-[10.5px] leading-relaxed text-zinc-400">
                        Epic cinematic shot of an astronaut exploring an alien planet. A vast landscape with rocky mountains, dramatic clouds, and a huge planet in the sky. Atmospheric lighting, ultra detailed, filmic, 8k.
                      </p>
                      <button className="absolute right-3 top-3 text-zinc-600 transition-colors hover:text-zinc-300">
                        <Copy size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Config */}
                  <div className="mb-5">
                    <h4 className="mb-3 text-[11.5px] font-semibold text-white">Configurações</h4>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2.5">
                      {[
                        ['Modelo de IA', 'Runway Gen-3'],
                        ['Estilo', 'Cinemático'],
                        ['Duração', '8 segundos'],
                        ['Orientação', 'Vertical'],
                        ['Resolução', '1080×1920'],
                        ['Seed', '732891'],
                        ['FPS', '24'],
                        ['Guidance Scale', '7.5'],
                      ].map(([label, value]) => (
                        <ConfigItem key={label} label={label} value={value} />
                      ))}
                    </div>
                  </div>

                  {/* Reference images */}
                  <div>
                    <h4 className="mb-2.5 text-[11.5px] font-semibold text-white">Imagens de referência</h4>
                    <div className="flex gap-2">
                      {[12, 32, 82].map((seed) => (
                        <img
                          key={seed}
                          src={`https://image.pollinations.ai/prompt/sci-fi%20alien%20landscape%20reference%20image%20cinematic?width=120&height=90&nologo=true&seed=${seed}`}
                          className="h-[66px] w-[78px] rounded-xl border border-zinc-800 object-cover transition-colors hover:border-zinc-700"
                          alt="Referência"
                        />
                      ))}
                      <button className="flex h-[66px] w-[78px] items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-[#11141a] text-zinc-600 transition-colors hover:border-violet-600/50 hover:text-violet-400">
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <h4 className="mb-3 text-[11.5px] font-semibold text-white">Especificações técnicas</h4>
                  <div className="space-y-0">
                    {[
                      ['Codec', 'H.264'],
                      ['Bitrate', '12 Mbps'],
                      ['Taxa de quadros', '24 fps'],
                      ['Profundidade de bits', '10-bit'],
                      ['Espaço de cor', 'BT.709'],
                      ['Tamanho do arquivo', '8.2 MB'],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between border-b border-zinc-800/50 py-2.5 text-[11px]">
                        <span className="text-zinc-500">{label}</span>
                        <span className="font-medium text-zinc-200">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
          </>}
          </aside>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #1a1d24; border-radius: 20px; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

function FilterSelect({ label, value }) {
  return (
    <div>
      <label className="mb-1 block text-[9.5px] font-medium text-zinc-500">{label}</label>
      <button className="flex h-7 w-full items-center justify-between rounded-lg border border-zinc-800 bg-[#0f1218] px-2.5 text-left text-[11px] text-zinc-300 transition-colors hover:border-zinc-700">
        {value}
        <ChevronDown size={11} className="text-zinc-600" />
      </button>
    </div>
  );
}

function VideoCard({ title, img, duration, tags, views, likes, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer overflow-hidden rounded-xl border transition-all duration-200 active:scale-[0.96] ${
        isSelected
          ? 'border-violet-500/60 shadow-lg shadow-violet-950/30'
          : 'border-zinc-800 hover:border-zinc-700'
      } bg-[#0d1016]`}
    >
      <div className="relative overflow-hidden bg-zinc-950" style={{ aspectRatio: '4/3' }}>
        <img
          src={img}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 pl-0.5 shadow-xl">
            <Play size={14} className="text-zinc-900" fill="#18181b" />
          </div>
        </div>

        {/* Duration */}
        <div className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-[9px] font-semibold text-white backdrop-blur-sm">
          {duration}
        </div>

        {/* Selected badge */}
        {isSelected && (
          <div className="absolute left-2 top-2 rounded-md bg-violet-600 px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wide text-white">
            Ativo
          </div>
        )}
      </div>

      <div className="p-2.5">
        <h3 className="mb-2 truncate text-[11.5px] font-semibold text-white">{title}</h3>
        <div className="mb-2 flex flex-wrap gap-1">
          {tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
        </div>
        <div className="flex items-center justify-between text-[10px] text-zinc-500">
          <span className="flex items-center gap-1"><Eye size={10} /> {views}</span>
          <span className="flex items-center gap-1"><Users size={10} /> {likes}</span>
        </div>
      </div>
    </div>
  );
}

function Tag({ children }) {
  return (
    <span className="rounded-md bg-zinc-800/60 px-1.5 py-0.5 text-[9.5px] leading-none text-zinc-400">
      {children}
    </span>
  );
}

function Metric({ icon, value, label }) {
  return (
    <div>
      <div className="flex items-center gap-1 text-[14px] font-bold text-white">
        <span className="text-zinc-500">{icon}</span>
        {value}
      </div>
      <div className="mt-0.5 text-[9.5px] text-zinc-600">{label}</div>
    </div>
  );
}

function PageButton({ children }) {
  return (
    <button className="flex h-8 min-w-8 items-center justify-center rounded-xl border border-zinc-800/80 bg-[#0d1016] px-2.5 text-[11.5px] font-medium text-zinc-400 transition-colors hover:border-zinc-700 hover:text-white">
      {children}
    </button>
  );
}

function ConfigItem({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-[10.5px]">
      <span className="text-zinc-600">{label}</span>
      <span className="text-right font-medium text-zinc-300">{value}</span>
    </div>
  );
}
