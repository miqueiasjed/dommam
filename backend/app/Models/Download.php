<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Download extends Model
{
    use HasFactory;

    /**
     * Atributos que podem ser atribuídos em massa.
     *
     * @var list<string>
     */
    protected $fillable = [
        'roteiro_id',
        'email',
        'ip_address',
        'user_agent',
    ];

    // -------------------------------------------------------------------------
    // Scopes
    // -------------------------------------------------------------------------

    /**
     * Filtra downloads pelo e-mail do membro (para auditoria).
     */
    public function scopePorEmail(Builder $query, string $email): Builder
    {
        return $query->where('email', $email);
    }

    // -------------------------------------------------------------------------
    // Relacionamentos
    // -------------------------------------------------------------------------

    /**
     * Roteiro associado a este download.
     */
    public function roteiro(): BelongsTo
    {
        return $this->belongsTo(Roteiro::class);
    }
}
