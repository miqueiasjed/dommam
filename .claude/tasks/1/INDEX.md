# Tasks do Plano 1 – Setup do Monorepo + Infraestrutura Laravel

> Gerado em: 2026-05-13

## Legenda
- ✅ Concluída
- 🔄 Em andamento
- ⏳ Pendente

## Tasks

| # | Título | Tipo | Status | Complexidade |
|---|--------|------|--------|-------------|
| 1.1 | Instalar Laravel 12 e configurar .env.example | config | ✅ | baixa |
| 1.2 | Configurar CORS, Sanctum, Storage e Redis | config | ✅ | média |
| 1.3 | Criar BaseApiController com helpers de resposta | componente-dominio | ✅ | baixa |
| 1.4 | Migrations: roteiros e sessions | config | ✅ | baixa |
| 1.5 | Migrations: downloads, webhooks_log, admin_users, admin_audit_log | config | ✅ | média |
| 1.6 | Mover frontend de src/ para frontend/ | config | ✅ | média |

## Ordem de execução
1.1 → 1.2 → 1.3 → 1.4 → 1.5 → 1.6

**Notas:**
- 1.1 é pré-requisito de tudo (instala o Laravel)
- 1.2 depende de 1.1 (precisa dos arquivos de config criados pelo Laravel)
- 1.3 depende de 1.1 (precisa da estrutura de diretórios do Laravel)
- 1.4 e 1.5 dependem de 1.1 (precisam do banco configurado)
- 1.6 é independente do backend — pode rodar em paralelo com 1.2–1.5 se desejado
