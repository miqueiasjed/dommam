<?php

namespace Tests\Feature\Download;

use App\Models\Download;
use App\Models\Roteiro;
use App\Services\Auth\LastlinkService;
use App\Services\Download\MarcaDaguaService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DownloadTest extends TestCase
{
    use RefreshDatabase;

    private string $emailMembro = 'membro@exemplo.com';

    // ——————————————————————————————————————
    // Helpers privados
    // ——————————————————————————————————————

    /**
     * Gera o cookie de sessão no formato esperado pelo SessaoService.
     */
    private function cookieSessao(?string $email = null): string
    {
        $email ??= $this->emailMembro;

        return base64_encode(json_encode([
            'email'     => $email,
            'criado_em' => now()->toIso8601String(),
            'expira_em' => now()->addDays(30)->toIso8601String(),
        ]));
    }

    /**
     * Cria um Roteiro publicado com pdf_url apontando para um caminho de teste.
     */
    private function criarRoteiroPublicado(string $slug = 'roteiro-teste'): Roteiro
    {
        return Roteiro::create([
            'titulo'      => 'Roteiro de Teste',
            'slug'        => $slug,
            'descricao'   => 'Roteiro para testes automatizados',
            'pdf_url'     => 'roteiros/roteiro-teste.pdf',
            'status'      => 'publicado',
            'publicado_em' => now(),
        ]);
    }

    /**
     * Configura mocks padrão para LastlinkService (ativo) e MarcaDaguaService.
     * Retorna bytes de PDF mínimo para evitar dependência do FPDI.
     */
    private function mockServicosDownload(): void
    {
        $this->mock(LastlinkService::class, function ($mock) {
            $mock->shouldReceive('assinaturaAtiva')->andReturn(true);
        });

        // PDF mínimo válido (header PDF real para evitar erros de parse)
        $pdfMinimo = "%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\nxref\n0 1\n0000000000 65535 f \ntrailer\n<< /Size 1 >>\nstartxref\n9\n%%EOF";

        $this->mock(MarcaDaguaService::class, function ($mock) use ($pdfMinimo) {
            $mock->shouldReceive('aplicar')->andReturn($pdfMinimo);
        });

        Storage::shouldReceive('get')
            ->andReturn($pdfMinimo);
    }

    // ——————————————————————————————————————
    // Testes
    // ——————————————————————————————————————

    public function test_download_sem_sessao_retorna_401(): void
    {
        $roteiro = $this->criarRoteiroPublicado();

        $response = $this->getJson("/api/roteiros/{$roteiro->slug}/download");

        $response->assertStatus(401);
    }

    public function test_download_com_assinatura_inativa_retorna_403(): void
    {
        $this->mock(LastlinkService::class, function ($mock) {
            $mock->shouldReceive('assinaturaAtiva')->andReturn(false);
        });

        $roteiro = $this->criarRoteiroPublicado();

        $response = $this->withCredentials()
            ->withUnencryptedCookie('backstage_sessao', $this->cookieSessao())
            ->getJson("/api/roteiros/{$roteiro->slug}/download");

        $response->assertStatus(403);
    }

    public function test_download_com_sessao_valida_retorna_pdf(): void
    {
        $this->mockServicosDownload();

        $roteiro = $this->criarRoteiroPublicado();

        $response = $this->withCredentials()
            ->withUnencryptedCookie('backstage_sessao', $this->cookieSessao())
            ->get("/api/roteiros/{$roteiro->slug}/download");

        $response->assertStatus(200);
        $this->assertStringContainsString('application/pdf', $response->headers->get('Content-Type'));
        $this->assertStringContainsString('attachment', $response->headers->get('Content-Disposition'));
    }

    public function test_download_registra_no_banco(): void
    {
        $this->mockServicosDownload();

        $roteiro = $this->criarRoteiroPublicado();

        $this->withCredentials()
            ->withUnencryptedCookie('backstage_sessao', $this->cookieSessao())
            ->get("/api/roteiros/{$roteiro->slug}/download");

        $this->assertDatabaseCount('downloads', 1);

        $this->assertDatabaseHas('downloads', [
            'email'      => $this->emailMembro,
            'roteiro_id' => $roteiro->id,
        ]);
    }

    public function test_download_roteiro_nao_publicado_retorna_404(): void
    {
        $this->mock(LastlinkService::class, function ($mock) {
            $mock->shouldReceive('assinaturaAtiva')->andReturn(true);
        });

        Roteiro::create([
            'titulo'  => 'Rascunho',
            'slug'    => 'roteiro-rascunho',
            'status'  => 'rascunho',
        ]);

        $response = $this->withCredentials()
            ->withUnencryptedCookie('backstage_sessao', $this->cookieSessao())
            ->getJson('/api/roteiros/roteiro-rascunho/download');

        $response->assertStatus(404);
    }

    public function test_alerta_disparado_apos_50_downloads(): void
    {
        Log::spy();

        $this->mockServicosDownload();

        $roteiro = $this->criarRoteiroPublicado();

        // Cria 51 downloads anteriores para o mesmo e-mail nas últimas 24h
        $agora = now()->subHour()->toDateTimeString();
        $registros = [];
        for ($i = 0; $i < 51; $i++) {
            $registros[] = [
                'roteiro_id' => $roteiro->id,
                'email'      => $this->emailMembro,
                'ip_address' => '127.0.0.1',
                'created_at' => $agora,
                'updated_at' => $agora,
            ];
        }
        Download::insert($registros);

        $this->withCredentials()
            ->withUnencryptedCookie('backstage_sessao', $this->cookieSessao())
            ->get("/api/roteiros/{$roteiro->slug}/download");

        Log::shouldHaveReceived('warning')
            ->withArgs(function (string $mensagem) {
                return str_contains($mensagem, 'limite de downloads excedido');
            })
            ->once();
    }
}
