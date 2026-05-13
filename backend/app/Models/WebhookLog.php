<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class WebhookLog extends Model
{
    /**
     * Nome da tabela no banco de dados.
     *
     * @var string
     */
    protected $table = 'webhooks_log';

    /**
     * Atributos que podem ser atribuídos em massa.
     *
     * @var list<string>
     */
    protected $fillable = [
        'event_id',
        'evento',
        'payload',
        'status',
        'erro_mensagem',
        'processado_em',
    ];

    /**
     * Casts de atributos.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'payload'       => 'array',
            'processado_em' => 'datetime',
        ];
    }

    // -------------------------------------------------------------------------
    // Constantes de status
    // -------------------------------------------------------------------------

    const STATUS_PENDENTE   = 'pendente';
    const STATUS_PROCESSADO = 'processado';
    const STATUS_ERRO       = 'erro';

    // -------------------------------------------------------------------------
    // Métodos estáticos
    // -------------------------------------------------------------------------

    /**
     * Verifica se um evento já foi processado com sucesso (idempotência).
     */
    public static function jaProcessado(string $eventId): bool
    {
        return static::where('event_id', $eventId)
            ->whereIn('status', [self::STATUS_PROCESSADO])
            ->exists();
    }

    // -------------------------------------------------------------------------
    // Scopes
    // -------------------------------------------------------------------------

    /**
     * Filtra registros com status pendente.
     */
    public function scopePendentes(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_PENDENTE);
    }
}
