<?php

namespace App\Services\Auth;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LastlinkService
{
    private string $baseUrl;
    private string $apiKey;
    private int $cacheTtlSegundos;

    public function __construct()
    {
        $this->baseUrl = config('services.lastlink.url', 'https://lastlink.com/api/v1');
        $this->apiKey = config('services.lastlink.api_key', '');
        $this->cacheTtlSegundos = (int) config('services.lastlink.cache_ttl', 600); // 10 min padrão
    }

    public function assinaturaAtiva(string $email): bool
    {
        $chave = 'lastlink:assinatura:' . md5(strtolower($email));

        return Cache::remember($chave, $this->cacheTtlSegundos, function () use ($email) {
            return $this->consultarLastlink($email);
        });
    }

    private function consultarLastlink(string $email): bool
    {
        try {
            $response = Http::withToken($this->apiKey)
                ->timeout(5)
                ->get("{$this->baseUrl}/subscribers/{$email}");

            if ($response->successful()) {
                $status = $response->json('status');
                $ativo = in_array($status, ['active', 'trialing']);

                Log::info('Consulta Lastlink realizada', [
                    'email' => $email,
                    'status' => $status,
                    'ativo' => $ativo,
                ]);

                return $ativo;
            }

            if ($response->status() === 404) {
                Log::info('E-mail não encontrado na Lastlink', ['email' => $email]);
                return false; // e-mail não encontrado = sem assinatura
            }

            Log::warning('Lastlink retornou status inesperado', [
                'email' => $email,
                'status_http' => $response->status(),
                'body' => $response->body(),
            ]);

            return false; // fail closed
        } catch (\Exception $e) {
            Log::error('Falha ao consultar Lastlink', [
                'email' => $email,
                'erro' => $e->getMessage(),
            ]);
            return false; // fail closed — sem acesso em caso de falha
        }
    }

    public function listarAssinantes(array $filtros = []): array
    {
        try {
            $query = array_filter([
                'status' => $filtros['status'] ?? null,
                'plan'   => $filtros['plano'] ?? null,
            ]);

            $response = Http::withToken($this->apiKey)
                ->timeout(10)
                ->get("{$this->baseUrl}/subscribers", $query);

            if ($response->successful()) {
                $corpo = $response->json();
                $registros = $corpo['data'] ?? $corpo['subscribers'] ?? $corpo ?? [];

                return array_map(fn ($item) => [
                    'id'          => $item['id'] ?? null,
                    'email'       => $item['email'] ?? '',
                    'plano'       => $item['plan'] ?? $item['plano'] ?? '',
                    'status'      => $item['status'] ?? '',
                    'criado_em'   => $item['created_at'] ?? $item['criado_em'] ?? null,
                    'lastlink_url' => $item['url'] ?? $item['lastlink_url'] ?? null,
                ], is_array($registros) ? $registros : []);
            }

            Log::warning('Lastlink: falha ao listar assinantes', [
                'status_http' => $response->status(),
                'body'        => $response->body(),
            ]);

            return [];
        } catch (\Exception $e) {
            Log::error('Lastlink: exceção ao listar assinantes', ['erro' => $e->getMessage()]);

            return [];
        }
    }

    public function invalidarCache(string $email): void
    {
        $chave = 'lastlink:assinatura:' . md5(strtolower($email));
        Cache::forget($chave);

        Log::info('Cache Lastlink invalidado', ['email' => $email]);
    }
}
