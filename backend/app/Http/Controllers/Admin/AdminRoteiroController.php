<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseApiController;
use App\Http\Requests\Admin\AtualizarRoteiroRequest;
use App\Http\Requests\Admin\CriarRoteiroRequest;
use App\Models\Roteiro;
use App\Services\Admin\AuditLogService;
use App\Services\Conteudo\RoteiroService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminRoteiroController extends BaseApiController
{
    public function __construct(
        private readonly RoteiroService $roteiroService,
        private readonly AuditLogService $auditLogService,
    ) {}

    // GET /api/admin/roteiros
    public function index(Request $request): JsonResponse
    {
        $roteiros = $this->roteiroService->listar([
            'status' => $request->status,
            'busca'  => $request->busca,
        ]);

        return $this->success($roteiros);
    }

    // POST /api/admin/roteiros
    public function store(CriarRoteiroRequest $request): JsonResponse
    {
        $roteiro = $this->roteiroService->criar(
            $request->validated(),
            $request->adminAutenticado,
        );

        return $this->created($roteiro);
    }

    // GET /api/admin/roteiros/{id}
    public function show(int $id): JsonResponse
    {
        $roteiro = Roteiro::findOrFail($id);

        return $this->success($roteiro);
    }

    // PUT /api/admin/roteiros/{id}
    public function update(AtualizarRoteiroRequest $request, int $id): JsonResponse
    {
        $roteiro = Roteiro::findOrFail($id);

        $roteiro = $this->roteiroService->atualizar(
            $roteiro,
            $request->validated(),
            $request->adminAutenticado,
        );

        return $this->success($roteiro);
    }

    // DELETE /api/admin/roteiros/{id}
    public function destroy(int $id, Request $request): JsonResponse
    {
        if ($request->adminAutenticado->role !== 'admin') {
            return $this->error('Permissão insuficiente', 403);
        }

        $roteiro = Roteiro::findOrFail($id);

        $roteiro->delete();

        $this->auditLogService->registrar(
            $request->adminAutenticado,
            AuditLogService::ACAO_DELETAR,
            $roteiro,
        );

        return $this->success(['mensagem' => 'Roteiro removido com sucesso']);
    }

    // PATCH /api/admin/roteiros/{id}/despublicar
    public function despublicar(int $id, Request $request): JsonResponse
    {
        $roteiro = Roteiro::findOrFail($id);

        $roteiro = $this->roteiroService->despublicar(
            $roteiro,
            $request->adminAutenticado,
        );

        return $this->success($roteiro);
    }
}
