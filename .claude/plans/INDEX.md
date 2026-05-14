# INDEX – Planos do Projeto Danuzio History Backstage

> Última atualização: 2026-05-13 (Plano 8 concluído)

## Legenda
- ✅ Concluído
- 🔄 Em andamento
- ⏳ Pendente
- 🔒 Bloqueado (dependência não concluída)

## Planos

| # | Nome | Status | Depende de | Tasks est. | Skills |
|---|------|--------|------------|------------|--------|
| 1 | Setup Monorepo + Infraestrutura Laravel | ✅ | — | 6 | laravel-arquitetura |
| 2 | Autenticação por Magic Link (Backend) | ✅ | 1 | 6 | laravel-arquitetura |
| 3 | Admin Backend: Auth + CRUD de Roteiros | ✅ | 1 | 8 | laravel-arquitetura |
| 4 | Webhooks Lastlink + Serviço de E-mail | ✅ | 1, 2 | ~7 | laravel-arquitetura |
| 5 | Download com Marca D'água Dinâmica | ✅ | 1, 2, 3 | 5 | laravel-arquitetura |
| 6 | Frontend: Design System e Estrutura Base | ✅ | 1 | ~6 | frontend-design-system |
| 7 | Frontend: Biblioteca de Roteiros (Grid Netflix) | ✅ | 3, 6 | 7 | frontend-design-system |
| 8 | Frontend: Autenticação + Página de Roteiro | ✅ | 2, 5, 6, 7 | 7 | frontend-design-system |
| 9 | Frontend: Painel Administrativo | ⏳ | 3, 6 | ~8 | frontend-design-system |
| 10 | Polimento, Onboarding E-mails e Lançamento | ⏳ | 1–9 | ~8 | laravel-arquitetura, frontend-design-system, frontend-testing |

## Ordem de execução recomendada

```
1 (infra)
├── 2 (auth magic link backend)
│   ├── 4 (webhooks + email)
│   └── 5 (download PDF) ← precisa de 3 também
├── 3 (admin backend CRUD)
│   └── 5 (download PDF)
└── 6 (frontend base)
    ├── 7 (biblioteca grid) ← precisa de 3 também
    │   └── 8 (auth UI + página roteiro) ← precisa de 2 e 5 também
    └── 9 (admin panel UI) ← precisa de 3 também

10 (polimento + lançamento) ← após todos
```

**Paralelo possível:**
- Backend (1 → 2 → 4) e (1 → 3) podem avançar em paralelo com Frontend (1 → 6)
- Plano 1 é o único bloqueador de todos

## Correspondência com os Sprints do PRD

| Sprint PRD | Planos correspondentes |
|------------|----------------------|
| Sprint 1 – Fundação e autenticação | 1, 2 |
| Sprint 2 – Webhooks e biblioteca | 3, 4, 6, 7 |
| Sprint 3 – Filtros, busca e downloads | 5, 7 (filtros), 8 |
| Sprint 4 – Polimento e lançamento | 9, 10 |
