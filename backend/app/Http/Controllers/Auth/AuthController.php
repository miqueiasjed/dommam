<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\BaseApiController;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\Auth\AutenticacaoService;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends BaseApiController
{
    public function __construct(
        private readonly AutenticacaoService $autenticacaoService,
    ) {}

    // POST /api/auth/login
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $resultado = $this->autenticacaoService->fazerLogin($request->validated());
        } catch (AuthenticationException $e) {
            return $this->error($e->getMessage(), 401);
        }

        return $this->success(dados: $resultado, mensagem: 'Login realizado com sucesso.');
    }

    // POST /api/auth/logout
    public function logout(Request $request): JsonResponse
    {
        $this->autenticacaoService->encerrarSessao($request->user());

        return $this->success(mensagem: 'Sessão encerrada com sucesso.');
    }

    // GET /api/auth/me
    public function me(Request $request): JsonResponse
    {
        return $this->success(
            dados: ['usuario' => $this->autenticacaoService->obterUsuarioAutenticado($request->user())]
        );
    }
}
