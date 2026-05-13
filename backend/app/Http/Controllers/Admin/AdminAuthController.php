<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseApiController;
use App\Http\Requests\Admin\LoginAdminRequest;
use App\Services\Admin\AdminAuthService;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminAuthController extends BaseApiController
{
    public function __construct(
        private readonly AdminAuthService $adminAuthService,
    ) {}

    // POST /api/admin/login
    public function login(LoginAdminRequest $request): JsonResponse
    {
        try {
            $resultado = $this->adminAuthService->tentarLogin(
                $request->validated('email'),
                $request->validated('senha')
            );

            if (!$resultado['requer_2fa']) {
                $admin = $resultado['admin'];
                session(['admin_autenticado' => $admin->id]);

                return $this->success(
                    dados: [
                        'id'           => $admin->id,
                        'email'        => $admin->email,
                        'role'         => $admin->role,
                        'ultimo_acesso' => $admin->ultimo_acesso,
                    ],
                    mensagem: 'Login realizado com sucesso.'
                );
            }

            return $this->success(
                dados: [
                    'requer_2fa'    => true,
                    'pending_token' => $resultado['pending_token'],
                ],
                mensagem: 'Informe o código de autenticação de dois fatores.'
            );
        } catch (AuthenticationException $e) {
            return $this->error($e->getMessage(), 401);
        }
    }

    // POST /api/admin/2fa/verificar
    public function verificar2fa(Request $request): JsonResponse
    {
        $request->validate([
            'pending_token' => ['required', 'string'],
            'codigo'        => ['required', 'string', 'size:6'],
        ]);

        try {
            $admin = $this->adminAuthService->verificar2FA(
                $request->pending_token,
                $request->codigo
            );

            session(['admin_autenticado' => $admin->id]);

            $admin->ultimo_acesso = now();
            $admin->save();

            return $this->success(
                dados: [
                    'id'           => $admin->id,
                    'email'        => $admin->email,
                    'role'         => $admin->role,
                    'ultimo_acesso' => $admin->ultimo_acesso,
                ],
                mensagem: 'Autenticação concluída com sucesso.'
            );
        } catch (AuthenticationException $e) {
            return $this->error($e->getMessage(), 401);
        }
    }

    // POST /api/admin/logout
    public function logout(Request $request): JsonResponse
    {
        session()->forget('admin_autenticado');

        return $this->success(mensagem: 'Sessão encerrada com sucesso.');
    }
}
