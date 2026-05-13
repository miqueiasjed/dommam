<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Roteiro extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Atributos que podem ser atribuídos em massa.
     *
     * @var list<string>
     */
    protected $fillable = [
        'titulo',
        'slug',
        'descricao',
        'conteudo',
        'capa_url',
        'pdf_url',
        'publicado_em',
        'status',
        'criado_por',
    ];

    /**
     * Casts de atributos.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'publicado_em' => 'datetime',
        ];
    }

    // -------------------------------------------------------------------------
    // Scopes
    // -------------------------------------------------------------------------

    /**
     * Filtra roteiros com status publicado.
     */
    public function scopePublicados(Builder $query): Builder
    {
        return $query->where('status', 'publicado');
    }

    /**
     * Filtra roteiros agendados cuja data de publicação já chegou.
     */
    public function scopeAgendados(Builder $query): Builder
    {
        return $query->where('status', 'agendado')
                     ->where('publicado_em', '<=', now());
    }

    /**
     * Filtra roteiros com status rascunho.
     */
    public function scopeRascunhos(Builder $query): Builder
    {
        return $query->where('status', 'rascunho');
    }

    /**
     * Filtra roteiros pelo status informado (quando não nulo).
     */
    public function scopePorStatus(Builder $query, ?string $status): Builder
    {
        if ($status !== null) {
            return $query->where('status', $status);
        }

        return $query;
    }

    // -------------------------------------------------------------------------
    // Métodos de estado
    // -------------------------------------------------------------------------

    /**
     * Verifica se o roteiro está publicado.
     */
    public function estaPublicado(): bool
    {
        return $this->status === 'publicado';
    }

    // -------------------------------------------------------------------------
    // Relacionamentos
    // -------------------------------------------------------------------------

    /**
     * Admin que criou o roteiro.
     */
    public function criador(): BelongsTo
    {
        return $this->belongsTo(AdminUser::class, 'criado_por');
    }
}
