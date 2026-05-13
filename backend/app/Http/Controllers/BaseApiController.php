<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

abstract class BaseApiController extends Controller
{
    protected function success(mixed $dados = null, string $mensagem = 'Operação realizada com sucesso', int $status = 200): JsonResponse
    {
        $resposta = ['sucesso' => true, 'mensagem' => $mensagem];

        if (!is_null($dados)) {
            $resposta['dados'] = $dados;
        }

        return response()->json($resposta, $status);
    }

    protected function created(mixed $dados = null, string $mensagem = 'Recurso criado com sucesso'): JsonResponse
    {
        return $this->success($dados, $mensagem, 201);
    }

    protected function error(string $mensagem = 'Erro interno do servidor', int $status = 500, mixed $erros = null): JsonResponse
    {
        $resposta = ['sucesso' => false, 'mensagem' => $mensagem];

        if (!is_null($erros)) {
            $resposta['erros'] = $erros;
        }

        return response()->json($resposta, $status);
    }
}
