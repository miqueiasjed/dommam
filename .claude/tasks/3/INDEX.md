# Tasks do Plano 3 – Admin Backend: Auth + CRUD de Roteiros

> Gerado em: 2026-05-13

## Legenda
- ✅ Concluída
- 🔄 Em andamento
- ⏳ Pendente

## Tasks

| # | Título | Tipo | Status | Complexidade |
|---|--------|------|--------|-------------|
| 3.1 | Models: AdminUser, Roteiro e AdminAuditLog | config | ✅ | média |
| 3.2 | AdminAuthService + LoginAdminRequest + Middleware | config | ✅ | alta |
| 3.3 | AdminAuthController + Rotas /admin/auth | config | ✅ | média |
| 3.4 | FileUploadService + AuditLogService | config | ✅ | média |
| 3.5 | RoteiroService + FormRequests (Criar + Atualizar) | config | ✅ | alta |
| 3.6 | AdminRoteiroController + Rotas /admin/roteiros | config | ✅ | média |
| 3.7 | Command PublicarRoteirosAgendados + Kernel | config | ✅ | baixa |
| 3.8 | AdminUserSeeder | config | ✅ | baixa |

## Ordem de execução

```
3.1 (models + migration)
├── 3.2 (AdminAuthService + middleware)     ← depende de AdminUser (3.1)
│   └── 3.3 (AdminAuthController + routes) ← depende de 3.2
├── 3.4 (FileUploadService + AuditLogService) ← depende de AdminAuditLog (3.1)
│   └── 3.5 (RoteiroService + FormRequests)   ← depende de 3.4
│       └── 3.6 (AdminRoteiroController + routes) ← depende de 3.5
├── 3.7 (Command + Kernel) ← depende de Roteiro (3.1), independente dos services
└── 3.8 (AdminUserSeeder)  ← depende de AdminUser (3.1), independente
```

**Paralelismo possível após 3.1:**
- 3.2 + 3.4 + 3.7 + 3.8 podem rodar em paralelo
- 3.3 depende de 3.2; 3.5 depende de 3.4; 3.6 depende de 3.5
