<?php

namespace App\Http\Middleware;

use App\Models\AdminUser;
use App\Services\Auth\LastlinkService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerificarAssinaturaAtiva
{
    public function __construct(
        private readonly LastlinkService $lastlinkService,
    ) {}

    public function handle(Request $request, Closure $next): Response
    {
        // Admin autenticado pode acessar a área de assinante sem token
        $adminId = session('admin_autenticado');
        if ($adminId) {
            $admin = AdminUser::find($adminId);
            if ($admin && $admin->ativo) {
                $request->merge(['email_membro' => $admin->email]);
                return $next($request);
            }
        }

        $usuario = auth('sanctum')->user();

        if (! $usuario) {
            return response()->json([
                'sucesso'  => false,
                'mensagem' => 'Não autenticado. Faça login para continuar.',
            ], 401);
        }

        $ativo = $this->lastlinkService->assinaturaAtiva($usuario->email);

        if (! $ativo) {
            return response()->json([
                'sucesso'  => false,
                'mensagem' => 'Assinatura inativa. Acesse lastlink.com para renovar.',
            ], 403);
        }

        $request->merge(['email_membro' => $usuario->email]);

        return $next($request);
    }
}
