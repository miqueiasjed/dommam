<?php

namespace App\Http\Controllers\Download;

use App\Http\Controllers\BaseApiController;
use App\Models\Roteiro;
use App\Services\Download\DownloadService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DownloadController extends BaseApiController
{
    public function __construct(
        private readonly DownloadService $downloadService,
    ) {}

    public function baixar(Request $request, string $slug): Response
    {
        $roteiro = Roteiro::where('slug', $slug)
            ->publicados()
            ->firstOrFail();

        $email = $request->get('email_membro');
        $nome  = $request->get('nome_membro', $email); // fallback para email se nome não disponível
        $ip    = $request->ip();

        $pdf = $this->downloadService->baixar($roteiro, $email, $nome, $ip);

        $nomeArquivo = "roteiro-{$roteiro->slug}.pdf";

        return response($pdf, 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => "attachment; filename=\"{$nomeArquivo}\"",
            'Content-Length'      => strlen($pdf),
            'Cache-Control'       => 'no-store, no-cache, must-revalidate',
            'Pragma'              => 'no-cache',
        ]);
    }
}
