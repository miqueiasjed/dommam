# Tasks do Plano 5 – Download com Marca D'água Dinâmica

> Gerado em: 2026-05-13

## Legenda
- ✅ Concluída
- 🔄 Em andamento
- ⏳ Pendente

## Tasks

| # | Título | Tipo | Status | Complexidade |
|---|--------|------|--------|-------------|
| 5.1 | Model Download | config | ⏳ | baixa |
| 5.2 | MarcaDaguaService (geração de PDF com marca d'água) | integracao | ⏳ | alta |
| 5.3 | DownloadService (orquestrador do fluxo de download) | integracao | ⏳ | média |
| 5.4 | DownloadController + Rota autenticada | componente-dominio | ⏳ | média |
| 5.5 | Testes Feature: Download de PDF | teste | ⏳ | média |

## Ordem de execução
5.1 → 5.2 → 5.3 → 5.4 → 5.5

## Dependências entre tasks
- 5.2 é independente de 5.1 (pode rodar em paralelo)
- 5.3 depende de 5.1 e 5.2
- 5.4 depende de 5.3
- 5.5 depende de 5.1, 5.3 e 5.4
