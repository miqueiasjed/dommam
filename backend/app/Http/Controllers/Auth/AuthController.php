<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\BaseApiController;
use App\Http\Requests\Auth\SolicitarMagicLinkRequest;
use App\Http\Requests\Auth\VerificarTokenRequest;
use App\Services\Auth\MagicLinkService;
use App\Services\Auth\SessaoService;
use Illuminate\Http\JsonResponse;

class AuthController extends BaseApiController
{
    public function __construct(
        private readonly MagicLinkService $magicLinkService,
        private readonly SessaoService $sessaoService,
    ) {}

    // POST /api/auth/solicitar-link
    public function solicitarLink(SolicitarMagicLinkRequest $request): JsonResponse
    {
        $this->magicLinkService->gerar($request->validated('email'));

        return $this->success(
            mensagem: 'Link de acesso enviado para ' . $request->validated('email') . '. Verifique sua caixa de entrada.'
        );
    }

    // GET /api/auth/verificar?token=xxx
    public function verificar(VerificarTokenRequest $request): JsonResponse
    {
        $sessao = $this->sessaoService->verificar($request->validated('token'));

        if (!$sessao) {
            return $this->error('Link inválido ou expirado. Solicite um novo link de acesso.', 401);
        }

        $cookie = $this->sessaoService->criarCookieSessao($sessao->email);

        return $this->success(
            dados: ['email' => $sessao->email],
            mensagem: 'Acesso autorizado.'
        )->withCookie($cookie);
    }
}
