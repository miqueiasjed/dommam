<?php

namespace App\Services\Admin;

use App\Models\AdminUser;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use OTPHP\TOTP;

class AdminAuthService
{
    /**
     * Tenta autenticar um admin com email e senha.
     *
     * Se o admin não tiver TOTP configurado, retorna o admin diretamente.
     * Se tiver TOTP, gera um pending token temporário (TTL 5 min) e retorna para
     * que o controller solicite o código ao usuário.
     *
     * @throws AuthenticationException Se credenciais inválidas ou admin inativo.
     */
    public function tentarLogin(string $email, string $senha): array
    {
        $admin = AdminUser::where('email', strtolower(trim($email)))
            ->where('ativo', true)
            ->first();

        if (!$admin || !Hash::check($senha, $admin->password)) {
            Log::warning('Tentativa de login admin inválida', ['email' => $email]);
            throw new AuthenticationException('Credenciais inválidas ou conta inativa.');
        }

        // Sem TOTP configurado: autenticação completa de imediato
        if (empty($admin->totp_secret)) {
            Log::info('Login admin sem 2FA', ['admin_id' => $admin->id, 'email' => $admin->email]);

            return [
                'requer_2fa' => false,
                'admin'      => $admin,
            ];
        }

        // Com TOTP: gera token temporário e aguarda verificação do código
        $pendingToken = Str::random(64);
        $chavePendente = $this->chavePendente($pendingToken);

        Cache::put($chavePendente, $admin->id, now()->addMinutes(5));

        Log::info('Login admin aguardando 2FA', ['admin_id' => $admin->id]);

        return [
            'requer_2fa'    => true,
            'pending_token' => $pendingToken,
        ];
    }

    /**
     * Verifica o código TOTP e retorna o AdminUser se válido.
     *
     * @throws AuthenticationException Se o código for inválido ou o token expirado.
     */
    public function verificar2FA(string $pendingToken, string $codigoTotp): AdminUser
    {
        $chavePendente = $this->chavePendente($pendingToken);
        $adminId = Cache::get($chavePendente);

        if (!$adminId) {
            Log::warning('Token 2FA admin expirado ou inválido');
            throw new AuthenticationException('Token expirado. Faça login novamente.');
        }

        $admin = AdminUser::find($adminId);

        if (!$admin || !$admin->ativo) {
            Cache::forget($chavePendente);
            throw new AuthenticationException('Conta de admin não encontrada ou inativa.');
        }

        $totp = TOTP::createFromSecret($admin->totp_secret);
        $totp->setLabel($admin->email);

        if (!$totp->verify($codigoTotp)) {
            Log::warning('Código TOTP admin inválido', ['admin_id' => $admin->id]);
            throw new AuthenticationException('Código de autenticação inválido.');
        }

        // Invalida o pending token após uso bem-sucedido
        Cache::forget($chavePendente);

        Log::info('Login admin com 2FA concluído', ['admin_id' => $admin->id]);

        return $admin;
    }

    /**
     * Gera um novo TOTP secret para configuração inicial de 2FA.
     */
    public function gerarTotpSecret(): string
    {
        return TOTP::create()->getSecret();
    }

    // -------------------------------------------------------------------------
    // Helpers privados
    // -------------------------------------------------------------------------

    private function chavePendente(string $token): string
    {
        return 'admin_pending_2fa:' . $token;
    }
}
