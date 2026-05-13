<?php

namespace App\Http\Controllers\Webhook;

use App\Http\Controllers\Controller;
use App\Jobs\Webhook\ProcessaWebhookJob;
use App\Models\WebhookLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    public function receber(Request $request): JsonResponse
    {
        // 1. Validar assinatura HMAC-SHA256
        if (!$this->hmacValido($request)) {
            Log::warning('Webhook Lastlink: HMAC inválido', [
                'ip'     => $request->ip(),
                'evento' => $request->input('event'),
            ]);

            return response()->json(['erro' => 'Assinatura inválida'], 401);
        }

        $payload  = $request->all();
        $eventId  = $payload['event_id'] ?? null;
        $evento   = $payload['event']    ?? 'desconhecido';

        // 2. Verificar idempotência via WebhookLog::jaProcessado()
        if ($eventId && WebhookLog::jaProcessado($eventId)) {
            Log::info('Webhook duplicado ignorado', ['event_id' => $eventId]);

            return response()->json(['status' => 'duplicado'], 200);
        }

        // 3. Registrar em webhooks_log com status pendente (antes de processar)
        $log = WebhookLog::create([
            'event_id' => $eventId,
            'evento'   => $evento,
            'payload'  => $payload,
            'status'   => WebhookLog::STATUS_PENDENTE,
        ]);

        // 4. Despachar job assíncrono para processamento real
        ProcessaWebhookJob::dispatch($log->id);

        Log::info('Webhook recebido', [
            'evento'   => $evento,
            'event_id' => $eventId,
            'log_id'   => $log->id,
        ]);

        // 5. Responder 200 rápido
        return response()->json(['status' => 'recebido'], 200);
    }

    // -------------------------------------------------------------------------
    // Helpers privados
    // -------------------------------------------------------------------------

    /**
     * Valida a assinatura HMAC-SHA256 enviada pela Lastlink no header X-Lastlink-Signature.
     */
    private function hmacValido(Request $request): bool
    {
        $segredo = config('services.lastlink.webhook_secret', '');

        if (empty($segredo)) {
            // Em ambiente local ou de testes, aceitar sem verificação de assinatura
            return app()->environment(['local', 'testing']);
        }

        $assinaturaRecebida  = $request->header('X-Lastlink-Signature', '');
        $payload             = $request->getContent();
        $assinaturaEsperada  = 'sha256=' . hash_hmac('sha256', $payload, $segredo);

        return hash_equals($assinaturaEsperada, $assinaturaRecebida);
    }
}
