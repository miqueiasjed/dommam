<?php

namespace App\Services\Webhook;

use App\Models\WebhookLog;
use App\Services\Auth\LastlinkService;
use App\Services\Email\EmailService;
use Illuminate\Support\Facades\Log;

class ProcessaEventoService
{
    public function __construct(
        private readonly EmailService $emailService,
        private readonly LastlinkService $lastlinkService,
    ) {}

    /**
     * Roteia o evento do webhook para o método correto conforme o tipo.
     */
    public function processar(WebhookLog $log): void
    {
        $payload = $log->payload;
        $email   = $payload['customer_email'] ?? $payload['email'] ?? null;

        match ($log->evento) {
            'Purchase_Order_Confirmed' => $this->confirmacaoCompra($email, $payload),
            'Subscription_Renewed'     => $this->renovacao($email, $payload),
            'Subscription_Canceled'    => $this->cancelamento($email),
            'Payment_Refund'           => $this->reembolso($email),
            'Payment_Chargeback'       => $this->chargeback($email),
            default => Log::info('Evento Lastlink não mapeado', ['evento' => $log->evento]),
        };
    }

    /**
     * Processa confirmação de compra: envia e-mail de boas-vindas com link de acesso.
     */
    private function confirmacaoCompra(?string $email, array $payload): void
    {
        if (!$email) return;

        // Para MVP: usa URL da landing page de login como link de primeiro acesso
        $linkAcesso = rtrim(config('app.frontend_url', 'http://localhost:5173'), '/') . '/login';

        $this->emailService->enviarBoasVindas($email, $linkAcesso);

        Log::info('Compra confirmada — boas-vindas enviado', ['email' => $email]);
    }

    /**
     * Processa renovação de assinatura: invalida cache para forçar revalidação.
     */
    private function renovacao(?string $email, array $payload): void
    {
        if (!$email) return;

        $this->lastlinkService->invalidarCache($email);

        Log::info('Assinatura renovada — cache invalidado', ['email' => $email]);
    }

    /**
     * Processa cancelamento: invalida cache e envia e-mail de cancelamento.
     */
    private function cancelamento(?string $email): void
    {
        if (!$email) return;

        $this->lastlinkService->invalidarCache($email);

        $this->emailService->enviarCancelamento($email);

        Log::info('Assinatura cancelada — cache invalidado + e-mail enviado', ['email' => $email]);
    }

    /**
     * Processa reembolso: invalida cache — middleware bloqueará acesso no próximo request.
     */
    private function reembolso(?string $email): void
    {
        if (!$email) return;

        $this->lastlinkService->invalidarCache($email);

        Log::warning('Reembolso processado — acesso invalidado', ['email' => $email]);
    }

    /**
     * Processa chargeback: invalida cache e emite alerta crítico para Danuzio.
     */
    private function chargeback(?string $email): void
    {
        if (!$email) return;

        $this->lastlinkService->invalidarCache($email);

        Log::critical('CHARGEBACK detectado!', ['email' => $email]);
    }
}
