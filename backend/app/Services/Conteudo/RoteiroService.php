<?php

namespace App\Services\Conteudo;

use App\Models\AdminUser;
use App\Models\Roteiro;
use App\Services\Admin\AuditLogService;
use App\Services\Admin\FileUploadService;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class RoteiroService
{
    public function __construct(
        private readonly AuditLogService $auditLogService,
        private readonly FileUploadService $fileUploadService,
    ) {}

    // -------------------------------------------------------------------------
    // Métodos públicos
    // -------------------------------------------------------------------------

    /**
     * Cria um novo roteiro com upload de arquivos e auditoria.
     */
    public function criar(array $dados, AdminUser $admin): Roteiro
    {
        $slug = $this->gerarSlugUnico(Str::slug($dados['titulo']));

        $capaUrl = null;
        if (!empty($dados['capa_file'])) {
            $capaUrl = $this->fileUploadService->uploadCapa($dados['capa_file']);
        }

        $pdfUrl = null;
        if (!empty($dados['pdf_file'])) {
            $pdfUrl = $this->fileUploadService->uploadPdf($dados['pdf_file']);
        }

        [$status, $publicadoEm] = $this->calcularStatus($dados['publicar_em'] ?? null);

        $roteiro = Roteiro::create([
            'titulo'       => $dados['titulo'],
            'slug'         => $slug,
            'descricao'    => $dados['descricao'] ?? null,
            'conteudo'     => $dados['conteudo'] ?? null,
            'capa_url'     => $capaUrl,
            'pdf_url'      => $pdfUrl,
            'publicado_em' => $publicadoEm,
            'status'       => $status,
            'criado_por'   => $admin->id,
        ]);

        $this->auditLogService->registrar(
            $admin,
            AuditLogService::ACAO_CRIAR,
            $roteiro,
            null,
            $roteiro->toArray(),
        );

        return $roteiro;
    }

    /**
     * Atualiza um roteiro existente, substituindo arquivos se necessário.
     */
    public function atualizar(Roteiro $roteiro, array $dados, AdminUser $admin): Roteiro
    {
        $dadosAntes = $roteiro->toArray();

        if (!empty($dados['capa_file'])) {
            if ($roteiro->capa_url) {
                $this->fileUploadService->remover($roteiro->capa_url);
            }
            $dados['capa_url'] = $this->fileUploadService->uploadCapa($dados['capa_file']);
        }

        if (!empty($dados['pdf_file'])) {
            if ($roteiro->pdf_url) {
                $this->fileUploadService->remover($roteiro->pdf_url);
            }
            $dados['pdf_url'] = $this->fileUploadService->uploadPdf($dados['pdf_file']);
        }

        $camposAtualizar = array_filter([
            'titulo'    => $dados['titulo'] ?? null,
            'descricao' => $dados['descricao'] ?? null,
            'conteudo'  => $dados['conteudo'] ?? null,
            'capa_url'  => $dados['capa_url'] ?? null,
            'pdf_url'   => $dados['pdf_url'] ?? null,
        ], fn ($v) => $v !== null);

        if (array_key_exists('publicar_em', $dados)) {
            [$status, $publicadoEm] = $this->calcularStatus($dados['publicar_em']);
            $camposAtualizar['status']       = $status;
            $camposAtualizar['publicado_em'] = $publicadoEm;
        }

        $roteiro->fill($camposAtualizar)->save();

        $roteiroAtualizado = $roteiro->fresh();

        $this->auditLogService->registrar(
            $admin,
            AuditLogService::ACAO_ATUALIZAR,
            $roteiroAtualizado,
            $dadosAntes,
            $roteiroAtualizado->toArray(),
        );

        return $roteiroAtualizado;
    }

    /**
     * Despublica um roteiro, voltando-o ao estado de rascunho.
     */
    public function despublicar(Roteiro $roteiro, AdminUser $admin): Roteiro
    {
        $roteiro->update([
            'status'       => 'rascunho',
            'publicado_em' => null,
        ]);

        $this->auditLogService->registrar(
            $admin,
            AuditLogService::ACAO_DESPUBLICAR,
            $roteiro,
            null,
            $roteiro->fresh()->toArray(),
        );

        return $roteiro->fresh();
    }

    /**
     * Agenda a publicação de um roteiro para uma data futura.
     */
    public function agendar(Roteiro $roteiro, Carbon $dataPublicacao, AdminUser $admin): Roteiro
    {
        $roteiro->update([
            'status'       => 'agendado',
            'publicado_em' => $dataPublicacao,
        ]);

        $this->auditLogService->registrar(
            $admin,
            AuditLogService::ACAO_AGENDAR,
            $roteiro,
            null,
            $roteiro->fresh()->toArray(),
        );

        return $roteiro->fresh();
    }

    /**
     * Lista roteiros com filtros opcionais e paginação.
     */
    public function listar(array $filtros = []): LengthAwarePaginator
    {
        $query = Roteiro::query();

        if (!empty($filtros['status'])) {
            $query->porStatus($filtros['status']);
        }

        if (!empty($filtros['busca'])) {
            $query->where('titulo', 'like', "%{$filtros['busca']}%");
        }

        return $query->orderBy('created_at', 'desc')->paginate(20);
    }

    // -------------------------------------------------------------------------
    // Helpers privados
    // -------------------------------------------------------------------------

    /**
     * Gera um slug único, adicionando sufixo numérico em caso de conflito.
     */
    private function gerarSlugUnico(string $slugBase): string
    {
        $slug = $slugBase;
        $contador = 1;

        while (Roteiro::where('slug', $slug)->exists()) {
            $slug = "{$slugBase}-{$contador}";
            $contador++;
        }

        return $slug;
    }

    /**
     * Calcula o status e a data de publicação baseado em publicar_em.
     *
     * @return array{string, \Carbon\Carbon|null}
     */
    private function calcularStatus(mixed $publicarEm): array
    {
        if (empty($publicarEm)) {
            return ['rascunho', null];
        }

        $data = $publicarEm instanceof Carbon ? $publicarEm : Carbon::parse($publicarEm);

        if ($data->isFuture()) {
            return ['agendado', $data];
        }

        return ['publicado', now()];
    }
}
