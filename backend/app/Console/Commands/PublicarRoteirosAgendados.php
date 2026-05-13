<?php

namespace App\Console\Commands;

use App\Models\Roteiro;
use Illuminate\Console\Command;

class PublicarRoteirosAgendados extends Command
{
    /**
     * Nome e assinatura do comando.
     *
     * @var string
     */
    protected $signature = 'roteiros:publicar-agendados';

    /**
     * Descrição do comando.
     *
     * @var string
     */
    protected $description = 'Publica roteiros agendados cujo horário de publicação já chegou';

    /**
     * Executa o comando.
     */
    public function handle(): int
    {
        $roteiros = Roteiro::where('status', 'agendado')
            ->where('publicado_em', '<=', now())
            ->get();

        foreach ($roteiros as $roteiro) {
            $roteiro->status = 'publicado';
            $roteiro->save();
        }

        $this->info("Publicados: {$roteiros->count()} roteiro(s)");

        return Command::SUCCESS;
    }
}
