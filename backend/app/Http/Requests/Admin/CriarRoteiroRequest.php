<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CriarRoteiroRequest extends FormRequest
{
    /**
     * Autoriza a requisição para qualquer admin autenticado.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Regras de validação para criação de roteiro.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'titulo'      => ['required', 'string', 'max:255'],
            'descricao'   => ['nullable', 'string'],
            'conteudo'    => ['nullable', 'string'],
            'capa_file'   => ['nullable', 'image', 'max:5120'],
            'pdf_file'    => ['nullable', 'mimes:pdf', 'max:51200'],
            'publicar_em' => ['nullable', 'date', 'after:now'],
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
            'titulo.required'      => 'O título é obrigatório.',
            'titulo.string'        => 'O título deve ser um texto.',
            'titulo.max'           => 'O título não pode ter mais de 255 caracteres.',
            'descricao.string'     => 'A descrição deve ser um texto.',
            'conteudo.string'      => 'O conteúdo deve ser um texto.',
            'capa_file.image'      => 'A capa deve ser uma imagem (jpeg, png, gif, bmp, svg ou webp).',
            'capa_file.max'        => 'A capa não pode ter mais de 5 MB.',
            'pdf_file.mimes'       => 'O arquivo de roteiro deve estar no formato PDF.',
            'pdf_file.max'         => 'O PDF não pode ter mais de 50 MB.',
            'publicar_em.date'     => 'A data de publicação deve ser uma data válida.',
            'publicar_em.after'    => 'A data de publicação deve ser no futuro.',
        ];
    }
}
