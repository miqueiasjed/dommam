<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Sessao extends Model
{
    protected $table = 'sessions';

    protected $fillable = [
        'email',
        'token_hash',
        'ip_address',
        'user_agent',
        'expira_em',
        'usado_em',
    ];

    protected $casts = [
        'expira_em' => 'datetime',
        'usado_em'  => 'datetime',
    ];

    /**
     * Scope: sessões ainda válidas (não usadas e não expiradas).
     */
    public function scopeAtiva(Builder $query): Builder
    {
        return $query->whereNull('usado_em')->where('expira_em', '>', Carbon::now());
    }

    /**
     * Scope: sessões expiradas por tempo (independente de uso).
     */
    public function scopeExpirada(Builder $query): Builder
    {
        return $query->where('expira_em', '<=', Carbon::now());
    }
}
