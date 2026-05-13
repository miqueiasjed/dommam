<?php

namespace App\Jobs\Webhook;

use App\Models\WebhookLog;
use App\Services\Webhook\ProcessaEventoService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

class ProcessaWebhookJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Número máximo de tentativas em caso de falha.
     */
    public int $tries = 3;

    /**
     * Intervalo em segundos entre retentativas.
     */
    public int $backoff = 60;

    public function __construct(
        private readonly int $webhookLogId
    ) {}

    /**
     * Processa o webhook de forma assíncrona.
     * Em caso de sucesso, marca o log como processado.
     * Em caso de falha, registra o erro e re-lança para ativar retry.
     */
    public function handle(ProcessaEventoService $service): void
    {
        $log = WebhookLog::findOrFail($this->webhookLogId);

        try {
            $service->processar($log);

            $log->update([
                'status'        => WebhookLog::STATUS_PROCESSADO,
                'processado_em' => now(),
            ]);
        } catch (Throwable $e) {
            $log->update([
                'status'        => WebhookLog::STATUS_ERRO,
                'erro_mensagem' => $e->getMessage(),
            ]);

            Log::error('Erro ao processar webhook', [
                'webhook_log_id' => $this->webhookLogId,
                'erro'           => $e->getMessage(),
            ]);

            throw $e; // re-throw para ativar retry
        }
    }
}
