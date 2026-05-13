import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import RoteiroCard from '../RoteiroCard'

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}))

const roteiroFixture = {
  slug: 'roteiro-teste',
  titulo: 'Roteiro de Teste Histórico',
  sinopse: 'Uma sinopse de teste.',
  cover_image_url: null,
  publicado_em: '2025-01-15',
  tema: 'História',
  tipo: 'Bastidor',
}

describe('RoteiroCard', () => {
  it('renderiza o título do roteiro', () => {
    render(<RoteiroCard roteiro={roteiroFixture} />)
    expect(screen.getAllByText('Roteiro de Teste Histórico')[0]).toBeInTheDocument()
  })

  it('renderiza o tema do roteiro', () => {
    render(<RoteiroCard roteiro={roteiroFixture} />)
    expect(screen.getAllByText('História')[0]).toBeInTheDocument()
  })

  it('não quebra quando cover_image_url é null', () => {
    render(<RoteiroCard roteiro={{ ...roteiroFixture, cover_image_url: null }} />)
    expect(screen.getAllByText('Roteiro de Teste Histórico')[0]).toBeInTheDocument()
  })

  it('renderiza imagem quando cover_image_url está presente', () => {
    render(<RoteiroCard roteiro={{ ...roteiroFixture, cover_image_url: 'https://example.com/capa.jpg' }} />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'https://example.com/capa.jpg')
    expect(img).toHaveAttribute('alt', 'Roteiro de Teste Histórico')
  })
})
