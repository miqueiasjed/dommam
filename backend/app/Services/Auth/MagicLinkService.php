<?php

namespace App\Services\Auth;

use App\Models\Sessao;
use App\Services\Email\EmailService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class MagicLinkService
{
    public function __construct(
        private readonly EmailService $emailService,
    ) {}

    public function gerar(string $email): void
    {
        // Revogar tokens anteriores não usados do mesmo e-mail
        Sessao::where('email', $email)->whereNull('usado_em')->delete();

        $token = bin2hex(random_bytes(32)); // 64 chars hex
        $tokenHash = hash('sha256', $token);

        Sessao::create([
            'email'      => strtolower(trim($email)),
            'token_hash' => $tokenHash,
            'expira_em'  => Carbon::now()->addMinutes(15),
        ]);

        $this->emailService->enviarMagicLink($email, $token);

        Log::info('Magic link gerado', ['email' => $email]);
    }
}
