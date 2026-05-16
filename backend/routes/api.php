<?php

use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminAssinanteController;
use App\Http\Controllers\Admin\AdminAuditLogController;
use App\Http\Controllers\Admin\AdminRoteiroController;
use App\Http\Controllers\Admin\AdminUsuarioController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Download\DownloadController;
use App\Http\Controllers\Roteiro\RoteiroController;
use App\Http\Controllers\Webhook\WebhookController;
use Illuminate\Support\Facades\Route;

// Autenticação de membros
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
    });
});

// Rotas protegidas — membros com assinatura ativa
Route::middleware('auth.membro')->group(function () {
    Route::get('roteiros', [RoteiroController::class, 'index']);
    Route::get('roteiros/{slug}', [RoteiroController::class, 'show']);
    Route::get('roteiros/{slug}/download', [DownloadController::class, 'baixar']);
});

// Webhook Lastlink (rota pública — HMAC valida autenticidade)
Route::post('webhooks/lastlink', [WebhookController::class, 'receber']);

// Rotas de autenticação admin (públicas)
Route::prefix('admin')->group(function () {
    Route::post('login', [AdminAuthController::class, 'login']);
    Route::post('2fa/verificar', [AdminAuthController::class, 'verificar2fa']);

    // Rotas protegidas — admin autenticado
    Route::middleware('auth.admin')->group(function () {
        Route::get('me', [AdminAuthController::class, 'me']);
        Route::post('logout', [AdminAuthController::class, 'logout']);

        Route::get('assinantes', [AdminAssinanteController::class, 'index']);
        Route::get('audit-log', [AdminAuditLogController::class, 'index']);

        Route::prefix('usuarios')->group(function () {
            Route::get('/', [AdminUsuarioController::class, 'index']);
            Route::post('/', [AdminUsuarioController::class, 'store']);
            Route::put('{id}', [AdminUsuarioController::class, 'update']);
            Route::delete('{id}', [AdminUsuarioController::class, 'destroy']);
        });

        Route::prefix('roteiros')->group(function () {
            Route::get('/', [AdminRoteiroController::class, 'index']);
            Route::post('/', [AdminRoteiroController::class, 'store']);
            Route::get('{id}', [AdminRoteiroController::class, 'show']);
            Route::put('{id}', [AdminRoteiroController::class, 'update']);
            Route::delete('{id}', [AdminRoteiroController::class, 'destroy']);
            Route::patch('{id}/despublicar', [AdminRoteiroController::class, 'despublicar']);
        });
    });
});
