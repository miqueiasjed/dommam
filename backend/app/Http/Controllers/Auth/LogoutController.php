<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\BaseApiController;
use App\Services\Auth\SessaoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LogoutController extends BaseApiController
{
    public function __construct(
        private readonly SessaoService $sessaoService,
    ) {}

    // POST /api/auth/logout
    public function logout(Request $request): JsonResponse
    {
        $cookie = $this->sessaoService->revogar($request);

        return $this->success(mensagem: 'Sessão encerrada com sucesso.')->withCookie($cookie);
    }
}
