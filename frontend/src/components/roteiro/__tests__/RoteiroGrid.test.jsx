import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import RoteiroGrid from '../RoteiroGrid'

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}))

describe('RoteiroGrid', () => {
  it('renderiza 8 skeletons quando carregando é true', () => {
    const { container } = render(<RoteiroGrid roteiros={[]} carregando={true} erro={null} />)
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons).toHaveLength(8)
  })

  it('renderiza mensagem de erro quando erro é truthy', () => {
    render(<RoteiroGrid roteiros={[]} carregando={false} erro="Falha na conexão" />)
    expect(screen.getByText(/Erro ao carregar roteiros/)).toBeInTheDocument()
  })

  it('renderiza EmptyState quando roteiros está vazio e não está carregando', () => {
    render(<RoteiroGrid roteiros={[]} carregando={false} erro={null} />)
    expect(screen.getByText('Nenhum roteiro encontrado')).toBeInTheDocument()
  })

  it('renderiza cards quando roteiros tem itens', () => {
    const roteiros = [
      { id: 1, slug: 'r-1', titulo: 'Roteiro Um', cover_image_url: null, publicado_em: '2025-01-01', tema: 'História' },
      { id: 2, slug: 'r-2', titulo: 'Roteiro Dois', cover_image_url: null, publicado_em: '2025-02-01', tema: 'Arte' },
    ]
    render(<RoteiroGrid roteiros={roteiros} carregando={false} erro={null} />)
    expect(screen.getAllByText('Roteiro Um')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Roteiro Dois')[0]).toBeInTheDocument()
  })
})
