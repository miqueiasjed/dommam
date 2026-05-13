<?php

namespace App\Services\Auth;

use App\Models\Sessao;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Cookie;

class SessaoService
{
    private string $nomeCookie = 'backstage_sessao';
    private int $duracaoSessaoDias = 30;

    public function verificar(string $token): ?Sessao
    {
        $tokenHash = hash('sha256', $token);

        $sessao = Sessao::ativa()->where('token_hash', $tokenHash)->first();

        if (!$sessao) {
            return null; // token inválido ou expirado
        }

        // Marcar como usado (invalida o token para evitar reuso)
        $sessao->update(['usado_em' => Carbon::now()]);

        Log::info('Magic link verificado com sucesso', ['email' => $sessao->email]);

        return $sessao;
    }

    public function criarCookieSessao(string $email): Cookie
    {
        $payload = base64_encode(json_encode([
            'email'     => $email,
            'criado_em' => Carbon::now()->toIso8601String(),
            'expira_em' => Carbon::now()->addDays($this->duracaoSessaoDias)->toIso8601String(),
        ]));

        return cookie(
            name: $this->nomeCookie,
            value: $payload,
            minutes: $this->duracaoSessaoDias * 24 * 60,
            path: '/',
            secure: app()->environment('production'),
            httpOnly: true,
            sameSite: 'Lax',
        );
    }

    public function sessaoAtiva(Request $request): ?object
    {
        $cookieValue = $request->cookie($this->nomeCookie);

        if (!$cookieValue) {
            return null;
        }

        try {
            $dados = json_decode(base64_decode($cookieValue));

            if (!$dados || !isset($dados->email, $dados->expira_em)) {
                return null;
            }

            if (Carbon::parse($dados->expira_em)->isPast()) {
                return null; // cookie expirado
            }

            return $dados;
        } catch (\Exception) {
            return null;
        }
    }

    public function revogar(Request $request): Cookie
    {
        Log::info('Sessão revogada');

        return cookie()->forget($this->nomeCookie);
    }
}
