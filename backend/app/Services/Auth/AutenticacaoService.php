<?php

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Hash;

class AutenticacaoService
{
    public function fazerLogin(array $credenciais): array
    {
        /** @var User|null $usuario */
        $usuario = User::where('email', $credenciais['email'])->first();

        if (! $usuario || ! Hash::check($credenciais['password'], $usuario->password)) {
            throw new AuthenticationException('E-mail ou senha incorretos.');
        }

        $token = $usuario->createToken('spa')->plainTextToken;

        return [
            'token'   => $token,
            'usuario' => $this->serializarUsuario($usuario),
        ];
    }

    public function encerrarSessao(User $usuario): void
    {
        $usuario->currentAccessToken()?->delete();
    }

    public function obterUsuarioAutenticado(User $usuario): array
    {
        return $this->serializarUsuario($usuario);
    }

    private function serializarUsuario(User $usuario): array
    {
        return [
            'id'    => $usuario->id,
            'nome'  => $usuario->name,
            'email' => $usuario->email,
        ];
    }
}
