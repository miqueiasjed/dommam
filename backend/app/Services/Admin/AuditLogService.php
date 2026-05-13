<?php

namespace App\Services\Admin;

use App\Models\AdminAuditLog;
use App\Models\AdminUser;
use Illuminate\Database\Eloquent\Model;

class AuditLogService
{
    // -------------------------------------------------------------------------
    // Constantes de ação
    // -------------------------------------------------------------------------

    public const ACAO_CRIAR       = 'criar';
    public const ACAO_ATUALIZAR   = 'atualizar';
    public const ACAO_DESPUBLICAR = 'despublicar';
    public const ACAO_DELETAR     = 'deletar';
    public const ACAO_AGENDAR     = 'agendar';

    // -------------------------------------------------------------------------
    // Métodos públicos
    // -------------------------------------------------------------------------

    /**
     * Registra uma ação de auditoria realizada por um admin.
     *
     * @param AdminUser   $admin       Admin que realizou a ação
     * @param string      $acao        Uma das constantes ACAO_* desta classe
     * @param Model|null  $entidade    Entidade afetada (ex: Roteiro)
     * @param array|null  $dadosAntes  Estado anterior da entidade (para atualizações)
     * @param array|null  $dadosDepois Estado posterior da entidade
     */
    public function registrar(
        AdminUser $admin,
        string $acao,
        ?Model $entidade = null,
        ?array $dadosAntes = null,
        ?array $dadosDepois = null,
    ): AdminAuditLog {
        return AdminAuditLog::create([
            'admin_id'      => $admin->id,
            'acao'          => $acao,
            'entidade_tipo' => $entidade ? class_basename($entidade) : null,
            'entidade_id'   => $entidade?->id,
            'dados_antes'   => $dadosAntes,
            'dados_depois'  => $dadosDepois,
            'ip_address'    => request()->ip(),
        ]);
    }
}
