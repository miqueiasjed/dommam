---
name: frontend-testing
description: Guia de testes automatizados do frontend IA Videos — Vitest + @testing-library/react. Cobre ambiente, padrões de renderização e mocks.
---
# Skill: Testes de Frontend – IA Videos (Vitest + RTL)

Use esta skill sempre que precisar **escrever, investigar ou corrigir testes de frontend** no projeto.

---

## 1. Ambiente

| Ferramenta | Uso |
|---|---|
| Vitest | Test runner |
| @testing-library/react | Queries e renderização de componentes |
| @testing-library/user-event | Interações realistas de usuário |
| @testing-library/jest-dom | Matchers extras (`toBeInTheDocument`, etc.) |
| jsdom | Ambiente de DOM simulado |

### 1.1 Instalação (caso ainda não configurado)

```bash
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

### 1.2 Configuração do Vitest (`vite.config.js`)

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
})
```

### 1.3 Setup (`src/setupTests.js`)

```js
import '@testing-library/jest-dom'
```

### 1.4 Como Rodar os Testes

```bash
# Rodar toda a suite
npm test -- --run

# Rodar apenas um arquivo
npx vitest run src/components/video/__tests__/VideoCard.test.jsx

# Modo watch (desenvolvimento)
npx vitest
```

### 1.5 Estrutura dos Arquivos de Teste

```
src/
├── components/
│   ├── video/__tests__/
│   │   ├── VideoCard.test.jsx
│   │   └── VideoGrid.test.jsx
│   └── ui/__tests__/
│       └── Button.test.jsx
└── hooks/__tests__/
    └── useFilter.test.js
```

**Convenção:** `src/**/__tests__/*.test.{jsx,js}`

---

## 2. Padrões de Renderização

### 2.1 Componentes simples — render direto

```jsx
import { render, screen } from '@testing-library/react'
import VideoCard from '../VideoCard'

const videoFixture = {
  id: 1,
  title: 'Exploração Alienígena',
  img: 'https://example.com/img.jpg',
  duration: '0:08',
  tags: ['Cinemático', 'Sci-Fi'],
  views: '125K',
  likes: '89K',
  users: '12K',
}

it('exibe o título do vídeo', () => {
  render(<VideoCard video={videoFixture} />)
  expect(screen.getByText('Exploração Alienígena')).toBeInTheDocument()
})
```

### 2.2 Imports padrão

```jsx
// Teste de componente
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Teste de hook
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
```

---

## 3. Mockar Módulos

### 3.1 Mockar dados/fixtures

O projeto usa arrays de dados estáticos. Para testes, use fixtures inline:

```jsx
const videos = [
  { id: 1, title: 'Vídeo A', tags: ['Sci-Fi'], duration: '0:05', img: '', views: '10K', likes: '5K', users: '1K' },
  { id: 2, title: 'Vídeo B', tags: ['Anime'], duration: '0:06', img: '', views: '8K', likes: '4K', users: '900' },
]
```

### 3.2 Mockar import de dados

```jsx
vi.mock('../data/videos', () => ({
  videos: [
    { id: 1, title: 'Vídeo Mock', tags: ['Teste'], duration: '0:01', img: '', views: '1K', likes: '500', users: '100' }
  ]
}))
```

---

## 4. Queries Assíncronas

```jsx
// findBy* → elementos que aparecem após estado assíncrono
const titulo = await screen.findByText('Exploração Alienígena')

// getBy* → elementos que já estão no DOM
expect(screen.getByText('Favoritos')).toBeInTheDocument()

// queryBy* → verificar ausência
expect(screen.queryByText('Excluir')).not.toBeInTheDocument()
```

---

## 5. Testando Interações

```jsx
it('chama onSelect ao clicar no card', async () => {
  const user = userEvent.setup()
  const onSelect = vi.fn()

  render(<VideoCard video={videoFixture} onSelect={onSelect} />)
  await user.click(screen.getByRole('button'))

  expect(onSelect).toHaveBeenCalledWith(videoFixture)
})
```

---

## 6. Bugs Comuns e Como Resolver

### 6.1 Imagem com `src` inválido em jsdom

Componentes com `<img src={url}>` podem gerar warnings em jsdom. Não é um erro — ignore ou use uma URL vazia nos fixtures.

### 6.2 `act()` warnings em hooks com estado

```jsx
// Use act() ao disparar atualizações de estado em hooks
import { renderHook, act } from '@testing-library/react'

const { result } = renderHook(() => useFilter(videos))
act(() => {
  result.current.setFiltro('Sci-Fi')
})
expect(result.current.videosFiltrados).toHaveLength(1)
```

### 6.3 `localStorage` não disponível

```jsx
beforeEach(() => {
  const storage = {}
  vi.stubGlobal('localStorage', {
    getItem: (key) => storage[key] ?? null,
    setItem: (key, val) => { storage[key] = String(val) },
    removeItem: (key) => { delete storage[key] },
    clear: () => { Object.keys(storage).forEach((k) => delete storage[k]) },
  })
})
```

---

## 7. Exemplo Completo – Teste de Componente

```jsx
// src/components/video/__tests__/VideoCard.test.jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import VideoCard from '../VideoCard'

const videoFixture = {
  id: 1,
  title: 'Exploração Alienígena',
  img: '',
  duration: '0:08',
  tags: ['Cinemático', 'Sci-Fi'],
  views: '125K',
  likes: '89K',
  users: '12K',
}

describe('VideoCard', () => {
  it('exibe título e duração', () => {
    render(<VideoCard video={videoFixture} />)
    expect(screen.getByText('Exploração Alienígena')).toBeInTheDocument()
    expect(screen.getByText('0:08')).toBeInTheDocument()
  })

  it('exibe as tags do vídeo', () => {
    render(<VideoCard video={videoFixture} />)
    expect(screen.getByText('Cinemático')).toBeInTheDocument()
    expect(screen.getByText('Sci-Fi')).toBeInTheDocument()
  })

  it('chama onSelect ao clicar', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<VideoCard video={videoFixture} onSelect={onSelect} />)
    await user.click(screen.getByRole('article'))
    expect(onSelect).toHaveBeenCalledWith(videoFixture)
  })
})
```

---

## 8. Regras Invioláveis de Teste

- **SEMPRE** usar `userEvent` para simular interações — nunca `fireEvent` diretamente.
- **NUNCA** testar detalhes de implementação (nomes de classes CSS, estrutura interna do DOM).
- **SEMPRE** usar fixtures com estrutura idêntica ao objeto `video` real do projeto.
- **NUNCA** deixar testes com `it.only` ou `it.skip` no código commitado.
