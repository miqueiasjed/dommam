<?php

namespace App\Services\Download;

use App\Models\Download;
use App\Models\Roteiro;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class DownloadService
{
    public function __construct(
        private readonly MarcaDaguaService $marcaDagua,
    ) {}

    /**
     * Orquestra o fluxo completo de download:
     * busca o PDF master, aplica marca d'água, registra e audita.
     *
     * @param  Roteiro  $roteiro  Roteiro a ser baixado
     * @param  string   $email    E-mail do membro (vem do middleware)
     * @param  string   $nome     Nome do membro (vem do middleware)
     * @param  string   $ip       IP da requisição
     * @return string             Bytes do PDF com marca d'água personalizada
     */
    public function baixar(Roteiro $roteiro, string $email, string $nome, string $ip): string
    {
        // 1. Buscar PDF master do Storage
        $pdfMaster = Storage::get($roteiro->pdf_url);
        abort_if(!$pdfMaster, 404, 'PDF não encontrado');

        // 2. Aplicar marca d'água personalizada
        $pdfPersonalizado = $this->marcaDagua->aplicar($pdfMaster, $email, $nome);

        // 3. Registrar o download no banco
        Download::create([
            'roteiro_id' => $roteiro->id,
            'email'      => $email,
            'ip_address' => $ip,
            'user_agent' => request()->userAgent(),
        ]);

        Log::info('DownloadService: download registrado', [
            'roteiro_id' => $roteiro->id,
            'slug'       => $roteiro->slug,
            'email'      => $email,
            'ip'         => $ip,
        ]);

        // 4. Verificar limite de downloads (alerta de abuso)
        $this->verificarLimite($email);

        return $pdfPersonalizado;
    }

    /**
     * Emite aviso de log quando um membro ultrapassa 50 downloads em 24 horas.
     * Não bloqueia o download — serve apenas para auditoria manual.
     */
    private function verificarLimite(string $email): void
    {
        $total = Download::porEmail($email)
            ->where('created_at', '>=', now()->subHours(24))
            ->count();

        if ($total > 50) {
            Log::warning('DownloadService: limite de downloads excedido', [
                'email'     => $email,
                'downloads' => $total,
                'periodo'   => '24h',
            ]);
        }
    }
}
