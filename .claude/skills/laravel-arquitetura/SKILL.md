---
name: laravel-arquitetura
description: Padrões de arquitetura Laravel para o Danuzio History Backstage — portal de membros com magic link, integração Lastlink e geração de PDF com marca d'água.
---
# Skill: Arquitetura Laravel – Danuzio History Backstage

Você está trabalhando no **Danuzio History Backstage**, um portal de membros para assinatura de roteiros históricos. Stack: **Laravel 12 + API REST + React SPA (em frontend/)**.

Estrutura do monorepo:
```
videos_ia/
├── backend/    ← Laravel 12 (esta skill se aplica aqui)
├── frontend/   ← React 19 + Vite + Tailwind CSS v4
└── CLAUDE.md
```

---

## Princípio arquitetural

A **Lastlink** é o backend oficial de assinaturas. O portal é a camada de apresentação + biblioteca de conteúdo + validador de acesso.

- Tudo que envolve **dinheiro ou status de assinatura** → Lastlink
- Tudo que envolve **experiência e conteúdo** → portal

O portal **não mantém tabela de assinantes**. Para saber se um e-mail tem acesso, consulta a API da Lastlink (com cache de 5-15 min).

---

## 1. Controllers

- Devem ser **finos**: recebe request → chama Service → retorna JSON.
- Injetam Services via construtor (`readonly`).
- Estendem `BaseApiController` com helpers `$this->success(...)`, `$this->created(...)`, `$this->error(...)`.
- Nunca chamam `Auth::user()` para passar ao Service.

**Exemplo:**
```php
class RoteiroController extends BaseApiController
{
    public function __construct(
        private readonly RoteiroService $roteiroService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $roteiros = $this->roteiroService->listar($request->validated());
        return $this->success($roteiros);
    }
}
```

---

## 2. Services

- Toda regra de negócio fica em Services em `App\Services\{Modulo}\`.
- Nunca fazem `Auth::user()` internamente — recebem o e-mail/sessão via parâmetro.
- Usam `DB::transaction()` para operações em múltiplas tabelas.
- Fazem `Log::info()` para rastreabilidade de operações críticas.

**Módulos do projeto:**
- `App\Services\Auth\` — MagicLinkService, SessaoService, LastlinkService
- `App\Services\Conteudo\` — RoteiroService, AgendamentoService
- `App\Services\Download\` — MarcaDaguaService, DownloadService
- `App\Services\Webhook\` — WebhookService, ProcessaEventoService
- `App\Services\Admin\` — AdminAuthService, AuditLogService
- `App\Services\Email\` — EmailService (wraps Resend/SendGrid)

---

## 3. Autenticação (Magic Link — membros)

Membros autenticam por **magic link** — sem senha. Fluxo:
1. Usuário informa e-mail → `MagicLinkService::gerar($email)` cria token hash em `sessions` (expires em 15 min).
2. E-mail enviado com link `{portal}/auth/verificar?token={token}`.
3. Usuário clica → `SessaoService::verificar($token)` valida token, cria sessão ativa (cookie httpOnly).
4. A cada request em rota protegida: `LastlinkService::validarAcesso($email)` consulta API Lastlink.
5. Cache do status Lastlink por 5-15 min (Redis ou cache file).

```php
// Middleware de acesso (aplica em todas as rotas do membro)
class VerificarAssinaturaAtiva
{
    public function handle(Request $request, Closure $next)
    {
        $sessao = $this->sessaoService->sessaoAtiva($request);
        if (!$sessao) return $this->error('Sessão inválida', 401);
        
        $ativo = $this->lastlinkService->assinaturaAtiva($sessao->email);
        if (!$ativo) return $this->error('Assinatura inativa', 403);
        
        $request->merge(['email_membro' => $sessao->email]);
        return $next($request);
    }
}
```

---

## 4. Autenticação Admin (separada dos membros)

Admins usam login + senha + TOTP (2FA). Ficam em `admin_users` — tabela separada dos membros.

```php
// Rotas admin separadas
Route::prefix('admin')->group(function () {
    Route::post('login', [AdminAuthController::class, 'login']);
    Route::post('2fa/verificar', [AdminAuthController::class, 'verificar2FA']);
    Route::middleware('auth.admin')->group(function () {
        Route::apiResource('roteiros', AdminRoteiroController::class);
    });
});
```

---

## 5. Validação (FormRequests)

- **Toda validação vai para FormRequests** em `App\Http\Requests\{Modulo}\`.
- Nunca usar `$request->validate()` nos controllers.
- Mensagens de erro em **português** no método `messages()`.

**Estrutura:**
```
App\Http\Requests\
├── Auth\      (SolicitarMagicLinkRequest, VerificarTokenRequest)
├── Admin\     (LoginAdminRequest, CriarRoteiroRequest, AtualizarRoteiroRequest)
└── Webhook\   (WebhookLastlinkRequest)
```

---

## 6. Models (Eloquent)

- Models **nunca** contêm regras de negócio.
- Permitido: Accessors, Mutators, Scopes simples.

**Tabelas do projeto:**
```
App\Models\
├── Roteiro          — id, title, slug, synopsis, cover_image_url, pdf_file_url,
│                      instagram_post_url, themes (JSON), published_at, available_at,
│                      is_published, created_at, updated_at
├── Sessao           — id, email, token_hash, expires_at, created_at
├── Download         — id, email, roteiro_id, downloaded_at, ip_address
├── WebhookLog       — id, event_type, payload (JSON), processed_at, status, error_message
├── AdminUser        — id, email, password_hash, totp_secret, role (admin|operator), created_at
└── AdminAuditLog    — id, admin_user_id, action, target_id, details (JSON), created_at
```

---

## 7. Webhooks Lastlink

Eventos a processar em `POST /api/webhooks/lastlink`:

| Evento | Ação |
|--------|------|
| `Purchase_Order_Confirmed` | Log + e-mail boas-vindas com link de acesso |
| `Subscription_Renewed` | Log + e-mail opcional de agradecimento |
| `Subscription_Canceled` | Log + e-mail pesquisa/oferta anual |
| `Payment_Refund` | Log + invalidar sessões ativas do e-mail |
| `Payment_Chargeback` | Log + invalidar sessões + notificar Danuzio |

**Fluxo assíncrono:**
```php
class WebhookController extends BaseApiController
{
    public function receber(Request $request): JsonResponse
    {
        // 1. Valida HMAC signature
        // 2. Registra em webhooks_log imediatamente
        // 3. Despacha Job assíncrono
        ProcessaWebhookJob::dispatch($webhookLog->id);
        return $this->success(['recebido' => true]); // responde 200 rápido
    }
}
```

---

## 8. PDF com Marca D'água

```php
// App\Services\Download\MarcaDaguaService
public function gerar(Roteiro $roteiro, string $email, string $nome): string
{
    $master = Storage::get($roteiro->pdf_file_url);
    // Aplica marca d'água em cada página: "Nome · email · Download em DATA · ID: HASH"
    // Rodapé centralizado, opacidade 30%, cor cinza médio
    // Cabeçalho: logo Backstage + "Confidencial — distribuição proibida"
    $pdf = $this->aplicarMarcaDagua($master, $email, $nome);
    return $pdf; // retorna bytes do PDF personalizado
}
```

- Biblioteca sugerida: `setasign/fpdi` ou `spatie/laravel-pdf`
- **Sem cache** — cada PDF é gerado na hora, único por usuário
- Meta de performance: < 3 segundos para PDF de 5-10 páginas

---

## 9. Jobs e Filas

- Jobs em `App\Jobs\{Modulo}\` para processamento assíncrono.
- Usar `php artisan queue:work` com driver Redis ou database.

**Jobs do projeto:**
- `ProcessaWebhookJob` — processa eventos Lastlink de forma assíncrona
- `EnviarEmailJob` — envia e-mails via serviço transacional
- `PublicarRoteiroJob` — cron para publicar roteiros agendados

---

## 10. Agendamento (Cron)

```php
// app/Console/Kernel.php
$schedule->command('roteiros:publicar-agendados')->everyMinute();

// Artisan Command
class PublicarRoteirosAgendados extends Command
{
    public function handle(RoteiroService $service): void
    {
        $service->publicarAgendados(); // muda is_published=true onde available_at <= now()
    }
}
```

---

## 11. Idioma

- Variáveis, métodos, nomes de classes (domínio): **português**
- Exceções técnicas Laravel permanecem em inglês: `Controller`, `Service`, `Request`, `Job`, `Command`, `Middleware`
- Mensagens de validação e respostas de API: **português**

---

## Ordem mental obrigatória

1. É regra de negócio? → **Service** em `App\Services\{Modulo}\`
2. É validação de input? → **FormRequest** em `App\Http\Requests\{Modulo}\`
3. É checagem de sessão/assinatura? → **Middleware** customizado
4. É processamento demorado/async? → **Job** em `App\Jobs\{Modulo}\`
5. É tarefa agendada? → **Command** via `$schedule`
6. É geração de PDF? → `MarcaDaguaService` no `App\Services\Download\`

Use este skill sempre que gerar código Laravel no `backend/`.
