<?php

namespace Database\Seeders;

use App\Models\AdminUser;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Inicializa o banco com o admin padrão para setup inicial.
     *
     * ATENÇÃO: a senha 'admin123' é temporária e DEVE ser trocada
     * imediatamente após o primeiro acesso ao painel administrativo.
     */
    public function run(): void
    {
        AdminUser::firstOrCreate(
            ['email' => 'admin@danuziohistory.com.br'],
            [
                'nome'        => 'Administrador',
                'password'    => 'admin123', // cast 'hashed' no model aplica o hash automaticamente
                'role'        => 'admin',
                'ativo'       => true,
                'totp_secret' => null,
            ]
        );

        $this->command->info('Admin padrão criado/verificado: admin@danuziohistory.com.br');
    }
}
