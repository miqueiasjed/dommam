<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\LogoutController;
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
