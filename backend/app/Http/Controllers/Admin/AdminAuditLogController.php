<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseApiController;
use App\Models\AdminAuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminAuditLogController extends BaseApiController
{
    // GET /api/admin/audit-log
    public function index(Request $request): JsonResponse
    {
        $query = AdminAuditLog::with('admin')
            ->orderByDesc('created_at')
            ->limit(100);

        if ($request->filled('tipo')) {
            $query->where('acao', $request->tipo);
        }

        if ($request->filled('de')) {
            $query->whereDate('created_at', '>=', $request->de);
        }

        if ($request->filled('ate')) {
            $query->whereDate('created_at', '<=', $request->ate);
        }

        $itens = $query->get()->map(fn ($log) => [
            'id'          => $log->id,
            'acao'        => $log->acao,
            'admin_email' => $log->admin?->email ?? '—',
            'alvo'        => $log->entidade_tipo && $log->entidade_id
                ? "{$log->entidade_tipo} #{$log->entidade_id}"
                : ($log->entidade_tipo ?? '—'),
            'criado_em'   => $log->created_at,
        ]);

        return $this->success($itens);
    }
}
