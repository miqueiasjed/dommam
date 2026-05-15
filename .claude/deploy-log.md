# Deploy Log — Danuzio History Backstage

Registro das tentativas de deploy no Laravel Forge, erros encontrados e soluções aplicadas.

---

## Configuração do Forge (dommam.com)

| Campo | Valor |
|---|---|
| Servidor | danuzio-news |
| Site | dommam.com |
| Root Directory | `/backend` |
| Web Directory | `/public` |
| PHP Version | 8.3 |
| Deploy Script | ver seção abaixo |

### Deploy Script atual

```bash
$CREATE_RELEASE()

cd $FORGE_RELEASE_DIRECTORY/backend

$FORGE_COMPOSER install --no-dev --no-interaction --prefer-dist --optimize-autoloader
$FORGE_PHP artisan config:cache
$FORGE_PHP artisan route:cache
$FORGE_PHP artisan event:cache
$FORGE_PHP artisan storage:link
$FORGE_PHP artisan migrate --force

cd $FORGE_RELEASE_DIRECTORY/frontend

npm ci || npm install
npm run build

$ACTIVATE_RELEASE()

$RESTART_QUEUES()
```

---

## Histórico de Erros e Soluções

### ❌ Erro 1 — composer.json não encontrado na raiz
**Mensagem:** `Composer could not find a composer.json file in /home/forge/dommam.com/releases/000000`  
**Causa:** Forge procurava `composer.json` na raiz do repo, mas o Laravel está em `backend/`.  
**Solução:** Configurar Root Directory como `/backend` no Forge. O deploy script usa `cd $FORGE_RELEASE_DIRECTORY/backend`.

---

### ❌ Erro 2 — PHP incompatível (Symfony 8.x requer PHP 8.4)
**Mensagem:** `symfony/clock v8.0.8 requires php >=8.4 -> your php version (8.3.23) does not satisfy`  
**Causa:** `composer.lock` foi gerado localmente com PHP 8.4, mas o servidor roda PHP 8.3.  
**Solução:**
- Adicionado `platform: {"php": "8.3.0"}` ao `composer.json` (config section)
- Alterado `"php": "^8.2"` para `"php": "^8.3"`
- Rodado `composer update` para regenerar o lock com Symfony 7.4.x

---

### ❌ Erro 3 — APP_KEY não definida
**Mensagem:** `No application encryption key has been specified`  
**Causa:** `.env` no Forge estava sem `APP_KEY`.  
**Solução:**
1. SSH no servidor → `cd /home/forge/dommam.com/current/backend`
2. `php artisan key:generate` (grava no shared `.env` via symlink)
3. Copiar o valor gerado para o Forge Environment

---

### ❌ Erro 4 — Tabela `sessions` com estrutura errada
**Mensagem:** `Unknown column 'payload' in 'field list'`  
**Causa:** O projeto tem duas tabelas de sessão:
- `sessions` → tokens de magic link (tabela custom do projeto, **sem** coluna `payload`)
- `laravel_sessions` → session driver do Laravel (com `payload`, `id`, `last_activity`)

O Laravel estava usando a tabela `sessions` como session driver por padrão.  
**Solução:**
1. Adicionado `SESSION_TABLE=laravel_sessions` no Forge Environment
2. Adicionado `SESSION_TABLE=laravel_sessions` ao `.env.example`
3. Via SSH: `php artisan config:clear && php artisan config:cache`

**Fix adicional necessário (sessions em estado inconsistente):**
```bash
php artisan tinker --execute="DB::statement('DROP TABLE IF EXISTS sessions;'); DB::table('migrations')->where('migration', 'like', '%sessions%')->delete(); echo 'OK';"
php artisan migrate --force
```

---

### ❌ Erro 5 — "Please provide a valid cache path" (Blade)
**Mensagem:** `Please provide a valid cache path at Compiler.php:75`  
**Causa:** A rota `/` em `web.php` chamava `view('welcome')`, que tenta compilar um template Blade. O backend é API-only e não tem storage de views configurado.  
**Solução:** Substituído em `backend/routes/web.php`:
```php
// Antes
Route::get('/', fn() => view('welcome'));

// Depois
Route::get('/', fn() => response()->json(['status' => 'ok']));
```

---

## Variáveis de Ambiente obrigatórias no Forge

```env
APP_NAME="Danuzio History Backstage"
APP_ENV=production
APP_KEY=base64:...          # gerado com php artisan key:generate --show
APP_DEBUG=false
APP_URL=https://dommam.com
FRONTEND_URL=https://dommam.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=dommam
DB_USERNAME=...
DB_PASSWORD=...

CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=database
SESSION_TABLE=laravel_sessions
SESSION_LIFETIME=120
SESSION_DOMAIN=dommam.com
SESSION_SECURE_COOKIE=true

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=resend
MAIL_FROM_ADDRESS="noreply@danuziohistory.com.br"
RESEND_API_KEY=...

LASTLINK_WEBHOOK_SECRET=...
LASTLINK_API_URL=https://lastlink.com/api/v1
LASTLINK_API_TOKEN=...
LASTLINK_API_KEY=...
LASTLINK_CACHE_TTL=600

SANCTUM_STATEFUL_DOMAINS=dommam.com
```

---

## Status atual

- [x] PHP 8.3 compatível (composer.lock com Symfony 7.4.x)
- [x] Root Directory e Web Directory configurados corretamente
- [x] APP_KEY gerada e salva no Forge Environment
- [x] SESSION_TABLE=laravel_sessions configurado
- [x] web.php sem Blade (API-only)
- [ ] Verificar se "cache path" sumiu após último deploy
- [ ] Verificar se sessions funcionam após `config:cache`
- [ ] Frontend React sendo servido corretamente
