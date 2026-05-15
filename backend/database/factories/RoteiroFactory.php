<?php

namespace Database\Factories;

use App\Models\Roteiro;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class RoteiroFactory extends Factory
{
    protected $model = Roteiro::class;

    private static array $temas = [
        'A Queda do Império Romano do Ocidente',
        'Gengis Khan e a Conquista Mongol',
        'A Revolução Francesa e o Terror',
        'A Batalha de Stalingrado',
        'O Descobrimento da América',
        'A Inquisição Espanhola',
        'Cleópatra e o Fim do Egito Faraônico',
        'A Primeira Guerra Mundial',
        'O Renascimento Italiano',
        'A Revolução Industrial na Inglaterra',
        'Alexandre, o Grande e a Grécia Clássica',
        'A Colonização do Brasil por Portugal',
        'O Holocausto e a Segunda Guerra Mundial',
        'A Guerra Fria e a Corrida Espacial',
        'O Império Otomano e Constantinopla',
        'A Revolução Russa de 1917',
        'Os Cavaleiros Templários',
        'A Inconfidência Mineira',
        'O Regime Nazista na Alemanha',
        'A Independência dos Estados Unidos',
        'A Abolição da Escravidão no Brasil',
        'O Império Asteca e Hernán Cortés',
        'A Peste Negra na Europa Medieval',
        'A Guerra dos Cem Anos',
        'O Renascimento do Japão Meiji',
    ];

    public function definition(): array
    {
        $titulo = fake()->unique()->randomElement(self::$temas);
        $slug   = Str::slug($titulo) . '-' . fake()->randomNumber(4, true);

        return [
            'titulo'      => $titulo,
            'slug'        => $slug,
            'descricao'   => fake()->paragraph(3),
            'conteudo'    => $this->gerarConteudo($titulo),
            'capa_url'    => 'https://picsum.photos/seed/' . fake()->numberBetween(1, 500) . '/800/1200',
            'pdf_url'     => null,
            'status'      => 'publicado',
            'publicado_em' => fake()->dateTimeBetween('-12 months', '-1 hour'),
            'criado_por'  => null,
        ];
    }

    public function rascunho(): static
    {
        return $this->state([
            'status'       => 'rascunho',
            'publicado_em' => null,
        ]);
    }

    public function agendado(): static
    {
        return $this->state([
            'status'       => 'agendado',
            'publicado_em' => fake()->dateTimeBetween('+1 hour', '+7 days'),
        ]);
    }

    private function gerarConteudo(string $titulo): string
    {
        return "# {$titulo}\n\n"
            . fake()->paragraphs(4, true) . "\n\n"
            . "## Contexto Histórico\n\n"
            . fake()->paragraphs(3, true) . "\n\n"
            . "## Personagens Principais\n\n"
            . fake()->paragraphs(2, true) . "\n\n"
            . "## Consequências\n\n"
            . fake()->paragraphs(3, true);
    }
}
