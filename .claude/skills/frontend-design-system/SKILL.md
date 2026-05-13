---
name: frontend-design-system
description: Padrões do frontend do projeto IA Videos — React 19 + Vite + Tailwind CSS v4. Define tokens de cor, layout, componentes e convenções de código para a galeria de vídeos com IA.
---
# Skill: Frontend – IA Videos (React SPA)

Você está trabalhando no frontend do **IA Videos**, uma galeria de vídeos gerados por inteligência artificial.
Stack: **React 19 + Vite + Tailwind CSS v4**.

---

## 1. Stack e Ferramentas

| Ferramenta | Versão | Uso |
|---|---|---|
| React | 19.x | UI framework |
| Vite | 8.x | Build tool e dev server |
| Tailwind CSS | 4.x | Estilização com `@import "tailwindcss"` |
| Lucide React | latest | Ícones |

**Não há:** React Router, Axios, Zustand, autenticação ou backend.

---

## 2. Paleta de Cores (Tema Escuro)

O projeto usa **tema escuro fixo** — não há light mode. As cores base do projeto são:

| Papel | Valor | Uso |
|---|---|---|
| Background global | `#030406` | Fundo da página (`bg-[#030406]`) |
| Surface principal | `#080a0e` | Cards e containers principais |
| Surface elevada | `#0d1017` | Sidebar, painéis laterais |
| Acento primário | `violet-600` | Logo, botões ativos, destaques |
| Acento hover | `violet-500` | Hover de elementos com acento |
| Texto principal | `zinc-300` | Corpo de texto geral |
| Texto secundário | `zinc-400` | Labels, metadados |
| Texto terciário | `zinc-500` | Placeholders, hints |
| Texto branco | `white` | Títulos e elementos em destaque |
| Borda padrão | `zinc-800/80` | Bordas de containers |
| Borda interna | `zinc-800/70` | Divisores internos |
| Borda sutil | `zinc-900/70` | Divisores de navegação |

### Regras de cor:
- **NUNCA** usar cores do Tailwind como `bg-blue-500`, `text-gray-800` etc. em lugares semânticos.
- **SEMPRE** usar as cores da paleta acima.
- Transparências via `/opacity` são permitidas e encorajadas (ex: `zinc-800/80`).
- Gradientes de surface: `bg-[linear-gradient(180deg,#0d1017_0%,#080a0d_100%)]` para o sidebar.

---

## 3. Layout Global

### 3.1 Estrutura raiz

```jsx
// App.jsx
<div className="h-screen w-screen overflow-hidden bg-[#030406] p-4 text-[12px] text-zinc-300 antialiased">
  <div className="flex h-full min-w-0 gap-3">
    {/* container principal com borda */}
    <div className="flex min-w-0 flex-1 overflow-hidden rounded-xl border border-zinc-800/80 bg-[#080a0e] shadow-2xl shadow-black/50">
      {/* sidebar + conteúdo */}
    </div>
    {/* painel lateral direito (se houver) */}
  </div>
</div>
```

### 3.2 Sidebar

- Largura fixa: `w-[200px]`
- Background: gradiente `#0d1017 → #080a0d`
- Bordas: `border-r border-zinc-800/70`
- Logo area: altura `h-[66px]`

### 3.3 Font size base

O projeto usa `text-[12px]` como tamanho base no container raiz. Ajuste relativo:
- Títulos de seção: `text-[11px]` uppercase com `tracking-wider`
- Nome da app: `text-[14px]`
- Badges/tags: `text-[9px]` ou `text-[10px]`

---

## 4. Componentes Padrão

### 4.1 NavItem (item de navegação)

```jsx
function NavItem({ icon, label, active }) {
  return (
    <button
      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-colors ${
        active
          ? 'bg-violet-600/20 text-violet-400'
          : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
```

### 4.2 Card de Vídeo

```jsx
// Estrutura base de card
<div className="group relative cursor-pointer overflow-hidden rounded-lg border border-zinc-800/60 bg-zinc-900/40 transition-all hover:border-zinc-700/60 hover:shadow-lg hover:shadow-black/40">
  {/* thumbnail */}
  <div className="relative aspect-video overflow-hidden">
    <img className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
    {/* overlay de duração */}
    <div className="absolute bottom-1.5 right-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white">
      {duration}
    </div>
  </div>
  {/* info */}
  <div className="p-3">
    <h3 className="font-medium text-white">{title}</h3>
    {/* tags, stats */}
  </div>
</div>
```

### 4.3 Badge/Tag

```jsx
<span className="rounded-full bg-zinc-800/80 px-2 py-0.5 text-[10px] text-zinc-400">
  {label}
</span>
```

### 4.4 Botão de ação

```jsx
// Primário (violeta)
<button className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-white transition-colors hover:bg-violet-500">
  {label}
</button>

// Secundário (outline)
<button className="flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white">
  {label}
</button>

// Ghost (sem borda)
<button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-zinc-200">
  {label}
</button>
```

### 4.5 FilterSelect

```jsx
function FilterSelect({ label, value }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] text-zinc-500">{label}</label>
      <div className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-1.5 text-zinc-300">
        <span>{value}</span>
        <ChevronDown size={12} className="text-zinc-500" />
      </div>
    </div>
  );
}
```

---

## 5. Convenções de Código

### 5.1 Estrutura de um componente

```jsx
import { useState } from 'react';
import { IconName } from 'lucide-react';

export default function NomeComponente({ prop1, prop2 }) {
  const [estado, setEstado] = useState(valor);

  function handleAcao() {
    // lógica
  }

  return (
    <div className="...">
      {/* conteúdo */}
    </div>
  );
}
```

### 5.2 Organização de arquivos

```
src/
├── components/
│   ├── ui/          # Botões, badges, inputs, selects genéricos
│   ├── layout/      # Sidebar, Header, Shell
│   └── video/       # VideoCard, VideoPlayer, VideoGrid
├── hooks/           # useVideos, useFilter, usePlayer
├── utils/           # Helpers, formatadores
├── data/            # Fixtures de vídeos, categorias, tags
├── App.jsx
├── main.jsx
└── index.css
```

### 5.3 Dados de vídeos

Os vídeos são objetos com esta estrutura:
```js
{
  id: number,
  title: string,         // título em português
  img: string,           // URL da imagem (pollinations.ai ou similar)
  duration: string,      // formato '0:08'
  tags: string[],        // ex: ['Cinemático', 'Sci-Fi']
  views: string,         // ex: '125K'
  likes: string,         // ex: '89K'
  users: string,         // ex: '12K'
}
```

---

## 6. Ícones

**Sempre** usar `lucide-react`. Tamanhos comuns:
- Navegação: `size={15}`
- Inline em texto: `size={12}` ou `size={13}`
- Botões: `size={14}` ou `size={16}`
- Destaque: `size={20}` ou superior

---

## 7. Animações e Transições

- **Hover em cards:** `transition-all`, `group-hover:scale-105` em thumbnails
- **Transições de cor:** `transition-colors` (duração padrão 150ms)
- **Opacidade:** `transition-opacity`
- Evitar `transition-all` em elementos com muitas propriedades — preferir específico.

---

## 8. Regras Invioláveis

- **NUNCA** usar cores hardcoded do Tailwind (`bg-blue-500`, `text-gray-800`) em lugares semânticos.
- **NUNCA** usar `light mode` — o projeto é dark-only.
- **NUNCA** adicionar lógica de IA ou fetch de dados em componentes de UI.
- **SEMPRE** manter `overflow-hidden` no container raiz para evitar scroll indesejado.
- **SEMPRE** usar ícones do `lucide-react`, não de outras libs.
- **SEMPRE** escrever textos visíveis ao usuário em **português**.
- **NUNCA** usar `font-size` em `px` inline — usar as classes `text-[12px]`, `text-[14px]` etc. do Tailwind.
