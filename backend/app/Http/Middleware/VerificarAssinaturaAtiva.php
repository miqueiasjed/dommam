<?php

namespace App\Http\Middleware;

use App\Services\Auth\LastlinkService;
use App\Services\Auth\SessaoService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerificarAssinaturaAtiva
{
    public function __construct(
        private readonly SessaoService $sessaoService,
        private readonly LastlinkService $lastlinkService,
    ) {}

    public function handle(Request $request, Closure $next): Response
    {
        $sessao = $this->sessaoService->sessaoAtiva($request);

        if (!$sessao) {
            return response()->json([
                'sucesso'  => false,
                'mensagem' => 'Sessão inválida ou expirada. Solicite um novo link de acesso.',
            ], 401);
        }

        $ativo = $this->lastlinkService->assinaturaAtiva($sessao->email);

        if (!$ativo) {
            return response()->json([
                'sucesso'  => false,
                'mensagem' => 'Assinatura inativa. Acesse lastlink.com para renovar.',
            ], 403);
        }

        // Injeta o e-mail do membro no request para uso nos controllers
        $request->merge(['email_membro' => $sessao->email]);

        return $next($request);
    }
}
