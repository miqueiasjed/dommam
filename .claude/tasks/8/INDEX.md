# Tasks do Plano 8 – Frontend: Autenticação + Página Individual de Roteiro

> Gerado em: 2026-05-13

## Legenda
- ✅ Concluída
- 🔄 Em andamento
- ⏳ Pendente

## Tasks

| # | Título | Tipo | Status | Complexidade |
|---|--------|------|--------|-------------|
| 8.1 | Hook `useRoteiro` | hook | ✅ | baixa |
| 8.2 | `LoginPage` (implementação completa) | pagina | ✅ | média |
| 8.3 | `MagicLinkCallbackPage` (implementação completa) | pagina | ✅ | média |
| 8.4 | `WelcomeTourPage` | pagina | ✅ | média |
| 8.5 | Componentes `RoteiroHero` e `RoteiroNav` | componente-dominio | ✅ | média |
| 8.6 | Componente `DownloadButton` | componente-dominio | ✅ | baixa |
| 8.7 | `RoteiroPage` (implementação completa) | pagina | ✅ | alta |

## Ordem de execução
8.1 → (8.2, 8.3, 8.4 em paralelo) → (8.5, 8.6 em paralelo) → 8.7

## Dependências entre tasks
- **8.1** não depende de nenhuma outra task deste plano
- **8.2, 8.3, 8.4** independentes entre si (podem rodar em paralelo após 8.1 se necessário, mas não dependem de 8.1)
- **8.5, 8.6** independentes entre si
- **8.7** depende de: 8.1, 8.5, 8.6
