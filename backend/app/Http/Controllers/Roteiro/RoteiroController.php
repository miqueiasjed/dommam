<?php

namespace App\Http\Controllers\Roteiro;

use App\Http\Controllers\BaseApiController;
use App\Models\Roteiro;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoteiroController extends BaseApiController
{
    // GET /api/roteiros
    public function index(Request $request): JsonResponse
    {
        $query = Roteiro::publicados()->orderBy('publicado_em', 'desc');

        if ($request->filled('busca')) {
            $busca = $request->busca;
            $query->where(function ($q) use ($busca) {
                $q->where('titulo', 'like', "%{$busca}%")
                  ->orWhere('descricao', 'like', "%{$busca}%");
            });
        }

        if ($request->filled('mes')) {
            $query->whereRaw("DATE_FORMAT(publicado_em, '%Y-%m') = ?", [$request->mes]);
        }

        if ($request->ordenacao === 'mais_antigos') {
            $query->reorder('publicado_em', 'asc');
        }

        $roteiros = $query->get()->map(fn ($r) => $this->formatarCard($r));

        return $this->success($roteiros);
    }

    // GET /api/roteiros/{slug}
    public function show(string $slug): JsonResponse
    {
        $roteiro = Roteiro::publicados()->where('slug', $slug)->firstOrFail();

        $anterior = Roteiro::publicados()
            ->where('publicado_em', '<', $roteiro->publicado_em)
            ->orderBy('publicado_em', 'desc')
            ->select('slug', 'titulo')
            ->first();

        $proximo = Roteiro::publicados()
            ->where('publicado_em', '>', $roteiro->publicado_em)
            ->orderBy('publicado_em', 'asc')
            ->select('slug', 'titulo')
            ->first();

        return $this->success([
            'id'             => $roteiro->id,
            'slug'           => $roteiro->slug,
            'titulo'         => $roteiro->titulo,
            'sinopse'        => $roteiro->descricao,
            'capa_url'       => $roteiro->capa_url,
            'data_publicacao' => $roteiro->publicado_em,
            'temas'          => [],
            'instagram_url'  => null,
            'anterior'       => $anterior,
            'proximo'        => $proximo,
        ]);
    }

    private function formatarCard(Roteiro $r): array
    {
        return [
            'id'              => $r->id,
            'slug'            => $r->slug,
            'titulo'          => $r->titulo,
            'sinopse'         => $r->descricao,
            'cover_image_url' => $r->capa_url,
            'publicado_em'    => $r->publicado_em,
            'tema'            => null,
        ];
    }
}
