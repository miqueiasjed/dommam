<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class LoginAdminRequest extends FormRequest
{
    /**
     * Qualquer usuário pode tentar autenticar (a validação de credenciais
     * fica no AdminAuthService).
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Regras de validação do payload de login.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'email'],
            'senha' => ['required', 'string', 'min:6'],
        ];
    }

    /**
     * Mensagens de validação em português.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.required' => 'O e-mail é obrigatório.',
            'email.email'    => 'Informe um e-mail válido.',
            'senha.required' => 'A senha é obrigatória.',
            'senha.string'   => 'A senha deve ser um texto.',
            'senha.min'      => 'A senha deve ter no mínimo 6 caracteres.',
        ];
    }
}
