# Danuzio History Backstage — CLAUDE.md

## Visão do Projeto

Portal de membros por assinatura para roteiros históricos. Assinantes recebem o roteiro completo 1 hora antes da publicação no @danuzio_history. Experiência cinematográfica (grid Netflix, marca d'água, busca/filtros). Lastlink como backend único de assinatura.

**PRD completo:** `.claude/prd/danuzio-backstage.md`

## Stack

**Backend:** Laravel 12, MySQL, Sanctum (sessão httpOnly), Redis  
**Frontend:** React 19, Vite, Tailwind CSS v4, Lucide React  
**Storage:** S3 / filesystem → CDN para capas e PDFs  
**Email:** Resend (preferencial) ou SendGrid  
**Assinaturas:** Lastlink (fonte única de verdade — sem banco próprio de assinantes)

## Estrutura do monorepo

```
videos_ia/               ← raiz do projeto
├── backend/             ← Laravel 12 (API REST)
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Services/
│   │   └── Models/
│   ├── database/migrations/
│   └── routes/api.php
├── frontend/            ← React 19 + Vite (código atual de src/ vai para cá)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/         # Botões, badges, inputs genéricos
│   │   │   ├── layout/     # Header, Shell, Sidebar
│   │   │   └── roteiro/    # RoteiroCard, RoteiroGrid, RoteiroPage
│   │   ├── hooks/          # useAuth, useRoteiros, useFilter
│   │   ├── utils/          # Helpers, formatadores
│   │   └── pages/          # Biblioteca, RoteiroPage, LoginPage, Admin
│   ├── package.json
│   └── vite.config.js
├── .claude/
│   ├── prd/danuzio-backstage.md   # PRD em texto
│   ├── plans/INDEX.md
│   ├── tasks/
│   └── skills/
└── CLAUDE.md
```

## Skills disponíveis

| Skill | Quando usar |
|---|---|
| `create-plans` | Transformar o PRD em planos de desenvolvimento |
| `create-tasks` | Decompor um plano em tasks granulares |
| `run-plan` | Executar o próximo plano disponível |
| `commit-push` | Commitar e fazer push das alterações |
| `laravel-arquitetura` | Criar/editar código Laravel (controllers, services, models, migrations) |
| `frontend-design-system` | Criar/editar componentes React, páginas, estilos |
| `frontend-testing` | Escrever ou corrigir testes de frontend |

## Convenções de código

**Backend (Laravel):**
- Variáveis, métodos, nomes de domínio: **português**
- Exceções técnicas Laravel permanecem em inglês: Controller, Service, Request, Job
- Mensagens de validação e respostas de API: português
- Toda regra de negócio em Services (`App\Services\{Modulo}\`)
- Toda validação em FormRequests (`App\Http\Requests\{Modulo}\`)

**Frontend (React):**
- Textos visíveis ao usuário em **português**
- Nomes de componentes e arquivos em inglês (convenção React)
- Tema escuro fixo — sem light mode
- Paleta: fundo `#030406`, surface `#080a0e`, acento dourado `amber-500/600`, texto `zinc-300`
- Nunca colocar lógica de dados em componentes visuais
- Sempre usar ícones do `lucide-react`

## Regras arquiteturais

- **Lastlink é a fonte única de verdade** para status de assinatura — o portal nunca duplica esse estado
- Sessões de membro em `sessions` (magic link, cookie httpOnly, sem senha)
- Admin em `admin_users` (login + senha + 2FA TOTP) — separado dos membros
- Webhooks processados de forma assíncrona (Job) — endpoint responde 200 rápido
- PDF com marca d'água gerado on-the-fly por download — sem cache compartilhado
- Cache do status Lastlink por 5-15 min (Redis)
