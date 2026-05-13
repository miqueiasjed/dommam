# Tasks do Plano 2 – Autenticação por Magic Link (Backend)

> Gerado em: 2026-05-13

## Legenda
- ✅ Concluída
- 🔄 Em andamento
- ⏳ Pendente

## Tasks

| # | Título | Tipo | Status | Complexidade |
|---|--------|------|--------|-------------|
| 2.1 | Model Sessao + FormRequests de Auth | config | ✅ | baixa |
| 2.2 | LastlinkService + EmailService | integracao | ✅ | média |
| 2.3 | MagicLinkService + SessaoService | integracao | ✅ | média |
| 2.4 | Middleware VerificarAssinaturaAtiva | config | ✅ | baixa |
| 2.5 | Controllers Auth + Rotas API + Registro do Middleware | pagina | ✅ | média |
| 2.6 | Testes Feature: Fluxo Magic Link | teste | ✅ | média |

## Ordem de execução
2.1 → 2.2 → 2.3 → 2.4 → 2.5 → 2.6

## Dependências entre tasks
- 2.2 depende de 2.1 (usa Model Sessao e EmailService)
- 2.3 depende de 2.1 e 2.2 (usa Sessao, EmailService, LastlinkService)
- 2.4 depende de 2.2 e 2.3 (usa SessaoService e LastlinkService)
- 2.5 depende de 2.3 e 2.4 (usa os services e middleware já criados)
- 2.6 depende de 2.1–2.5 (testa o sistema completo)

## Paralelismo possível
- 2.1 e 2.2 podem ser executadas em paralelo (sem dependência entre si)
- 2.3 e 2.4 podem ser executadas em paralelo (2.3 usa 2.1+2.2; 2.4 usa 2.2+2.3 — aguardar 2.2 para ambas)
- 2.5 e 2.6 devem aguardar todas as tasks anteriores
