<?php

namespace App\Http\Middleware;

use App\Models\AdminUser;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AutenticadoComoAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $adminId = session('admin_autenticado');

        if (!$adminId) {
            return response()->json([
                'sucesso'  => false,
                'mensagem' => 'Acesso não autorizado.',
            ], 401);
        }

        $admin = AdminUser::find($adminId);

        if (!$admin || !$admin->ativo) {
            return response()->json([
                'sucesso'  => false,
                'mensagem' => 'Acesso não autorizado.',
            ], 401);
        }

        // Atualiza o último acesso do admin
        $admin->update(['ultimo_acesso' => now()]);

        // Injeta o admin autenticado no request para uso nos controllers
        $request->adminAutenticado = $admin;

        return $next($request);
    }
}
