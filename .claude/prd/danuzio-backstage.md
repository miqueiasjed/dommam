# PRD – Danuzio History Backstage (v4.0 Final · Maio 2026)

**Proprietário:** Danuzio Neto  
**Arquitetura:** Portal próprio (Laravel + React) consumindo Lastlink como backend único de assinatura.

---

## 1. Sumário Executivo

Portal de membros por assinatura recorrente (mensal R$197, anual R$1.500) em que o assinante recebe o **roteiro completo** de cada vídeo 1 hora antes da publicação no @danuzio_history.

**Princípio:** A Lastlink entrega gestão de assinatura (pagamento, recorrência, status). O portal entrega experiência premium (grid Netflix, busca, filtros, marca d'água). Não duplicamos lógica de negócio.

### Métricas de sucesso (90 dias)
- Assinantes ativos: mín 30, meta 80
- Conversão visitante→assinante: mín 1,5%, meta 3%
- Churn mensal: mín ≤25%, meta ≤15%
- RMR: mín R$6.000, meta R$16.000
- Tempo médio na biblioteca: >5 min/sessão, meta >12 min

---

## 2. Escopo do MVP

### 2.1 Incluso

**Landing page** (já entregue em HTML/CSS):
- Plugar URLs de checkout Lastlink nos dois botões de plano
- Adicionar GA4 e Meta Pixel

**Autenticação:**
- Login por e-mail (magic link) — sem senha
- Validação de acesso via API Lastlink (cache 5-15 min)
- Sessão persistente (cookie httpOnly); logout manual ou por expiração
- Página de boas-vindas no primeiro acesso (tour 60-90s)

**Biblioteca de roteiros (grid Netflix):**
- Home com grid de cards estilo Netflix
- Cards: capa cinematográfica, título, data de publicação
- Hover: animação scale(1.05-1.1) + preview sinopse + botões "Ver roteiro" e "Baixar PDF"
- Filtros: mês de publicação, tema (guerra, política, ciência…), tipo (bastidor, evento…)
- Múltipla seleção nos filtros; combinação como AND
- Busca textual (título, sinopse, tags) com debounce 300ms
- Ordenação: mais recentes (padrão), alfabético, cronológico inverso
- Carrosséis temáticos opcionais (ex: "Os mais baixados", "Bastidores históricos")

**Página de roteiro individual:**
- Capa cinematográfica hero (tela cheia)
- Título, data, link clicável para o vídeo no Instagram
- Sinopse / contexto do tema (2-3 parágrafos)
- Botão download PDF (marca d'água dinâmica)
- Navegação: roteiro anterior / próximo

**Painel administrativo:**
- CRUD de roteiros: criar, editar, agendar publicação, despublicar
- Upload de capa (imagem) e PDF; gerenciamento de metadados
- Agendamento automático: roteiro vira público em `available_at` (1h antes da pub. no Instagram)
- Visualização de assinantes ativos via API Lastlink (somente leitura)
- Audit log de ações administrativas
- Acesso: /admin, login+senha+2FA, roles: admin | operator

**Integrações:**
- Lastlink (API + webhooks)
- E-mail transacional (Resend ou SendGrid)
- GA4 + Meta Pixel

### 2.2 Fora do escopo (v2)
- Banco próprio de assinantes
- Painel financeiro próprio
- Painel "minha conta" para assinante
- Embed de vídeos do Instagram
- App mobile nativo
- Comunidade (chat, fórum, comentários)
- Afiliados / cupons
- Internacionalização

---

## 3. Arquitetura

### Stack escolhida pela equipe
- **Backend:** Laravel 12, MySQL, Sanctum (sessão httpOnly), Redis (cache Lastlink + queues)
- **Frontend:** React 19, Vite, Tailwind CSS v4
- **Storage:** S3 ou Filesystem local → CDN para capas e PDFs master
- **Email:** Resend (preferencial) ou SendGrid

### Modelo de dados

```sql
-- roteiros (conteúdo gerenciado pelo admin)
id (uuid, PK)
title, slug (unique), synopsis (text)
cover_image_url, pdf_file_url
instagram_post_url (nullable)
themes (JSON array de strings)
published_at (timestamp)    -- data de publicação no Instagram
available_at (timestamp)    -- 1h antes do published_at → quando libera no portal
is_published (boolean, default false)
created_at, updated_at

-- sessions (sessões de magic link ativas)
id (uuid, PK)
email, token_hash (unique)
expires_at (timestamp)
created_at

-- downloads (audit log)
id (uuid, PK)
email, roteiro_id (FK), downloaded_at, ip_address

-- webhooks_log
id (uuid, PK)
event_type, payload (JSON), processed_at
status (enum: success|failed), error_message (nullable)

-- admin_users
id (uuid, PK)
email (unique), password_hash, totp_secret
role (enum: admin|operator)
created_at

-- admin_audit_log
id (uuid, PK)
admin_user_id (FK), action (string), target_id (uuid)
details (JSON), created_at
```

### Fluxo de validação de acesso
1. Usuário acessa rota protegida → middleware verifica cookie de sessão
2. Middleware consulta API Lastlink: `GET /api/v1/subscribers/{email}`
3. Se `subscription.status = active` → libera; se não → encerra sessão, redireciona com mensagem
4. Resultado cacheado por 5-15 min

### Fluxo de compra
1. Visitante clica "Assinar" → redirect para URL de checkout Lastlink
2. Lastlink processa pagamento → dispara webhook `Purchase_Order_Confirmed`
3. Portal recebe webhook → registra log → envia e-mail de boas-vindas customizado
4. Assinante clica no link → magic link → tour de boas-vindas → /biblioteca

---

## 4. Webhooks Lastlink

**Endpoint:** `POST /api/webhooks/lastlink`  
**Auth:** HMAC signature (secret configurado na Lastlink)

| Evento | Ação |
|--------|------|
| Purchase_Order_Confirmed | Log + e-mail boas-vindas com link de acesso |
| Subscription_Renewed | Log + e-mail opcional |
| Subscription_Canceled | Log + e-mail pesquisa/oferta anual |
| Payment_Refund | Log + invalidar sessões do e-mail |
| Payment_Chargeback | Log + invalidar sessões + notificar Danuzio |

- Webhook registrado em `webhooks_log` antes de qualquer processamento
- ID único do evento para detectar duplicações (idempotência)
- Endpoint responde 200 rápido; processamento pesado em Job assíncrono

---

## 5. Grid Netflix – Especificações

**Cards:**
- Grid responsivo: 4 col desktop, 2-3 tablet, 1-2 mobile
- Aspect ratio: 2:3 (poster) ou 16:9 (thumbnail)
- Capa em cobertura total; título sobreposto no terço inferior com gradiente
- Tag de tema visível em destaque

**Hover (desktop):**
- Scale 1.05-1.1, transição 200-300ms
- Sobreposição escura + sinopse curta 1-2 linhas
- Botões "Ver roteiro" e "Baixar PDF"
- Mobile: sem hover; clique vai direto para a página individual

**Filtros:**
- Barra fixa no topo da biblioteca
- Filtro por mês (dropdown com meses que têm roteiros)
- Filtro por tema (tags clicáveis, múltipla seleção)
- Filtro por tipo (dropdown ou tabs)
- Combinação como AND; botão "Limpar filtros" sempre visível

**Busca:**
- Debounce 300ms
- Procura em: título, sinopse, tags, personagens
- Highlight do termo; mensagem clara quando sem resultados

**Ordenação:**
- Padrão: mais recentes (published_at desc)
- Opções: alfabético asc/desc, cronológico asc/desc

**Carrosséis (opcional):**
- Acima do grid, por tema (estilo Netflix homepage)
- Setas de navegação horizontal; mobile: scroll horizontal nativo

---

## 6. Marca D'água Dinâmica

- Cada download gera PDF único (sem cache compartilhado)
- Marca d'água em cada página: `"[Nome] · [email] · Download em [data] · ID: [hash]"`
- Rodapé centralizado, opacidade 30%, cinza médio
- Cabeçalho: logo Backstage + "Confidencial — distribuição proibida"
- Download registrado em `downloads` (auditoria)
- Performance: < 3 segundos para PDF de 5-10 páginas
- Biblioteca sugerida: `setasign/fpdi` ou `spatie/laravel-pdf`

---

## 7. Painel Administrativo

- Rota `/admin` protegida (login + senha + 2FA TOTP)
- Roles: `admin` (tudo), `operator` (CRUD roteiros, sem gerenciar admins)
- Audit log de todas as ações em `admin_audit_log`

**CRUD de roteiros:**
- Lista com filtros: publicados / agendados / rascunhos
- Formulário: título, slug, sinopse, temas (tags), data pub. Instagram, data disponibilização portal (1h antes)
- Upload de capa (imagem) e PDF
- Preview antes de publicar
- Edição com confirmação dupla
- Agendamento automático via cron (command artisan)

**Visualização de assinantes:**
- Consulta API Lastlink (somente leitura)
- Filtros por status e plano
- Link direto para painel Lastlink para gerenciar

---

## 8. Comunicação Transacional

| Gatilho | Momento | Conteúdo |
|---------|---------|----------|
| Magic link | On-demand | Link de login (expira em 15 min) |
| Boas-vindas | Webhook compra | Confirmação + link de acesso + instruções |
| Onboarding D1 | 24h após | Tour rápido (vídeo 90s) |
| Onboarding D3 | 72h após | 3 roteiros recomendados |
| Onboarding D7 | 7 dias após | Pedido de feedback inicial |
| Novo roteiro | 1h antes da pub. | Capa, teaser, CTA direto |
| Retenção D25 | Dia 25 do ciclo | Roteiros não acessados no mês |
| Cancelamento | Webhook cancelado | Pesquisa motivo + oferta anual |

- Todos os e-mails seguem identidade visual Backstage (preto, dourado, serifa)
- Versão texto-puro disponível
- Atenção: Lastlink também envia e-mail próprio → desabilitar se possível, ou enviar o nosso explicando que o acesso correto é via portal

---

## 9. Cronograma

**Total estimado:** 4 semanas (1 dev full-time), 80-140h.

- **Sprint 1 (semana 1):** Setup, schema, magic link, validação Lastlink, deploy
- **Sprint 2 (semana 2):** Webhooks, e-mails, CRUD admin, uploads, grid
- **Sprint 3 (semana 3):** Filtros, busca, página roteiro, marca d'água
- **Sprint 4 (semana 4):** Onboarding emails, seed histórico, testes E2E, lançamento

---

## 10. Riscos

| Risco | Mitigação |
|-------|-----------|
| API Lastlink não permite consulta por e-mail | Plano B: cache leve atualizado por webhooks |
| Webhook falha | Endpoint idempotente; retry manual no admin; Lastlink ainda envia seu e-mail |
| Cronograma atrasa | Cortes de escopo (simplificar filtros, carrosséis para v2) |
| Vazamento de PDFs | Marca d'água identificável + termos de uso |
| Lastlink muda API | Logs detalhados; acompanhar changelog |
