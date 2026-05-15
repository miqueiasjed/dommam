import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import BibliotecaPage from '../BibliotecaPage'

vi.mock('../../hooks/useRoteiros', () => ({
  useRoteiros: () => ({
    roteiros: [],
    carregando: true,
    erro: null,
    filtros: { mes: '', temas: [], tipo: '' },
    setFiltros: vi.fn(),
    busca: '',
    setBusca: vi.fn(),
    ordenacao: 'mais_recentes',
    setOrdenacao: vi.fn(),
  }),
}))

vi.mock('../../components/layout/AppShell', () => ({
  default: ({ children }) => <div data-testid="app-shell">{children}</div>,
}))

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}))

describe('BibliotecaPage', () => {
  it('renderiza sem crash', () => {
    render(<BibliotecaPage />)
    expect(screen.getByTestId('app-shell')).toBeInTheDocument()
  })

  it('exibe o campo de busca', () => {
    render(<BibliotecaPage />)
    expect(screen.getByPlaceholderText('Buscar vídeos, temas, tipos...')).toBeInTheDocument()
  })

  it('exibe o seletor de ordenação', () => {
    render(<BibliotecaPage />)
    expect(screen.getByDisplayValue('Mais recentes')).toBeInTheDocument()
  })
})
