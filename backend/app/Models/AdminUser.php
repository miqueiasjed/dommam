<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class AdminUser extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'admin_users';

    /**
     * Atributos que podem ser atribuídos em massa.
     *
     * @var list<string>
     */
    protected $fillable = [
        'nome',
        'email',
        'password',
        'totp_secret',
        'ativo',
        'role',
        'ultimo_acesso',
    ];

    /**
     * Atributos ocultos na serialização.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'totp_secret',
        'remember_token',
    ];

    /**
     * Casts de atributos.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'ativo'         => 'boolean',
            'ultimo_acesso' => 'datetime',
            'password'      => 'hashed',
        ];
    }

    // -------------------------------------------------------------------------
    // Métodos de papel (role)
    // -------------------------------------------------------------------------

    /**
     * Verifica se o admin tem papel de administrador.
     */
    public function ehAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Verifica se o admin tem papel de operador.
     */
    public function ehOperator(): bool
    {
        return $this->role === 'operator';
    }

    // -------------------------------------------------------------------------
    // Relacionamentos
    // -------------------------------------------------------------------------

    /**
     * Logs de auditoria deste admin.
     */
    public function auditLogs(): HasMany
    {
        return $this->hasMany(AdminAuditLog::class, 'admin_id');
    }
}
