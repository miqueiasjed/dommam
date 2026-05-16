<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseApiController;
use App\Models\AdminUser;
use App\Services\Admin\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AdminUsuarioController extends BaseApiController
{
    public function __construct(
        private readonly AuditLogService $auditLogService,
    ) {}

    // GET /api/admin/usuarios
    public function index(Request $request): JsonResponse
    {
        if (! $request->adminAutenticado->ehAdmin()) {
            return $this->error('Acesso restrito ao administrador', 403);
        }

        $usuarios = AdminUser::query()
            ->when(
                $request->busca,
                fn ($q) => $q->where('nome', 'like', "%{$request->busca}%")
                             ->orWhere('email', 'like', "%{$request->busca}%")
            )
            ->orderBy('nome')
            ->get(['id', 'nome', 'email', 'role', 'ativo', 'ultimo_acesso', 'created_at']);

        return $this->success($usuarios);
    }

    // POST /api/admin/usuarios
    public function store(Request $request): JsonResponse
    {
        if (! $request->adminAutenticado->ehAdmin()) {
            return $this->error('Acesso restrito ao administrador', 403);
        }

        $dados = $request->validate([
            'nome'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'unique:admin_users,email'],
            'password' => ['required', Password::min(8)],
            'role'     => ['required', 'in:admin,operator'],
        ]);

        $usuario = AdminUser::create([
            'nome'     => $dados['nome'],
            'email'    => $dados['email'],
            'password' => Hash::make($dados['password']),
            'role'     => $dados['role'],
            'ativo'    => true,
        ]);

        $this->auditLogService->registrar(
            $request->adminAutenticado,
            AuditLogService::ACAO_CRIAR,
            $usuario,
        );

        return $this->created($usuario->only(['id', 'nome', 'email', 'role', 'ativo', 'created_at']));
    }

    // PUT /api/admin/usuarios/{id}
    public function update(Request $request, int $id): JsonResponse
    {
        if (! $request->adminAutenticado->ehAdmin()) {
            return $this->error('Acesso restrito ao administrador', 403);
        }

        $usuario = AdminUser::findOrFail($id);

        if ($usuario->id === $request->adminAutenticado->id) {
            return $this->error('Não é possível editar o próprio usuário', 422);
        }

        $rules = [
            'nome'  => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'unique:admin_users,email,' . $id],
            'role'  => ['sometimes', 'in:admin,operator'],
            'ativo' => ['sometimes', 'boolean'],
        ];

        if ($request->filled('password')) {
            $rules['password'] = ['string', Password::min(8)];
        }

        $dados = $request->validate($rules);

        if (isset($dados['password'])) {
            $dados['password'] = Hash::make($dados['password']);
        }

        $antes = $usuario->only(['nome', 'email', 'role', 'ativo']);
        $usuario->update($dados);

        $this->auditLogService->registrar(
            $request->adminAutenticado,
            AuditLogService::ACAO_ATUALIZAR,
            $usuario,
            $antes,
            $usuario->only(['nome', 'email', 'role', 'ativo']),
        );

        return $this->success($usuario->only(['id', 'nome', 'email', 'role', 'ativo', 'ultimo_acesso']));
    }

    // DELETE /api/admin/usuarios/{id}
    public function destroy(Request $request, int $id): JsonResponse
    {
        if (! $request->adminAutenticado->ehAdmin()) {
            return $this->error('Acesso restrito ao administrador', 403);
        }

        $usuario = AdminUser::findOrFail($id);

        if ($usuario->id === $request->adminAutenticado->id) {
            return $this->error('Não é possível remover o próprio usuário', 422);
        }

        $this->auditLogService->registrar(
            $request->adminAutenticado,
            AuditLogService::ACAO_DELETAR,
            $usuario,
        );

        $usuario->delete();

        return $this->success(['mensagem' => 'Usuário removido com sucesso']);
    }
}
