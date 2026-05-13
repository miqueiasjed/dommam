<?php

namespace Tests\Feature\Auth;

use App\Models\Sessao;
use App\Services\Auth\LastlinkService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class MagicLinkTest extends TestCase
{
    use RefreshDatabase;

    // ——————————————————————————————————————
    // POST /api/auth/solicitar-link
    // ——————————————————————————————————————

    public function test_solicitar_link_com_email_valido_retorna_200(): void
    {
        Mail::fake();

        $response = $this->postJson('/api/auth/solicitar-link', [
            'email' => 'teste@exemplo.com',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('sucesso', true);

        $this->assertDatabaseHas('sessions', ['email' => 'teste@exemplo.com']);
    }

    public function test_solicitar_link_com_email_invalido_retorna_422(): void
    {
        $response = $this->postJson('/api/auth/solicitar-link', [
            'email' => 'nao-e-um-email',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_solicitar_link_invalida_token_anterior_do_mesmo_email(): void
    {
        Mail::fake();

        Sessao::create([
            'email'      => 'teste@exemplo.com',
            'token_hash' => hash('sha256', 'token-antigo'),
            'expira_em'  => Carbon::now()->addMinutes(10),
        ]);

        $this->postJson('/api/auth/solicitar-link', ['email' => 'teste@exemplo.com']);

        // Deve haver apenas 1 token ativo (o novo, o antigo foi revogado)
        $this->assertDatabaseCount('sessions', 1);
    }

    // ——————————————————————————————————————
    // GET /api/auth/verificar?token=xxx
    // ——————————————————————————————————————

    public function test_verificar_token_valido_retorna_200_e_cookie(): void
    {
        $token = bin2hex(random_bytes(32));
        Sessao::create([
            'email'      => 'membro@exemplo.com',
            'token_hash' => hash('sha256', $token),
            'expira_em'  => Carbon::now()->addMinutes(15),
        ]);

        $response = $this->getJson("/api/auth/verificar?token={$token}");

        $response->assertStatus(200)
            ->assertJsonPath('sucesso', true)
            ->assertJsonPath('dados.email', 'membro@exemplo.com')
            ->assertCookie('backstage_sessao');
    }

    public function test_verificar_token_expirado_retorna_401(): void
    {
        $token = bin2hex(random_bytes(32));
        Sessao::create([
            'email'      => 'membro@exemplo.com',
            'token_hash' => hash('sha256', $token),
            'expira_em'  => Carbon::now()->subMinutes(1), // expirado
        ]);

        $response = $this->getJson("/api/auth/verificar?token={$token}");

        $response->assertStatus(401)
            ->assertJsonPath('sucesso', false);
    }

    public function test_verificar_token_invalido_retorna_401(): void
    {
        $response = $this->getJson('/api/auth/verificar?token=' . str_repeat('a', 64));

        $response->assertStatus(401)
            ->assertJsonPath('sucesso', false);
    }

    public function test_verificar_token_ja_usado_retorna_401(): void
    {
        $token = bin2hex(random_bytes(32));
        Sessao::create([
            'email'      => 'membro@exemplo.com',
            'token_hash' => hash('sha256', $token),
            'expira_em'  => Carbon::now()->addMinutes(15),
            'usado_em'   => Carbon::now()->subSeconds(5), // já usado
        ]);

        $response = $this->getJson("/api/auth/verificar?token={$token}");

        $response->assertStatus(401);
    }

    // ——————————————————————————————————————
    // Middleware VerificarAssinaturaAtiva
    // ——————————————————————————————————————

    public function test_rota_protegida_sem_cookie_retorna_401(): void
    {
        $response = $this->postJson('/api/auth/logout');

        $response->assertStatus(401)
            ->assertJsonPath('sucesso', false);
    }

    public function test_rota_protegida_com_assinatura_inativa_retorna_403(): void
    {
        $this->mock(LastlinkService::class, function ($mock) {
            $mock->shouldReceive('assinaturaAtiva')->andReturn(false);
        });

        $sessaoPayload = base64_encode(json_encode([
            'email'     => 'inativo@exemplo.com',
            'criado_em' => now()->toIso8601String(),
            'expira_em' => now()->addDays(30)->toIso8601String(),
        ]));

        $response = $this->withCredentials()
            ->withUnencryptedCookie('backstage_sessao', $sessaoPayload)
            ->postJson('/api/auth/logout');

        $response->assertStatus(403)
            ->assertJsonPath('sucesso', false);
    }

    // ——————————————————————————————————————
    // POST /api/auth/logout
    // ——————————————————————————————————————

    public function test_logout_com_sessao_valida_retorna_200_e_remove_cookie(): void
    {
        $this->mock(LastlinkService::class, function ($mock) {
            $mock->shouldReceive('assinaturaAtiva')->andReturn(true);
        });

        $sessaoPayload = base64_encode(json_encode([
            'email'     => 'ativo@exemplo.com',
            'criado_em' => now()->toIso8601String(),
            'expira_em' => now()->addDays(30)->toIso8601String(),
        ]));

        $response = $this->withCredentials()
            ->withUnencryptedCookie('backstage_sessao', $sessaoPayload)
            ->postJson('/api/auth/logout');

        $response->assertStatus(200)
            ->assertJsonPath('sucesso', true)
            ->assertCookieExpired('backstage_sessao');
    }
}
