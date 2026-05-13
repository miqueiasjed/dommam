<?php

use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminRoteiroController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Webhook\WebhookController;
use Illuminate\Support\Facades\Route;

// Rotas públicas de autenticação de membros
Route::prefix('auth')->group(function () {
    Route::post('solicitar-link', [AuthController::class, 'solicitarLink']);
    Route::get('verificar', [AuthController::class, 'verificar']);
    Route::post('logout', [LogoutController::class, 'logout'])->middleware('auth.membro');
});

// Rotas protegidas — membros com assinatura ativa
Route::middleware('auth.membro')->group(function () {
    // Planos futuros adicionarão rotas aqui
});

// Webhook Lastlink (rota pública — HMAC valida autenticidade)
Route::post('webhooks/lastlink', [WebhookController::class, 'receber']);

// Rotas de autenticação admin (públicas)
Route::prefix('admin')->group(function () {
    Route::post('login', [AdminAuthController::class, 'login']);
    Route::post('2fa/verificar', [AdminAuthController::class, 'verificar2fa']);

    // Rotas protegidas — admin autenticado
    Route::middleware('auth.admin')->group(function () {
        Route::post('logout', [AdminAuthController::class, 'logout']);

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
