<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseApiController;
use App\Services\Auth\LastlinkService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminAssinanteController extends BaseApiController
{
    public function __construct(private readonly LastlinkService $lastlinkService) {}

    // GET /api/admin/assinantes
    public function index(Request $request): JsonResponse
    {
        $filtros = array_filter([
            'status' => $request->query('status'),
            'plano'  => $request->query('plano'),
        ]);

        $assinantes = $this->lastlinkService->listarAssinantes($filtros);

        return $this->success($assinantes);
    }
}
