<?php

namespace Tests\Feature\Webhook;

use App\Jobs\Webhook\ProcessaWebhookJob;
use App\Models\WebhookLog;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class WebhookLastlinkTest extends TestCase
{
    use RefreshDatabase;

    private string $segredo = 'segredo-teste-123';
    private string $url = '/api/webhooks/lastlink';

    protected function setUp(): void
    {
        parent::setUp();
        config(['services.lastlink.webhook_secret' => $this->segredo]);
    }

    private function gerarAssinatura(string $payload): string
    {
        return 'sha256=' . hash_hmac('sha256', $payload, $this->segredo);
    }

    /** @test */
    public function hmac_valido_registra_webhook_e_despacha_job(): void
    {
        Queue::fake();

        $payload = json_encode([
            'event_id'       => 'evt_abc123',
            'event'          => 'Purchase_Order_Confirmed',
            'customer_email' => 'joao@teste.com',
        ]);

        $response = $this->postJson($this->url, json_decode($payload, true), [
            'X-Lastlink-Signature' => $this->gerarAssinatura($payload),
            'Content-Type'         => 'application/json',
        ]);

        $response->assertStatus(200)->assertJson(['status' => 'recebido']);
        $this->assertDatabaseHas('webhooks_log', [
            'event_id' => 'evt_abc123',
            'evento'   => 'Purchase_Order_Confirmed',
            'status'   => WebhookLog::STATUS_PENDENTE,
        ]);
        Queue::assertPushed(ProcessaWebhookJob::class);
    }

    /** @test */
    public function hmac_invalido_retorna_401(): void
    {
        Queue::fake();

        $response = $this->postJson($this->url, [
            'event_id' => 'evt_xyz',
            'event'    => 'Purchase_Order_Confirmed',
        ], [
            'X-Lastlink-Signature' => 'sha256=assinatura-errada',
        ]);

        $response->assertStatus(401);
        Queue::assertNothingPushed();
        $this->assertDatabaseCount('webhooks_log', 0);
    }

    /** @test */
    public function event_id_duplicado_nao_e_reprocessado(): void
    {
        Queue::fake();

        // Criar log já processado
        WebhookLog::create([
            'event_id'      => 'evt_dup456',
            'evento'        => 'Purchase_Order_Confirmed',
            'payload'       => ['event_id' => 'evt_dup456'],
            'status'        => WebhookLog::STATUS_PROCESSADO,
            'processado_em' => now(),
        ]);

        $payload = json_encode([
            'event_id'       => 'evt_dup456',
            'event'          => 'Purchase_Order_Confirmed',
            'customer_email' => 'joao@teste.com',
        ]);

        $response = $this->postJson($this->url, json_decode($payload, true), [
            'X-Lastlink-Signature' => $this->gerarAssinatura($payload),
        ]);

        $response->assertStatus(200)->assertJson(['status' => 'duplicado']);
        Queue::assertNothingPushed();
        // Deve continuar com apenas 1 registro (o já existente)
        $this->assertDatabaseCount('webhooks_log', 1);
    }
}
